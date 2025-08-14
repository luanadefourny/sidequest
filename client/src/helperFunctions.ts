import axios from 'axios';
import type { ErrorBody } from './types';

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

export { extractAxiosError };