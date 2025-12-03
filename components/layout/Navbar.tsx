'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
// Assuming 'react-icons' package is installed for universal icons
import { FaChartBar, FaUserCircle, FaStore, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

// Variants for the entire navigation container
const navContainerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.1, 0.25, 1.0], // luxury-ease
      when: "beforeChildren", 
      staggerChildren: 0.1
    } 
  },
};

// Variants for individual items (Logo and Nav Links)
const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] } },
};

// Define the structure for all navigation items
const navItems = [
  { label: 'Shop', href: '/shop', icon: FaStore, requiresAuth: false, allowedRoles: null },
  { label: 'Dashboard', href: '/dashboard', icon: FaChartBar, requiresAuth: true, allowedRoles: ['admin', 'reseller'] },
  { label: 'Account', href: '/account', icon: FaUserCircle, requiresAuth: true, allowedRoles: null },
];

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const { toggleCart, getTotalItems } = useCart();
  const router = useRouter();
  const cartItemCount = getTotalItems();

  // Filter items based on authentication status and role
  const visibleNavItems = navItems.filter(item => {
    if (item.requiresAuth && !isLoggedIn) return false;
    if (item.allowedRoles && (!user || !item.allowedRoles.includes(user.role))) return false;
    return true;
  });

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      router.push('/login');
    }
  };

  return (
    <motion.nav 
      className="fixed w-full z-50 bg-base-navy/90 backdrop-blur-sm shadow-md"
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Animated Logo */}
        <motion.div variants={itemVariants}>
          <Link href="/" className="font-headings text-2xl text-text-cream font-semibold tracking-wider">
            VELVET ZENITH
          </Link>
        </motion.div>

        {/* Animated Navigation Links */}
        <motion.div className="space-x-8 flex items-center">
          
          {visibleNavItems.map(({ label, href, icon: Icon }, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link 
                href={href} 
                className="relative text-text-lavender transition-colors duration-300 hover:text-cta-copper group flex items-center space-x-2"
              >
                <Icon className="text-xl" />
                <span className="hidden sm:inline">{label}</span>
                {/* Sliding Underline Micro-Interaction */}
                <span className="absolute bottom-[-4px] left-0 h-[2px] w-full bg-cta-copper transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </motion.div>
          ))}
          
          {/* Cart Icon */}
          <motion.button
            variants={itemVariants}
            onClick={toggleCart}
            className="relative text-text-lavender transition-colors duration-300 hover:text-cta-copper group flex items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open cart"
          >
            <FaShoppingCart className="text-xl" />
            {cartItemCount > 0 && (
              <motion.span
                className="absolute -top-2 -right-2 bg-cta-copper text-text-cream text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </motion.span>
            )}
          </motion.button>
          
          {/* Auth Toggle */}
          <motion.button
            variants={itemVariants}
            onClick={handleAuthClick}
            className={`
              font-body text-sm font-medium px-4 py-1 rounded-full transition-colors duration-300
              ${isLoggedIn ? 'bg-highlight-wine text-text-cream hover:bg-highlight-wine/80' : 'bg-cta-copper text-text-cream hover:bg-cta-copper/80'}
            `}
          >
            {isLoggedIn ? 'Log Out' : 'Sign In'}
          </motion.button>
        </motion.div>
      </div>
    </motion.nav>
  );
}