import apiClient from "@/lib/api/client";
import { ShareLink, ShareLinkStats } from "@/types";

export const shareLinkService = {
  async createShareLink(data: {
    sellerId: string;
    productId?: string;
    sellerPrice?: number;
    expiresAt?: string;
  }): Promise<ShareLink> {
    const response = await apiClient.post<ShareLink>("/share-links", data);
    return response.data;
  },

  async getShareLink(code: string): Promise<ShareLink> {
    const response = await apiClient.get<ShareLink>(`/share-links/${code}`);
    return response.data;
  },

  async getShareLinks(sellerId: string): Promise<ShareLink[]> {
    const response = await apiClient.get<ShareLink[]>("/share-links", {
      params: { sellerId },
    });
    return response.data;
  },

  async getStats(code: string): Promise<ShareLinkStats> {
    const response = await apiClient.get<ShareLinkStats>(`/share-links/${code}/stats`);
    return response.data;
  },
};

