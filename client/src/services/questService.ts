import axios, { AxiosError } from 'axios';
import { serverUrl } from '../constants';
import type {
  Quest,
} from '../types';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
});

async function getQuests (): Promise<Quest[]> {
  try {
    const { data } = await server.get<Quest[]>(`/quests`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getQuests failed:${status} ${detail}`);

  }
}

export { 
  getQuests,
};