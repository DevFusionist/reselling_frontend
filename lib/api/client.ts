import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (typeof window !== "undefined") {
            const refreshToken = localStorage.getItem("refreshToken");
            
            if (refreshToken) {
              try {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                  refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Retry original request
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return this.client(originalRequest);
              } catch (refreshError) {
                // Refresh failed - logout user
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                if (window.location.pathname !== "/login") {
                  window.location.href = "/login";
                }
                return Promise.reject(refreshError);
              }
            } else {
              // No refresh token - redirect to login
              localStorage.removeItem("accessToken");
              if (window.location.pathname !== "/login") {
                window.location.href = "/login";
              }
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.client;
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
export default apiClient.instance;

