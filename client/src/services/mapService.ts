//TODO fix openmapapi to follow mock syntax when replugging it in
let coordsHelper: string | null = null;
let apiData: any[] = [];
let currentMap: google.maps.Map | null = null;
let currentRadius = 1000; //meters
let loadSeq = 0;
let mapMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

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
      const res = await fetch(`/api/opentripmap?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
      if (!res.ok) throw new Error("Failed to fetch OpenTripMap data");
      const data = await res.json();

      if (seq !== loadSeq) return;
      
      apiData = data;
      console.log(apiData);

      const infoWindow = new google.maps.InfoWindow();

       data.forEach((feature: any) => {
        console.log('Feature: ',feature);
        const [lon, lat] = feature.geometry.coordinates;
        const name = feature.properties.name || "Unnamed place";
        const kinds = feature.properties.kinds || "No category found";

        const icon = document.createElement("img");
        icon.src = "./creep.jpg";
        icon.style.width = "20px";
        icon.style.height = "20px";

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat, lng: lon },
          title: name,
          content: icon,
        });

        // Include OpenTripMap markers in bounds
        bounds.extend({ lat, lng: lon });

        marker.addListener("click", async () => {
          const res = await fetch(`/api/opentripmap/details/${feature.properties.xid}`);
          const details = await res.json();
          console.log(details);
          const address = details.address ? `${details.address.road || ''} ${details.address.house_number || ''}, ${details.address.city || ''}, ${details.address.country || ''}` : 'No address available';

    //       //TODO get a fallback image to plug in as default if we have no details.preview.source

          infoWindow.setContent(`
            <div style="font-size:14px">
            ${details.preview?.source ? `<img src="${details.preview.source}" style="max-height:200px; width:auto; height:auto;"/>` : ""}
            <strong>${name}</strong><br/>
            <em>${kinds}</em><br/>
            ${address}
            </div>
            `);
            infoWindow.open(map, marker);
          });
        });

    //     // Fit map to include the searched place + all OpenTripMap markers
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        map.setZoom(15);
      }
    } else {
      // If no markers, center on fallback location
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
    await loadMarkers(map, bounds, latitude, longitude, radius);

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
    const bounds = new google.maps.LatLngBounds();
    await loadMarkers(currentMap, bounds, lat, lon, currentRadius);
  } catch (err) {
    console.error('Failed to reload markers on radius change', err);
  }
});
