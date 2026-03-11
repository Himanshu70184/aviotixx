import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminMe, clearToken, getToken, type AdminUser } from '../services/adminApi';

interface AuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAdmin: (admin: AdminUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setIsLoading(false); return; }
    adminMe()
      .then(setAdmin)
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const logout = () => {
    clearToken();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, isAuthenticated: !!admin, setAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
