'use client';
import React, { useState } from 'react';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Global Header Component (Framer Motion Enhanced)
 */
const Header = ({ navigate, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'Shop', path: 'shop' },
    { name: 'Design Services', path: 'design' },
    { name: 'Manifesto', path: 'about' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-lg font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <motion.button 
          onClick={() => navigate('home')} 
          className="text-2xl font-extrabold tracking-widest text-gray-900 uppercase"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          E T H O S
        </motion.button>
        <nav className="hidden md:flex space-x-10">
          {navItems.map(item => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="text-base font-medium text-gray-600 hover:text-indigo-600 transition relative group py-2"
              whileHover={{ color: '#4f46e5' }}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </motion.button>
          ))}
        </nav>
        <div className="flex items-center space-x-6">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-600 hover:text-indigo-600 rounded-full transition hidden sm:inline-block"><User size={22} /></motion.button>
          <motion.button 
            onClick={() => navigate('cart')} 
            className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:text-indigo-600 rounded-full transition md:hidden">
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                className="text-lg text-left font-medium text-gray-700 hover:text-indigo-600 py-3 border-b border-gray-100 last:border-b-0"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
