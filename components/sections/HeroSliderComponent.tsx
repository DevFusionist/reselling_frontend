'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroSliderProps {
  images: string[];
  duration?: number; // Duration for each slide in seconds
}

const HeroSlider: React.FC<HeroSliderProps> = ({ images, duration = 6 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check: if no images, return null
  if (!images || images.length === 0) {
    return null;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration * 1000); // Convert seconds to milliseconds

    return () => clearInterval(timer);
  }, [images.length, duration]);

  // Framer Motion variants for slide transitions
  const slideVariants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.5,ease: [0.25, 0.1, 0.25, 1.0] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1.0] } },
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex} // Important for AnimatePresence to track changes
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`Hero Slide ${currentIndex + 1}`}
            fill // Fills the parent container
            style={{ objectFit: 'cover', objectPosition: 'center' }} // Ensures image covers the area
            priority={true} // Essential for LCP and initial load
            sizes="(max-width: 768px) 100vw, 100vw" // Responsive sizing
            quality={80} // Optimize image quality
          />
          {/* Subtle overlay to enhance text readability and blend with theme */}
          <div className="absolute inset-0 bg-base-navy/40 mix-blend-multiply"></div> 
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroSlider;