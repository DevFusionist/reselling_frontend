'use client';

import { motion } from 'framer-motion';
import { FaShieldAlt, FaUndo, FaLock, FaHeadset } from 'react-icons/fa';

const trustSignals = [
  {
    icon: FaShieldAlt,
    title: '30-Day Returns',
    description: 'Hassle-free returns',
  },
  {
    icon: FaLock,
    title: 'Secure Checkout',
    description: 'Your data is protected',
  },
  {
    icon: FaHeadset,
    title: '24/7 Support',
    description: 'Always here to help',
  },
  {
    icon: FaUndo,
    title: 'Free Shipping',
    description: 'On orders over $50',
  },
];

export default function TrustSignals() {
  return (
    <section className="py-12 bg-card-taupe border-t border-divider-silver">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <signal.icon className="text-4xl text-cta-copper mx-auto mb-4" />
              <h3 className="font-headings text-lg text-text-cream font-semibold mb-2">
                {signal.title}
              </h3>
              <p className="font-body text-sm text-text-lavender">
                {signal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

