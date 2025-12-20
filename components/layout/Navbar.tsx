'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaShoppingCart, FaHeart, FaSearch, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { apiClient } from '@/lib/api';

interface NavCategory {
  label: string;
  href: string;
  subcategories: Array<{ label: string; href: string }>;
}

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const { toggleCart, getTotalItems } = useCart();
  const router = useRouter();
  const cartItemCount = getTotalItems();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [navCategories, setNavCategories] = useState<NavCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Fetch categories and sub-categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await apiClient.getAllAttributes();
        
        if (response.success && response.data) {
          const categories = response.data.categories || [];
          const subCategories = response.data.sub_categories || [];
          
          // Build navigation structure
          const builtCategories: NavCategory[] = categories.map((category: { id: number; name: string }) => {
            // Find sub-categories for this category
            const categorySubCategories = subCategories
              .filter((sub: { category_id: number; name: string }) => sub.category_id === category.id)
              .map((sub: { name: string }) => ({
                label: sub.name,
                href: `/shop?category=${encodeURIComponent(category.name)}&sub_category=${encodeURIComponent(sub.name)}`,
              }));

            return {
              label: category.name,
              href: `/shop?category=${encodeURIComponent(category.name)}`,
              subcategories: categorySubCategories,
            };
          });

          setNavCategories(builtCategories);
        }
      } catch (error) {
        console.error('Error fetching navigation categories:', error);
        // Fallback to empty array if API fails
        setNavCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Close search suggestions and account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchSuggestions(false);
    }
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setShowAccountMenu(!showAccountMenu);
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    setShowAccountMenu(false);
    await logout();
  };

  return (
    <>
      {/* Top Bar - Announcement Banner */}
      <div className="bg-cta-copper text-text-cream text-sm py-2 text-center">
        <p>Free Shipping on orders over $50 • Summer Sale Ends Friday</p>
      </div>

      {/* Main Header */}
      <nav className="sticky top-0 z-50 bg-base-navy shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Main Header Row */}
          <div className="flex items-center justify-between py-4">
            
            {/* Logo */}
            <Link href="/" className="font-headings text-2xl text-text-cream font-semibold tracking-wider flex-shrink-0">
              VELVET ZENITH
            </Link>

            {/* Search Bar - Centered and Prominent */}
            <div className="flex-1 max-w-2xl mx-4 md:mx-8" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                  className="w-full px-4 py-2 pl-12 pr-4 bg-card-taupe text-text-cream rounded-lg border border-divider-silver focus:outline-none focus:border-cta-copper focus:ring-2 focus:ring-cta-copper/20"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-lavender" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-cta-copper text-text-cream rounded hover:bg-cta-copper/80 transition-colors text-sm"
                >
                  Search
                </button>
                
                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSearchSuggestions && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card-taupe border border-divider-silver rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
                    >
                      <div className="p-2">
                        <Link
                          href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                          className="block px-4 py-2 text-text-cream hover:bg-cta-copper/20 rounded transition-colors"
                          onClick={() => setShowSearchSuggestions(false)}
                        >
                          Search for "{searchQuery}"
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Utilities - Right Side */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Account / Sign In */}
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={handleAuthClick}
                  className="flex items-center space-x-1 text-text-lavender hover:text-cta-copper transition-colors"
                  aria-label={isLoggedIn ? 'Account Menu' : 'Sign In'}
                >
                  <FaUserCircle className="text-xl" />
                  <span className="hidden sm:inline text-sm">{isLoggedIn ? 'Account' : 'Sign In'}</span>
                  {isLoggedIn && <FaChevronDown className="text-xs opacity-70" />}
                </button>

                {/* Account Dropdown Menu */}
                <AnimatePresence>
                  {isLoggedIn && showAccountMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-card-taupe border border-divider-silver rounded-lg shadow-xl py-2 z-50"
                    >
                      {(user?.role === 'admin' || user?.role === 'reseller') && (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-text-cream hover:bg-cta-copper/20 transition-colors"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-text-cream hover:bg-cta-copper/20 transition-colors"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-text-cream hover:bg-cta-copper/20 transition-colors"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Order History
                      </Link>
                      <div className="border-t border-divider-silver my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-text-cream hover:bg-red-600/20 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                href="/account"
                className="flex items-center space-x-1 text-text-lavender hover:text-cta-copper transition-colors relative"
                aria-label="Wishlist"
              >
                <FaHeart className="text-xl" />
                <span className="hidden sm:inline text-sm">Wishlist</span>
              </Link>

              {/* Cart with Badge */}
              <button
                onClick={toggleCart}
                className="relative flex items-center space-x-1 text-text-lavender hover:text-cta-copper transition-colors"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart className="text-xl" />
                <span className="hidden sm:inline text-sm">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cta-copper text-text-cream text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-text-lavender hover:text-cta-copper transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Navigation Row - Mega Menu (Desktop) */}
          {!isMobile && !isLoadingCategories && (
            <div className="border-t border-divider-silver py-3" ref={megaMenuRef}>
              <div className="flex items-center space-x-8">
                {navCategories.map((category) => (
                  <div
                    key={category.label}
                    className="relative group"
                    onMouseEnter={() => setActiveMegaMenu(category.label)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <Link
                      href={category.href}
                      className="text-text-lavender hover:text-cta-copper transition-colors font-medium text-sm flex items-center space-x-1"
                    >
                      <span>{category.label}</span>
                      <FaChevronDown className="text-xs opacity-70" />
                    </Link>

                    {/* Mega Dropdown */}
                    <AnimatePresence>
                      {activeMegaMenu === category.label && category.subcategories.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-card-taupe border border-divider-silver rounded-lg shadow-xl p-4 z-50"
                        >
                          <div className="space-y-2">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="block px-4 py-2 text-text-cream hover:bg-cta-copper/20 rounded transition-colors"
                                onClick={() => setActiveMegaMenu(null)}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu (Hamburger) */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && !isLoadingCategories && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-divider-silver bg-base-navy md:hidden overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navCategories.length > 0 ? (
                  navCategories.map((category) => (
                    <MobileCategoryItem 
                      key={category.label} 
                      category={category} 
                      onLinkClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))
                ) : (
                  <p className="text-text-lavender text-center py-4">No categories available</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

// Mobile Category Item with Accordion
function MobileCategoryItem({ 
  category, 
  onLinkClick 
}: { 
  category: NavCategory; 
  onLinkClick: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-divider-silver pb-2">
      <div className="w-full flex items-center justify-between py-2">
        <Link 
          href={category.href} 
          className="font-medium text-text-lavender hover:text-cta-copper transition-colors"
          onClick={onLinkClick}
        >
          {category.label}
        </Link>
        {category.subcategories.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-text-lavender hover:text-cta-copper transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <FaChevronDown
              className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
      <AnimatePresence>
        {isExpanded && category.subcategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 pt-2 space-y-1"
          >
            {category.subcategories.map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="block py-1 text-text-lavender hover:text-cta-copper transition-colors text-sm"
                onClick={onLinkClick}
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
