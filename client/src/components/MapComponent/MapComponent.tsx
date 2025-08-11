import './MapComponent.css';
import { useEffect } from 'react';
import { initMap } from '../../services/mapService';

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
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places`;
  script.async = true;
  script.onload = onLoad;
  document.head.appendChild(script);
}

export default function Map() {
  useEffect(() => {
    const container = document.getElementById('map');
    const input = document.getElementById('pac-input') as HTMLInputElement;
    if (!container) return;

    loadGoogleMapsScript(() => {
      initMap(container, input);
    });
  }, []);

  return (
    <div className="MapComponent-container">
      <div id="map"></div>
      <input id="pac-input" type="text" placeholder="Search places" />
    </div>
  );
}