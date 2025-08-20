import axios from 'axios';

import { serverUrl } from '../constants';
import { extractAxiosError } from '../helperFunctions';
import type { Quest } from '../types';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
});

async function getTicketmasterEvents(params: {
  near: string;           // "lon,lat"
  radius: number;         // meters (server converts to km)
  segment?: string;       // optional (e.g., "Arts & Theatre")
  limit?: number;         // optional -> size
}): Promise<Quest[]> {
  try {
    const q: Record<string, string> = {
      near: params.near,
      radius: String(params.radius),
    };
    if (params.segment) q.segment = params.segment;
    if (params.limit)  q.size    = String(params.limit);

    const { data } = await server.get<Quest[]>('/api/ticketmaster', { params: q });
    return data;
  } catch (error) {
    extractAxiosError(error, 'getTicketmasterEvents');
    return [];
  }
}

export { getTicketmasterEvents };