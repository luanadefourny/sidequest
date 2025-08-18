import './MapComponent.css';

import { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

import { getMarkerPosition, initMap } from '../../services/mapService';
import type { MapComponentProps } from '../../types';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const apiKey = import.meta.env.VITE_API_KEY;

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

  useEffect(() => {
    const container = document.getElementById('map');
    const input = document.getElementById('pac-input') as HTMLInputElement;
    if (!container) return;

    loadGoogleMapsScript(() => {
      initMap(container, input, radius); // Pass radius here!
      const position = getMarkerPosition();
      if (position) {
        const [lon, lat] = position.split(',');
        setLocation({ longitude: lon, latitude: lat });
      }
    });
  }, [radius, setLocation]);

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
        className="absolute text-black bg-white font-semibold top-2 left-11 z-10 p-1 border rounded shadow"
      />
      <div id="map"></div>
    </div>
  );
}
