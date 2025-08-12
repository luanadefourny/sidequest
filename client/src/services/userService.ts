import axios, { AxiosError } from 'axios';
import { serverUrl } from "../constants";
import type { 
  User, 
  RegisterUserData, 
  LoginUserData, 
  EditUserData,
  Credentials,
  PublicUserData, 
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
    throw new Error(`getUsers failed:${status} ${detail}`);
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
    const { data } = await server.patch<User>(`/users/${userId}/password`, password);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`editUserPassword failed:${status} ${detail}`);
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
};