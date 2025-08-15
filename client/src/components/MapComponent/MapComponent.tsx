import './MapComponent.css';
import { useEffect, useState } from 'react';
import { initMap, getMarkerPosition } from '../../services/mapService';
import { IoIosSearch } from "react-icons/io";
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

export default function MapComponent({ setLocation }: MapComponentProps) {

  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const container = document.getElementById('map');
    const input = document.getElementById('pac-input') as HTMLInputElement;
    if (!container) return;

    loadGoogleMapsScript(() => {
      initMap(container, input);
      const position = getMarkerPosition();
      if (position) {
        const [lon, lat] = position.split(','); //TODO i'm an idiot and mihai should change how they are returned hehe
        setLocation({ longitude: lon, latitude: lat});
      } else if (navigator.geolocation) { //TODO this happens in the service but i couldn't figure out how to get that value out without messing up mihai's code so i just got the values again and mihai the big boss of the map will know how to deal with it for sure!
        navigator.geolocation.getCurrentPosition((p) => {
          setLocation({ longitude: String(p.coords.longitude), latitude: String(p.coords.latitude) });
        });
      }
    });
  }, []);

  useEffect(() => {
    let prev = getMarkerPosition();
    const id = setInterval(() => {
      const cur = getMarkerPosition();
      if (cur && cur !== prev) {
        prev = cur;
        const [lon, lat] = cur.split(',');
        setLocation({ longitude: lon, latitude: lat });
      }
    }, 400); //TODO ideally this doesn't happen like this but again, the getting the markerposition wasn't updating easily, so maybe there's something to figure out here, i'm not sure but this should work for now
    return () => clearInterval(id);
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
        style={{ visibility: showInput ? "visible" : "hidden" }}
        className="absolute text-black bg-white font-semibold top-2 left-11 z-10 p-1 border rounded shadow"
      />
      <div id="map"></div>
    </div>
  );
}