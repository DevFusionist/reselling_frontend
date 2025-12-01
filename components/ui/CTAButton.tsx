'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

// Implements Copper color, soft radius, and the smooth hover interaction
const CTAButton: React.FC<CTAButtonProps> = ({ children, onClick, className = '', type = 'button', disabled = false }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-4 text-lg font-body font-medium tracking-wide 
        bg-cta-copper text-text-cream rounded-soft-lg 
        shadow-luxury-soft transition-all duration-300 ease-luxury-ease
        hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cta-copper/50
        flex items-center justify-center gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.05, boxShadow: '0 20px 45px rgba(199, 90, 56, 0.5)' }} // Deeper shadow and subtle scale on hover
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default CTAButton;