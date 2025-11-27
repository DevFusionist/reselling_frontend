'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { categories } from './data/products';

const Footer = ({ navigate }) => (
    <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="bg-gray-900 text-white mt-24 pt-16 pb-10 font-sans shadow-inner shadow-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 border-b border-gray-800 pb-12">
          {/* ... Footer Content (Non-animated for stability) ... */}
          <div>
            <h4 className="text-xl font-bold mb-5 uppercase text-indigo-400">Ethos</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => navigate('about')} className="hover:text-white transition">Manifesto</button></li>
              <li><button onClick={() => navigate('design')} className="hover:text-white transition">Design Services</button></li>
              <li><button className="hover:text-white transition">Press & Media</button></li>
              <li><button className="hover:text-white transition">Careers</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-5 uppercase text-indigo-400">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {categories.slice(0, 4).map(c => (
                <li key={c}><button onClick={() => navigate('shop')} className="hover:text-white transition">{c}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-5 uppercase text-indigo-400">Customer Care</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button className="hover:text-white transition">Contact Us</button></li>
              <li><button className="hover:text-white transition">Shipping & Returns</button></li>
              <li><button className="hover:text-white transition">FAQs</button></li>
              <li><button className="hover:text-white transition">Product Support</button></li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="text-xl font-bold mb-5 uppercase text-indigo-400">Stay Connected</h4>
            <p className="text-base text-gray-400 max-w-sm">
              Sign up for exclusive previews and design consultations.
            </p>
            <div className="mt-5 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow p-4 rounded-l-lg bg-gray-800 border-2 border-gray-700 text-sm text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
              <motion.button
                className="px-6 bg-indigo-600 text-white font-black rounded-r-lg hover:bg-indigo-700"
                whileHover={{ backgroundColor: '#4f46e5' }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ethos Technologies. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="hover:text-white transition">Privacy</button>
            <button className="hover:text-white transition">Terms</button>
            <button className="hover:text-white transition">Cookies</button>
          </div>
        </div>
      </div>
    </motion.footer>
  );

export default Footer;
