'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CTAButton from '@/components/ui/CTAButton';
import ShareLinkModal from '@/components/modals/ShareLinkModal';
import { FaShareAlt, FaTag, FaCheckCircle, FaStar } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { apiClient, Product, ProductImage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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
const ResellerExplainerBox: React.FC<{ product: Product; onGenerateLink: () => void }> = ({ product, onGenerateLink }) => {
    // Use reseller_price from API if available, otherwise calculate
    const basePrice = typeof product.base_price === 'string' ? parseFloat(product.base_price) : product.base_price;
    const resellerPriceValue = product.reseller_price 
      ? (typeof product.reseller_price === 'string' ? parseFloat(product.reseller_price) : product.reseller_price)
      : basePrice * 0.8; // Fallback to 20% discount if not provided
    const potentialMargin = (basePrice - resellerPriceValue).toFixed(2);
    
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
                <span className="text-text-cream font-medium"> USD ${resellerPriceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>. 
                This allows a potential earning margin of 
                <span className="text-cta-copper font-medium"> USD ${potentialMargin}</span> per direct sale.
            </p>
            <CTAButton 
                className="w-full text-base bg-transparent border border-text-lavender text-text-lavender hover:bg-text-lavender/10"
                onClick={onGenerateLink}
            >
                <FaShareAlt className="mr-2" />
                Generate Shareable Link
            </CTAButton>
        </motion.div>
    );
};

// Main PDP Component
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { addItem } = useCart();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // Try to parse slug as product ID
        const productId = parseInt(params.slug);
        if (isNaN(productId)) {
          throw new Error('Invalid product ID');
        }

        const response = await apiClient.getProduct(productId);
        if (response.success && response.data) {
          // API response structure: product fields directly on data, with images array
          const productData = response.data;
          const productImages = response.data.images || [];
          
          // Extract product (excluding images)
          const { images: _, ...product } = productData;
          setProduct(product as Product);
          setImages(productImages);
          
          // Set main image - use first image sorted by display_order, or fallback
          const sortedImages = productImages
            .sort((a, b) => a.display_order - b.display_order)
            .map((img) => img.image_url);
          
          // Determine main image with proper fallback chain
          const firstImage = sortedImages[0] || 
            productImages[0]?.image_url ||
            productData.image_url ||
            productData.image_urls?.[0] ||
            'https://placehold.co/800x800/28242D/F0EAD6?text=Product';
          
          setMainImage(firstImage);
        } else {
          setError(response.message || 'Product not found');
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  // Sync mainImage with images when they change
  useEffect(() => {
    if (images.length > 0 && !mainImage) {
      const sortedImages = images
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.image_url);
      
      if (sortedImages[0]) {
        setMainImage(sortedImages[0]);
      }
    }
  }, [images, mainImage]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Get the first image sorted by display_order
    const sortedImages = images
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => img.image_url);
    
    const imageUrl = sortedImages[0] || product.image_url || product.image_urls?.[0] || '';
    const price = typeof product.base_price === 'string' ? parseFloat(product.base_price) : product.base_price;
    
    addItem({
      id: product.id,
      name: product.title,
      price: price,
      imagePlaceholder: imageUrl,
      slug: params.slug,
    });
  };

  const handleOpenShareModal = () => {
    if (!isLoggedIn) {
      alert('Please login to generate share links');
      return;
    }
    setIsShareModalOpen(true);
  };

  const handleCreateShareLink = async (data: {
    product_id: number;
    margin_amount: number;
    expires_in_days?: number;
  }) => {
    const response = await apiClient.createShareLink(data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to generate share link');
    }
    return response.data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-navy font-body py-20 flex items-center justify-center">
        <p className="font-body text-text-lavender text-xl">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-navy font-body py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-highlight-wine text-xl mb-4">{error || 'Product not found'}</p>
          <Link href="/shop" className="text-cta-copper hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  // Get images sorted by display_order, with fallback
  const productImages = images
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => img.image_url);
  
  const allImages = productImages.length > 0 
    ? productImages 
    : (product.image_url ? [product.image_url] : product.image_urls || ['https://placehold.co/800x800/28242D/F0EAD6?text=Product']);
  
  // Ensure mainImage is set from allImages if it's empty
  const displayMainImage = mainImage || allImages[0] || 'https://placehold.co/800x800/28242D/F0EAD6?text=Product';
  
  // Handle base_price as string or number
  const price = typeof product.base_price === 'string' ? parseFloat(product.base_price) : product.base_price;
  const formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
            <Link href="/shop" className="hover:text-cta-copper transition-colors">Shop</Link> / {product.title}
          </motion.p>

          {/* --- Main Product Grid --- */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-20">
            
            {/* --- Column 1: Image Gallery --- */}
            <motion.div className="mb-10 lg:mb-0" variants={itemVariants}>
              {/* Main Image View */}
              <div className="aspect-square rounded-soft-lg overflow-hidden mb-6 shadow-luxury-soft bg-base-navy">
                <img 
                  src={displayMainImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <motion.img
                      key={index}
                      src={img}
                      alt={`${product.title} - View ${index + 1}`}
                      className={`
                        w-24 h-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-300
                        ${displayMainImage === img ? 'border-cta-copper shadow-lavender-glow' : 'border-divider-silver hover:border-text-lavender'}
                      `}
                      onClick={() => {
                        setMainImage(img);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/100x100/28242D/F0EAD6?text=Image'; }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* --- Column 2: Details & Actions --- */}
            <div className="flex flex-col">
              
              <motion.h1 
                className="font-headings text-5xl text-text-cream font-semibold mb-4"
                variants={itemVariants}
              >
                {product.title}
              </motion.h1>
              
              {/* SKU */}
              {product.sku && (
                <motion.p className="font-body text-sm text-text-lavender mb-2" variants={itemVariants}>
                  SKU: {product.sku}
                </motion.p>
              )}
              
              {/* Price (Copper Accent) */}
              <motion.p 
                className="font-body text-3xl font-bold text-cta-copper mb-6"
                variants={itemVariants}
              >
                USD ${formattedPrice}
              </motion.p>
              
              {/* Features/Trust Badges */}
              <motion.div className="flex items-center space-x-4 text-sm mb-8" variants={itemVariants}>
                  <span className={`flex items-center text-text-lavender`}>
                    <FaCheckCircle className={`${product.stock > 0 ? 'text-green-500' : 'text-highlight-wine'} mr-2`}/> 
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.stock > 0 && (
                    <span className="flex items-center text-text-lavender">
                      {product.stock} available
                    </span>
                  )}
              </motion.div>
              
              {/* Description (Rich Text) */}
              {product.description && (
                <motion.p 
                  className="font-body text-text-lavender leading-relaxed mb-8"
                  variants={itemVariants}
                >
                  {product.description}
                </motion.p>
              )}
              
              {/* --- Primary Purchase CTA --- */}
              <motion.div variants={itemVariants}>
                  <CTAButton 
                    className="w-full text-lg py-4" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Add to Collection (Buy Now)' : 'Out of Stock'}
                  </CTAButton>
              </motion.div>
              
              {/* --- Reseller Link Explainer Box --- */}
              {(isLoggedIn && (user?.role === 'reseller' || user?.role === 'admin')) && (
                <ResellerExplainerBox product={product} onGenerateLink={handleOpenShareModal} />
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Share Link Modal */}
        {product && (
          <ShareLinkModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            productId={product.id}
            onSubmit={handleCreateShareLink}
          />
        )}
      </div>
  );
}

