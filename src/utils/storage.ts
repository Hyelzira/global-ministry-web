import type { NewUserDto } from '../types';

const TOKEN_KEY = 'gfm_token';
const REFRESH_KEY = 'gfm_refresh_token';
const USER_KEY = 'gfm_user';

export const storage = {
  getToken: (): string | null =>
    localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void =>
    localStorage.setItem(TOKEN_KEY, token),

  getRefreshToken: (): string | null =>
    localStorage.getItem(REFRESH_KEY),

  setRefreshToken: (token: string): void =>
    localStorage.setItem(REFRESH_KEY, token),

  getUser: (): NewUserDto | null => {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  setUser: (user: NewUserDto): void =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
};