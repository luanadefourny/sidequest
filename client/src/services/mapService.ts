
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
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      return;
    }

    const name = place.name || 'Not registered';
    const address = place.formatted_address || 'No adress';
    const coords = place.geometry.location;
    const latitude = coords.lat();
    const longitude = coords.lng();
    console.log({ name, address, latitude, longitude });

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    // Remove old marker if exists
    if (currentMarker) {
      currentMarker.map = null;  // Remove from map
      currentMarker = null;
    }

    // Add new marker
    currentMarker = new AdvancedMarkerElement({
      map: map,
      position: place.geometry.location,
      title: place.name || 'Found spot',
    });
  });
}