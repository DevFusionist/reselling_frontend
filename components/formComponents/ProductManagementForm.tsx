'use client';

import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import CTAButton from '@/components/ui/CTAButton';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { FaTag, FaDollarSign, FaBarcode, FaBoxOpen, FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import { apiClient } from '@/lib/api';

// Mock data structure for the product
interface ProductData {
  id?: string;
  name: string;
  retailPrice: number;
  resellerPrice: number;
  costPrice: number;
  inventory: number;
  description: string;
  imageUrls: string[]; // Still stores URLs, but now generated from upload
}

interface ProductFormProps {
  initialData?: ProductData;
  isNewProduct?: boolean;
}


// --- Main Product Form Component ---
export default function ProductForm({ initialData, isNewProduct = true }: ProductFormProps) {
  const defaultData: ProductData = {
    name: '',
    retailPrice: 0.00,
    resellerPrice: 0.00,
    costPrice: 0.00,
    inventory: 0,
    description: '',
    imageUrls: [], 
  };

  const [formData, setFormData] = useState<ProductData>(initialData || defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for upload process
  const [isDragOver, setIsDragOver] = useState(false); // New state for drag-and-drop visual
  
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const formTitle = isNewProduct ? 'Add New Curated Product' : `Edit Product: ${formData.name}`;
  const submitLabel = isNewProduct ? 'Create Product Listing' : 'Save Changes';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: (e.target.type === 'number' || id === 'inventory') ? parseFloat(value) : value,
    }));
  };
  
  // --- Image Upload Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUploadFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadFiles = (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    // Create blob URLs for preview (actual upload happens on form submit)
    const newUrls: string[] = files.map(file => URL.createObjectURL(file));
    
    // Store the files for later upload
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...newUrls],
    }));
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation check
    if (formData.imageUrls.length === 0) {
        alert("Please upload at least one product image.");
        return;
    }

    setIsLoading(true);
    
    try {
      // Convert image URLs to File objects if they're blob URLs
      const imageFiles: File[] = [];
      for (const url of formData.imageUrls) {
        if (url.startsWith('blob:')) {
          // Convert blob URL to File
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
          imageFiles.push(file);
        } else {
          // If it's already a URL, we'll need to fetch it or handle differently
          // For now, skip non-blob URLs in the upload
          console.warn('Skipping non-blob URL:', url);
        }
      }

      const productData = {
        title: formData.name,
        description: formData.description,
        base_price: formData.retailPrice,
        reseller_price: formData.resellerPrice,
        retail_price: formData.retailPrice,
        stock: formData.inventory,
      };

      let response;
      if (isNewProduct) {
        response = await apiClient.createProduct(productData, imageFiles.length > 0 ? imageFiles : undefined);
      } else {
        if (!formData.id) {
          throw new Error('Product ID is required for updates');
        }
        response = await apiClient.updateProduct(parseInt(formData.id), productData, imageFiles.length > 0 ? imageFiles : undefined);
      }

      if (response.success) {
        alert(`Successfully ${isNewProduct ? 'added' : 'updated'} ${formData.name}!`);
        if (isNewProduct) {
          setFormData(defaultData);
          // Reset file input
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      } else {
        throw new Error(response.message || 'Failed to save product');
      }
    } catch (error: any) {
      console.error('Error submitting product:', error);
      alert(error.message || 'Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Framer Motion variant for the card entrance
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] } 
    },
  };
  
  const profitMargin = (formData.retailPrice - formData.costPrice).toFixed(2);
  const resellerMargin = (formData.retailPrice - formData.resellerPrice).toFixed(2);
  const potentialGrossProfit = (formData.resellerPrice - formData.costPrice).toFixed(2);


  return (
    <div className="min-h-screen bg-base-navy font-body py-20 pt-32 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-card-taupe rounded-soft-lg shadow-luxury-soft p-8"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="font-headings text-4xl text-text-cream font-semibold mb-2">
          {formTitle}
        </h1>
        <p className="font-body text-md text-text-lavender mb-10 border-b border-divider-silver pb-4">
          Manage product details and critical pricing tiers for your hybrid model.
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* --- Section 1: Core Details --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <Input 
              label="Product Name" 
              id="name" 
              type="text" 
              icon={FaTag} 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Current Inventory Count" 
              id="inventory" 
              type="number" 
              icon={FaBoxOpen} 
              value={formData.inventory} 
              onChange={handleChange} 
              min="0" 
              required 
            />
          </div>
          
          <Textarea 
            label="Product Description (SEO Optimized)" 
            id="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />


          {/* --- Section 1.5: Image Management (Uploads) --- */}
          <h2 className="font-headings text-3xl text-text-cream font-semibold my-6 border-t border-divider-silver pt-6">
            Image Management
          </h2>
          <div className="p-4 bg-base-navy rounded-soft-lg mb-6">
            {/* Drag & Drop Area */}
            <motion.div
                className={`
                    w-full p-8 border-2 border-dashed rounded-soft-lg text-center cursor-pointer mb-4
                    transition-all duration-300
                    ${isDragOver ? 'border-cta-copper bg-cta-copper/10' : 'border-divider-silver hover:border-text-lavender'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                />
                <FaUpload className="mx-auto text-4xl text-text-lavender mb-3" />
                {isUploading ? (
                    <div className="flex items-center justify-center text-text-cream">
                        <FaSpinner className="animate-spin mr-2" /> Uploading...
                    </div>
                ) : (
                    <p className="font-body text-text-lavender">Drag & Drop images here, or <span className="text-cta-copper hover:underline">click to browse</span></p>
                )}
            </motion.div>

            {/* Display Current Images */}
            <div className="flex flex-wrap gap-4 pt-2">
                {formData.imageUrls.length > 0 ? (
                    formData.imageUrls.map((url, index) => (
                        <div key={url + index} className="relative w-24 h-24 rounded-soft-lg overflow-hidden border border-divider-silver group">
                            <img 
                                src={url} 
                                alt={`Product Image ${index + 1}`} 
                                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/100x100/A32D4C/F0EAD6?text=Broken' }}
                            />
                            <motion.button 
                                type="button"
                                onClick={() => handleRemoveImage(url)}
                                className="absolute inset-0 flex items-center justify-center bg-highlight-wine/80 text-text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                whileHover={{ scale: 1.1 }}
                                aria-label={`Remove image ${index + 1}`}
                            >
                                <FaTimes className="text-xl" />
                            </motion.button>
                            {/* Primary Image Label */}
                            {index === 0 && (
                                <span className="absolute top-1 left-1 bg-base-navy/70 text-text-lavender text-xs px-2 py-0.5 rounded">
                                    Primary
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-text-lavender/70">No images uploaded yet.</p>
                )}
            </div>
          </div>


          {/* --- Section 2: Pricing Tiers (Critical Hybrid Model Inputs) --- */}
          <h2 className="font-headings text-3xl text-text-cream font-semibold my-6 border-t border-divider-silver pt-6">
            Pricing & Margin Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
            {/* Cost Price */}
            <Input 
              label="Cost Price (Your Cost)" 
              id="costPrice" 
              type="number" 
              icon={FaDollarSign} 
              value={formData.costPrice} 
              onChange={handleChange} 
              min="0" step="0.01" 
              hint="The actual acquisition cost."
              required 
            />
            {/* Reseller Price (Wholesale) */}
            <Input 
              label="Reseller Price" 
              id="resellerPrice" 
              type="number" 
              icon={FaDollarSign} 
              value={formData.resellerPrice} 
              onChange={handleChange} 
              min="0" step="0.01"
              hint="The price paid by registered resellers."
              required 
            />
            {/* Retail Price (Public) */}
            <Input 
              label="Retail Price (Public)" 
              id="retailPrice" 
              type="number" 
              icon={FaDollarSign} 
              value={formData.retailPrice} 
              onChange={handleChange} 
              min="0" step="0.01"
              hint="The final price for direct customer purchase."
              required 
            />
          </div>

          {/* --- Section 3: Margin Summary --- */}
          <div className="mt-8 p-4 bg-base-navy rounded-soft-lg border border-divider-silver">
             <h3 className="font-headings text-xl text-text-cream mb-3">Profit Forecasts (Per Unit)</h3>
             <div className="grid grid-cols-3 text-sm font-body">
                <p className="text-text-lavender">Direct Profit (Retail - Cost):</p>
                <p className="text-text-lavender">Reseller Commission Potential (Retail - Reseller):</p>
                <p className="text-text-lavender">Reseller Gross Profit (Reseller - Cost):</p>
                
                <p className={`font-semibold ${parseFloat(profitMargin) > 0 ? 'text-green-500' : 'text-highlight-wine'}`}>${profitMargin}</p>
                <p className={`font-semibold ${parseFloat(resellerMargin) > 0 ? 'text-cta-copper' : 'text-highlight-wine'}`}>${resellerMargin}</p>
                <p className={`font-semibold ${parseFloat(potentialGrossProfit) > 0 ? 'text-green-500' : 'text-highlight-wine'}`}>${potentialGrossProfit}</p>
             </div>
          </div>
          

          {/* --- Submit Button --- */}
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CTAButton type="submit" className="w-full text-lg py-4" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    {isUploading ? 'Uploading Images...' : 'Saving Data...'}
                </div>
              ) : (
                submitLabel
              )}
            </CTAButton>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}