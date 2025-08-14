import './MapComponent.css';
import { useEffect, useRef, useState } from 'react';
import { initMap } from '../../services/mapService';
import { IoIosSearch } from "react-icons/io";

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
      const existingScript = document.getElementById('google-maps-script');
      existingScript!.addEventListener('load', onLoad);
    }
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places`;
  script.async = true;
  script.onload = onLoad;
  document.head.appendChild(script);
}

export default function Map() {
  const [showSearch, setShowSearch] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    loadGoogleMapsScript(() => {
      initMap(mapRef.current!, document.getElementById('pac-input') as HTMLInputElement | null);
    });
  }, []);

  useEffect(() => {
    // Optionally, re-attach autocomplete if needed when toggling
    if (showSearch && mapRef.current) {
      initMap(mapRef.current, document.getElementById('pac-input') as HTMLInputElement | null);
    }
  }, [showSearch]);

  return (
    <div className="MapComponent-container relative">
      <IoIosSearch
        className="text-3xl text-white cursor-pointer absolute top-2 left-2 z-10"
        onClick={() => setShowSearch((prev) => !prev)}
      />
      <input
        id="pac-input"
        type="text"
        placeholder="Search location..."
        style={{ display: showSearch ? "block" : "none" }}
        className="absolute text-black bg-white font-semibold top-2 left-11 z-10 p-1 border rounded shadow"
      />
      <div id="map" ref={mapRef}></div>
    </div>
  );
}