import axios, { AxiosError } from 'axios';
import { serverUrl } from "../constants";
import type { 
  User, 
  RegisterUserData, 
  LoginUserData, 
  EditUserData,
  Credentials,
  PublicUserData,
  MyQuest, 
} from '../types';
import { Types } from 'mongoose';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
})

async function getUsers (): Promise<User[]> {
  try {
    const { data } = await server.get<User[]>(`/users`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getUsers failed:${status} ${detail}`);
  }
}

async function getUser (userId: Types.ObjectId): Promise<PublicUserData> {
  try {
    const { data } = await server.get<PublicUserData>(`/users/${userId}`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getUser failed:${status} ${detail}`);
  }
}

async function registerUser (userData: RegisterUserData): Promise<User> {
 try {
  const { data } = await server.post<User>(`/users`, userData);
  return data;
 } catch (error) {
  const e = error as AxiosError<{ error?: string; message?: string }>;
  const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
  const status = e.response?.status ? ` ${e.response.status}` : '';
  throw new Error(`registerUser failed:${status} ${detail}`);
 }
}

async function loginUser (loginData: LoginUserData): Promise<User> {
  try {
    const { data } = await server.post<User>(`/login`, loginData);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`loginUser failed:${status} ${detail}`);
  }
}

// only for non-sensitive data like first/last name, profile picture, birthday
async function editUserData (userId: Types.ObjectId, dataToEdit: EditUserData): Promise<User> {
  try {
    const { data } = await server.patch<User>(`/users/${userId}`, dataToEdit);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`editUserData failed:${status} ${detail}`);
  }
}

async function editUserCredentials (userId: Types.ObjectId, credentials: Credentials): Promise<User> {
  try {
    const { data } = await server.patch<User>(`/users/${userId}/credentials`, credentials);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`editUserCredentials failed:${status} ${detail}`);
  }
}

async function editUserPassword (userId: Types.ObjectId, password: string): Promise<User> {
  try {
    const { data } = await server.patch<User>(`/users/${userId}/password`, { newPassword: password });
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`editUserPassword failed:${status} ${detail}`);
  }
}

async function getMyQuests (userId: Types.ObjectId, populate?: 0|1): Promise<MyQuest[]> {
  try {
    const queryParams = populate ? `?populate=${populate}` : '';
    const { data } = await server.get<MyQuest[]>(`/users/${userId}/my-quests${queryParams}`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getMyQuests failed:${status} ${detail}`);
  }
}

async function getMyQuest (userId: Types.ObjectId, questId: Types.ObjectId, populate?: 0|1): Promise<MyQuest> {
  try {
    const queryParams = populate ? `?populate=${populate}` : '';
    const { data } = await server.get<MyQuest>(`/users/${userId}/my-quests/${questId}${queryParams}`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getMyQuest failed:${status} ${detail}`);
  }
}

async function addToMyQuests (userId: Types.ObjectId, questId: Types.ObjectId, populate?: 0|1): Promise<MyQuest[]> {
  try {
    const queryParams = populate ? `?populate=${populate}` : '';
    const { data } = await server.post<MyQuest[]>(`/users/${userId}/my-quests/${questId}${queryParams}`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`addToMyQuests failed:${status} ${detail}`);
  }
}

async function removeFromMyQuests (userId: Types.ObjectId, questId: Types.ObjectId, populate?: 0|1): Promise<MyQuest[]> {
  try {
    const queryParams = populate ? `?populate=${populate}` : '';
    const { data, status } = await server.delete<MyQuest[]>(`/users/${userId}/my-quests/${questId}${queryParams}`);
    return status === 204 ? [] : data; //in case there is nothing to remove
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`removeFromMyQuests failed:${status} ${detail}`);
  }
}

async function toggleFavoriteQuest (userId: Types.ObjectId, questId: Types.ObjectId, populate?: 0|1): Promise<MyQuest[]> {
  try {
    const queryParams = populate ? `?populate=${populate}` : '';
    const { data } = await server.patch<MyQuest[]>(`/users/${userId}/my-quests/${questId}/favorite${queryParams}`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`toggleFavoriteQuest failed:${status} ${detail}`);

  }
}

export { 
  getUsers, 
  getUser, 
  registerUser, 
  loginUser, 
  editUserData,
  editUserCredentials,
  editUserPassword,
  getMyQuests,
  getMyQuest,
  addToMyQuests,
  removeFromMyQuests,
  toggleFavoriteQuest,
};