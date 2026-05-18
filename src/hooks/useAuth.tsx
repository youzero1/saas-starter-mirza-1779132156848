import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '@/types';

const STORAGE_KEY = 'jb_auth_user';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', avatar: 'AJ' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', avatar: 'BS' },
  { id: '3', name: 'Carol White', email: 'carol@company.com', avatar: 'CW' },
];

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        setAuthState({ user, isAuthenticated: true });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setAuthState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, isAuthenticated: false });
  };

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
