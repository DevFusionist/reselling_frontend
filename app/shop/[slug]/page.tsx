'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Link from 'next/link';
import CTAButton from '@/components/ui/CTAButton';
import { FaShareAlt, FaTag, FaCheckCircle, FaStar } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

// Mock Product Data (Example: The Nocturne Lumina Desk Globe)
const mockProduct = {
  id: 'nocturne-globe',
  name: 'Nocturne Lumina Desk Globe',
  price: '9,800.00',
  sku: 'NOCT-LUM-001',
  description: "A meticulously crafted, oversized desk globe featuring continents rendered in polished obsidian, oceans in deep, swirling sapphire resin, and major cities marked by subtle, inlaid mother-of-pearl. It rests on a brushed brass armature and a sculpted, dark walnut base. The soft, internal LED luminescence is adjustable, ensuring an ethereal glow that complements any executive space.",
  features: [
    'Hand-polished Obsidian Continents',
    'Sapphire Resin Oceans with Depth Effect',
    'Brushed Brass Armature and Walnut Base',
    'Dimmable Internal LED Luminescence',
  ],
  images: [
    'https://placehold.co/800x800/28242D/F0EAD6?text=Main+Globe',
    'https://placehold.co/800x800/28242D/F0EAD6?text=Globe+Detail+1',
    'https://placehold.co/800x800/28242D/F0EAD6?text=Globe+Detail+2',
    'https://placehold.co/800x800/28242D/F0EAD6?text=Globe+Detail+3',
  ],
  resellerPrice: '7,500.00',
};

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] } },
};

// Component for the Reseller/Affiliate Section (Explainer Box)
const ResellerExplainerBox: React.FC = () => {
    // In a real application, margin calculation would be dynamic
    const potentialMargin = (parseFloat(mockProduct.price.replace(',', '')) - parseFloat(mockProduct.resellerPrice.replace(',', ''))).toFixed(2);
    
    return (
        <motion.div 
            className="bg-card-taupe p-6 rounded-soft-lg border border-divider-silver mt-8 shadow-inner"
            variants={itemVariants}
        >
            <div className="flex items-center mb-4">
                <FaTag className="text-cta-copper mr-3 text-2xl" />
                <h3 className="font-headings text-2xl text-text-cream font-semibold">Zenith Partnership Access</h3>
            </div>
            
            <p className="font-body text-text-lavender text-sm mb-4">
                As an approved partner, you access this item at a preferred rate of 
                <span className="text-text-cream font-medium"> USD ${mockProduct.resellerPrice}</span>. 
                This allows a potential earning margin of 
                <span className="text-cta-copper font-medium"> USD ${potentialMargin}</span> per direct sale.
            </p>
            <CTAButton className="w-full text-base bg-transparent border border-text-lavender text-text-lavender hover:bg-text-lavender/10">
                <FaShareAlt className="mr-2" />
                Generate Shareable Link
            </CTAButton>
        </motion.div>
    );
};

// Main PDP Component
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [mainImage, setMainImage] = useState(mockProduct.images[0]);
  const { addItem } = useCart();

  // Dynamic page title (Cormorant Garamond)
  const PageTitle = `${mockProduct.name}`;

  const handleAddToCart = () => {
    // Generate a numeric ID from the slug or use a hash
    const numericId = params.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    addItem({
      id: numericId,
      name: mockProduct.name,
      price: parseFloat(mockProduct.price.replace(',', '')),
      imagePlaceholder: mockProduct.images[0],
      slug: params.slug,
    });
  };

  // Note: Structured data is now handled in layout.tsx (server component) for better SEO
  // This ensures search engines can see it in the initial HTML

  return (
    <div className="min-h-screen bg-base-navy font-body py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb / Navigation */}
          <motion.p className="text-text-lavender mb-6 text-sm" variants={itemVariants}>
            <Link href="/shop" className="hover:text-cta-copper transition-colors">Shop</Link> / {PageTitle}
          </motion.p>

          {/* --- Main Product Grid --- */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-20">
            
            {/* --- Column 1: Image Gallery --- */}
            <motion.div className="mb-10 lg:mb-0" variants={itemVariants}>
              {/* Main Image View */}
              <div className="aspect-square rounded-soft-lg overflow-hidden mb-6 shadow-luxury-soft">
                <img 
                  src={mainImage} 
                  alt={mockProduct.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {mockProduct.images.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img}
                    alt={`${mockProduct.name} - View ${index + 1}`}
                    className={`
                      w-24 h-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-300
                      ${mainImage === img ? 'border-cta-copper shadow-lavender-glow' : 'border-divider-silver hover:border-text-lavender'}
                    `}
                    onClick={() => setMainImage(img)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* --- Column 2: Details & Actions --- */}
            <div className="flex flex-col">
              
              <motion.h1 
                className="font-headings text-5xl text-text-cream font-semibold mb-4"
                variants={itemVariants}
              >
                {PageTitle}
              </motion.h1>
              {/* Price (Copper Accent) */}
              <motion.p 
                className="font-body text-3xl font-bold text-cta-copper mb-6"
                variants={itemVariants}
              >
                USD ${mockProduct.price}
              </motion.p>
              
              {/* Features/Trust Badges */}
              <motion.div className="flex items-center space-x-4 text-sm mb-8" variants={itemVariants}>
                  <span className="flex items-center text-text-lavender"><FaCheckCircle className="text-green-500 mr-2"/> In Stock</span>
                  <span className="flex items-center text-text-lavender"><FaStar className="text-text-cream mr-2"/> 4.8 / 5.0 (12 Reviews)</span>
              </motion.div>
              {/* Description (Rich Text) */}
              <motion.p 
                className="font-body text-text-lavender leading-relaxed mb-8"
                variants={itemVariants}
              >
                {mockProduct.description}
              </motion.p>
              {/* Product Features List */}
              <motion.ul className="mb-10 space-y-3" variants={itemVariants}>
                  {mockProduct.features.map((feature, index) => (
                      <li key={index} className="font-body text-text-cream flex items-start">
                          <span className="text-cta-copper mr-3 mt-1">•</span> {feature}
                      </li>
                  ))}
              </motion.ul>
              {/* --- Primary Purchase CTA --- */}
              <motion.div variants={itemVariants}>
                  <CTAButton className="w-full text-lg py-4" onClick={handleAddToCart}>
                    Add to Collection (Buy Now)
                  </CTAButton>
              </motion.div>
              {/* --- Reseller Link Explainer Box --- */}
              <ResellerExplainerBox />
            </div>
          </div>
        </motion.div>
      </div>
  );
}

