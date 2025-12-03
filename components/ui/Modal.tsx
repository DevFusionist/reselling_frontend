'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative bg-card-taupe rounded-soft-lg shadow-luxury-soft w-full max-w-md p-6 md:p-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-lavender hover:text-text-cream transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Title */}
              <h2 className="font-headings text-3xl text-text-cream font-semibold mb-6 pr-8">
                {title}
              </h2>

              {/* Content */}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

