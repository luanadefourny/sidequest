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

async function getQuests(filters: QuestFilters = {}): Promise<Quest[]> {
  try {
    const { data } = await server.get<Quest[]>(`/quests`, { params: filters });
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
