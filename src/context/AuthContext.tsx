import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/services/auth.api';
import { userApi } from '../api/services/user.api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  emailVerification: boolean;
  emailVerificationLocked: boolean;
  phoneVerification: boolean;
  phoneVerificationLocked: boolean;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  register: (token: string, user?: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [user, setUser] = useState<User | null>(null); // Normally we might fetch user on mount if token exists
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await userApi.getCurrentUser();
      setUser(data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

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
      await authApi.logout();
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
    refreshUser,
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
