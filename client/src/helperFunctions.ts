import axios from 'axios';

function extractAxiosError (error: unknown, context: string): never {
  if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
    const detail = error.response?.data?.error ?? error.response?.data?.message ?? error.message;
    const status = error.response?.status ? ` ${error.response.status}` : '';
    throw new Error(`${context} failed:${status} ${detail}`);
  }
  throw new Error(`${context} failed: ${String(error)}`);
}

export { extractAxiosError };