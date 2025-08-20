import { HARD_LIMIT } from '../constants';
import type { Quest } from '../types';
import { getPlaceDetails } from './openTripMapApiService';
import { getQuests } from './questService';
import { getEventDetails } from './ticketmasterService';

//TODO fix openmapapi to follow mock syntax when replugging it in
let coordsHelper: string | null = null;
// let apiData: any[] = [];
let currentMap: google.maps.Map | null = null;
let currentRadius = 1000; //meters
let loadSeq = 0;
let mapMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
const returnLimit = HARD_LIMIT;

let currentCircle: google.maps.Circle | null = null;

function upsertRadiusCircle(
  map: google.maps.Map,
  center: google.maps.LatLngLiteral,
  radius: number
) {
  if (currentCircle) {
    currentCircle.setCenter(center);
    currentCircle.setRadius(radius);
    currentCircle.setMap(map);
  } else {
    currentCircle = new google.maps.Circle({
      map,
      center,
      radius,
      strokeColor: '#059669',
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: '#10b981',
      fillOpacity: 0.07, // transparent fill
      clickable: false,
    });
  }
  const b = currentCircle.getBounds();
  if (b) map.fitBounds(b);
}

export function getMarkerPosition() {
  return coordsHelper;
}

//! sends out location to mapcomponent
function emitMarkerPosition(lon: number, lat: number) {
  coordsHelper = `${lon},${lat}`;
  window.dispatchEvent(new CustomEvent('markerpositionchange', { detail: { lon, lat } }));
}

async function loadMarkers(
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  latitude: number,
  longitude: number,
  radius: number
) {

    const seq = ++loadSeq;
    // clear previous markers
    mapMarkers.forEach(m => (m.map = null));
    mapMarkers = [];
  //! Opentripmap call starts here - DON'T DELETE IT PLEASE
    try {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker',
      )) as google.maps.MarkerLibrary;
      // const quests: OpenTripMapPlace[] = await getPlaces(latitude, longitude, radius);
      const quests: Quest[] = await getQuests({
        near: `${longitude},${latitude}`,
        radius,
        limit: returnLimit,
      })

      if (seq !== loadSeq) return;
      
      // apiData = places;

      const infoWindow = new google.maps.InfoWindow();

      quests.forEach((quest) => {
        console.log('Place: ',quest);
        // const { coords: { lat, lng }, name, kinds, xid } = place;
        const [lon, lat] = quest.location.coordinates;
        const questLongitude = Number(lon);
        const questLatitude = Number(lat);
        const name = quest.name;
        const type = quest.type;

        let pinImage: string = '';
        if (type === 'event') pinImage = './orange_pin.svg';
        else if (type === 'place') pinImage = './green_pin.svg';

        const icon = document.createElement("img");
        // icon.src = "./creep.jpg";
        icon.src = pinImage;
        icon.style.width = "20px";
        icon.style.height = "20px";

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: questLatitude, lng: questLongitude },
          title: name,
          content: icon,
        });
        mapMarkers.push(marker);

        // Include OpenTripMap markers in bounds
        bounds.extend({ lat: questLatitude, lng: questLongitude });

        marker.addListener('click', async () => {
          let bodyHtml = '';

          // 1) Ticketmaster events: fetch details server-side
          if (
            quest.type === 'event' &&
            quest.source === 'ticketmaster' &&
            typeof quest.sourceId === 'string' &&
            quest.sourceId
          ) {
            try {
              const d = await getEventDetails(quest.sourceId);
              const img = d?.image ? `<img src="${d.image}" style="max-height:200px;width:auto;height:auto;" alt=""/>` : '';
              const venue = d?.venueName ? `<div><strong>${d.venueName}</strong></div>` : '';
              const addr = [d?.address, d?.city, d?.country].filter(Boolean).join(', ');
              const addrHtml = addr ? `<div>${addr}</div>` : '';
              const info = d?.info ? `<div>${d.info}</div>` : '';
              const start = d?.start ? `<div>${new Date(d.start).toLocaleString()}</div>` : '';
              const price = d?.price && d?.currency ? `<div>From ${d.price} ${d.currency}</div>` : '';
              const link = d?.url ? `<a href="${d.url}" target="_blank" rel="noopener">More info</a>` : '';
              bodyHtml = `${img}${venue}${addrHtml}${start}${info}${price}${link}`;
            } catch (e) {
              console.error('Failed to fetch TM details', e);
              // fallback to quest fields if details call fails
              const img = quest.image ? `<img src="${quest.image}" style="max-height:200px;width:auto;height:auto;" alt=""/>` : '';
              const venue = quest.venueName ? `<div><strong>${quest.venueName}</strong></div>` : '';
              const desc = quest.description ? `<div>${quest.description}</div>` : '';
              const link = quest.url ? `<a href="${quest.url}" target="_blank" rel="noopener">More info</a>` : '';
              bodyHtml = `${img}${venue}${desc}${link}`;
            }
          }
          // 2) OpenTripMap places: enrich with image/address
          else if (quest.source === 'opentripmap' && typeof quest.sourceId === 'string' && quest.sourceId) {
            const details = await getPlaceDetails(quest.sourceId);
            const address = details?.address ?? '';
            const img = details?.preview
              ? `<img src="${details.preview}" style="max-height:200px;width:auto;height:auto;" alt=""/>`
              : '';
            bodyHtml = `${img}${address ? `<br/>${address}` : ''}`;
          }
          // 3) Fallback for anything else
          else {
            const img = quest.image ? `<img src="${quest.image}" style="max-height:200px;width:auto;height:auto;" alt=""/>` : '';
            const venue = quest.venueName ? `<div><strong>${quest.venueName}</strong></div>` : '';
            const desc = quest.description ? `<div>${quest.description}</div>` : '';
            const link = quest.url ? `<a href="${quest.url}" target="_blank" rel="noopener">More info</a>` : '';
            bodyHtml = `${img}${venue}${desc}${link}`;
          }

          const typeLabel = quest.type;
          infoWindow.setContent(`
            <div style="font-size:14px">
              <strong>${name}</strong><br/>
              <em>${typeLabel}</em><br/>
              ${bodyHtml}
            </div>
          `);
          infoWindow.open(map, marker);
        });
      });

    //     // Fit map to include the searched place + all OpenTripMap markers
    // if (!bounds.isEmpty()) {
    //   map.fitBounds(bounds);
    //   if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
    //     map.setZoom(15);
    //   }
    // } else {
    //   // If no markers, center on fallback location
    //   map.setCenter({ lat: latitude, lng: longitude });
    //   map.setZoom(15);
    // }

    const circleBounds = currentCircle?.getBounds();
    if (circleBounds) {
      map.fitBounds(circleBounds, 0);
    } else if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) map.setZoom(15);
    } else {
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(15);
    }
  } catch (error) {
    console.error('Error loading OpenTripMap data:', error);
    map.setCenter({ lat: latitude, lng: longitude });
    map.setZoom(15);
  }
}
//! Opentripmap call ends here


//! mock data call starts here
//   try {
//     const { AdvancedMarkerElement } = (await google.maps.importLibrary(
//       'marker',
//     )) as google.maps.MarkerLibrary;
//     const res = await fetch(
//       `http://localhost:3000/quests?near=${longitude},${latitude}&radius=10000`,
//     );
//     if (!res.ok) throw new Error('Failed to fetch mock data from DB');
//     const data = await res.json();

//     const infoWindow = new google.maps.InfoWindow();

//     data.forEach((entry: any) => {
//       const [lon, lat] = entry.location.coordinates;
//       const name = entry.name || 'Unnamed place';
//       const type = entry.type || 'No category found';
//       const description = entry.description || 'No address found';

//       const icon = document.createElement('img');
//       icon.src = './creep.jpg';
//       icon.style.width = '20px';
//       icon.style.height = '20px';

//       const marker = new AdvancedMarkerElement({
//         map,
//         position: { lat, lng: lon },
//         title: name,
//         content: icon,
//       });

//       // Include OpenTripMap markers in bounds
//       bounds.extend({ lat, lng: lon });

//       marker.addListener('click', async () => {
//         //TODO get a fallback image to plug in as default if we have no details.preview.source

//         infoWindow.setContent(`
//             <div style="font-size:14px">
//             <strong>${name}</strong><br/>
//             <em>${type}</em><br/>
//             ${description}
//             </div>
//             `);
//         infoWindow.open(map, marker);
//       });
//     });

//     // Fit map to include the searched place + all OpenTripMap markers
//     if (!bounds.isEmpty()) {
//       map.fitBounds(bounds);
//       if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
//         map.setZoom(15);
//       }
//     } else {
//       // If no markers, center on fallback location
//       map.setCenter({ lat: latitude, lng: longitude });
//       map.setZoom(15);
//     }
//   } catch (error) {
//     console.error('Error loading OpenTripMap data:', error);
//     map.setCenter({ lat: latitude, lng: longitude });
//     map.setZoom(15);
//   }
// }
//! mock data call ends here

export async function initMap(container: HTMLElement, input: HTMLInputElement, radius: number): Promise<void> {
  // The location of Grand Place
  let position = { lat: 50.84676, lng: 4.35278 };

  if (navigator.geolocation) {
    try {
      const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 50000 },
        );
      });
      position = { lat: coords.latitude, lng: coords.longitude };
    } catch (error) {
      console.log('Geolocation rejected, using default position', error);
    }
  } else {
    console.log('Geolocation not supported');
  }

  //! does the thing
  emitMarkerPosition(position.lng, position.lat);

  // Request needed libraries.
  //@ts-ignore - this is used to ignore ts errors bellow this line (in our case google.maps throws a TS error)
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    'marker',
  )) as google.maps.MarkerLibrary;
  const { Autocomplete } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;

  // The map, centered at Grand Place
  const map = new Map(container, {
    zoom: 15,
    center: position,
    mapId: import.meta.env.VITE_MAP_ID,
    mapTypeControl: false,
    streetViewControl: false,
  });

  currentMap = map;

  let currentMarker: google.maps.marker.AdvancedMarkerElement | null = null;

  currentMarker = new AdvancedMarkerElement({
    map,
    position, // this is either the default or geolocated position
    title: 'Current location',
  });

  const bounds = new google.maps.LatLngBounds();
  console.log('Radius here: ', radius);
  currentRadius = radius;

  upsertRadiusCircle(map, position, currentRadius);

  // Plot markers for both events and places on initial load
  await loadMarkers(map, bounds, position.lat, position.lng, currentRadius);

  const autocomplete = new Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  autocomplete.addListener('place_changed', async () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const coords = place.geometry.location;
    const latitude = coords.lat();
    const longitude = coords.lng();

    // coordsHelper = `${longitude},${latitude}`;
    //!does the thing
    emitMarkerPosition(longitude, latitude);

    console.log(getMarkerPosition());

    // Removes old marker if there is one
    if (currentMarker) {
      currentMarker.map = null;
      currentMarker = null;
    }

    // Adds new marker for the searched place
    currentMarker = new AdvancedMarkerElement({
      map,
      position: place.geometry.location,
      title: place.name || 'Found spot',
    });

    // Create a LatLngBounds object to include all markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(place.geometry.location);

    // fit to circle first, then load with the current radius
    upsertRadiusCircle(map, { lat: latitude, lng: longitude }, currentRadius);

    await loadMarkers(map, bounds, latitude, longitude, currentRadius);
    // await loadMarkers(map, bounds, latitude, longitude, radius);

    //! Opentripmap call starts here - DON'T DELETE IT PLEASE
    // try {
    //   const res = await fetch(`/api/opentripmap?latitude=${latitude}&longitude=${longitude}&radius=10000`);
    //   if (!res.ok) throw new Error("Failed to fetch OpenTripMap data");
    //   const data = await res.json();

    //   const infoWindow = new google.maps.InfoWindow();

    //   data.forEach((feature: any) => {
    //     const [lon, lat] = feature.geometry.coordinates;
    //     const name = feature.properties.name || "Unnamed place";
    //     const kinds = feature.properties.kinds || "No category found";
    //     const address = feature.properties.address || "No address found";

    //     const icon = document.createElement("img");
    //     icon.src = "./creep.jpg";
    //     icon.style.width = "20px";
    //     icon.style.height = "20px";

    //     const marker = new AdvancedMarkerElement({
    //       map,
    //       position: { lat, lng: lon },
    //       title: name,
    //       content: icon,
    //     });

    //     // Include OpenTripMap markers in bounds
    //     bounds.extend({ lat, lng: lon });

    //     marker.addListener("click", async () => {
    //       const res = await fetch(`/api/opentripmap/details/${feature.properties.xid}`);
    //       const details = await res.json();
    //       const address = details.address ? `${details.address.road || ''} ${details.address.house_number || ''}, ${details.address.city || ''}, ${details.address.country || ''}` : 'No address available';

    //       //TODO get a fallback image to plug in as default if we have no details.preview.source

    //       infoWindow.setContent(`
    //         <div style="font-size:14px">
    //         ${details.preview?.source ? `<img src="${details.preview.source}" style="max-height:500px; width:auto; height:auto;"/>` : ""}
    //         <strong>${name}</strong><br/>
    //         <em>${kinds}</em><br/>
    //         ${address}
    //         </div>
    //         `);
    //         infoWindow.open(map, marker);
    //       });
    //     });

    //     // Fit map to include the searched place + all OpenTripMap markers
    //     map.fitBounds(bounds);

    //   } catch (error) {
    //     console.error("Error loading OpenTripMap data:", error);
    //     map.setCenter(place.geometry.location);
    //     map.setZoom(17);
    //   }
    // });
    //! Opentripmap call ends here
  });
}

window.addEventListener('radiuschange', async (e: Event) => {
  try {
    if (!currentMap || !coordsHelper) return;
    const { radius } = (e as CustomEvent<{ radius: number }>).detail;
    currentRadius = radius;
    const [lonStr, latStr] = coordsHelper.split(',');
    const lon = parseFloat(lonStr);
    const lat = parseFloat(latStr);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return;


    upsertRadiusCircle(currentMap, { lat, lng: lon }, currentRadius);

    const bounds = new google.maps.LatLngBounds();
    await loadMarkers(currentMap, bounds, lat, lon, currentRadius);
  } catch (err) {
    console.error('Failed to reload markers on radius change', err);
  }
});
