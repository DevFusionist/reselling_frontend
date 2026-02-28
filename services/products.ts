import apiClient from "@/lib/api/client";
import { Product, ProductsResponse, Category } from "@/types";

export const productService = {
  async getProducts(params?: {
    skip?: number;
    take?: number;
    categoryId?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>("/products", { params });
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },

  async createProduct(data: any): Promise<Product> {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};

