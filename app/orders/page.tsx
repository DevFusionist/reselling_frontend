'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient, Order } from '@/lib/api';
import { FaBox, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaCreditCard } from 'react-icons/fa';
import Link from 'next/link';
import { useApiWithLoader } from '@/hooks/useApiWithLoader';
import { useLoading } from '@/contexts/LoadingContext';

const statusColors: Record<string, string> = {
  pending: 'text-yellow-500',
  processing: 'text-blue-500',
  shipped: 'text-purple-500',
  delivered: 'text-green-500',
  cancelled: 'text-highlight-wine',
  paid: 'text-green-600',
};

const statusIcons: Record<string, React.ElementType> = {
  pending: FaClock,
  processing: FaSpinner,
  shipped: FaBox,
  delivered: FaCheckCircle,
  cancelled: FaTimesCircle,
  paid: FaCreditCard,
};

export default function OrdersPage() {
  const { callWithLoader } = useApiWithLoader();
  const { isLoading } = useLoading();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) return;

      try {
        setError(null);
        const response = await callWithLoader(() => apiClient.getOrders({ page: 1, limit: 50 }));
        
        if (response.success && response.data) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.message || 'Failed to load orders');
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      }
    };

    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  if (authLoading || isLoading) {
    return null; // Global loader will handle this
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-base-navy pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.h1 
            className="font-headings text-5xl text-text-cream font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Orders
          </motion.h1>

          {error && (
            <div className="bg-highlight-wine/20 border border-highlight-wine text-highlight-wine px-4 py-3 rounded-soft-lg mb-6">
              {error}
            </div>
          )}

          {orders.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <FaBox className="mx-auto text-6xl text-text-lavender/50 mb-4" />
              <p className="font-body text-xl text-text-lavender mb-6">No orders yet</p>
              <Link 
                href="/shop" 
                className="inline-block px-6 py-3 bg-cta-copper text-text-cream rounded-soft-lg hover:bg-cta-copper/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {orders?.map((order) => {
              const StatusIcon = statusIcons[order.status.toLowerCase()] || FaClock;
              const statusColor = statusColors[order.status.toLowerCase()] || 'text-text-lavender';

              return (
                <motion.div
                  key={order.id}
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="font-headings text-2xl text-text-cream font-semibold mb-2">
                        Order #{order.id}
                      </h3>
                      <p className="font-body text-sm text-text-lavender">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Date not available'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <StatusIcon className={`${statusColor} text-xl`} />
                      <span className={`font-body font-semibold capitalize ${statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-divider-silver pt-4">
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {item.product?.image_url && (
                              <img
                                src={item.product.image_url}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded-md"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://placehold.co/64x64/28242D/F0EAD6?text=Item';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-body text-text-cream font-medium">
                                {item.product?.title || `Product #${item.product_id}`}
                              </p>
                              <p className="font-body text-sm text-text-lavender">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-body text-text-cream font-semibold">
                            ${(typeof (item as any).total_price === 'string' 
                              ? parseFloat((item as any).total_price) 
                              : (item.price || 0) * item.quantity
                            ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-divider-silver flex justify-between items-center">
                      <span className="font-body text-text-lavender">Total:</span>
                      <span className="font-headings text-2xl text-cta-copper font-semibold">
                        ${(typeof order.total_amount === 'string' 
                          ? parseFloat(order.total_amount) 
                          : order.total_amount
                        ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
  );
}

