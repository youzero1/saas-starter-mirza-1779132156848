import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '@/types';
import { dbGet, dbPut, dbCount, USERS_STORE } from '@/lib/db';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'jb_auth_user_id';

const SEED_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', avatar: 'AJ' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', avatar: 'BS' },
  { id: '3', name: 'Carol White', email: 'carol@company.com', avatar: 'CW' },
];

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function seedUsers() {
  const count = await dbCount(USERS_STORE);
  if (count === 0) {
    for (const u of SEED_USERS) {
      await dbPut<User>(USERS_STORE, u);
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await seedUsers();

        const storedId = localStorage.getItem(STORAGE_KEY);
        if (storedId) {
          const user = await dbGet<User>(USERS_STORE, storedId);
          if (!cancelled && user) {
            setAuthState({ user, isAuthenticated: true });
          }
        }
      } catch (err) {
        console.error('[DB] auth init error', err);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(
    async (email: string, _password: string): Promise<boolean> => {
      try {
        // Search all users for matching email
        const db = await import('@/lib/db');
        const allUsers = await db.dbGetAll<User>(USERS_STORE);
        const user = allUsers.find((u) => u.email === email);
        if (user) {
          localStorage.setItem(STORAGE_KEY, user.id);
          setAuthState({ user, isAuthenticated: true });
          return true;
        }
        return false;
      } catch (err) {
        console.error('[DB] login error', err);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Keep generateId accessible for future user creation flows
export { generateId };
