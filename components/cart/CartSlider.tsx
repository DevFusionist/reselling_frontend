'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { FaTrashAlt, FaMinus, FaPlus, FaLock, FaShoppingBag } from 'react-icons/fa';
import CTAButton from '@/components/ui/CTAButton';
import { useIsMobile } from '@/hooks/useIsMobile';


// -------------------------
// Hamburger → X Icon
// -------------------------
const HamburgerToX: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  return (
    <div className="relative w-6 h-6">
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-text-cream origin-center"
        animate={{
          rotate: isHovered ? 45 : 0,
          y: isHovered ? 8 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      />

      <motion.div
        className="absolute top-2.5 left-0 w-full h-0.5 bg-text-cream"
        animate={{
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
      />

      <motion.div
        className="absolute top-5 left-0 w-full h-0.5 bg-text-cream origin-center"
        animate={{
          rotate: isHovered ? -45 : 0,
          y: isHovered ? -8 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      />
    </div>
  );
};

// -------------------------
// Cart Item Component
// -------------------------
const CartItem: React.FC<{ item: any }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 border-b border-divider-silver transition-all duration-300 hover:bg-card-taupe/50 group"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <motion.img
          src={item.imagePlaceholder}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src='https://placehold.co/100x100/28242D/F0EAD6?text=Item';
          }}
          whileHover={{ scale: 1.05 }}
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

      <div className="flex items-center space-x-4 ml-4">

        <div className="flex items-center border border-divider-silver rounded-full overflow-hidden">
          <motion.button
            onClick={() => handleQuantityChange(-1)}
            className="p-2 text-text-lavender hover:text-text-cream transition-colors"
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPlus className="text-xs" />
          </motion.button>
        </div>

        <p className="font-body text-text-cream font-medium w-24 text-right hidden md:block">
          ${(item.price * item.quantity).toFixed(2)}
        </p>

        <motion.button
          onClick={() => removeItem(item.id)}
          className="text-text-lavender hover:text-highlight-wine transition-colors"
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTrashAlt />
        </motion.button>

      </div>
    </motion.div>
  );
};

// -------------------------
// Main Cart Slider
// -------------------------
export default function CartSlider() {
  const { isOpen, closeCart, items, getSubtotal, getTotal } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  // Auto animate hamburger → X on mobile when cart opens and button comes into view
  useEffect(() => {
    if (!isMobile || !isOpen) {
      setIsHovered(false);
      return;
    }

    // Wait for the cart slider to slide in, then check if button is in view
    const timer = setTimeout(() => {
      if (closeButtonRef.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              // Trigger animation after a small delay for visibility
              setTimeout(() => {
                setIsHovered(true);
              }, 200);
              observer.disconnect();
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(closeButtonRef.current);
        return () => observer.disconnect();
      }
    }, 300); // Wait for slide animation to start

    return () => {
      clearTimeout(timer);
      setIsHovered(false);
    };
  }, [isMobile, isOpen]);
  

  // Prevent scroll behind slider
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const shippingEstimate = 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-base-navy z-50 shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
          >
            <div className="flex items-center justify-between p-6 border-b border-divider-silver bg-card-taupe">
              <h2 className="font-headings text-3xl text-text-cream font-semibold">
                Your Cart
              </h2>

              <motion.button
                ref={closeButtonRef}
                onClick={closeCart}
                className="p-2 text-text-cream hover:text-cta-copper transition-colors"
                aria-label="Close cart"
                onHoverStart={() => !isMobile && setIsHovered(true)}
                onHoverEnd={() => !isMobile && setIsHovered(false)}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <HamburgerToX isHovered={isHovered} />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => <CartItem key={item.id} item={item} />)
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center h-full text-center p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FaShoppingBag className="text-6xl text-text-lavender/30 mb-4" />
                  <p className="font-body text-xl text-text-lavender mb-4">
                    Your cart is empty
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="text-cta-copper hover:underline font-body"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <motion.div
                className="border-t border-divider-silver bg-card-taupe p-6"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
              >
                <div className="space-y-3 font-body text-text-lavender mb-6">
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

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/cart" onClick={closeCart}>
                    <CTAButton className="w-full text-lg py-4">
                      <FaLock className="mr-2" /> Proceed to Checkout
                    </CTAButton>
                  </Link>
                </motion.div>

                <p className="font-body text-text-lavender text-xs text-center mt-4">
                  Shipping and taxes calculated at checkout.
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
