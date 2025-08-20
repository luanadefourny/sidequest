export const serverUrl: string = 'http://localhost:3000';
export const PROFILE_PICS = Array.from(
  { length: 10 },
  (_, i) => `/profile-pics/profile-pic-${i + 1}.jpg`,
);
export const STORAGE_KEY = 'user';
export const HARD_LIMIT = 250;