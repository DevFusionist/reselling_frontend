"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CTAButton from "@/components/ui/CTAButton";
import { FaCheckCircle } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

// ---------------------------------------
// MOTION VARIANTS
// ---------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ---------------------------------------
// PAGE
// ---------------------------------------
const ShareProductPage = ({ params }: { params: { code: string } }) => {
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  const productCode = params.code;

  // Fetch product by share link code
  const fetchProductDetails = async () => {
    try {
      const res = await apiClient.fetchProductDataByShareLinkCode(productCode);
      if (res.success && res.data) {
        const p = res.data.product;

        const sortedImages = p.productImages
          ?.sort((a: any, b: any) => a.display_order - b.display_order)
          ?.map((img: any) => img.image_url) || [];

        setProduct(p);
        setImages(sortedImages);
        setMainImage(sortedImages[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.title,
      price: parseFloat(product.base_price),
      imagePlaceholder: mainImage,
      slug: product.id.toString(),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-navy font-body py-20 flex items-center justify-center">
        <p className="text-text-lavender text-xl">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-base-navy font-body py-20 flex items-center justify-center">
        <p className="text-highlight-wine text-xl">Invalid or expired link</p>
      </div>
    );
  }

  const price = parseFloat(product.base_price);

  return (
    <div className="min-h-screen bg-base-navy font-body py-20">
      <motion.div
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Breadcrumb */}
        <motion.p className="text-text-lavender mb-6 text-sm" variants={itemVariants}>
          <Link href="/shop" className="hover:text-cta-copper">Shop</Link> /
          Shared Product
        </motion.p>

        <div className="lg:grid lg:grid-cols-2 lg:gap-20">
          {/* IMAGE SECTION */}
          <motion.div className="mb-10 lg:mb-0" variants={itemVariants}>
            <div className="aspect-square rounded-soft-lg overflow-hidden mb-6 shadow-luxury-soft bg-base-navy">
              <img
                src={mainImage}
                className="w-full h-full object-cover"
                alt={product.title}
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <motion.img
                  key={index}
                  src={img}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-300 ${
                    mainImage === img
                      ? "border-cta-copper shadow-lavender-glow"
                      : "border-divider-silver hover:border-text-lavender"
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </motion.div>

          {/* DETAILS SECTION */}
          <div>
            <motion.h1
              className="font-headings text-5xl text-text-cream font-semibold mb-4"
              variants={itemVariants}
            >
              {product.title}
            </motion.h1>

            {product.sku && (
              <motion.p className="text-sm text-text-lavender mb-2" variants={itemVariants}>
                SKU: {product.sku}
              </motion.p>
            )}

            <motion.p
              className="text-3xl font-bold text-cta-copper mb-6"
              variants={itemVariants}
            >
              USD ${price.toLocaleString()}
            </motion.p>

            {/* STOCK - Shared link might NOT include stock, just display Available */}
            <motion.div className="flex items-center space-x-4 text-sm mb-8" variants={itemVariants}>
              <span className="flex items-center text-text-lavender">
                <FaCheckCircle className="text-green-500 mr-2" />
                Available
              </span>
            </motion.div>

            {/* DESCRIPTION */}
            <motion.p
              className="text-text-lavender leading-relaxed mb-8"
              variants={itemVariants}
            >
              {product.description}
            </motion.p>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <CTAButton className="w-full text-lg py-4" onClick={handleAddToCart}>
                Add to Collection (Buy Now)
              </CTAButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareProductPage;
