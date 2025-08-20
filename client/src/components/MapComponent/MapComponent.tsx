// MapComponent.tsx
import './MapComponent.css';

import React, { useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { RiCustomerService2Fill } from 'react-icons/ri';

import { getMarkerPosition, initMap } from '../../services/mapService';
import type { MapComponentProps } from '../../types';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const apiKey = import.meta.env.VITE_API_KEY;

function loadGoogleMapsScript(onLoad: () => void) {
  if (typeof window === 'undefined') return;
  const existing = document.getElementById('google-maps-script');
  if (existing) {
    if ((window as any).google && (window as any).google.maps) {
      onLoad();
    } else {
      existing.addEventListener('load', onLoad);
    }
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places`;
  script.async = true;
  script.defer = true;
  script.onload = onLoad;
  document.head.appendChild(script);
}

export default function MapComponent({ setLocation, radius }: MapComponentProps) {
  // make sure hooks are imported (fixes "useState is not defined")
  const [showInput, setShowInput] = useState(false);
  const initedRef = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // init map once
  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const container = mapContainerRef.current;
    const input = document.getElementById('pac-input') as HTMLInputElement | null;
    if (!container) return;

    loadGoogleMapsScript(() => {
      try {
        initMap(container, input, radius);
        const position = getMarkerPosition();
        if (position) {
          const [lon, lat] = position.split(',');
          setLocation({ longitude: lon, latitude: lat });
        }
      } catch (err) {
        // fail gracefully, show in console for debugging
        // don't crash the whole react tree
        // (React will show this in dev overlay)
         
        console.error('Map init failed', err);
      }
    });
  }, [setLocation, radius]);

  // re-init on apply event (HomePage dispatches 'applymap')
  useEffect(() => {
    function onApply() {
      const container = mapContainerRef.current;
      const input = document.getElementById('pac-input') as HTMLInputElement | null;
      if (!container) return;
      try {
        initMap(container, input, radius);
      } catch (err) {
         
        console.error('Re-init map failed', err);
      }
    }
    window.addEventListener('applymap', onApply);
    return () => window.removeEventListener('applymap', onApply);
  }, [radius]);

  // broadcast radius change to any listeners in mapService if needed
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('radiuschange', { detail: { radius } }));
  }, [radius]);

  // marker position change (fired from mapService)
  useEffect(() => {
    function onMarkerChange(event: Event) {
      const detail = (event as CustomEvent<{ lon: number; lat: number }>).detail;
      if (!detail) return;
      const { lon, lat } = detail;
      setLocation({ longitude: String(lon), latitude: String(lat) });
    }
    window.addEventListener('markerpositionchange', onMarkerChange);
    return () => window.removeEventListener('markerpositionchange', onMarkerChange);
  }, [setLocation]);

  return (
    <div className="MapComponent-container relative">
      <IoIosSearch
        className="text-3xl text-white cursor-pointer absolute top-2 left-2 z-10"
        onClick={() => setShowInput((prev) => !prev)}
      />
      <input
        id="pac-input"
        type="text"
        placeholder="Search places"
        style={{ visibility: showInput ? 'visible' : 'hidden' }}
        className="absolute text-black bg-white font-semibold top-2 left-11 z-10 p-1 border rounded shadow"
      />
      <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
