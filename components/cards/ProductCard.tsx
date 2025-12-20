'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CTAButton from '@/components/ui/CTAButton'; // Corrected path to common

interface ProductCardProps {
  product: {
    id?: string;
    name: string;
    price: string;
    imagePlaceholder: string;
    slug?: string;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  // Generate slug from product name or use provided slug/id
  const productSlug = product.slug || product.id || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const productUrl = `/shop/${productSlug}`;

  return (
    <Link href={productUrl} className="block h-full">
      <motion.div
        className="
          bg-card-taupe rounded-soft-lg p-5 
          shadow-luxury-soft cursor-pointer
          transition-all duration-500 ease-luxury-ease
          group relative overflow-hidden
          h-full flex flex-col
        "
      // Entrance animation: Fade-in and slide up when scrolling into view
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} // Ensures animation runs once per load
      transition={{ 
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0] // The 'luxury-ease' cubic-bezier
      }}
      // Hover animations
      whileHover={{
        scale: 1.04,
        boxShadow: '0 25px 60px rgba(199, 90, 56, 0.45)', // Enhanced Copper glow
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Copper Glow Border (Neon Effect) - Triggered by group-hover */}
      <motion.div
        className="absolute inset-0 rounded-soft-lg pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          boxShadow:
            '0 0 25px rgba(199, 90, 56, 0.5), inset 0 0 20px rgba(199, 90, 56, 0.25)',
        }}
      />

      {/* Product Image */}
      <div className="aspect-square rounded-md overflow-hidden mb-4 bg-divider-silver">
        <img
          src={product.imagePlaceholder}
          alt={product.name}
          className="
            w-full h-full object-cover 
            transition-transform duration-500 group-hover:scale-110
          "
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/400x400/28242D/F0EAD6?text=Product' }}
        />
      </div>

      {/* Product Title */}
      <h3 className="font-body text-lg text-text-cream font-medium mb-2 line-clamp-2 min-h-[3rem]">
        {product.name}
      </h3>

      {/* Price */}
      <p className="font-body text-text-lavender mb-4">USD ${product.price}</p>

      {/* CTA Appears on Hover */}
      <motion.div
        className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <CTAButton className="w-full text-base">View Details</CTAButton>
      </motion.div>
    </motion.div>
    </Link>
  );
}