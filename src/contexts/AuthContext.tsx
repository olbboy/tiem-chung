import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if token exists on mount
    const token = apiService.getToken();
    console.log('[Auth] Checking existing token:', token ? 'found' : 'not found');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    try {
      console.log('[Auth] Login attempt');
      await apiService.login(phoneNumber, password);

      // API service now guarantees that token exists in response
      // or throws an error, so we can safely set isAuthenticated
      console.log('[Auth] Login successful, setting authenticated');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    console.log('[Auth] Logout');
    apiService.clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
