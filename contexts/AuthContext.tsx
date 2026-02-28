"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, AuthResponse } from "@/types";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: "ADMIN" | "CUSTOMER" | "RESELLER";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          await refreshUser();
        } else {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.login({ email, password });
      setUser(response.user);
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response: AuthResponse = await authService.register(data);
      setUser(response.user);
      toast.success("Registration successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

