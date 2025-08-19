import axios from 'axios'

import { extractAxiosError } from '../helperFunctions';
import type { OpenTripMapDetails, OpenTripMapPlace } from '../types';

const api = axios.create({
  baseURL: '/api/opentripmap',
  headers: { 'Content-Type': 'application/json' },
})



async function getPlaces (latitude: number, longitude: number, radius: number, kinds?: string): Promise<OpenTripMapPlace[]> {
  try {
    const { data } = await api.get('', {
      params: {
        latitude,
        longitude,
        radius,
        ...(kinds ? { kinds } : {}),
      },
    });
    console.log('getPlaces data: ', data);

    const arr = Array.isArray(data) ? data : Array.isArray(data?.features) ? data.features : [];

    return arr.filter((feature: any) => 
      Array.isArray(feature.geometry.coordinates) && 
      feature.geometry.coordinates.length === 2 &&
      Number.isFinite(feature.geometry.coordinates[0]) &&
      Number.isFinite(feature.geometry.coordinates[1])
    )
    .map((feature: any): OpenTripMapPlace => {
      const [lon, lat] = feature.geometry.coordinates;
      const properties = feature.properties ?? {};
      return {
        id: String(properties.xid ?? properties.id ?? `${lon},${lat}`),
        xid: properties.xid ? String(properties.xid) : '',
        name: String(properties.name ?? 'Unknown'),
        kinds: typeof properties.kinds === 'string' ? properties.kinds.split(',') : [],
        coords: { lat: Number(lat), lng: Number(lon) },
        url: typeof properties.wikidata === 'string'
          ? `https://www.wikidata.org/wiki/${properties.wikidata}`
          : typeof properties.wikipedia === 'string'
            ? `https://${properties.wikipedia}`
            : undefined,
        source: 'opentripmap',
      };
    });
  } catch (error) {
    extractAxiosError(error, 'getPlaces');
  }
}

async function getPlaceDetails (xid?: string): Promise<OpenTripMapDetails | null> {
  if (!xid) return null;

  try {
    const { data } = await api.get(`/details/${xid}`);
    console.log('getPlaceDetails data: ', data);
    const address = data?.address
      ? `${data.address.road || ''} ${data.address.house_number || ''}, ${data.address.city || ''}, ${data.address.country || ''}`.trim()
      : undefined;
    const preview = data?.preview?.source as string | undefined;
    return { address, preview, raw: data }; 
  } catch (error) {
    extractAxiosError(error, 'getPlaceDetails');
  }
}

export { getPlaceDetails, getPlaces };