'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DesignServicePage from './pages/DesignServicePage';
import AboutPage from './pages/AboutPage';

// --- MAIN APPLICATION COMPONENT ---
const App = () => {
  const [currentPage, setCurrentPage] = useState({ name: 'home', id: null });
  const [cartItems, setCartItems] = useState([]); // Dummy cart state

  const navigate = useCallback((pageName, id = null) => {
    setCurrentPage({ name: pageName, id: id });
  }, []);

  const renderPage = () => {
    switch (currentPage.name) {
      case 'shop':
        return <ShopPage navigate={navigate} />;
      case 'product':
        return <ProductDetailPage productId={currentPage.id} navigate={navigate} />;
      case 'design':
        return <DesignServicePage />;
      case 'about':
        return <AboutPage />;
      case 'cart':
        return (
            <motion.div 
                className="max-w-xl mx-auto py-32 text-center px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-black text-gray-900">Your Cart</h1>
                <p className="mt-4 text-xl text-gray-600">You have <span className="font-bold text-indigo-600">{cartItems.length}</span> items waiting for synthesis.</p>
                <motion.button 
                    onClick={() => navigate('shop')} 
                    className="mt-10 inline-flex items-center px-8 py-4 border-2 border-indigo-600 text-lg font-bold rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Continue Exploring
                </motion.button>
            </motion.div>
        );
      case 'home':
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-white font-sans">
      <Header navigate={navigate} cartCount={cartItems.length} />
      <div className="flex-grow">
        {renderPage()}
      </div>
      <Footer navigate={navigate} />
    </div>
  );
};

export default App;
