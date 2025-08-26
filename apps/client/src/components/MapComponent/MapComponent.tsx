import './MapComponent.css';

import { useEffect, useRef,useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

import { getMarkerPosition, initMap } from '../../services/mapService';
import type { MapComponentProps } from '../../types';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const apiKey = import.meta.env.VITE_API_KEY; //TODO change where this comes from 

function loadGoogleMapsScript(onLoad: () => void) {
  if (document.getElementById('google-maps-script')) {
    if (window.google && window.google.maps) {
      onLoad();
    } else {
      // Wait for the script to load
      const existingScript = document.getElementById('google-maps-script');
      existingScript!.addEventListener('load', onLoad);
    }
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places`;
  script.async = true;
  script.onload = onLoad;
  document.head.appendChild(script);
}

export default function MapComponent({ setLocation, radius }: MapComponentProps) {
  const [showInput, setShowInput] = useState(false);
  const initedRef = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const container = mapContainerRef.current;
    const input = document.getElementById('pac-input') as HTMLInputElement;
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
        console.error('Map init failed', err);
      }
    });
  }, [setLocation, radius]);

  // broadcast radius change to any listeners in mapService if needed
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('radiuschange', { detail: { radius } }));
  }, [radius]);

  useEffect(() => {
    function onMarkerChange(event: Event) {
      const { lon, lat } = (event as CustomEvent<{ lon: number; lat: number }>).detail;
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
        className="absolute text-black bg-white font-semibold top-2 left-11 z-10 p-1 border rounded shadow" />
      <div id="map" ref={mapContainerRef} />
      {/* <div id="map"></div> */}
    </div>
  );
}
