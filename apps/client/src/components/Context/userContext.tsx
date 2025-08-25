import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { STORAGE_KEY } from '../../constants';
import type { User, UserContextType } from '../../types';

const isBrowser = typeof window !== 'undefined';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (!isBrowser) return null;
    try {
      const info = window.localStorage.getItem(STORAGE_KEY);
      return info ? JSON.parse(info) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  useEffect(() => {
    if (!isBrowser) return;
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setUser(event.newValue ? JSON.parse(event.newValue) : null);
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const value = useMemo(() => ({ user, setUser, loggedIn: user !== null }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
