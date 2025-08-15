import axios from 'axios';
import type { ErrorBody } from './types';
import { PROFILE_PICS } from './constants';

function extractAxiosError (error: unknown, context: string): never {
  if (axios.isAxiosError<ErrorBody>(error)) {
    const s = error.response?.status;
    const b = error.response?.data;
    const detail = b?.error ?? b?.message ?? error.message ?? 'Unknown Axios error';
    throw new Error(`${context} failed${s ? ` ${s}` : ''}: ${detail}`);
  }
  if (error instanceof Error) throw new Error(`${context} failed: ${error.message}`);
  throw new Error(`${context} failed: ${String(error)}`);
}

function pickRandomProfilePicture () {
  return PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
}

export { extractAxiosError, pickRandomProfilePicture };