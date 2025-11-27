'use client';
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Product Card (Framer Motion Enhanced)
 */
const ProductCard = ({ product, navigate }) => (
  <motion.div
    className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 shadow-sm"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
  >
    <div className="relative aspect-[4/5] overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
        <motion.button
          onClick={() => navigate('product', product.id)}
          className="w-full text-sm font-medium bg-white text-gray-900 py-3 rounded-full shadow-lg hover:bg-gray-100"
          whileHover={{ backgroundColor: '#e5e7eb' }}
          whileTap={{ scale: 0.95 }}
        >
          View Details
        </motion.button>
      </div>
    </div>
    <div className="p-4 bg-white flex flex-col items-start">
      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{product.category}</p>
      <p className="mt-2 text-2xl font-bold text-gray-800">${product.price.toLocaleString()}</p>
    </div>
  </motion.div>
);

export default ProductCard;
