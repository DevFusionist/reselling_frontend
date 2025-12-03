'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/cards/ProductCard';
import { apiClient, Product } from '@/lib/api';

export default function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getProducts({ limit: 4, page: 1 });
        if (response.success && response.data) {
          setProducts(response.data.products || []);
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
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

      {loading ? (
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
