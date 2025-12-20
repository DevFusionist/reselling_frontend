'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import CTAButton from '@/components/ui/CTAButton';
import ShareLinkModal from '@/components/modals/ShareLinkModal';
import ProductCard from '@/components/cards/ProductCard';
import { FaShareAlt, FaTag, FaCheckCircle, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { apiClient, Product, ProductImage, Review, ReviewRatingStats } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useApiWithLoader } from '@/hooks/useApiWithLoader';
import { useLoading } from '@/contexts/LoadingContext';
import ReviewStats from '@/components/reviews/ReviewStats';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewRating from '@/components/reviews/ReviewRating';

// Helper function to get image URL from ProductImage (handles both 'url' and 'image_url')
const getImageUrl = (img: ProductImage): string => {
  return img.url || img.image_url || '';
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
  const { callWithLoader } = useApiWithLoader();
  const { isLoading } = useLoading();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>('description');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedImages, setRelatedImages] = useState<ProductImage[]>([]);
  const [showAddToCartAnimation, setShowAddToCartAnimation] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewRatingStats | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    color?: string;
    size?: string;
    material?: string;
    style?: string;
    fit?: string;
    pattern?: string;
  }>({});
  const { addItem } = useCart();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError(null);
        // Try to parse slug as product ID
        const productId = parseInt(params.slug);
        if (isNaN(productId)) {
          throw new Error('Invalid product ID');
        }

        const response = await callWithLoader(() => apiClient.getProduct(productId));
        if (response.success && response.data) {
          // API response structure: product fields directly on data, with images array
          const productData = response.data;
          const productImages = response.data.images || [];
          
          // Extract product (excluding images)
          const { images: _, ...product } = productData;
          setProduct(product as Product);
          setImages(productImages);
          
          // Reset selected attributes when product changes
          setSelectedAttributes({});
          
          // Set main image - use first image sorted by display_order, or fallback
          const sortedImages = productImages
            .sort((a, b) => a.display_order - b.display_order)
            .map((img) => getImageUrl(img))
            .filter((url) => url.length > 0);
          
          // Determine main image with proper fallback chain
          const firstImage = sortedImages[0] || 
            (productImages[0] ? getImageUrl(productImages[0]) : '') ||
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
      }
    };

    fetchProduct();
  }, [params.slug]);

  // Fetch reviews and stats
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product) return;
      
      try {
        const [reviewsResponse, statsResponse] = await Promise.all([
          callWithLoader(() => apiClient.getProductReviews(product.id)),
          callWithLoader(() => apiClient.getProductRatingStats(product.id)),
        ]);

        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }
        if (statsResponse.success && statsResponse.data) {
          setReviewStats(statsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    if (product) {
      fetchReviews();
    }
  }, [product]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      
      try {
        const response = await callWithLoader(() => 
          apiClient.getProducts({ 
            limit: 4, 
            page: 1,
            // Fetch related products from same category if available
          })
        );
        if (response.success && response.data) {
          // Filter out current product
          const filtered = (response.data.products || []).filter((p: Product) => p.id !== product.id);
          setRelatedProducts(filtered.slice(0, 4));
          setRelatedImages(response.data.images || []);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  // Update main image when selected attributes change
  useEffect(() => {
    if (images.length === 0) return;

    // Function to find matching image based on selected attributes
    const findMatchingImage = (attributes: typeof selectedAttributes): string | null => {
      // Find images that match the selected attributes
      const matchingImages = images.filter((img) => {
        const imgAttrs = img.attributes || {};
        let matches = true;

        if (attributes.color && imgAttrs.color !== attributes.color) matches = false;
        if (attributes.size && imgAttrs.size !== attributes.size) matches = false;
        if (attributes.material && imgAttrs.material !== attributes.material) matches = false;
        if (attributes.style && imgAttrs.style !== attributes.style) matches = false;
        if (attributes.fit && imgAttrs.fit !== attributes.fit) matches = false;
        if (attributes.pattern && imgAttrs.pattern !== attributes.pattern) matches = false;

        return matches;
      });

      // If we have matches, return the first one sorted by display_order
      if (matchingImages.length > 0) {
        const sorted = matchingImages.sort((a, b) => a.display_order - b.display_order);
        return getImageUrl(sorted[0]);
      }

      // If no exact match, try to find partial matches (prioritize color, then size)
      if (attributes.color) {
        const colorMatches = images.filter((img) => img.attributes?.color === attributes.color);
        if (colorMatches.length > 0) {
          const sorted = colorMatches.sort((a, b) => a.display_order - b.display_order);
          return getImageUrl(sorted[0]);
        }
      }

      if (attributes.size) {
        const sizeMatches = images.filter((img) => img.attributes?.size === attributes.size);
        if (sizeMatches.length > 0) {
          const sorted = sizeMatches.sort((a, b) => a.display_order - b.display_order);
          return getImageUrl(sorted[0]);
        }
      }

      return null;
    };

    const matchingImage = findMatchingImage(selectedAttributes);
    
    if (matchingImage) {
      setMainImage(matchingImage);
    } else {
      // Fallback to first image if no match
      const sortedImages = images
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => getImageUrl(img))
        .filter((url) => url.length > 0);
      
      if (sortedImages[0]) {
        setMainImage(sortedImages[0]);
      }
    }
  }, [selectedAttributes, images]);

  // Sync mainImage with images when they change (initial load)
  useEffect(() => {
    if (images.length > 0 && !mainImage) {
      const sortedImages = images
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => getImageUrl(img))
        .filter((url) => url.length > 0);
      
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
      .map((img) => getImageUrl(img));
    
    const imageUrl = sortedImages[0] || product.image_url || product.image_urls?.[0] || '';
    const price = typeof product.base_price === 'string' ? parseFloat(product.base_price) : product.base_price;
    
    // Add item without opening cart slider
    addItem({
      id: product.id,
      name: product.title,
      price: price,
      imagePlaceholder: imageUrl,
      slug: params.slug,
    }, false); // Don't open cart
    
    // Show animation feedback
    setShowAddToCartAnimation(true);
    setTimeout(() => {
      setShowAddToCartAnimation(false);
    }, 2000);
  };

  const handleOpenShareModal = () => {
    if (!isLoggedIn) {
      alert('Please login to generate share links');
      return;
    }
    setIsShareModalOpen(true);
  };

  const handleAttributeSelect = (type: 'color' | 'size' | 'material' | 'style' | 'fit' | 'pattern', value: string) => {
    setSelectedAttributes((prev) => {
      // Toggle selection: if already selected, deselect; otherwise select
      const newAttrs = { ...prev };
      if (newAttrs[type] === value) {
        delete newAttrs[type];
      } else {
        newAttrs[type] = value;
      }
      return newAttrs;
    });
  };

  const handleCreateShareLink = async (data: {
    product_id: number;
    margin_amount: number;
    expires_in_days?: number;
  }) => {
    const response = await callWithLoader(() => apiClient.createShareLink(data));
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to generate share link');
    }
    return response.data;
  };

  if (isLoading) {
    return null; // Global loader handles this
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
    .map((img) => getImageUrl(img))
    .filter((url) => url.length > 0);
  
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
              
              {/* Review Summary */}
              {reviewStats && reviewStats.total_reviews > 0 && (
                <motion.div className="flex items-center space-x-2 mb-6" variants={itemVariants}>
                  <ReviewRating rating={reviewStats.average_rating} size="sm" showValue={false} />
                  <span className="text-text-lavender text-sm">
                    ({reviewStats.average_rating.toFixed(1)}) {reviewStats.total_reviews} {reviewStats.total_reviews === 1 ? 'review' : 'reviews'}
                  </span>
                </motion.div>
              )}
              
              {/* Available Attributes/Options */}
              {(product.brands?.length || product.colors?.length || product.sizes?.length || 
                product.materials?.length || product.styles?.length || product.fits?.length || 
                product.patterns?.length || product.model) && (
                <motion.div 
                  className="mb-6 p-4 bg-card-taupe rounded-soft-lg border border-divider-silver"
                  variants={itemVariants}
                >
                  <h3 className="font-headings text-lg text-text-cream font-semibold mb-4">Available Options</h3>
                  <div className="space-y-3">
                    {product.model && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Model:</span>
                        <span className="font-body text-text-cream">{product.model}</span>
                      </div>
                    )}
                    {product.brands && product.brands.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Brands:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.brands.map((brand, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-base-navy text-text-cream rounded-md text-sm border border-divider-silver"
                            >
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Colors:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color, idx) => {
                            const isSelected = selectedAttributes.color === color;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAttributeSelect('color', color)}
                                className={`
                                  px-3 py-1 rounded-md text-sm border transition-all duration-200 cursor-pointer
                                  ${isSelected 
                                    ? 'bg-cta-copper text-text-cream border-cta-copper shadow-lavender-glow' 
                                    : 'bg-base-navy text-text-cream border-divider-silver hover:border-cta-copper hover:bg-card-taupe'
                                  }
                                `}
                              >
                                {color}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Sizes:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size, idx) => {
                            const isSelected = selectedAttributes.size === size;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAttributeSelect('size', size)}
                                className={`
                                  px-3 py-1 rounded-md text-sm border transition-all duration-200 cursor-pointer
                                  ${isSelected 
                                    ? 'bg-cta-copper text-text-cream border-cta-copper shadow-lavender-glow' 
                                    : 'bg-base-navy text-text-cream border-divider-silver hover:border-cta-copper hover:bg-card-taupe'
                                  }
                                `}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {product.materials && product.materials.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Materials:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.materials.map((material, idx) => {
                            const isSelected = selectedAttributes.material === material;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAttributeSelect('material', material)}
                                className={`
                                  px-3 py-1 rounded-md text-sm border transition-all duration-200 cursor-pointer
                                  ${isSelected 
                                    ? 'bg-cta-copper text-text-cream border-cta-copper shadow-lavender-glow' 
                                    : 'bg-base-navy text-text-cream border-divider-silver hover:border-cta-copper hover:bg-card-taupe'
                                  }
                                `}
                              >
                                {material}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {product.styles && product.styles.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Styles:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.styles.map((style, idx) => {
                            const isSelected = selectedAttributes.style === style;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAttributeSelect('style', style)}
                                className={`
                                  px-3 py-1 rounded-md text-sm border transition-all duration-200 cursor-pointer
                                  ${isSelected 
                                    ? 'bg-cta-copper text-text-cream border-cta-copper shadow-lavender-glow' 
                                    : 'bg-base-navy text-text-cream border-divider-silver hover:border-cta-copper hover:bg-card-taupe'
                                  }
                                `}
                              >
                                {style}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {product.fits && product.fits.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Fits:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.fits.map((fit, idx) => {
                            const isSelected = selectedAttributes.fit === fit;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAttributeSelect('fit', fit)}
                                className={`
                                  px-3 py-1 rounded-md text-sm border transition-all duration-200 cursor-pointer
                                  ${isSelected 
                                    ? 'bg-cta-copper text-text-cream border-cta-copper shadow-lavender-glow' 
                                    : 'bg-base-navy text-text-cream border-divider-silver hover:border-cta-copper hover:bg-card-taupe'
                                  }
                                `}
                              >
                                {fit}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {product.patterns && product.patterns.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-body text-text-lavender min-w-[100px]">Patterns:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.patterns.map((pattern, idx) => {
                            const isSelected = selectedAttributes.pattern === pattern;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAttributeSelect('pattern', pattern)}
                                className={`
                                  px-3 py-1 rounded-md text-sm border transition-all duration-200 cursor-pointer
                                  ${isSelected 
                                    ? 'bg-cta-copper text-text-cream border-cta-copper shadow-lavender-glow' 
                                    : 'bg-base-navy text-text-cream border-divider-silver hover:border-cta-copper hover:bg-card-taupe'
                                  }
                                `}
                              >
                                {pattern}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Stock Status with urgency */}
              {product.stock > 0 && product.stock < 5 && (
                <motion.div 
                  className="mb-4 p-3 bg-highlight-wine/20 border border-highlight-wine rounded-lg"
                  variants={itemVariants}
                >
                  <p className="text-highlight-wine text-sm font-medium">
                    Only {product.stock} left in stock!
                  </p>
                </motion.div>
              )}
              
              {/* --- Primary Purchase CTA - Large and Prominent --- */}
              <motion.div variants={itemVariants} className="mb-6 relative">
                  <CTAButton 
                    className="w-full text-xl py-5 font-bold relative overflow-hidden" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <motion.span
                      animate={showAddToCartAnimation ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </motion.span>
                  </CTAButton>
                  
                  {/* Success Animation Toast */}
                  <AnimatePresence>
                    {showAddToCartAnimation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-cta-copper text-text-cream rounded-lg p-4 shadow-lg z-50 flex items-center justify-center space-x-2"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        >
                          <FaCheckCircle className="text-xl" />
                        </motion.div>
                        <span className="font-body font-semibold">Item added to cart!</span>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center space-x-1"
                        >
                          <FaShoppingCart />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </motion.div>
              
              {/* --- Reseller Link Explainer Box --- */}
              {(isLoggedIn && (user?.role === 'reseller' || user?.role === 'admin')) && (
                <ResellerExplainerBox product={product} onGenerateLink={handleOpenShareModal} />
              )}
            </div>
          </div>

          {/* Below the Fold - Tabbed Information */}
          <motion.div className="mt-16" variants={itemVariants}>
            {/* Tabs */}
            <div className="border-b border-divider-silver mb-8">
              <div className="flex space-x-8">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'specifications', label: 'Specifications / Dimensions' },
                  { id: 'shipping', label: 'Shipping & Returns' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      pb-4 px-2 font-body font-medium text-sm border-b-2 transition-colors
                      ${
                        activeTab === tab.id
                          ? 'border-cta-copper text-cta-copper'
                          : 'border-transparent text-text-lavender hover:text-text-cream'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="font-body text-text-lavender leading-relaxed text-lg">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  {product.sku && (
                    <div className="flex justify-between py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender">SKU</span>
                      <span className="font-body text-text-cream">{product.sku}</span>
                    </div>
                  )}
                  {product.model && (
                    <div className="flex justify-between py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender">Model</span>
                      <span className="font-body text-text-cream">{product.model}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender">Category</span>
                      <span className="font-body text-text-cream">{product.category}</span>
                    </div>
                  )}
                  {product.sub_category && (
                    <div className="flex justify-between py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender">Sub Category</span>
                      <span className="font-body text-text-cream">{product.sub_category}</span>
                    </div>
                  )}
                  {product.brands && product.brands.length > 0 && (
                    <div className="py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender block mb-2">Brands</span>
                      <div className="flex flex-wrap gap-2">
                        {product.brands.map((brand, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-card-taupe text-text-cream rounded-md text-sm border border-divider-silver"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender block mb-2">Available Colors</span>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-card-taupe text-text-cream rounded-md text-sm border border-divider-silver"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender block mb-2">Available Sizes</span>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-card-taupe text-text-cream rounded-md text-sm border border-divider-silver"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.materials && product.materials.length > 0 && (
                    <div className="py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender block mb-2">Materials</span>
                      <div className="flex flex-wrap gap-2">
                        {product.materials.map((material, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-card-taupe text-text-cream rounded-md text-sm border border-divider-silver"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.styles && product.styles.length > 0 && (
                    <div className="py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender block mb-2">Styles</span>
                      <div className="flex flex-wrap gap-2">
                        {product.styles.map((style, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-card-taupe text-text-cream rounded-md text-sm border border-divider-silver"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.fits && product.fits.length > 0 && (
                    <div className="py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender block mb-2">Fits</span>
                      <div className="flex flex-wrap gap-2">
                        {product.fits.map((fit, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-card-taupe text-text-cream rounded-md text-sm border border-divider-silver"
                          >
                            {fit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.patterns && product.patterns.length > 0 && (
                    <div className="py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender block mb-2">Patterns</span>
                      <div className="flex flex-wrap gap-2">
                        {product.patterns.map((pattern, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-card-taupe text-text-cream rounded-md text-sm border border-divider-silver"
                          >
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-divider-silver">
                    <span className="font-body text-text-lavender">Stock</span>
                    <span className="font-body text-text-cream">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-divider-silver">
                    <span className="font-body text-text-lavender">Base Price</span>
                    <span className="font-body text-text-cream">USD ${formattedPrice}</span>
                  </div>
                  {product.reseller_price && (
                    <div className="flex justify-between py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender">Reseller Price</span>
                      <span className="font-body text-text-cream">
                        USD ${typeof product.reseller_price === 'string' 
                          ? parseFloat(product.reseller_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : product.reseller_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {product.retail_price && (
                    <div className="flex justify-between py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender">Retail Price</span>
                      <span className="font-body text-text-cream">
                        USD ${typeof product.retail_price === 'string' 
                          ? parseFloat(product.retail_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : product.retail_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {product.isFeatured !== undefined && (
                    <div className="flex justify-between py-3 border-b border-divider-silver">
                      <span className="font-body text-text-lavender">Featured</span>
                      <span className="font-body text-text-cream">{product.isFeatured ? 'Yes' : 'No'}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-headings text-xl text-text-cream mb-3">Shipping</h3>
                    <ul className="space-y-2 text-text-lavender">
                      <li>• Free shipping on orders over $50</li>
                      <li>• Standard shipping: 5-7 business days</li>
                      <li>• Express shipping: 2-3 business days (additional fee)</li>
                      <li>• International shipping available</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-headings text-xl text-text-cream mb-3">Returns</h3>
                    <ul className="space-y-2 text-text-lavender">
                      <li>• 30-day return policy</li>
                      <li>• Items must be in original condition</li>
                      <li>• Free returns for defective items</li>
                      <li>• Contact support for return authorization</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Cross-Sells Section */}
          {relatedProducts.length > 0 && (
            <motion.div className="mt-16" variants={itemVariants}>
              <h2 className="font-headings text-3xl text-text-cream mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedProductImages = relatedImages
                    .filter((img) => img.product_id === relatedProduct.id)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((img) => getImageUrl(img))
                    .filter((url) => url.length > 0);

                  const imageUrl =
                    relatedProductImages[0] ||
                    relatedProduct.image_url ||
                    relatedProduct.image_urls?.[0] ||
                    'https://placehold.co/400x400/28242D/F0EAD6?text=Product';

                  const price = typeof relatedProduct.base_price === 'string'
                    ? parseFloat(relatedProduct.base_price)
                    : relatedProduct.base_price;

                  return (
                    <ProductCard
                      key={relatedProduct.id}
                      product={{
                        id: relatedProduct.id.toString(),
                        name: relatedProduct.title,
                        price: price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        imagePlaceholder: imageUrl,
                        slug: relatedProduct.id.toString(),
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Reviews Section */}
          <motion.div className="mt-16" variants={itemVariants}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headings text-3xl text-text-cream">Customer Reviews</h2>
              {isLoggedIn && !showReviewForm && (
                <CTAButton
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-2"
                >
                  Write a Review
                </CTAButton>
              )}
            </div>

            {/* Review Stats */}
            {reviewStats && reviewStats.total_reviews > 0 && (
              <div className="mb-8">
                <ReviewStats stats={reviewStats} />
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm
                  productId={product.id}
                  onSuccess={async () => {
                    setShowReviewForm(false);
                    // Refresh reviews and stats
                    const [reviewsResponse, statsResponse] = await Promise.all([
                      callWithLoader(() => apiClient.getProductReviews(product.id)),
                      callWithLoader(() => apiClient.getProductRatingStats(product.id)),
                    ]);
                    if (reviewsResponse.success && reviewsResponse.data) {
                      setReviews(reviewsResponse.data);
                    }
                    if (statsResponse.success && statsResponse.data) {
                      setReviewStats(statsResponse.data);
                    }
                  }}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {/* Review List */}
            <ReviewList
              reviews={reviews}
              onReviewDeleted={async () => {
                // Refresh reviews and stats after deletion
                const [reviewsResponse, statsResponse] = await Promise.all([
                  callWithLoader(() => apiClient.getProductReviews(product.id)),
                  callWithLoader(() => apiClient.getProductRatingStats(product.id)),
                ]);
                if (reviewsResponse.success && reviewsResponse.data) {
                  setReviews(reviewsResponse.data);
                }
                if (statsResponse.success && statsResponse.data) {
                  setReviewStats(statsResponse.data);
                }
              }}
            />
          </motion.div>
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

