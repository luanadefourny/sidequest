import axios from 'axios';

import { serverUrl } from '../constants';
import { extractAxiosError } from '../helperFunctions';
import type {
  Credentials,
  EditUserData,
  LoginUserData,
  MyQuest,
  PublicUserData,
  RegisterUserData,
  User,
} from '../types';

const server = axios.create({
  baseURL: serverUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

async function getUsers(): Promise<User[]> {
  try {
    const { data } = await server.get<User[]>(`/users`);
    return data;
  } catch (error) {
    extractAxiosError(error, 'getUsers');
  }
}

async function getUser(userId: string): Promise<PublicUserData> {
  try {
    const { data } = await server.get<PublicUserData>(`/users/${userId}`);
    return data;
  } catch (error) {
    extractAxiosError(error, 'getUser');
  }
}

async function registerUser(userData: RegisterUserData): Promise<User> {
  try {
    const { data } = await server.post<User>(`/users`, userData);
    return data;
  } catch (error) {
    extractAxiosError(error, 'registerUser');
  }
}

async function loginUser(loginData: LoginUserData): Promise<User> {
  try {
    const { data } = await server.post<User>(`/login`, loginData);
    return data;
  } catch (error) {
    extractAxiosError(error, 'loginUser');
  }
}

async function logoutUser(userId: string): Promise<User> {
  try {
    const { data } = await server.patch<User>(`/users/${userId}/logout`);
    return data;
  } catch (error) {
    extractAxiosError(error, 'logoutUser');
  }
}

// only for non-sensitive data like first/last name, profile picture, birthday
async function editUserData(userId: string, dataToEdit: EditUserData): Promise<User> {
  try {
    const { data } = await server.patch<User>(`/users/${userId}`, dataToEdit);
    return data;
  } catch (error) {
    extractAxiosError(error, 'editUserData');
  }
}

async function editUserCredentials(userId: string, credentials: Credentials): Promise<User> {
  try {
    const { data } = await server.patch<User>(`/users/${userId}/credentials`, credentials);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMsg = error.response?.data?.message;
      if (status === 409) {
        // surface a clean, user-friendly message
        throw new Error(serverMsg || 'Username or email already exists');
      }
      throw new Error(serverMsg || 'Failed to update credentials');
    }
    throw error;
  }
}

async function editUserPassword(userId: string, password: string): Promise<User> {
  try {
    const { data } = await server.patch<User>(`/users/${userId}/password`, {
      newPassword: password,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMsg = error.response?.data?.message;
      throw new Error(serverMsg || 'Failed to update password');
    }
    throw error;
  }
}

async function uploadProfilePicture(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  try {
    const { data } = await server.post<{ url: string }>('/uploads/profile-picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMsg = error.response?.data?.message;
      if (status === 404) {
        throw new Error('Profile picture uploads are not configured on the server');
      }
      throw new Error(serverMsg || 'Profile picture upload failed');
    }
    throw error;
  }
}

async function getMyQuests(userId: string, populate?: 0 | 1): Promise<MyQuest[]> {
  try {
    const { data } = await server.get<MyQuest[]>(`/users/${userId}/my-quests`, {
      params: populate !== undefined ? { populate } : {},
    });
    return data;
  } catch (error) {
    extractAxiosError(error, 'getMyQuests');
  }
}

async function getMyQuest(userId: string, questId: string, populate?: 0 | 1): Promise<MyQuest> {
  try {
    const { data } = await server.get<MyQuest>(`/users/${userId}/my-quests/${questId}`, {
      params: populate !== undefined ? { populate } : {},
    });
    return data;
  } catch (error) {
    extractAxiosError(error, 'getMyQuest');
  }
}

async function addToMyQuests(
  userId: string,
  questId: string,
  populate?: 0 | 1,
): Promise<MyQuest[]> {
  try {
    const { data } = await server.post<MyQuest[]>(
      `/users/${userId}/my-quests/${questId}`,
      undefined,
      { params: populate !== undefined ? { populate } : {} },
    );
    return data;
  } catch (error) {
    extractAxiosError(error, 'addToMyQuests');
  }
}

async function removeFromMyQuests(
  userId: string,
  questId: string,
  populate?: 0 | 1,
): Promise<MyQuest[]> {
  try {
    const { data, status } = await server.delete<MyQuest[]>(
      `/users/${userId}/my-quests/${questId}`,
      { params: populate !== undefined ? { populate } : {} },
    );
    return status === 204 ? [] : data; //in case there is nothing to remove
  } catch (error) {
    extractAxiosError(error, 'removeFromMyQuests');
  }
}

async function toggleFavoriteQuest(
  userId: string,
  questId: string,
  populate?: 0 | 1,
): Promise<MyQuest[]> {
  try {
    const { data } = await server.patch<MyQuest[]>(
      `/users/${userId}/my-quests/${questId}/favorite`,
      undefined,
      { params: populate !== undefined ? { populate } : {} },
    );
    return data;
  } catch (error) {
    extractAxiosError(error, 'toggleFavoriteQuest');
  }
}

export {
  addToMyQuests,
  editUserCredentials,
  editUserData,
  editUserPassword,
  getMyQuest,
  getMyQuests,
  getUser,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  removeFromMyQuests,
  toggleFavoriteQuest,
  uploadProfilePicture,
};
