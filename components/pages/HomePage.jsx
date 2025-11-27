'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Settings, Sun } from 'lucide-react';
import ThreeDComponent from '../ThreeDComponent';
import ProductCard from '../ProductCard';
import { products } from '../data/products';
import HeroSection from '../HeroSection';

/**
 * 1. Home Page (GSAP/ScrollTrigger mimic using Framer Motion whileInView)
 */
const HomePage = ({ navigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const FeatureBlock = ({ title, subtitle, description, icon, alignRight = false, image }) => (
    <motion.div
      className={`flex flex-col md:flex-row items-center my-20 py-12 px-4 sm:px-6 lg:px-8`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, type: "tween" }}
    >
      <div className={`md:w-1/2 p-6 ${alignRight ? 'md:order-2' : 'md:order-1'}`}>
        <motion.div initial={{ x: alignRight ? 50 : -50 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
          <div className="text-indigo-600 mb-4">{icon}</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{title}</h2>
          <p className="mt-4 text-xl text-gray-500">{subtitle}</p>
          <p className="mt-6 text-lg text-gray-700">{description}</p>
          <motion.button
            onClick={() => navigate('shop')}
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-gray-900 hover:bg-indigo-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore The Collection <ChevronRight size={18} className="ml-2" />
          </motion.button>
        </motion.div>
      </div>
      <div className={`md:w-1/2 mt-10 md:mt-0 p-6 ${alignRight ? 'md:order-1' : 'md:order-2'}`}>
        <motion.img
          className="rounded-xl shadow-2xl w-full"
          src={image}
          alt={title}
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </motion.div>
  );

  return (
    <main>
      {/* Hero Section - Shopping Center Super Sale Design */}
   <HeroSection navigate={navigate} />

      {/* 3D Immersive Showcase (OKA-style sophisticated product view) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
                className="h-full min-h-[500px]"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <ThreeDComponent />
            </motion.div>
            <motion.div
                className="p-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Immersive Presence. On-Demand.
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    Interact with our core technology in an immersive, three-dimensional space, controlled entirely by you.
                </p>
                <p className="mt-6 text-lg text-gray-700">
                    The core aesthetic of Ethos is demonstrated here: technology that is beautifully rendered, yet always ready to recede into the background of your life. Spin the element to view its precision engineering.
                </p>
                <motion.button
                    onClick={() => navigate('product', products[0].id)}
                    className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View 3D Product Details <ChevronRight size={18} className="ml-2" />
                </motion.button>
            </motion.div>
        </div>
      </section>
      
      {/* Feature Sections (Scroll-driven narrative flow) */}
      <div className="max-w-7xl mx-auto">
        <FeatureBlock
          title="Intuitive Presence"
          subtitle="Stay connected without losing the moment."
          description="Like the subtle in-lens display, our interfaces offer vital information discreetly. No more staring at a screen—just glance and proceed. We design for human attention."
          icon={<Settings size={40} strokeWidth={1.5} />}
          image="/images/service1.jpg"
        />
        <FeatureBlock
          title="The Natural Aesthetic"
          subtitle="Materials crafted to blend, not impose."
          description="Drawing inspiration from OKA, we use sustainable wood, hand-stitched leather, and bespoke finishes to ensure technology complements your interior, never disrupts it. Lasting quality is key."
          icon={<Sun size={40} strokeWidth={1.5} />}
          alignRight={true}
          image="/images/service2.jpg"
        />
      </div>

       {/* Category Preview (OKA-style grid) */}
       <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl font-extrabold text-gray-900 tracking-tight text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Curated Collections
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
            <div className="text-center mt-16">
              <motion.button
                onClick={() => navigate('shop')}
                className="inline-flex items-center px-10 py-4 border-2 border-gray-900 text-lg font-bold rounded-full text-gray-900 hover:bg-gray-900 hover:text-white transition duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                View All Products
              </motion.button>
            </div>
          </div>
        </section>
    </main>
  );
};

export default HomePage;
