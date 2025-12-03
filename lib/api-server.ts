// Server-side API utility for fetching data without client-side dependencies
// Used for SEO, metadata generation, etc.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ServerApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface ServerProduct {
  id: number;
  sku?: string;
  title: string;
  description?: string;
  base_price: number | string;
  reseller_price?: number | string;
  retail_price?: number | string;
  stock: number;
  image_url?: string;
  image_urls?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ServerProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
  created_at?: string;
}

export interface ServerProductDetailResponse extends ServerProduct {
  images?: ServerProductImage[];
}

/**
 * Fetch product data server-side (for SEO, metadata, etc.)
 * This function doesn't require authentication tokens
 */
export async function fetchProductServerSide(
  productId: number
): Promise<ServerApiResponse<ServerProductDetailResponse>> {
  try {
    const url = `${API_BASE_URL}/products/${productId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache revalidation for better performance
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch product: ${response.statusText}`,
      };
    }

    const data = await response.json();
    
    // Log for debugging - remove in production
    console.log('Server-side product fetch response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error: any) {
    console.error('Server-side product fetch error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch product',
    };
  }
}

