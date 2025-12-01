'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function LuxuryStatement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Text moves slower than the page scroll, creating a floating effect
  const yText = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]); 

  return (
    <div 
      ref={ref} 
      className="bg-card-taupe py-20 md:py-32 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.p 
          style={{ y: yText }}
          className="font-headings text-4xl sm:text-5xl lg:text-7xl italic text-text-lavender font-light tracking-tight"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          "Craftsmanship speaks in silence, elegance endures the fleeting."
        </motion.p>
      </div>

      {/* Subtle Divider Line */}
      <div className="absolute bottom-0 left-1/2 w-1/4 h-[1px] bg-divider-silver transform -translate-x-1/2"></div>
    </div>
  );
}