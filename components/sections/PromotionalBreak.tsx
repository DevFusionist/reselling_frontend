'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CTAButton from '@/components/ui/CTAButton';

interface PromotionalBreakProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

export default function PromotionalBreak({ 
  title, 
  subtitle, 
  ctaText = 'Shop Now', 
  ctaLink = '/shop',
  imageUrl 
}: PromotionalBreakProps) {
  return (
    <section className="py-12 bg-base-navy">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="relative rounded-lg overflow-hidden bg-card-taupe"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {imageUrl && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/1200x400/28242D/F0EAD6?text=Promotion';
                }}
              />
            </div>
          )}
          <div className="relative z-10 p-12 text-center">
            <h2 className="font-headings text-4xl md:text-5xl text-text-cream mb-4 font-bold">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body text-xl text-text-lavender mb-8 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            <Link href={ctaLink}>
              <CTAButton className="text-lg px-8 py-3">
                {ctaText} →
              </CTAButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

