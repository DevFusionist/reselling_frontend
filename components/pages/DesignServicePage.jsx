'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const DesignServicePage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
  
    const ServiceCard = ({ title, description, image }) => (
      <motion.div
        className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        whileHover={{ translateY: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      >
        <img src={image} alt={title} className="w-full h-72 object-cover" />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="mt-3 text-gray-600">{description}</p>
          <motion.button 
            className="mt-4 text-indigo-600 font-semibold flex items-center hover:text-indigo-700 transition"
            whileHover={{ x: 5 }}
          >
            Start Consultation <ChevronRight size={16} className="ml-1" />
          </motion.button>
        </div>
      </motion.div>
    );
  
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Integration & Lifestyle</p>
          <h1 className="mt-2 text-6xl font-extrabold text-gray-900 tracking-tighter">
            Ethos Design Services
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-4xl mx-auto">
            Inspired by OKA's approach to home styling, we ensure our technology not only performs flawlessly but also integrates seamlessly into the architecture of your life.
          </p>
        </motion.header>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ServiceCard
            title="The Home Audit"
            description="A specialist audits your space to recommend the optimal placement and finish for all connected products."
            image="/images/service1.jpg"
          />
          <ServiceCard
            title="Bespoke Finishes"
            description="Select from exclusive materials—marble, aged copper, and custom fabrics—to perfectly match your aesthetic."
            image="/images/service2.jpg"
          />
          <ServiceCard
            title="Future-Proof Planning"
            description="Consult on the long-term evolution of your integrated home technology, ensuring scalability and aesthetic permanence."
            image="/images/service3.jpg"
          />
        </div>
      </main>
    );
  };

export default DesignServicePage;
