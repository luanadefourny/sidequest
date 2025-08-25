import axios from 'axios';

import { serverUrl } from '../constants';
import { extractAxiosError } from '../helperFunctions';
import type { Quest, QuestDTO, QuestFilters } from '../types';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
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

    if ((filters as any).near) params.near = String((filters as any).near);
    if ((filters as any).radius) params.radius = String((filters as any).radius);
    if ((filters as any).limit)  params.limit  = String((filters as any).limit);
    if ((filters as any).kinds)  params.kinds  = String((filters as any).kinds);
    params.includeEvents = '1';
    params.todayOnly = '1';

    const { data } = await server.get<QuestDTO[]>('/quests/live', { params });

    const normalized: Quest[] = (Array.isArray(data) ? data : []).map((quest) => {
      const [lon, lat] = Array.isArray(quest.location?.coordinates)
        ? quest.location.coordinates
        : [NaN, NaN];

      const id =
        quest._id ??
        (quest.source && quest.sourceId
          ? `${quest.source}:${quest.sourceId}`
          : `${quest.name}:${lon},${lat}`);

      return {
        _id: String(id),
        name: String(quest.name ?? 'Unknown'),
        type: quest.type === 'event' ? 'event' : 'place',
        location: {
          type: 'Point',
          coordinates: [Number(lon), Number(lat)],
        },
        ageRestricted: Boolean(quest.ageRestricted),
        price: typeof quest.price === 'number' ? quest.price : undefined,
        currency: typeof quest.currency === 'string' ? quest.currency : undefined,
        url: typeof quest.url === 'string' ? quest.url : undefined,
        startAt: typeof quest.startAt === 'string' ? quest.startAt : undefined,
        endAt: typeof quest.endAt === 'string' ? quest.endAt : undefined,
        description: typeof quest.description === 'string' ? quest.description : undefined,
        source: typeof quest.source === 'string' ? quest.source : undefined,
        sourceId: typeof quest.sourceId === 'string' ? quest.sourceId : undefined,
        venueName: typeof (quest as any).venueName === 'string' ? (quest as any).venueName : undefined,
        image: typeof (quest as any).image === 'string' ? (quest as any).image : undefined,
      };
    });
    // console.log('normalized: ',normalized);
    return normalized;
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
