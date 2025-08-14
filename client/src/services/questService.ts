import axios from 'axios';
import { extractAxiosError } from '../helperFunctions';
import { serverUrl } from '../constants';
import type {
  Quest,
  QuestFilters,
} from '../types';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
});

async function getQuests (filters: QuestFilters = {}): Promise<Quest[]> {
  try {
    const { data } = await server.get<Quest[]>(`/quests`, { params: filters });
    return data;
  } catch (error) {
    extractAxiosError(error, 'getQuests');
  }
}

async function getQuest (questId: string): Promise<Quest> {
  try {
    const { data } = await server.get<Quest>(`/quests/${questId}`);
    return data;
  } catch (error) {
    extractAxiosError(error, 'getQuest');
  }
}

export { 
  getQuests, 
  getQuest, 
};