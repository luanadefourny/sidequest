import axios from 'axios';

import { serverUrl } from '../constants';
import { extractAxiosError } from '../helperFunctions';
import type { Quest } from '../types';

const api = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
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

    const { data } = await api.get<Quest[]>('/ticketmaster', { params: q });
    return data;
  } catch (error) {
    extractAxiosError(error, 'getTicketmasterEvents');
    return [];
  }
}

async function getEventDetails (id: string) {
  try {
    const { data } = await api.get(`/ticketmaster/${encodeURIComponent(id)}`);
    return data as {
      id: string; name: string; url?: string; info?: string;
      venueName?: string; address?: string; city?: string; country?: string;
      image?: string; start?: string; price?: number; currency?: string;
    };
  } catch (error) {
    extractAxiosError(error, 'getEventDetails');
  }
}

export { getEventDetails, getTicketmasterEvents };