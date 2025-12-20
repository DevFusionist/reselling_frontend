'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/cards/ProductCard';
import { apiClient, Product } from '@/lib/api';
import { useApiWithLoader } from '@/hooks/useApiWithLoader';
import { useLoading } from '@/contexts/LoadingContext';

export default function FeaturedCollection() {
  const { callWithLoader } = useApiWithLoader();
  const { isLoading } = useLoading();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await callWithLoader(() => apiClient.getProducts({ limit: 4, page: 1 }));
        if (response.success && response.data) {
          setProducts(response.data.products || []);
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  // Transform API product to ProductCard format
  const transformProduct = (product: Product) => ({
    id: product.id.toString(),
    name: product.title,
    price: product.base_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    imagePlaceholder: product.image_url || product.image_urls?.[0] || '/images/watch.png',
  });

  return (
    <section className="py-25 max-w-7xl mx-auto px-6">
      <h2 className="font-headings text-5xl text-center text-text-cream mb-20">Curated for Elegance</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="font-body text-text-lavender text-xl">Loading featured products...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <p className="font-body text-highlight-wine text-xl">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="font-body text-text-lavender text-xl">No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map(product => (
            <ProductCard key={product.id} product={transformProduct(product)}/>
          ))}
        </div>
      )}
    </section>
  );
}
