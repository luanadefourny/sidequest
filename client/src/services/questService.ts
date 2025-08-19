import axios from 'axios';

import { serverUrl } from '../constants';
import { extractAxiosError } from '../helperFunctions';
import type { Quest, QuestFilters } from '../types';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
});

server.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//! mock data version
// async function getQuests(filters: QuestFilters = {}): Promise<Quest[]> {
//   try {
//     const { data } = await server.get<Quest[]>(`/quests`, { params: filters });
//     return data;
//   } catch (error) {
//     extractAxiosError(error, 'getQuests');
//   }
// }

//! live version for api
async function getQuests(filters: QuestFilters = {}): Promise<Quest[]> {
  try {
    const params: Record<string, string> = {};
    if ((filters as any).near)   params.near   = String((filters as any).near);   // "lon,lat"
    if ((filters as any).radius) params.radius = String((filters as any).radius); // meters
    if ((filters as any).limit)  params.limit  = String((filters as any).limit);
    if ((filters as any).kinds)  params.kinds  = String((filters as any).kinds);

    const { data } = await server.get<Quest[]>('/api/quests/live', { params });
    console.log('getquests service data: ', data);
    return data;
  } catch (error) {
    extractAxiosError(error, 'getQuests');
  }
}

async function getQuest(questId: string): Promise<Quest> {
  try {
    const { data } = await server.get<Quest>(`/quests/${questId}`);
    return data;
  } catch (error) {
    extractAxiosError(error, 'getQuest');
  }
}

export { getQuest, getQuests };
