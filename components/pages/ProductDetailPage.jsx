'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import { products } from '../data/products';

const ProductDetailPage = ({ productId, navigate }) => {
    const product = products.find(p => p.id === productId);
    useEffect(() => { window.scrollTo(0, 0); }, [productId]);
    if (!product) return (<div className="max-w-7xl mx-auto py-20 text-center"><h1 className="text-3xl font-bold">Product Not Found</h1><button onClick={() => navigate('shop')} className="mt-4 text-indigo-600 hover:underline">Go to Shop</button></div>);
  
    const specs = {
      "Technology": "Micro-LED 4K Display, Biometric Sensor Array",
      "Material": "Aerospace-grade Titanium, Full-grain Italian Leather",
      "Battery Life": "48 Hours (Standard Mode), 12 Hours (Performance Mode)",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.4, Ethos Neural Link",
      "Weight": "68g (Ultra-Light Chassis)",
      "Warranty": "5-Year Limited Global Warranty",
    };
  
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Visuals & Hero */}
          <motion.div 
            className="rounded-xl overflow-hidden shadow-2xl aspect-square lg:aspect-auto h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
  
          {/* Product Details & Purchase */}
          <motion.div 
            className="sticky top-20 h-fit"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{product.category}</p>
            <h1 className="text-6xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-4xl font-light text-gray-800 mt-4">${product.price.toLocaleString()}</p>
            <p className="mt-8 text-lg text-gray-600 border-b pb-6">{product.description} Experience seamless integration with your environment and a new form of digital presence.</p>
  
            <div className="mt-8 space-y-4">
              <motion.button
                className="w-full flex items-center justify-center px-8 py-5 border border-transparent text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add to Cart
              </motion.button>
              <motion.button
                onClick={() => navigate('design')}
                className="w-full flex items-center justify-center px-8 py-5 border-2 border-gray-900 text-lg font-bold rounded-full text-gray-900 hover:bg-gray-900 hover:text-white transition duration-300"
                whileHover={{ scale: 1.02, backgroundColor: '#1f2937', color: '#ffffff' }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={20} className="mr-3" /> Book A Personal Demo (Ray-Ban style conversion)
              </motion.button>
            </div>
  
            {/* Technical Specs (Ray-Ban style details table) */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Specifications</h2>
              <dl className="space-y-4">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-100 pb-3">
                    <dt className="text-base font-medium text-gray-500">{key}</dt>
                    <dd className="text-base text-gray-900 text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </main>
    );
  };

export default ProductDetailPage;
