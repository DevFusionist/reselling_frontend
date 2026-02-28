import apiClient from "@/lib/api/client";
import { PricingCalculation, MarginValidation, PricingItem } from "@/types";

export const pricingService = {
  async calculate(data: {
    sellerId: string;
    items: PricingItem[];
  }): Promise<PricingCalculation> {
    const response = await apiClient.post<PricingCalculation>("/pricing/calculate", data);
    return response.data;
  },

  async validateMargin(data: {
    productId: string;
    sellerPrice: number;
  }): Promise<MarginValidation> {
    const response = await apiClient.post<MarginValidation>("/pricing/validate-margin", data);
    return response.data;
  },

  async getProductPricing(productId: string): Promise<{ basePrice: number }> {
    const response = await apiClient.get<{ basePrice: number }>(`/pricing/product/${productId}`);
    return response.data;
  },
};

