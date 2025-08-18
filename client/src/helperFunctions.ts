import axios from 'axios';

import { PROFILE_PICS } from './constants';
import type { ErrorBody } from './types';

function extractAxiosError(error: unknown, context: string, fallback = 'Request failed'): never {
  if (axios.isAxiosError<ErrorBody>(error)) {
    const status = error.response?.status;
    const body = error.response?.data;
    const detail = body?.error ?? body?.message ?? error.message ?? fallback;
    // Log detailed context for developers without exposing it to the UI
    console.error(`[${context}]`, { status, detail, body });
    throw new Error(detail);  }
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[${context}]`, msg);
  throw new Error(fallback);
}

function pickRandomProfilePicture() {
  return PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
}

function capitalizeFirstLetter(str: string) {
  return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
}

export { capitalizeFirstLetter, extractAxiosError, pickRandomProfilePicture };
