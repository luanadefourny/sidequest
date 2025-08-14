import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { User } from '../../types';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo(() =>({ user, setUser }), [user]);
  return <UserContext.Provider value={ value }>{ children }</UserContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
