import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { ReactNode } from 'react';

interface User {
  id: number;
  username: string | null;
  email?: string;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const userData = await authService.checkAuth();
    setUser(userData);
  };

  useEffect(() => {
    const checkUser = async () => {
      await refreshUser();
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = () => {
    authService.login();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}