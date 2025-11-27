'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';
import { products, categories } from '../data/products';

/**
 * 2. Shop Page (OKA-style e-commerce grid with Framer Motion)
 */
const ShopPage = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const filteredProducts = selectedCategory === 'All Products'
    ? products
    : products.filter(p => p.category === selectedCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1 
        className="text-5xl font-extrabold text-gray-900 tracking-tight mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        The Ethos Collection
      </motion.h1>
      <div className="md:grid md:grid-cols-4 lg:grid-cols-5 gap-10">
        <aside className="md:col-span-1 lg:col-span-1 mb-8 md:mb-0 p-6 rounded-xl bg-gray-50 shadow-md h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-5 border-b pb-3">
            Filter By Category
          </h2>
          <nav className="space-y-3">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left py-3 px-4 rounded-lg text-base font-medium transition duration-200 flex justify-between items-center ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ x: selectedCategory === category ? 0 : 5 }}
              >
                {category}
                <span className={`text-sm ${selectedCategory === category ? 'text-indigo-200' : 'text-gray-500'}`}>
                    ({products.filter(p => p.category === category || category === 'All Products').length})
                </span>
              </motion.button>
            ))}
          </nav>
        </aside>
        <section className="md:col-span-3 lg:col-span-4">
          <p className="text-base text-gray-600 mb-6">Showing {filteredProducts.length} results for "<span className="font-semibold">{selectedCategory}</span>"</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-center text-xl text-gray-500 py-20">No products found in this category. Try a different filter.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ShopPage;
