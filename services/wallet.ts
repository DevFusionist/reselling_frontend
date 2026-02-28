import apiClient from "@/lib/api/client";
import { Wallet, WalletTransaction, PayoutRequest } from "@/types";

export const walletService = {
  async getWallet(sellerId: string): Promise<Wallet> {
    const response = await apiClient.get<Wallet>(`/wallets/${sellerId}`);
    return response.data;
  },

  async getTransactions(
    sellerId: string,
    params?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ data: WalletTransaction[]; total: number }> {
    const response = await apiClient.get<{ data: WalletTransaction[]; total: number }>(
      `/wallets/${sellerId}/transactions`,
      { params }
    );
    return response.data;
  },

  async createPayoutRequest(
    sellerId: string,
    data: {
      amount: number;
      bankAccount?: string;
      notes?: string;
    }
  ): Promise<PayoutRequest> {
    const response = await apiClient.post<PayoutRequest>(`/wallets/${sellerId}/payouts`, data);
    return response.data;
  },

  async getPayoutRequests(params?: {
    sellerId?: string;
    status?: string;
  }): Promise<{ data: PayoutRequest[] }> {
    const response = await apiClient.get<{ data: PayoutRequest[] }>("/wallets/payouts", { params });
    return response.data;
  },

  async updatePayoutStatus(
    payoutId: string,
    data: {
      status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";
      notes?: string;
    }
  ): Promise<PayoutRequest> {
    const response = await apiClient.patch<PayoutRequest>(`/wallets/payouts/${payoutId}`, data);
    return response.data;
  },
};

