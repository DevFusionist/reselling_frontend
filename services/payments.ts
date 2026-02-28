import apiClient from "@/lib/api/client";
import { Payment, RazorpayOrderResponse } from "@/types";

export const paymentService = {
  async createRazorpayOrder(data: {
    orderId: string;
    userId: string;
    amount: number;
    currency?: string;
    method?: string;
  }): Promise<RazorpayOrderResponse> {
    const response = await apiClient.post<RazorpayOrderResponse>(
      "/payments/razorpay/create-order",
      data
    );
    return response.data;
  },

  async getPayment(id: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  async getPaymentByOrderId(orderId: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/payments/order/${orderId}`);
    return response.data;
  },

  async getPayments(params?: {
    userId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }): Promise<{ data: Payment[]; total: number }> {
    const response = await apiClient.get<{ data: Payment[]; total: number }>("/payments", {
      params,
    });
    return response.data;
  },
};

