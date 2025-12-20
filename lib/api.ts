// API Client for Reseller Backend
// Optimized with caching, error handling, and token management

import { LoaderManager } from './loader-manager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// --- Interface Definitions ---

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
  status?: string; // Product status (active, inactive, archived, etc.)
  image_url?: string;
  image_urls?: string[];
  created_at?: string;
  updated_at?: string;
  model?: string;
  isFeatured?: boolean;
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  styles?: string[];
  fits?: string[];
  patterns?: string[];
  category?: string;
  sub_category?: string;
}

export interface ProductImage {
  id: number;
  product_id?: number;
  image_url?: string;
  url?: string; // API may return as 'url' instead of 'image_url'
  display_order: number;
  created_at?: string;
  attributes?: {
    image_id?: number;
    color?: string;
    size?: string;
    material?: string;
    style?: string;
    fit?: string;
    pattern?: string;
  };
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

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_id?: number | null;
  rating: number;
  title?: string | null;
  comment?: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

export interface ReviewRatingStats {
  average_rating: number;
  total_reviews: number;
  rating_1: number;
  rating_2: number;
  rating_3: number;
  rating_4: number;
  rating_5: number;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Token Management Class ---
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

// --- API Client Class ---
class ApiClient {
  private baseURL: string;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Private method to handle all API requests, including authorization and refresh logic.
   * @param endpoint The API endpoint path.
   * @param options Fetch options (method, body, headers).
   * @param isRetry Flag to prevent infinite retry loops on token failure.
   * @param showLoader Flag to control whether to show the global loader (default: true, false for refresh/retry).
   * @returns A promise that resolves to ApiResponse<T>.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false,
    showLoader: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getAccessToken();

    // Show loader for initial requests (not retries or refresh endpoints)
    const shouldShowLoader = showLoader && !isRetry && !endpoint.includes('/auth/refresh');
    if (shouldShowLoader) {
      LoaderManager.show();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Remove Content-Type for FormData requests (browser handles setting boundary)
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      const isUnauthorizedStatus = response.status === 401;

      let data: ApiResponse<T>;
      
      // Safely attempt to parse the body as JSON
      try {
          if (response.headers.get('content-type')?.includes('application/json') && response.status !== 204) {
              data = await response.json();
          } else {
             // Handle non-JSON response types gracefully
             if (!response.ok) {
                data = { 
                    success: false, 
                    message: response.statusText || 'Unknown Error', 
                    code: isUnauthorizedStatus ? 'UNAUTHORIZED' : 'API_ERROR' 
                } as ApiResponse<T>;
             } else {
                 // For 2xx responses with no JSON (e.g., 204 No Content), assume success
                 data = { success: true, message: 'Success (No content)' } as ApiResponse<T>; 
             }
          }
      } catch (e) {
          // If JSON parsing fails (e.g., empty body or malformed JSON)
          console.error(`Error parsing response body for ${endpoint}:`, e);
          if (isUnauthorizedStatus) {
              // If it's a 401 status, manually set the UNAUTHORIZED code
              data = { success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' } as ApiResponse<T>;
          } else {
             data = { success: false, message: response.statusText || 'Invalid response format' } as ApiResponse<T>;
          }
      }
      
      // Final evaluation of the unauthorized condition (based on status or parsed code)
      const isUnauthorized = isUnauthorizedStatus ||
                            (data.code === 'UNAUTHORIZED') ||
                            (data.success === false && data.message?.toLowerCase().includes('unauthorized'));

      console.log("isUnauthorized", isUnauthorized);
      console.log("Token present for retry:", !!token, "Is Retry:", isRetry); // DEBUG LOG

      // --- Token Refresh Logic ---
      if (isUnauthorized && token && !isRetry) {
        console.warn('Unauthorized request. Attempting token refresh...');
        
        // If already refreshing, wait for that to complete
        if (this.isRefreshing && this.refreshPromise) {
          await this.refreshPromise;
        } else {
          // Start refresh process
          this.isRefreshing = true;
          this.refreshPromise = this.refreshToken();
          const refreshed = await this.refreshPromise;
          this.isRefreshing = false;
          this.refreshPromise = null;

          if (!refreshed) {
            console.error('Token refresh failed. Clearing tokens.');
            TokenManager.clearTokens();
            // Critical error: cannot refresh, forcing logout/relogin
            throw new Error('Authentication failed - unable to refresh token. Please log in again.');
          }
        }

        // Retry the original request with the new token (don't show loader again)
        console.log('Token refresh successful. Retrying original request...');
        return this.request<T>(endpoint, options, true, false); 
      }
      // --- End Token Refresh Logic ---

      // Hide loader on success
      if (shouldShowLoader) {
        LoaderManager.hide();
      }

      return data;

    } catch (error: any) {
      // Hide loader on error
      if (shouldShowLoader) {
        LoaderManager.hide();
      }
      console.error(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Handles the token refresh API call and updates the stored tokens.
   * @returns A promise that resolves to true if refresh was successful, false otherwise.
   */
  private async refreshToken(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token available. Cannot refresh.');
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.error('Token refresh API failed with status:', response.status);
        return false;
      }

      const data: ApiResponse<AuthResponse> = await response.json();

      if (data.success && data.data) {
        // Successfully got new tokens
        TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }
      
      console.error('Token refresh response missing required data or failed:', data.message);
      return false;
    } catch (error) {
      console.error('Token refresh request failed:', error);
      return false;
    }
  }

  // --- Public API Methods ---

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
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sub_category?: string;
    brand?: string;
    color?: string;
    size?: string;
    material?: string;
    style?: string;
    is_featured?: boolean;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort_by?: 'base_price' | 'title' | 'stock' | 'created_at';
    sort_order?: 'asc' | 'desc';
  }): Promise<ApiResponse<ProductListResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sub_category) queryParams.append('sub_category', params.sub_category);
    if (params?.brand) queryParams.append('brand', params.brand);
    if (params?.color) queryParams.append('color', params.color);
    if (params?.size) queryParams.append('size', params.size);
    if (params?.material) queryParams.append('material', params.material);
    if (params?.style) queryParams.append('style', params.style);
    if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
    if (params?.min_price !== undefined) queryParams.append('min_price', params.min_price.toString());
    if (params?.max_price !== undefined) queryParams.append('max_price', params.max_price.toString());
    if (params?.in_stock !== undefined) queryParams.append('in_stock', params.in_stock.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

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
    reseller_price?: number;
    retail_price?: number;
    stock: number;
    image_url?: string;
    // Product attributes - support arrays for multi-value attributes
    category?: string;
    sub_category?: string;
    brand?: string | string[];
    model?: string;
    colors?: string[];
    sizes?: string[];
    materials?: string[];
    styles?: string[];
    fits?: string[];
    patterns?: string[];
    // Backward compatibility - single values
    color?: string;
    size?: string;
    material?: string;
    style?: string;
    fit?: string;
    pattern?: string;
    // Images with attributes
    images?: Array<{ url?: string; attributes?: { color?: string; size?: string; material?: string; style?: string; fit?: string; pattern?: string } }>;
    image_urls?: string[];
    // File attributes metadata for matching uploaded files with attributes
    fileAttributes?: Array<{ index: number; attributes?: { color?: string; size?: string; material?: string; style?: string; fit?: string; pattern?: string } | null }>;
  }, images?: File[]): Promise<ApiResponse<Product>> {
    if (images && images.length > 0) {
      // Use FormData for multipart upload
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      images.forEach((image, index) => {
        formData.append('images', image);
        // Include attributes metadata for each file if available
        if (productData.fileAttributes) {
          const fileAttr = productData.fileAttributes.find(attr => attr.index === index);
          if (fileAttr && fileAttr.attributes) {
            formData.append(`image_attributes_${index}`, JSON.stringify(fileAttr.attributes));
          }
        }
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
      reseller_price?: number;
      retail_price?: number;
      stock: number;
      image_url?: string;
      // Product attributes - support arrays for multi-value attributes
      category?: string;
      sub_category?: string;
      brand?: string | string[];
      model?: string;
      colors?: string[];
      sizes?: string[];
      materials?: string[];
      styles?: string[];
      fits?: string[];
      patterns?: string[];
      // Backward compatibility - single values
      color?: string;
      size?: string;
      material?: string;
      style?: string;
      fit?: string;
      pattern?: string;
      // Images with attributes
      images?: Array<{ url?: string; attributes?: { color?: string; size?: string; material?: string; style?: string; fit?: string; pattern?: string } }>;
      image_urls?: string[];
      // File attributes metadata for matching uploaded files with attributes
      fileAttributes?: Array<{ index: number; attributes?: { color?: string; size?: string; material?: string; style?: string; fit?: string; pattern?: string } | null }>;
    }>,
    images?: File[]
  ): Promise<ApiResponse<Product>> {
    if (images && images.length > 0) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      images.forEach((image, index) => {
        formData.append('images', image);
        // Include attributes metadata for each file if available
        if (productData.fileAttributes) {
          const fileAttr = productData.fileAttributes.find(attr => attr.index === index);
          if (fileAttr && fileAttr.attributes) {
            formData.append(`image_attributes_${index}`, JSON.stringify(fileAttr.attributes));
          }
        }
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

  async bulkDeleteProducts(productIds: number[]): Promise<ApiResponse<{ deleted: number; failed: number }>> {
    return this.request<{ deleted: number; failed: number }>('/products/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ product_ids: productIds }),
    });
  }

  async updateProductStatus(id: number, status: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateProductStock(id: number, stock: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  }

  async bulkUpdateProductStock(updates: Array<{ id: number; stock: number }>): Promise<ApiResponse<{ updated: number; failed: number }>> {
    return this.request<{ updated: number; failed: number }>('/products/bulk-stock', {
      method: 'POST',
      body: JSON.stringify({ updates }),
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

  async updateOrderStatus(id: number, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getPayouts(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<{
    payouts: Array<{
      id: number;
      reseller_id: number;
      order_id: number;
      amount: number;
      status: string;
      created_at: string;
      updated_at: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request<{
      payouts: Array<{
        id: number;
        reseller_id: number;
        order_id: number;
        amount: number;
        status: string;
        created_at: string;
        updated_at: string;
      }>;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/admin/payouts${query ? `?${query}` : ''}`);
  }

  async updatePayoutStatus(id: number, status: string): Promise<ApiResponse<{
    id: number;
    reseller_id: number;
    order_id: number;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
  }>> {
    return this.request<{
      id: number;
      reseller_id: number;
      order_id: number;
      amount: number;
      status: string;
      created_at: string;
      updated_at: string;
    }>(`/admin/payouts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async createOrder(orderData: {
    items: Array<{ product_id: number; quantity: number; reseller_id?: number; share_link_code?: string }>;
    shipping_address: {
      name: string;
      phone: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    billing_address?: {
      name: string;
      phone: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }): Promise<ApiResponse<{
    order: {
      id: number;
      customer_id: number;
      reseller_id: number | null;
      product_id: number | null;
      share_link_id: number | null;
      final_price: string | null;
      quantity: number;
      total_amount: string;
      status: string;
      created_at: string;
      product: Product | null;
      customer: User | null;
      reseller: User | null;
      shareLink: any | null;
      items: Array<{
        id: number;
        order_id: number;
        product_id: number;
        quantity: number;
        unit_price: string;
        total_price: string;
        share_link_id: number | null;
        created_at: string;
        product: Product | null;
        shareLink: any | null;
      }>;
    };
    total_amount: number;
    items_count: number;
    failed: number;
  }>> {
    return this.request<{
      order: {
        id: number;
        customer_id: number;
        reseller_id: number | null;
        product_id: number | null;
        share_link_id: number | null;
        final_price: string | null;
        quantity: number;
        total_amount: string;
        status: string;
        created_at: string;
        product: Product | null;
        customer: User | null;
        reseller: User | null;
        shareLink: any | null;
        items: Array<{
          id: number;
          order_id: number;
          product_id: number;
          quantity: number;
          unit_price: string;
          total_price: string;
          share_link_id: number | null;
          created_at: string;
          product: Product | null;
          shareLink: any | null;
        }>;
      };
      total_amount: number;
      items_count: number;
      failed: number;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Payment endpoints
  async createPaymentOrder(orderId: number, metadata?: any): Promise<ApiResponse<{
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, any>;
    created_at: number;
    internal_receipt_id: string;
    payment_id: number;
    order_id: number;
  }>> {
    const body: { order_id: number; metadata?: any } = { order_id: orderId };
    if (metadata !== undefined) {
      body.metadata = metadata;
    }
    return this.request<{
      id: string;
      entity: string;
      amount: number;
      amount_paid: number;
      amount_due: number;
      currency: string;
      receipt: string;
      status: string;
      attempts: number;
      notes: Record<string, any>;
      created_at: number;
      internal_receipt_id: string;
      payment_id: number;
      order_id: number;
    }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<ApiResponse<{ order: Order; verified: boolean }>> {
    return this.request<{ order: Order; verified: boolean }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
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

  // Attribute endpoints
  async getCategories(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/categories');
  }

  async getSubCategories(categoryId?: number): Promise<ApiResponse<Array<{ id: number; name: string; category_id?: number; category_name?: string }>>> {
    const query = categoryId ? `?category_id=${categoryId}` : '';
    return this.request<Array<{ id: number; name: string; category_id?: number; category_name?: string }>>(`/attributes/sub-categories${query}`);
  }

  async getBrands(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/brands');
  }

  async getColors(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/colors');
  }

  async getSizes(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/sizes');
  }

  async getMaterials(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/materials');
  }

  async getStyles(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/styles');
  }

  async getFits(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/fits');
  }

  async getPatterns(): Promise<ApiResponse<Array<{ id: number; name: string }>>> {
    return this.request<Array<{ id: number; name: string }>>('/attributes/patterns');
  }

  async getAllAttributes(): Promise<ApiResponse<{
    categories: Array<{ id: number; name: string }>;
    sub_categories: Array<{ id: number; name: string; category_id: number; category_name: string }>;
    brands: Array<{ id: number; name: string }>;
    colors: Array<{ id: number; name: string }>;
    sizes: Array<{ id: number; name: string }>;
    materials: Array<{ id: number; name: string }>;
    styles: Array<{ id: number; name: string }>;
    fits: Array<{ id: number; name: string }>;
    patterns: Array<{ id: number; name: string }>;
  }>> {
    return this.request<{
      categories: Array<{ id: number; name: string }>;
      sub_categories: Array<{ id: number; name: string; category_id: number; category_name: string }>;
      brands: Array<{ id: number; name: string }>;
      colors: Array<{ id: number; name: string }>;
      sizes: Array<{ id: number; name: string }>;
      materials: Array<{ id: number; name: string }>;
      styles: Array<{ id: number; name: string }>;
      fits: Array<{ id: number; name: string }>;
      patterns: Array<{ id: number; name: string }>;
    }>('/attributes/all');
  }

  // Review endpoints
  async getProductReviews(productId: number): Promise<ApiResponse<Review[]>> {
    return this.request<Review[]>(`/reviews/product/${productId}`);
  }

  async getProductRatingStats(productId: number): Promise<ApiResponse<ReviewRatingStats>> {
    return this.request<ReviewRatingStats>(`/reviews/product/${productId}/stats`);
  }

  async getReview(id: number): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${id}`);
  }

  async listReviews(params?: {
    page?: number;
    limit?: number;
    product_id?: number;
    user_id?: number;
    rating?: number;
    is_approved?: boolean;
    is_verified_purchase?: boolean;
    sort_by?: 'rating' | 'helpful_count' | 'created_at';
    sort_order?: 'asc' | 'desc';
  }): Promise<ApiResponse<ReviewListResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.product_id) queryParams.append('product_id', params.product_id.toString());
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.is_approved !== undefined) queryParams.append('is_approved', params.is_approved.toString());
    if (params?.is_verified_purchase !== undefined) queryParams.append('is_verified_purchase', params.is_verified_purchase.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const query = queryParams.toString();
    return this.request<ReviewListResponse>(`/reviews${query ? `?${query}` : ''}`);
  }

  async createReview(reviewData: {
    product_id: number;
    rating: number;
    title?: string;
    comment?: string;
    order_id?: number;
  }): Promise<ApiResponse<Review>> {
    return this.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(id: number, reviewData: {
    rating?: number;
    title?: string;
    comment?: string;
  }): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async markReviewHelpful(id: number): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${id}/helpful`, {
      method: 'POST',
    });
  }

  async approveReview(id: number): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${id}/approve`, {
      method: 'POST',
    });
  }
}

// --- Export Singleton Instance and Classes ---

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export token manager for direct access if needed
export { TokenManager };