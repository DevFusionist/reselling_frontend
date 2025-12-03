'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role?: 'admin' | 'customer' | 'reseller') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored auth state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('velvetZenith_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('velvetZenith_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.login(email, password);
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('velvetZenith_user', JSON.stringify(userData));
        // Set cookie for middleware (simple flag)
        document.cookie = `velvetZenith_auth=true; path=/; max-age=86400; SameSite=Lax`;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: 'admin' | 'customer' | 'reseller' = 'customer') => {
    setLoading(true);
    try {
      const response = await apiClient.signup(email, password, role);
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('velvetZenith_user', JSON.stringify(userData));
        // Set cookie for middleware (simple flag)
        document.cookie = `velvetZenith_auth=true; path=/; max-age=86400; SameSite=Lax`;
        // Also set tokens from signup response
        if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem('velvetZenith_accessToken', response.data.accessToken);
          localStorage.setItem('velvetZenith_refreshToken', response.data.refreshToken);
        }
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('velvetZenith_refreshToken');
      if (refreshToken) {
        await apiClient.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('velvetZenith_user');
      localStorage.removeItem('velvetZenith_accessToken');
      localStorage.removeItem('velvetZenith_refreshToken');
      // Clear cookie
      document.cookie = 'velvetZenith_auth=; path=/; max-age=0';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

