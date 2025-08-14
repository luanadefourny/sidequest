import axios, { AxiosError } from 'axios';
import { serverUrl } from '../constants';
import { Types } from 'mongoose';
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
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getQuests failed:${status} ${detail}`);

  }
}

async function getQuest (questId: Types.ObjectId): Promise<Quest> {
  try {
    const { data } = await server.get<Quest>(`/quests/${questId}`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getQuest failed:${status} ${detail}`);
  }
}

export { 
  getQuests, 
  getQuest, 
};