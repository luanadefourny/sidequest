// Initialize and add the map
let map;

export async function initMap(container: HTMLElement): Promise<void> {
  // The location of Grand Place
  const position = { lat: 50.846760, lng: 4.352780 };

  // Request needed libraries.
  //@ts-ignore - this is used to ignore ts errors bellow this line (in our case google.maps throws a TS error)
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  //@ts-ignore
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  // The map, centered at Grand Place
  map = new Map(container, {
      zoom: 15,
      center: position,
      mapId: '40c5454ddb73d58df4c06ef3',
      mapTypeControl: false,
  });

  // The marker, positioned at Grand Place
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'Grand Place'
  });
}