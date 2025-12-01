'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  // Add more user properties as needed
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
      // Mock authentication - replace with actual Firebase/auth service
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would do:
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      
      // For now, mock successful login
      const userData: User = { email };
      setUser(userData);
      localStorage.setItem('velvetZenith_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - replace with actual Firebase/auth service
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would do:
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      
      // For now, mock successful signup
      const userData: User = { email };
      setUser(userData);
      localStorage.setItem('velvetZenith_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('velvetZenith_user');
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

