'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/cards/ProductCard';
import { apiClient, Product, ProductImage } from '@/lib/api';
import { useApiWithLoader } from '@/hooks/useApiWithLoader';
import { useLoading } from '@/contexts/LoadingContext';

interface ProductGridSectionProps {
  title: string;
  apiParams?: any;
  limit?: number;
}

export default function ProductGridSection({ title, apiParams = {}, limit = 4 }: ProductGridSectionProps) {
  const { callWithLoader } = useApiWithLoader();
  const { isLoading } = useLoading();
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await callWithLoader(() => 
          apiClient.getProducts({ ...apiParams, limit, page: 1 })
        );
        if (response.success && response.data) {
          setProducts(response.data.products || []);
          setImages(response.data.images || []);
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
      }
    };

    fetchProducts();
  }, [apiParams, limit]);

  const transformProduct = (product: Product) => {
    const productImages = images
      .filter((img) => img.product_id === product.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => img.image_url);

    const imageUrl =
      productImages[0] ||
      product.image_url ||
      product.image_urls?.[0] ||
      'https://placehold.co/400x400/28242D/F0EAD6?text=Product';

    const price = typeof product.base_price === 'string' 
      ? parseFloat(product.base_price) 
      : product.base_price;

    return {
      id: product.id.toString(),
      name: product.title,
      price: price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      imagePlaceholder: imageUrl,
      slug: product.id.toString(),
    };
  };

  if (error && !isLoading) {
    return null; // Fail silently for homepage sections
  }

  return (
    <section className="py-12 bg-base-navy">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-headings text-4xl text-text-cream mb-8">{title}</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <p className="font-body text-text-lavender text-xl">Loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="font-body text-text-lavender text-xl">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={transformProduct(product)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

