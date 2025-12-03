// API Client for Reseller Backend
// Optimized with caching, error handling, and token management

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface Product {
  id: number;
  sku?: string;
  title: string;
  description?: string;
  base_price: number | string; // API may return as string
  reseller_price?: number | string; // API may return as string
  retail_price?: number | string; // API may return as string
  stock: number;
  image_url?: string;
  image_urls?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
  created_at?: string;
}

export interface ProductListResponse {
  products: Product[];
  images?: ProductImage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductDetailResponse extends Product {
  images?: ProductImage[];
}

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'customer' | 'reseller';
  profile_picture_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  items: OrderItem[];
  created_at?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Token management
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'velvetZenith_accessToken';
  private static REFRESH_TOKEN_KEY = 'velvetZenith_refreshToken';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token refresh on 401
      if (response.status === 401 && token) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          const newToken = TokenManager.getAccessToken();
          if (newToken) {
            const retryHeaders: Record<string, string> = {
              ...headers,
              'Authorization': `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(url, {
              ...options,
              headers: retryHeaders,
            });
            return await retryResponse.json();
          }
        }
        // If refresh failed, clear tokens and throw error
        TokenManager.clearTokens();
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, role?: 'admin' | 'customer' | 'reseller'): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role: role || 'customer' }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data) {
      TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  }

  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    const response = await this.request<null>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    TokenManager.clearTokens();
    return response;
  }

  // Product endpoints
  async getProducts(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<ProductListResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return this.request<ProductListResponse>(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: number): Promise<ApiResponse<ProductDetailResponse>> {
    return this.request<ProductDetailResponse>(`/products/${id}`);
  }

  async createProduct(productData: {
    title: string;
    description?: string;
    base_price: number;
    stock: number;
    image_url?: string;
  }, images?: File[]): Promise<ApiResponse<Product>> {
    if (images && images.length > 0) {
      // Use FormData for multipart upload
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      images.forEach((image) => {
        formData.append('images', image);
      });

      return this.request<Product>('/products', {
        method: 'POST',
        body: formData,
      });
    }

    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(
    id: number,
    productData: Partial<{
      title: string;
      description?: string;
      base_price: number;
      stock: number;
      image_url?: string;
    }>,
    images?: File[]
  ): Promise<ApiResponse<Product>> {
    if (images && images.length > 0) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      images.forEach((image) => {
        formData.append('images', image);
      });

      return this.request<Product>(`/products/${id}`, {
        method: 'PUT',
        body: formData,
      });
    }

    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteProductImage(imageId: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/products/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async getOrders(params?: { page?: number; limit?: number }): Promise<ApiResponse<OrderListResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request<OrderListResponse>(`/orders${query ? `?${query}` : ''}`);
  }

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    items: Array<{ product_id: number; quantity: number }>;
  }): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Share link endpoints
  async createShareLink(data: { 
    product_id: number; 
    margin_amount: number; 
    expires_in_days?: number 
  }): Promise<ApiResponse<{ code: string; url: string }>> {
    return this.request<{ code: string; url: string }>('/share', {
      method: 'POST',
      body: JSON.stringify({
        product_id: data.product_id,
        margin_amount: data.margin_amount,
        ...(data.expires_in_days && { expires_in_days: data.expires_in_days }),
      }),
    });
  }

  async getShareLink(code: string): Promise<ApiResponse<{ product: Product; markup: number }>> {
    return this.request<{ product: Product; markup: number }>(`/share/${code}`);
  }

  async getShareLinks(): Promise<ApiResponse<Array<{ code: string; url: string; product_id: number }>>> {
    return this.request<Array<{ code: string; url: string; product_id: number }>>('/share');
  }

  async deleteShareLink(code: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/share/${code}`, {
      method: 'DELETE',
    });
  }

  // Markup endpoints (for resellers)
  async setMarkup(productId: number, markup: number): Promise<ApiResponse<any>> {
    return this.request<any>('/markups', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, markup }),
    });
  }

  async getMarkups(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/markups');
  }

  async getMarkup(productId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/markups/${productId}`);
  }

  async fetchProductDataByShareLinkCode(code: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/share/${code}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export token manager for direct access if needed
export { TokenManager };

