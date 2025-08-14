//TODO fix this below to export coords
let coordsHelper: string | null = null;

export function getMarkerPosition() {
  return coordsHelper;
}

export async function initMap(container: HTMLElement, input: HTMLInputElement): Promise<void> {
  // The location of Grand Place
  const position = { lat: 50.846760, lng: 4.352780 };
  
  // Request needed libraries.
  //@ts-ignore - this is used to ignore ts errors bellow this line (in our case google.maps throws a TS error)
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

  // The map, centered at Grand Place
  const map = new Map(container, {
      zoom: 15,
      center: position,
      mapId: import.meta.env.VITE_MAP_ID,
      mapTypeControl: false,
  });

  let currentMarker: google.maps.marker.AdvancedMarkerElement | null = null;

  const autocomplete = new Autocomplete(input);
  autocomplete.bindTo("bounds", map);
  autocomplete.addListener("place_changed", async () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    
    const coords = place.geometry.location;
    const latitude = coords.lat();
    const longitude = coords.lng();

    coordsHelper = `${longitude},${latitude}`;

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
      title: place.name || "Found spot",
    });
    
    
    // Create a LatLngBounds object to include all markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(place.geometry.location);
    
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

    //! mock data call starts here
    try {
      const res = await fetch(`http://localhost:3000/quests?near=${longitude},${latitude}&radius=10000`);
      if (!res.ok) throw new Error("Failed to fetch mock data from DB");
      const data = await res.json();
      
      const infoWindow = new google.maps.InfoWindow();
      
      data.forEach((entry: any) => {
        const [lon, lat] = entry.location.location.coordinates;
        const name = entry.name || "Unnamed place";
        const type = entry.type || "No category found";
        const description = entry.description || "No address found";
        
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
          //TODO get a fallback image to plug in as default if we have no details.preview.source
          
          infoWindow.setContent(`
            <div style="font-size:14px">
            <strong>${name}</strong><br/>
            <em>${type}</em><br/>
            ${description}
            </div>
            `);
            infoWindow.open(map, marker);
          });
        });
        
        // Fit map to include the searched place + all OpenTripMap markers
        map.fitBounds(bounds);
        
      } catch (error) {
        console.error("Error loading OpenTripMap data:", error);
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    });
    //! mock data call ends here
}