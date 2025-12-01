'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import CTAButton from '@/components/ui/CTAButton'; // Corrected path
import HeroSlider from '@/components/sections/HeroSliderComponent'; // New import

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Your provided images for the slider
  const heroImages = [
    '/images/handbag.png',
    '/images/watch.png',
    '/images/scent.png',
    '/images/wallet.png',
  ];

  return (
    <div className="relative h-[80vh] overflow-hidden flex items-center justify-center pt-20">
      
      {/* Hero Slider as the background, with parallax effect */}
      <motion.div 
        style={{ y }} // Apply parallax to the container holding the slider
        className="absolute inset-0"
      >
        <HeroSlider images={heroImages} duration={6} />
      </motion.div>

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-base-navy/60 z-10"></div> 

      {/* Content for the Hero Section */}
      <div className="relative z-20 text-center max-w-4xl px-4">

        <motion.h1 
          className="font-headings text-7xl font-semibold text-text-cream mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }} // Added theme ease
        >
          The Art of Curated Commerce
        </motion.h1>

        <motion.p 
          className="font-body text-2xl text-text-lavender mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }} // Added theme ease
        >
          A Selection of Heritage, Exclusively for You and Your Network.
        </motion.p>

        <motion.div 
          className="flex justify-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CTAButton>Explore Collections</CTAButton>
          <CTAButton className="bg-transparent border border-cta-copper text-cta-copper hover:bg-cta-copper/10">
            Become a Partner
          </CTAButton>
        </motion.div>

      </div>
    </div>
  );
}