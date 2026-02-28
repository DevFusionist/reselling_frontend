import apiClient from "@/lib/api/client";
import { User, AuthResponse } from "@/types";

export const authService = {
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: "ADMIN" | "CUSTOMER" | "RESELLER";
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
};

