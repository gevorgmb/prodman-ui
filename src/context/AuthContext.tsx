import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  register: (token: string, user?: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [user, setUser] = useState<User | null>(null); // Normally we might fetch user on mount if token exists
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token is valid or fetch user profile if needed
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // For now, we'll assume the token is enough, but in a real app,
      // we'd probably call /api/me here.
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser?: User) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    if (newUser) setUser(newUser);
  }, []);

  const register = useCallback((newToken: string, newUser?: User) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    if (newUser) setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
