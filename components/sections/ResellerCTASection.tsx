'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import CTAButton from '@/components/ui/CTAButton'; // Assuming common path for CTAButton

export default function ResellerCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Background moves slightly slower than foreground content
  const yBackground = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]); 

  return (
    <div ref={ref} className="relative h-[60vh] overflow-hidden">
      
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        // Placeholder for an abstract luxury background or texture
        style={{ 
          y: yBackground, 
          backgroundImage: 'url(https://placehold.co/1920x800/28242D/454A56?text=Warm+Taupe+Texture)' 
        }}
      >
        {/* Soft dark overlay */}
        <div className="absolute inset-0 bg-base-navy/70"></div>
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-5xl mx-auto px-6 text-center">
        <motion.h2 
          className="font-headings text-6xl text-text-cream mb-4 font-bold"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          Elevate Your Enterprise
        </motion.h2>
        <motion.p 
          className="font-body text-xl text-text-lavender mb-10 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          Access exclusive reseller pricing, set custom margins, and build a lasting network on the world's most elegant platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CTAButton>Join the Zenith Partnership</CTAButton>
        </motion.div>
      </div>
    </div>
  );
}