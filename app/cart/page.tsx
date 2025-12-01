'use client';

import { motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import CTAButton from '@/components/ui/CTAButton';
import { FaTrashAlt, FaLock, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

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
  const { items, getSubtotal, getTotal } = useCart();
  const shippingEstimate = 100.00;

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
                <CTAButton className="w-full text-lg py-4">
                  <FaLock className="mr-2" /> Proceed to Secure Checkout
                </CTAButton>
              </motion.div>

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

