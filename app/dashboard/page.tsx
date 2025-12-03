'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiClient, Product, Order } from '@/lib/api';
import { FaBox, FaShoppingCart, FaUsers, FaChartLine, FaCog, FaPlus } from 'react-icons/fa';
import ProductManagementForm from '@/components/formComponents/ProductManagementForm';

export default function DashboardPage() {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    totalRevenue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push('/login');
      } else if (user && user.role !== 'admin' && user.role !== 'reseller') {
        // Redirect customers away from dashboard
        router.push('/shop');
      }
    }
  }, [isLoggedIn, loading, router, user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isLoggedIn) return;

      try {
        setLoadingStats(true);
        
        // Fetch products
        const productsResponse = await apiClient.getProducts({ limit: 10, page: 1 });
        if (productsResponse.success && productsResponse.data) {
          setRecentProducts(productsResponse.data.products || []);
          setStats(prev => ({ ...prev, products: productsResponse.data.total || 0 }));
        }

        // Fetch orders (if admin)
        if (user?.role === 'admin') {
          const ordersResponse = await apiClient.getOrders({ page: 1, limit: 10 });
          if (ordersResponse.success && ordersResponse.data) {
            const orders = ordersResponse.data.orders || [];
            setRecentOrders(orders.slice(0, 5));
            setStats(prev => ({ 
              ...prev, 
              orders: ordersResponse.data.total || 0,
              totalRevenue: orders.reduce((sum: number, order: Order) => sum + order.total_amount, 0)
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn, user]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base-navy pt-20 pb-20 flex items-center justify-center">
          <p className="font-body text-xl text-text-lavender">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  // Only admin and reseller can access dashboard
  if (user?.role !== 'admin' && user?.role !== 'reseller') {
    return null; // Will redirect
  }

  const isAdmin = user?.role === 'admin';
  const isReseller = user?.role === 'reseller';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-navy pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-headings text-5xl text-text-cream font-semibold mb-2">
                  Dashboard
                </h1>
                <p className="font-body text-xl text-text-lavender">
                  Welcome back, {user?.email} ({user?.role})
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowProductForm(!showProductForm)}
                  className="px-6 py-3 bg-cta-copper text-text-cream rounded-soft-lg hover:bg-cta-copper/90 transition-colors flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>{showProductForm ? 'Hide' : 'Add'} Product</span>
                </button>
              )}
            </div>

            {/* Product Form Toggle */}
            {showProductForm && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <ProductManagementForm isNewProduct={true} />
              </motion.div>
            )}

            {/* Stats Cards */}
            {isAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-text-lavender text-sm mb-1">Total Products</p>
                      <p className="font-headings text-3xl text-text-cream font-semibold">
                        {loadingStats ? '...' : stats.products}
                      </p>
                    </div>
                    <FaBox className="text-4xl text-cta-copper" />
                  </div>
                </motion.div>

                <motion.div
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-text-lavender text-sm mb-1">Total Orders</p>
                      <p className="font-headings text-3xl text-text-cream font-semibold">
                        {loadingStats ? '...' : stats.orders}
                      </p>
                    </div>
                    <FaShoppingCart className="text-4xl text-cta-copper" />
                  </div>
                </motion.div>

                <motion.div
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-text-lavender text-sm mb-1">Total Revenue</p>
                      <p className="font-headings text-3xl text-cta-copper font-semibold">
                        ${loadingStats ? '...' : stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <FaChartLine className="text-4xl text-cta-copper" />
                  </div>
                </motion.div>
              </div>
            )}

            {/* Quick Actions - Admin Only */}
            {isAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <motion.div
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="font-headings text-2xl text-text-cream font-semibold mb-4 flex items-center">
                    <FaBox className="mr-3 text-cta-copper" />
                    Recent Products
                  </h2>
                  {loadingStats ? (
                    <p className="font-body text-text-lavender">Loading...</p>
                  ) : recentProducts.length === 0 ? (
                    <p className="font-body text-text-lavender">No products yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentProducts.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.id}`}
                          className="block p-3 bg-base-navy rounded-md hover:bg-base-navy/80 transition-colors"
                        >
                          <p className="font-body text-text-cream font-medium">{product.title}</p>
                          <p className="font-body text-sm text-text-lavender">
                            ${product.base_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/shop"
                    className="mt-4 inline-block text-cta-copper hover:underline font-body"
                  >
                    View All Products →
                  </Link>
                </motion.div>

                <motion.div
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="font-headings text-2xl text-text-cream font-semibold mb-4 flex items-center">
                    <FaShoppingCart className="mr-3 text-cta-copper" />
                    Recent Orders
                  </h2>
                  {loadingStats ? (
                    <p className="font-body text-text-lavender">Loading...</p>
                  ) : recentOrders.length === 0 ? (
                    <p className="font-body text-text-lavender">No orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-3 bg-base-navy rounded-md"
                        >
                          <p className="font-body text-text-cream font-medium">
                            Order #{order.id}
                          </p>
                          <p className="font-body text-sm text-text-lavender">
                            ${order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • {order.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/orders"
                    className="mt-4 inline-block text-cta-copper hover:underline font-body"
                  >
                    View All Orders →
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Reseller Specific Modules */}
            {isReseller && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <motion.div
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="font-headings text-2xl text-text-cream font-semibold mb-4">
                    My Share Links
                  </h2>
                  <p className="font-body text-text-lavender mb-4">
                    View and manage your shareable product links to track commissions.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-3 bg-cta-copper text-text-cream rounded-soft-lg hover:bg-cta-copper/90 transition-colors"
                  >
                    Manage Links
                  </Link>
                </motion.div>

                <motion.div
                  className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="font-headings text-2xl text-text-cream font-semibold mb-4">
                    Markup Settings
                  </h2>
                  <p className="font-body text-text-lavender mb-4">
                    Set custom markup percentages for products to maximize your earnings.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-3 bg-cta-copper text-text-cream rounded-soft-lg hover:bg-cta-copper/90 transition-colors"
                  >
                    Configure Markups
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Reseller Browse Products Section */}
            {isReseller && (
              <motion.div
                className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="font-headings text-2xl text-text-cream font-semibold mb-4">
                  Browse Products
                </h2>
                <p className="font-body text-text-lavender mb-4">
                  Explore products and create share links to start earning commissions.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-cta-copper text-text-cream rounded-soft-lg hover:bg-cta-copper/90 transition-colors"
                >
                  View All Products
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

