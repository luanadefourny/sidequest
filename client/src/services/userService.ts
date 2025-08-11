import axios, { AxiosError } from 'axios';
import { serverUrl } from "../constants";
import type { User, RegisterUserData, LoginUserData } from '../types';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
})

async function getAllUsers (): Promise<User[]> {
  try {
    const { data } = await server.get<User[]>(`/users`);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`getAllUsers failed:${status} ${detail}`);
  }
}

//TODO: maybe change name, depending on whether there are separate login and register endpoints
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
    const { data } = await server.put<User>(`/login`, loginData);
    return data;
  } catch (error) {
    const e = error as AxiosError<{ error?: string; message?: string }>;
    const detail = e.response?.data?.error ?? e.response?.data?.message ?? e.message;
    const status = e.response?.status ? ` ${e.response.status}` : '';
    throw new Error(`loginUser failed:${status} ${detail}`);
  }
}

export { getAllUsers, registerUser, loginUser };