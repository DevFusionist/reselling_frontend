import apiClient from "@/lib/api/client";
import { Order, CreateOrderRequest } from "@/types";

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>("/orders", data);
    return response.data;
  },

  async getOrders(params?: {
    userId?: string;
    sellerId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }): Promise<{ data: Order[]; total: number }> {
    const response = await apiClient.get<{ data: Order[]; total: number }>("/orders", { params });
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: string, notes?: string): Promise<Order> {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status, notes });
    return response.data;
  },
};

