'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CTAButton from '@/components/ui/CTAButton';
import { FaTrashAlt, FaLock, FaMinus, FaPlus, FaShoppingBag, FaSpinner } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useApiWithLoader } from '@/hooks/useApiWithLoader';
import CheckoutForm, { Address } from '@/components/checkout/CheckoutForm';

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] } },
};

// Cart Item Component
interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imagePlaceholder: string;
    slug?: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 border-b border-divider-silver transition-all duration-300 hover:bg-card-taupe/50 group"
      variants={itemVariants}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <motion.img
          src={item.imagePlaceholder}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/100x100/28242D/F0EAD6?text=Item';
          }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.2 }}
        />
        <div className="flex flex-col min-w-0 flex-1">
          <Link
            href={`/shop/${item.slug || item.id}`}
            className="font-headings text-lg text-text-cream hover:text-cta-copper transition-colors truncate"
          >
            {item.name}
          </Link>
          <p className="font-body text-text-lavender text-sm">
            Unit Price: ${item.price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        {/* Quantity Controls */}
        <div className="flex items-center border border-divider-silver rounded-full overflow-hidden">
          <motion.button
            onClick={() => handleQuantityChange(-1)}
            className="p-2 text-text-lavender hover:text-text-cream transition-colors"
            aria-label="Decrease quantity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaMinus className="text-xs" />
          </motion.button>
          <span className="font-body text-text-cream w-8 text-center">
            {item.quantity}
          </span>
          <motion.button
            onClick={() => handleQuantityChange(1)}
            className="p-2 text-text-lavender hover:text-text-cream transition-colors"
            aria-label="Increase quantity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPlus className="text-xs" />
          </motion.button>
        </div>
        {/* Subtotal */}
        <p className="font-body text-text-cream font-medium w-24 text-right hidden md:block">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        {/* Remove Button */}
        <motion.button
          onClick={() => removeItem(item.id)}
          className="text-text-lavender hover:text-highlight-wine transition-colors"
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Remove ${item.name}`}
        >
          <FaTrashAlt />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main Cart Page Component
export default function CartPage() {
  const { items, getSubtotal, getTotal, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { callWithLoader } = useApiWithLoader();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const shippingEstimate = 100.00;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async (shippingAddr?: Address, billingAddr?: Address) => {
    if (!isLoggedIn) {
      alert('Please login to proceed with checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // If addresses are not provided, show the form
    if (!shippingAddr) {
      setShowCheckoutForm(true);
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order in backend with addresses
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const orderResponse = await callWithLoader(() => apiClient.createOrder({
        items: orderItems,
        shipping_address: shippingAddr,
        billing_address: billingAddr,
      }));

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const orderData = orderResponse.data;

      // Backend returns a single order with multiple items
      if (!orderData.order || !orderData.order.id) {
        throw new Error('No order created');
      }

      const orderId = orderData.order.id;

      // Step 2: Create Razorpay payment order (backend calculates amount from order)
      const paymentOrderResponse = await callWithLoader(() =>
        apiClient.createPaymentOrder(orderId, orderData)
      );

      if (!paymentOrderResponse.success || !paymentOrderResponse.data) {
        throw new Error(paymentOrderResponse.message || 'Failed to create payment order');
      }

      const paymentData = paymentOrderResponse.data;

      // Step 3: Initialize Razorpay checkout
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      // Get Razorpay key from environment variable
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }

      const options = {
        key: razorpayKey,
        amount: paymentData.amount, // Already in paise from backend
        currency: paymentData.currency,
        name: 'Velvet Zenith',
        description: `Order #${orderId}`,
        order_id: paymentData.id, // Razorpay order ID from backend response
        handler: async function (response: any) {
          try {
            // Step 4: Verify payment
            const verifyResponse = await callWithLoader(() =>
              apiClient.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            );

            console.log('verifyResponse', verifyResponse);

            if (verifyResponse.success && verifyResponse.data?.verified) {
              // Payment successful
              clearCart();
              alert('Payment successful! Your order has been placed.');
              router.push(`/orders`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.email?.split('@')[0] || '',
          email: user?.email || '',
        },
        theme: {
          color: '#C97D60', // cta-copper color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response);
        alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to process checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-navy font-body py-20 pt-32">
      <motion.div
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Title */}
        <motion.h1
          className="font-headings text-5xl text-text-cream font-semibold mb-10"
          variants={itemVariants}
        >
          Your Curated Cart
        </motion.h1>

        {/* Checkout Form Modal/Overlay */}
        <AnimatePresence>
          {showCheckoutForm && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCheckoutForm(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-base-navy rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headings text-3xl text-text-cream">Checkout</h2>
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-text-lavender hover:text-text-cream transition-colors text-xl"
                  >
                    ×
                  </button>
                </div>
                <CheckoutForm
                  onSubmit={async (shippingAddr, billingAddr) => {
                    setShippingAddress(shippingAddr);
                    setBillingAddress(billingAddr || undefined);
                    setShowCheckoutForm(false);
                    await handleCheckout(shippingAddr, billingAddr);
                  }}
                  onCancel={() => setShowCheckoutForm(false)}
                  isLoading={isProcessing}
                />
              </div>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area: Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
          {/* Column 1: Cart Items List */}
          <motion.div
            className="lg:col-span-2 bg-card-taupe rounded-soft-lg shadow-luxury-soft p-6 mb-10 lg:mb-0"
            variants={itemVariants}
          >
            {items.length > 0 ? (
              items.map((item) => <CartItem key={item.id} item={item} />)
            ) : (
              <motion.div
                className="text-center py-10 text-text-lavender"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaShoppingBag className="text-6xl mx-auto mb-4 text-text-lavender/30" />
                <p className="font-body text-xl mb-4">Your cart is currently empty.</p>
                <Link
                  href="/shop"
                  className="text-cta-copper hover:underline font-body inline-block"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Column 2: Order Summary Card */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="sticky top-28 bg-card-taupe p-6 rounded-soft-lg shadow-luxury-soft border border-divider-silver">
              <h2 className="font-headings text-3xl text-text-cream mb-6 border-b border-divider-silver pb-3">
                Order Summary
              </h2>
              <div className="space-y-3 font-body text-text-lavender">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-text-cream font-medium">
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate:</span>
                  <span className="text-text-cream font-medium">
                    ${shippingEstimate.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-divider-silver mt-4">
                  <span className="text-xl text-text-cream font-bold">Order Total:</span>
                  <span className="text-xl text-cta-copper font-bold">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.div className="mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <CTAButton
                  className="w-full text-lg py-4"
                  onClick={handleCheckout}
                  disabled={isProcessing || !razorpayLoaded || items.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" /> Proceed to Secure Checkout
                    </>
                  )}
                </CTAButton>
              </motion.div>

              {!isLoggedIn && (
                <p className="font-body text-highlight-wine text-sm text-center mt-4">
                  Please <Link href="/login" className="underline">login</Link> to proceed with checkout
                </p>
              )}

              <p className="font-body text-text-lavender text-xs text-center mt-4">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

