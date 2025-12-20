'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiClient, Product, Order } from '@/lib/api';
import { FaBox, FaShoppingCart, FaChartLine, FaPlus, FaEdit, FaTrash, FaCheckSquare, FaSquare, FaWarehouse, FaDollarSign } from 'react-icons/fa';
import ProductManagementForm from '@/components/formComponents/ProductManagementForm';
import { useApiWithLoader } from '@/hooks/useApiWithLoader';
import { useLoading } from '@/contexts/LoadingContext';

type TabType = 'overview' | 'products' | 'orders' | 'payouts';

export default function DashboardPage() {
  const { callWithLoader } = useApiWithLoader();
  const { isLoading } = useLoading();
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Stats
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    totalRevenue: 0,
  });
  
  // Product Management
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [bulkStockValue, setBulkStockValue] = useState<number>(0);
  const [bulkStatusValue, setBulkStatusValue] = useState<string>('active');
  
  // Order Management
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  
  // Payout Management
  const [payouts, setPayouts] = useState<any[]>([]);
  const [payoutPage, setPayoutPage] = useState(1);
  const [payoutTotalPages, setPayoutTotalPages] = useState(1);
  const [updatingPayoutId, setUpdatingPayoutId] = useState<number | null>(null);

  const productStatuses = ['active', 'inactive', 'archived', 'out_of_stock'];
  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'paid'];

  const fetchProducts = async (page: number = 1, search: string = '') => {
    try {
      const response = await callWithLoader(() => 
        apiClient.getProducts({ 
          page, 
          limit: 20, 
          search: search || undefined 
        })
      );
      if (response.success && response.data) {
        setAllProducts(response.data.products || []);
        setProductTotalPages(response.data.totalPages || 1);
        setStats(prev => ({ ...prev, products: response.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async (page: number = 1) => {
    try {
      const response = await callWithLoader(() => 
        apiClient.getOrders({ page, limit: 20 })
      );
      if (response.success && response.data) {
        setAllOrders(response.data.orders || []);
        setOrderTotalPages(response.data.totalPages || 1);
        setStats(prev => ({ 
          ...prev, 
          orders: response.data?.total || 0,
          totalRevenue: response.data.orders?.reduce(
            (sum: number, order: Order) => sum + Number(order.total_amount),
            0
          ) || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchPayouts = async (page: number = 1) => {
    try {
      const response = await callWithLoader(() => 
        apiClient.getPayouts({ page, limit: 20 })
      );
      if (response.success && response.data) {
        setPayouts(response.data.payouts || []);
        setPayoutTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingProductId(productId);
      const response = await callWithLoader(() => apiClient.deleteProduct(productId));
      
      if (response.success) {
        await fetchProducts(productPage, productSearch);
        setSelectedProducts(new Set());
      } else {
        alert(response.message || 'Failed to delete product');
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert(error.message || 'Failed to delete product');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} product(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await callWithLoader(() => 
        apiClient.bulkDeleteProducts(Array.from(selectedProducts))
      );
      
      if (response.success) {
        await fetchProducts(productPage, productSearch);
        setSelectedProducts(new Set());
        alert(`Successfully deleted ${response.data?.deleted || 0} product(s)`);
      } else {
        alert(response.message || 'Failed to delete products');
      }
    } catch (error: any) {
      console.error('Error bulk deleting products:', error);
      alert(error.message || 'Failed to delete products');
    }
  };

  const handleUpdateProductStatus = async (productId: number, status: string) => {
    try {
      const response = await callWithLoader(() => 
        apiClient.updateProductStatus(productId, status)
      );
      
      if (response.success) {
        await fetchProducts(productPage, productSearch);
      } else {
        alert(response.message || 'Failed to update product status');
      }
    } catch (error: any) {
      console.error('Error updating product status:', error);
      alert(error.message || 'Failed to update product status');
    }
  };

  const handleUpdateProductStock = async (productId: number, stock: number) => {
    try {
      const response = await callWithLoader(() => 
        apiClient.updateProductStock(productId, stock)
      );
      
      if (response.success) {
        await fetchProducts(productPage, productSearch);
      } else {
        alert(response.message || 'Failed to update stock');
      }
    } catch (error: any) {
      console.error('Error updating stock:', error);
      alert(error.message || 'Failed to update stock');
    }
  };

  const handleBulkUpdateStock = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product');
      return;
    }

    if (bulkStockValue <= 0) {
      alert('Please enter a valid stock amount');
      return;
    }

    try {
      const updates = Array.from(selectedProducts).map(id => ({
        id,
        stock: bulkStockValue
      }));

      const response = await callWithLoader(() => 
        apiClient.bulkUpdateProductStock(updates)
      );
      
      if (response.success) {
        await fetchProducts(productPage, productSearch);
        setSelectedProducts(new Set());
        setBulkStockValue(0);
        alert(`Successfully updated stock for ${response.data?.updated || 0} product(s)`);
      } else {
        alert(response.message || 'Failed to update stock');
      }
    } catch (error: any) {
      console.error('Error bulk updating stock:', error);
      alert(error.message || 'Failed to update stock');
    }
  };

  const handleBulkUpdateStatus = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      const promises = Array.from(selectedProducts).map(id => 
        apiClient.updateProductStatus(id, bulkStatusValue)
      );

      await Promise.all(promises);
      await fetchProducts(productPage, productSearch);
      setSelectedProducts(new Set());
      alert(`Successfully updated status for ${selectedProducts.size} product(s)`);
    } catch (error: any) {
      console.error('Error bulk updating status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await callWithLoader(() => 
        apiClient.updateOrderStatus(orderId, status)
      );
      
      if (response.success) {
        await fetchOrders(orderPage);
      } else {
        alert(response.message || 'Failed to update order status');
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      alert(error.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleUpdatePayoutStatus = async (payoutId: number, status: string) => {
    try {
      setUpdatingPayoutId(payoutId);
      const response = await callWithLoader(() => 
        apiClient.updatePayoutStatus(payoutId, status)
      );
      
      if (response.success) {
        await fetchPayouts(payoutPage);
      } else {
        alert(response.message || 'Failed to update payout status');
      }
    } catch (error: any) {
      console.error('Error updating payout status:', error);
      alert(error.message || 'Failed to update payout status');
    } finally {
      setUpdatingPayoutId(null);
    }
  };

  const toggleProductSelection = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === allProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(allProducts.map(p => p.id)));
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push('/login');
      } else if (user && user.role !== 'admin' && user.role !== 'reseller') {
        router.push('/shop');
      }
    }
  }, [isLoggedIn, loading, router, user]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      if (activeTab === 'products') {
        fetchProducts(productPage, productSearch);
      } else if (activeTab === 'orders') {
        fetchOrders(orderPage);
      } else if (activeTab === 'payouts') {
        fetchPayouts(payoutPage);
      } else {
        fetchProducts(1);
        fetchOrders(1);
      }
    }
  }, [isLoggedIn, user, activeTab, productPage, productSearch, orderPage, payoutPage]);

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  if (user?.role !== 'admin' && user?.role !== 'reseller') {
    return null;
  }

  const isAdmin = user?.role === 'admin';
  const isReseller = user?.role === 'reseller';

  return (
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
            {isAdmin && activeTab === 'products' && (
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="px-6 py-3 bg-cta-copper text-text-cream rounded-soft-lg hover:bg-cta-copper/90 transition-colors flex items-center space-x-2"
              >
                <FaPlus />
                <span>{showProductForm ? 'Hide' : 'Add'} Product</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          {isAdmin && (
            <div className="flex space-x-4 mb-8 border-b border-divider-silver">
              {(['overview', 'products', 'orders', 'payouts'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-body font-semibold capitalize transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-cta-copper text-cta-copper'
                      : 'border-transparent text-text-lavender hover:text-text-cream'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Product Form */}
          {(showProductForm || editingProduct) && isAdmin && activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              {editingProduct ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-headings text-2xl text-text-cream">Edit Product</h2>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setShowProductForm(false);
                      }}
                      className="text-text-lavender hover:text-text-cream transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <ProductManagementForm 
                    isNewProduct={false} 
                    productId={editingProduct.id}
                    onSuccess={() => {
                      setEditingProduct(null);
                      fetchProducts(productPage, productSearch);
                    }}
                  />
                </div>
              ) : (
                <ProductManagementForm 
                  isNewProduct={true} 
                  onSuccess={() => {
                    setShowProductForm(false);
                    fetchProducts(productPage, productSearch);
                  }}
                />
              )}
            </motion.div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && isAdmin && (
            <>
              {/* Stats Cards */}
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
                        {isLoading ? '...' : stats.products}
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
                        {isLoading ? '...' : stats.orders}
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
                        ${isLoading ? '...' : stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <FaChartLine className="text-4xl text-cta-copper" />
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* Products Management Tab */}
          {activeTab === 'products' && isAdmin && (
            <div className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headings text-2xl text-text-cream font-semibold">Product Management</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProductPage(1);
                    }}
                    className="px-4 py-2 bg-base-navy text-text-cream rounded-md border border-divider-silver focus:outline-none focus:border-cta-copper"
                  />
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedProducts.size > 0 && (
                <div className="mb-6 p-4 bg-base-navy rounded-md flex flex-wrap items-center gap-4">
                  <span className="font-body text-text-cream">
                    {selectedProducts.size} product(s) selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Stock amount"
                      value={bulkStockValue || ''}
                      onChange={(e) => setBulkStockValue(parseInt(e.target.value) || 0)}
                      className="px-3 py-1 bg-card-taupe text-text-cream rounded-md border border-divider-silver w-32"
                    />
                    <button
                      onClick={handleBulkUpdateStock}
                      className="px-4 py-2 bg-cta-copper text-text-cream rounded-md hover:bg-cta-copper/90 transition-colors flex items-center space-x-2"
                    >
                      <FaWarehouse />
                      <span>Update Stock</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={bulkStatusValue}
                      onChange={(e) => setBulkStatusValue(e.target.value)}
                      className="px-3 py-1 bg-card-taupe text-text-cream rounded-md border border-divider-silver"
                    >
                      {productStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleBulkUpdateStatus}
                      className="px-4 py-2 bg-cta-copper text-text-cream rounded-md hover:bg-cta-copper/90 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-highlight-wine text-text-cream rounded-md hover:bg-highlight-wine/90 transition-colors flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>Delete Selected</span>
                  </button>
                </div>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-divider-silver">
                      <th className="text-left py-3 px-4">
                        <button onClick={toggleSelectAll} className="text-text-cream hover:text-cta-copper">
                          {selectedProducts.size === allProducts.length ? <FaCheckSquare /> : <FaSquare />}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Product</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Price</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Stock</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map((product) => (
                      <tr key={product.id} className="border-b border-divider-silver/50 hover:bg-base-navy/50">
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => toggleProductSelection(product.id)}
                            className="text-text-lavender hover:text-cta-copper"
                          >
                            {selectedProducts.has(product.id) ? <FaCheckSquare /> : <FaSquare />}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/shop/${product.id}`} className="font-body text-text-cream hover:text-cta-copper">
                            {product.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4 font-body text-text-cream">
                          ${typeof product.base_price === 'string' 
                            ? parseFloat(product.base_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : product.base_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={product.stock}
                              onChange={(e) => {
                                const newStock = parseInt(e.target.value) || 0;
                                handleUpdateProductStock(product.id, newStock);
                              }}
                              className="w-20 px-2 py-1 bg-base-navy text-text-cream rounded border border-divider-silver"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={product.status || 'active'}
                            onChange={(e) => handleUpdateProductStatus(product.id, e.target.value)}
                            className="px-3 py-1 bg-base-navy text-text-cream rounded border border-divider-silver"
                          >
                            {productStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductForm(false);
                              }}
                              className="p-2 text-text-lavender hover:text-cta-copper transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deletingProductId === product.id}
                              className="p-2 text-text-lavender hover:text-highlight-wine transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {productTotalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setProductPage(p => Math.max(1, p - 1))}
                    disabled={productPage === 1}
                    className="px-4 py-2 bg-base-navy text-text-cream rounded-md hover:bg-base-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="font-body text-text-lavender">
                    Page {productPage} of {productTotalPages}
                  </span>
                  <button
                    onClick={() => setProductPage(p => Math.min(productTotalPages, p + 1))}
                    disabled={productPage === productTotalPages}
                    className="px-4 py-2 bg-base-navy text-text-cream rounded-md hover:bg-base-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Orders Management Tab */}
          {activeTab === 'orders' && isAdmin && (
            <div className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6">
              <h2 className="font-headings text-2xl text-text-cream font-semibold mb-6">Order Management</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-divider-silver">
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Items</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Total</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((order) => (
                      <tr key={order.id} className="border-b border-divider-silver/50 hover:bg-base-navy/50">
                        <td className="py-3 px-4 font-body text-text-cream">#{order.id}</td>
                        <td className="py-3 px-4 font-body text-text-lavender">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-body text-text-lavender">
                          {order.items?.length || 0} item(s)
                        </td>
                        <td className="py-3 px-4 font-body text-text-cream font-semibold">
                          ${(typeof order.total_amount === 'string' 
                            ? parseFloat(order.total_amount) 
                            : order.total_amount
                          ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1 bg-base-navy text-text-cream rounded border border-divider-silver disabled:opacity-50"
                          >
                            {orderStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/orders`}
                            className="text-cta-copper hover:underline font-body"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {orderTotalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                    disabled={orderPage === 1}
                    className="px-4 py-2 bg-base-navy text-text-cream rounded-md hover:bg-base-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="font-body text-text-lavender">
                    Page {orderPage} of {orderTotalPages}
                  </span>
                  <button
                    onClick={() => setOrderPage(p => Math.min(orderTotalPages, p + 1))}
                    disabled={orderPage === orderTotalPages}
                    className="px-4 py-2 bg-base-navy text-text-cream rounded-md hover:bg-base-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payouts Management Tab */}
          {activeTab === 'payouts' && isAdmin && (
            <div className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6">
              <h2 className="font-headings text-2xl text-text-cream font-semibold mb-6">Payout Management</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-divider-silver">
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Payout ID</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Reseller ID</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-body text-text-cream font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="border-b border-divider-silver/50 hover:bg-base-navy/50">
                        <td className="py-3 px-4 font-body text-text-cream">#{payout.id}</td>
                        <td className="py-3 px-4 font-body text-text-lavender">#{payout.reseller_id}</td>
                        <td className="py-3 px-4 font-body text-text-lavender">#{payout.order_id}</td>
                        <td className="py-3 px-4 font-body text-text-cream font-semibold">
                          <FaDollarSign className="inline mr-1" />
                          {payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={payout.status}
                            onChange={(e) => handleUpdatePayoutStatus(payout.id, e.target.value)}
                            disabled={updatingPayoutId === payout.id}
                            className="px-3 py-1 bg-base-navy text-text-cream rounded border border-divider-silver disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 font-body text-text-lavender">
                          {payout.created_at ? new Date(payout.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleUpdatePayoutStatus(payout.id, 'completed')}
                            disabled={updatingPayoutId === payout.id || payout.status === 'completed'}
                            className="px-3 py-1 bg-cta-copper text-text-cream rounded-md hover:bg-cta-copper/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Mark Paid
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {payoutTotalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setPayoutPage(p => Math.max(1, p - 1))}
                    disabled={payoutPage === 1}
                    className="px-4 py-2 bg-base-navy text-text-cream rounded-md hover:bg-base-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="font-body text-text-lavender">
                    Page {payoutPage} of {payoutTotalPages}
                  </span>
                  <button
                    onClick={() => setPayoutPage(p => Math.min(payoutTotalPages, p + 1))}
                    disabled={payoutPage === payoutTotalPages}
                    className="px-4 py-2 bg-base-navy text-text-cream rounded-md hover:bg-base-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reseller Specific Modules */}
          {isReseller && activeTab === 'overview' && (
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
        </motion.div>
      </div>
    </div>
  );
}
