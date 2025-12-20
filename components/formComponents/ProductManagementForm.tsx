'use client';

import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import CTAButton from '@/components/ui/CTAButton';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { FaTag, FaDollarSign, FaBoxOpen, FaTimes, FaUpload } from 'react-icons/fa';
import { apiClient,  ProductImage } from '@/lib/api';
import { useApiWithLoader } from '@/hooks/useApiWithLoader';
import { useEffect } from 'react';
import Combobox from '@/components/ui/Combobox';

// Image with attributes structure
interface ImageWithAttributes {
  url: string;
  attributes: {
    color?: string[];
    size?: string[];
    material?: string[];
    style?: string[];
    fit?: string[];
    pattern?: string[];
  };
}

// Product data structure with arrays for multi-value attributes
interface ProductData {
  id?: string;
  name: string;
  retailPrice: number;
  resellerPrice: number;
  costPrice: number;
  inventory: number;
  description: string;
  images: ImageWithAttributes[]; // Images with their assigned attributes
  category?: string;
  sub_category?: string;
  brands?: string[]; // Array for multiple brands
  model?: string;
  colors?: string[]; // Array for multiple colors
  sizes?: string[]; // Array for multiple sizes
  materials?: string[]; // Array for multiple materials
  styles?: string[]; // Array for multiple styles
  fits?: string[]; // Array for multiple fits
  patterns?: string[]; // Array for multiple patterns
}

interface Attribute {
  id: number;
  name: string;
  category_id?: number;
  category_name?: string;
}

interface ProductFormProps {
  initialData?: ProductData;
  isNewProduct?: boolean;
  productId?: number;
  onSuccess?: () => void;
}


// --- Main Product Form Component ---
export default function ProductForm({ initialData, isNewProduct = true, productId, onSuccess }: ProductFormProps) {
  const { callWithLoader } = useApiWithLoader();
  const defaultData: ProductData = {
    name: '',
    retailPrice: 0.00,
    resellerPrice: 0.00,
    costPrice: 0.00,
    inventory: 0,
    description: '',
    images: [],
    category: '',
    sub_category: '',
    brands: [],
    model: '',
    colors: [],
    sizes: [],
    materials: [],
    styles: [],
    fits: [],
    patterns: [],
  };

  const [formData, setFormData] = useState<ProductData>(initialData || defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Attributes data
  const [categories, setCategories] = useState<Attribute[]>([]);
  const [subCategories, setSubCategories] = useState<Attribute[]>([]);
  const [brands, setBrands] = useState<Attribute[]>([]);
  const [colors, setColors] = useState<Attribute[]>([]);
  const [sizes, setSizes] = useState<Attribute[]>([]);
  const [materials, setMaterials] = useState<Attribute[]>([]);
  const [styles, setStyles] = useState<Attribute[]>([]);
  const [fits, setFits] = useState<Attribute[]>([]);
  const [patterns, setPatterns] = useState<Attribute[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all attributes on mount
  useEffect(() => {
    const fetchAttributes = async () => {
      setIsLoadingAttributes(true);
      try {
        const response = await callWithLoader(() => apiClient.getAllAttributes());
        if (response.success && response.data) {
          setCategories(response.data.categories || []);
          setSubCategories(response.data.sub_categories || []);
          setBrands(response.data.brands || []);
          setColors(response.data.colors || []);
          setSizes(response.data.sizes || []);
          setMaterials(response.data.materials || []);
          setStyles(response.data.styles || []);
          setFits(response.data.fits || []);
          setPatterns(response.data.patterns || []);
        }
      } catch (error) {
        console.error('Error fetching attributes:', error);
      } finally {
        setIsLoadingAttributes(false);
      }
    };

    fetchAttributes();
  }, [callWithLoader]);

  // Fetch sub-categories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (formData.category) {
        const category = categories.find(cat => cat.name === formData.category);
        if (category) {
          try {
            const response = await callWithLoader(() => apiClient.getSubCategories(category.id));
            if (response.success && response.data) {
              setSubCategories(response.data);
            }
          } catch (error) {
            console.error('Error fetching sub-categories:', error);
          }
        }
      } else {
        // Fetch all sub-categories if no category selected
        try {
          const response = await callWithLoader(() => apiClient.getSubCategories());
          if (response.success && response.data) {
            setSubCategories(response.data);
          }
        } catch (error) {
          console.error('Error fetching sub-categories:', error);
        }
      }
    };

    fetchSubCategories();
  }, [formData.category, categories, callWithLoader]);

  // Fetch product data when editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isNewProduct && productId) {
        setIsLoadingProduct(true);
        try {
          const response = await callWithLoader(() => apiClient.getProduct(productId));
          if (response.success && response.data) {
            const product = response.data;
            const images = response.data.images || [];
            
            // Map API product to form data
            const basePrice = typeof product.base_price === 'string' ? parseFloat(product.base_price) : product.base_price;
            const resellerPrice = product.reseller_price 
              ? (typeof product.reseller_price === 'string' ? parseFloat(product.reseller_price) : product.reseller_price)
              : basePrice * 0.8; // Default to 80% if not set
            const costPrice = resellerPrice * 0.8; // Estimate cost price
            
            // Extract multi-value attributes from product (assuming API returns arrays or comma-separated strings)
            const productAny = product as any;
            const extractArray = (value: string | string[] | undefined): string[] => {
              if (!value) return [];
              if (Array.isArray(value)) return value;
              if (typeof value === 'string' && value.includes(',')) return value.split(',').map(v => v.trim());
              return [value];
            };

            const productColors = extractArray(productAny.colors || productAny.color);
            const productSizes = extractArray(productAny.sizes || productAny.size);
            const productMaterials = extractArray(productAny.materials || productAny.material);
            const productStyles = extractArray(productAny.styles || productAny.style);
            const productFits = extractArray(productAny.fits || productAny.fit);
            const productPatterns = extractArray(productAny.patterns || productAny.pattern);
            
            // Process images with attribute mappings - convert to new structure
            const imagesWithAttributes: ImageWithAttributes[] = [];
            
            images.forEach((img: ProductImage & { attributeMappings?: any[] }) => {
              const imageUrl = img.image_url;
              if (!imageUrl) return; // Skip if no image URL
              
              const mappings = img.attributeMappings || [];
              
              // Collect all attributes for this image
              const imageAttributes: ImageWithAttributes['attributes'] = {
                color: [],
                size: [],
                material: [],
                style: [],
                fit: [],
                pattern: [],
              };
              
              // Process all mappings for this image
              mappings.forEach((mapping: any) => {
                const attrs = mapping.attributes || {};
                if (attrs.color && !imageAttributes.color?.includes(attrs.color)) {
                  imageAttributes.color?.push(attrs.color);
                }
                if (attrs.size && !imageAttributes.size?.includes(attrs.size)) {
                  imageAttributes.size?.push(attrs.size);
                }
                if (attrs.material && !imageAttributes.material?.includes(attrs.material)) {
                  imageAttributes.material?.push(attrs.material);
                }
                if (attrs.style && !imageAttributes.style?.includes(attrs.style)) {
                  imageAttributes.style?.push(attrs.style);
                }
                if (attrs.fit && !imageAttributes.fit?.includes(attrs.fit)) {
                  imageAttributes.fit?.push(attrs.fit);
                }
                if (attrs.pattern && !imageAttributes.pattern?.includes(attrs.pattern)) {
                  imageAttributes.pattern?.push(attrs.pattern);
                }
              });
              
              // Clean up empty arrays
              Object.keys(imageAttributes).forEach(key => {
                const attrKey = key as keyof typeof imageAttributes;
                if (imageAttributes[attrKey]?.length === 0) {
                  delete imageAttributes[attrKey];
                }
              });
              
              imagesWithAttributes.push({
                url: imageUrl,
                attributes: imageAttributes,
              });
            });
            
            setFormData({
              id: product.id.toString(),
              name: product.title || '',
              retailPrice: basePrice,
              resellerPrice: resellerPrice,
              costPrice: costPrice,
              inventory: product.stock || 0,
              description: product.description || '',
              images: imagesWithAttributes,
              category: productAny.category || productAny.categories?.[0] || '',
              sub_category: productAny.sub_category || productAny.sub_categories?.[0] || '',
              brands: extractArray(productAny.brands || productAny.brand),
              model: productAny.model || '',
              colors: productColors,
              sizes: productSizes,
              materials: productMaterials,
              styles: productStyles,
              fits: productFits,
              patterns: productPatterns,
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setIsLoadingProduct(false);
        }
      }
    };

    fetchProduct();
  }, [productId, isNewProduct, callWithLoader]);

  // Clean up image attributes when product attributes are removed
  useEffect(() => {
    setFormData(prev => {
      const updatedImages = prev.images.map(img => {
        const updatedAttributes = { ...img.attributes };
        let hasChanges = false;
        
        // Clean up color attributes
        if (updatedAttributes.color) {
          const validColors = prev.colors || [];
          const filtered = updatedAttributes.color.filter(c => validColors.includes(c));
          if (filtered.length !== updatedAttributes.color.length) {
            updatedAttributes.color = filtered.length > 0 ? filtered : undefined;
            hasChanges = true;
          }
        }
        
        // Clean up size attributes
        if (updatedAttributes.size) {
          const validSizes = prev.sizes || [];
          const filtered = updatedAttributes.size.filter(s => validSizes.includes(s));
          if (filtered.length !== updatedAttributes.size.length) {
            updatedAttributes.size = filtered.length > 0 ? filtered : undefined;
            hasChanges = true;
          }
        }
        
        // Clean up material attributes
        if (updatedAttributes.material) {
          const validMaterials = prev.materials || [];
          const filtered = updatedAttributes.material.filter(m => validMaterials.includes(m));
          if (filtered.length !== updatedAttributes.material.length) {
            updatedAttributes.material = filtered.length > 0 ? filtered : undefined;
            hasChanges = true;
          }
        }
        
        // Clean up style attributes
        if (updatedAttributes.style) {
          const validStyles = prev.styles || [];
          const filtered = updatedAttributes.style.filter(s => validStyles.includes(s));
          if (filtered.length !== updatedAttributes.style.length) {
            updatedAttributes.style = filtered.length > 0 ? filtered : undefined;
            hasChanges = true;
          }
        }
        
        // Clean up fit attributes
        if (updatedAttributes.fit) {
          const validFits = prev.fits || [];
          const filtered = updatedAttributes.fit.filter(f => validFits.includes(f));
          if (filtered.length !== updatedAttributes.fit.length) {
            updatedAttributes.fit = filtered.length > 0 ? filtered : undefined;
            hasChanges = true;
          }
        }
        
        // Clean up pattern attributes
        if (updatedAttributes.pattern) {
          const validPatterns = prev.patterns || [];
          const filtered = updatedAttributes.pattern.filter(p => validPatterns.includes(p));
          if (filtered.length !== updatedAttributes.pattern.length) {
            updatedAttributes.pattern = filtered.length > 0 ? filtered : undefined;
            hasChanges = true;
          }
        }
        
        return hasChanges ? { ...img, attributes: updatedAttributes } : img;
      });
      
      return { ...prev, images: updatedImages };
    });
  }, [formData.colors, formData.sizes, formData.materials, formData.styles, formData.fits, formData.patterns]);

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
    const newImages: ImageWithAttributes[] = files.map(file => ({
      url: URL.createObjectURL(file),
      attributes: {},
    }));
    
    // Store the images for later upload
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleUpdateImageAttributes = (imageIndex: number, attributeType: 'color' | 'size' | 'material' | 'style' | 'fit' | 'pattern', values: string[]) => {
    setFormData(prev => {
      const updatedImages = [...prev.images];
      const image = updatedImages[imageIndex];
      if (image) {
        updatedImages[imageIndex] = {
          ...image,
          attributes: {
            ...image.attributes,
            [attributeType]: values.length > 0 ? values : undefined,
          },
        };
      }
      return { ...prev, images: updatedImages };
    });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation check
    if (formData.images.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Separate images into existing URLs and new blob URLs
      const existingImages: Array<{ url: string; attributes?: any }> = [];
      const newImageFiles: Array<{ file: File; attributes?: any }> = [];
      
      formData.images.forEach((img) => {
        if (img.url.startsWith('blob:')) {
          // New upload - convert to File
          // We'll handle this in the loop below
        } else {
          // Existing URL - include in images array
          const attrs: any = {};
          if (img.attributes.color && img.attributes.color.length > 0) attrs.color = img.attributes.color;
          if (img.attributes.size && img.attributes.size.length > 0) attrs.size = img.attributes.size;
          if (img.attributes.material && img.attributes.material.length > 0) attrs.material = img.attributes.material;
          if (img.attributes.style && img.attributes.style.length > 0) attrs.style = img.attributes.style;
          if (img.attributes.fit && img.attributes.fit.length > 0) attrs.fit = img.attributes.fit;
          if (img.attributes.pattern && img.attributes.pattern.length > 0) attrs.pattern = img.attributes.pattern;
          
          existingImages.push({
            url: img.url,
            ...(Object.keys(attrs).length > 0 && { attributes: attrs }),
          });
        }
      });
      
      // Convert blob URLs to File objects
      for (const img of formData.images) {
        if (img.url.startsWith('blob:')) {
          const response = await fetch(img.url);
          const blob = await response.blob();
          const file = new File([blob], `image-${Date.now()}-${Math.random()}.jpg`, { type: blob.type });
          
          const attrs: any = {};
          if (img.attributes.color && img.attributes.color.length > 0) attrs.color = img.attributes.color;
          if (img.attributes.size && img.attributes.size.length > 0) attrs.size = img.attributes.size;
          if (img.attributes.material && img.attributes.material.length > 0) attrs.material = img.attributes.material;
          if (img.attributes.style && img.attributes.style.length > 0) attrs.style = img.attributes.style;
          if (img.attributes.fit && img.attributes.fit.length > 0) attrs.fit = img.attributes.fit;
          if (img.attributes.pattern && img.attributes.pattern.length > 0) attrs.pattern = img.attributes.pattern;
          
          newImageFiles.push({
            file,
            ...(Object.keys(attrs).length > 0 && { attributes: attrs }),
          });
        }
      }
      
      // Prepare images array for backend
      const imagesWithAttributes: Array<{ url?: string; attributes?: any }> = [...existingImages];
      
      // Add placeholders for new uploads (backend will add URLs after upload)
      newImageFiles.forEach((item) => {
        imagesWithAttributes.push({
          ...(item.attributes && { attributes: item.attributes }),
        });
      });
      
      // Extract files for upload
      const allImageFiles = newImageFiles.map(item => item.file);

      const productData: any = {
        title: formData.name,
        description: formData.description,
        base_price: formData.retailPrice,
        reseller_price: formData.resellerPrice,
        retail_price: formData.retailPrice,
        stock: formData.inventory,
        // Single-value attributes
        ...(formData.category && { category: formData.category }),
        ...(formData.sub_category && { sub_category: formData.sub_category }),
        ...(formData.model && { model: formData.model }),
        // Multi-value attributes - send as arrays
        ...(formData.brands && formData.brands.length > 0 && { brands: formData.brands }),
        ...(formData.colors && formData.colors.length > 0 && { colors: formData.colors }),
        ...(formData.sizes && formData.sizes.length > 0 && { sizes: formData.sizes }),
        ...(formData.materials && formData.materials.length > 0 && { materials: formData.materials }),
        ...(formData.styles && formData.styles.length > 0 && { styles: formData.styles }),
        ...(formData.fits && formData.fits.length > 0 && { fits: formData.fits }),
        ...(formData.patterns && formData.patterns.length > 0 && { patterns: formData.patterns }),
        // Include images with attributes
        ...(imagesWithAttributes.length > 0 && { images: imagesWithAttributes }),
      };
      
      let response;
      if (isNewProduct) {
        response = await callWithLoader(() => apiClient.createProduct(productData, allImageFiles.length > 0 ? allImageFiles : undefined));
      } else {
        if (!formData.id) {
          throw new Error('Product ID is required for updates');
        }
        const productId = parseInt(formData.id);
        response = await callWithLoader(() => apiClient.updateProduct(productId, productData, allImageFiles.length > 0 ? allImageFiles : undefined));
      }

      if (response.success) {
        alert(`Successfully ${isNewProduct ? 'added' : 'updated'} ${formData.name}!`);
        // if (onSuccess) onSuccess();
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


  if (isLoadingProduct || isLoadingAttributes) {
    return (
      <div className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-8">
        <p className="text-text-lavender text-center">
          {isLoadingProduct ? 'Loading product data...' : 'Loading attributes...'}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-8"
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
              hint="Enter the full product name as it should appear in listings"
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
              hint="Current stock quantity available for sale"
              required 
            />
          </div>
          
          <Textarea 
            label="Product Description (SEO Optimized)" 
            id="description" 
            value={formData.description} 
            onChange={handleChange} 
            hint="Write a detailed, SEO-friendly description. Include key features, benefits, and relevant keywords."
            required 
          />


          {/* --- Section 1.5: Image Management (Uploads) --- */}
          <h2 className="font-headings text-3xl text-text-cream font-semibold my-6 border-t border-divider-silver pt-6">
            Image Management
          </h2>
          
          <div className="p-4 bg-base-navy rounded-soft-lg mb-6">
            <p className="font-body text-text-lavender mb-4">
              Upload all product images first, then assign attributes to each image below.
            </p>
            
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
                <p className="font-body text-text-lavender">Drag & Drop images here, or <span className="text-cta-copper hover:underline">click to browse</span></p>
                <p className="font-body text-text-lavender/70 text-sm mt-2">Upload all images, then assign attributes to each image below</p>
            </motion.div>

            {/* Display Images with Attribute Assignment */}
            {formData.images.length > 0 ? (
              <div className="space-y-4 mt-6">
                {formData.images.map((img, index) => (
                  <div key={`img-${index}`} className="p-4 bg-card-taupe rounded-soft-lg border border-divider-silver">
                    <div className="flex gap-4 items-start">
                      {/* Image Preview */}
                      <div className="relative w-32 h-32 rounded-soft-lg overflow-hidden border border-divider-silver group flex-shrink-0">
                        <img 
                          src={img.url} 
                          alt={`Product Image ${index + 1}`} 
                          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/100x100/A32D4C/F0EAD6?text=Broken' }}
                        />
                        <motion.button 
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 flex items-center justify-center bg-highlight-wine/80 text-text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.1 }}
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <FaTimes className="text-xl" />
                        </motion.button>
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-base-navy/70 text-text-lavender text-xs px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      
                      {/* Attribute Assignment */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Color Assignment */}
                        {formData.colors && formData.colors.length > 0 && (
                          <Combobox
                            label="Colors"
                            value={img.attributes.color || []}
                            onChange={(values) => handleUpdateImageAttributes(index, 'color', Array.isArray(values) ? values : [])}
                            options={colors.map(c => ({ value: c.name, label: c.name }))}
                            placeholder="Select colors"
                            multiple={true}
                            allowCreate={true}
                            hint="Colors shown in this image"
                          />
                        )}
                        
                        {/* Size Assignment */}
                        {formData.sizes && formData.sizes.length > 0 && (
                          <Combobox
                            label="Sizes"
                            value={img.attributes.size || []}
                            onChange={(values) => handleUpdateImageAttributes(index, 'size', Array.isArray(values) ? values : [])}
                            options={sizes.map(s => ({ value: s.name, label: s.name }))}
                            placeholder="Select sizes"
                            multiple={true}
                            allowCreate={true}
                            hint="Sizes shown in this image"
                          />
                        )}
                        
                        {/* Material Assignment */}
                        {formData.materials && formData.materials.length > 0 && (
                          <Combobox
                            label="Materials"
                            value={img.attributes.material || []}
                            onChange={(values) => handleUpdateImageAttributes(index, 'material', Array.isArray(values) ? values : [])}
                            options={materials.map(m => ({ value: m.name, label: m.name }))}
                            placeholder="Select materials"
                            multiple={true}
                            allowCreate={true}
                            hint="Materials shown in this image"
                          />
                        )}
                        
                        {/* Style Assignment */}
                        {formData.styles && formData.styles.length > 0 && (
                          <Combobox
                            label="Styles"
                            value={img.attributes.style || []}
                            onChange={(values) => handleUpdateImageAttributes(index, 'style', Array.isArray(values) ? values : [])}
                            options={styles.map(s => ({ value: s.name, label: s.name }))}
                            placeholder="Select styles"
                            multiple={true}
                            allowCreate={true}
                            hint="Styles shown in this image"
                          />
                        )}
                        
                        {/* Fit Assignment */}
                        {formData.fits && formData.fits.length > 0 && (
                          <Combobox
                            label="Fits"
                            value={img.attributes.fit || []}
                            onChange={(values) => handleUpdateImageAttributes(index, 'fit', Array.isArray(values) ? values : [])}
                            options={fits.map(f => ({ value: f.name, label: f.name }))}
                            placeholder="Select fits"
                            multiple={true}
                            allowCreate={true}
                            hint="Fits shown in this image"
                          />
                        )}
                        
                        {/* Pattern Assignment */}
                        {formData.patterns && formData.patterns.length > 0 && (
                          <Combobox
                            label="Patterns"
                            value={img.attributes.pattern || []}
                            onChange={(values) => handleUpdateImageAttributes(index, 'pattern', Array.isArray(values) ? values : [])}
                            options={patterns.map(p => ({ value: p.name, label: p.name }))}
                            placeholder="Select patterns"
                            multiple={true}
                            allowCreate={true}
                            hint="Patterns shown in this image"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-lavender/70 text-center py-4">No images uploaded yet. Upload images above to get started.</p>
            )}
          </div>

          {/* --- Section 2: Product Attributes --- */}
          <h2 className="font-headings text-3xl text-text-cream font-semibold my-6 border-t border-divider-silver pt-6">
            Product Attributes
          </h2>
          
          {isLoadingAttributes ? (
            <div className="text-center py-8">
              <p className="text-text-lavender">Loading attributes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
              {/* Category - Creatable Combobox */}
              <Combobox
                label="Category"
                id="category"
                value={formData.category || ''}
                onChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    category: Array.isArray(value) ? value[0] || '' : value,
                    sub_category: '' // Clear sub-category when category changes
                  }));
                }}
                options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                placeholder="Select or type to create category"
                allowCreate={true}
                multiple={false}
                hint="Main product category (e.g., Electronics, Clothing, Accessories)"
              />
              
              {/* Sub Category - Creatable Combobox */}
              <Combobox
                label="Sub Category"
                id="sub_category"
                value={formData.sub_category || ''}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, sub_category: Array.isArray(value) ? value[0] || '' : value }));
                }}
                options={subCategories
                  .filter(sub => {
                    // If no category selected, show all sub-categories
                    if (!formData.category) return true;
                    // If category selected, filter by category_id
                    const selectedCategory = categories.find(cat => cat.name === formData.category);
                    if (!selectedCategory) return true;
                    return sub.category_id === selectedCategory.id;
                  })
                  .map(sub => ({ value: sub.name, label: sub.name }))}
                placeholder="Select or type to create sub-category"
                allowCreate={true}
                multiple={false}
                hint="More specific product classification within the selected category"
              />
              
              {/* Brand - Multi Select */}
              <Combobox
                label="Brand(s)"
                id="brands"
                value={formData.brands || []}
                onChange={(values) => setFormData(prev => ({ ...prev, brands: Array.isArray(values) ? values : [] }))}
                options={brands.map(brand => ({ value: brand.name, label: brand.name }))}
                placeholder="Select or type to create brands"
                multiple={true}
                allowCreate={true}
                hint="Select one or more brands associated with this product"
              />
              
              {/* Model - Text Input */}
              <Input 
                label="Model" 
                id="model" 
                type="text" 
                value={formData.model || ''} 
                onChange={handleChange} 
                hint="Product model number/name"
              />
              
              {/* Colors - Multi Select */}
              <Combobox
                label="Color(s)"
                id="colors"
                value={formData.colors || []}
                onChange={(values) => setFormData(prev => ({ ...prev, colors: Array.isArray(values) ? values : [] }))}
                options={colors.map(color => ({ value: color.name, label: color.name }))}
                placeholder="Select or type to create colors"
                multiple={true}
                allowCreate={true}
                hint="Select all available color variants for this product"
              />
              
              {/* Sizes - Multi Select */}
              <Combobox
                label="Size(s)"
                id="sizes"
                value={formData.sizes || []}
                onChange={(values) => setFormData(prev => ({ ...prev, sizes: Array.isArray(values) ? values : [] }))}
                options={sizes.map(size => ({ value: size.name, label: size.name }))}
                placeholder="Select or type to create sizes"
                multiple={true}
                allowCreate={true}
                hint="Select all available sizes (e.g., S, M, L, XL or numeric sizes)"
              />
              
              {/* Materials - Multi Select */}
              <Combobox
                label="Material(s)"
                id="materials"
                value={formData.materials || []}
                onChange={(values) => setFormData(prev => ({ ...prev, materials: Array.isArray(values) ? values : [] }))}
                options={materials.map(material => ({ value: material.name, label: material.name }))}
                placeholder="Select or type to create materials"
                multiple={true}
                allowCreate={true}
                hint="Primary materials used in the product (e.g., Cotton, Leather, Metal)"
              />
              
              {/* Styles - Multi Select */}
              <Combobox
                label="Style(s)"
                id="styles"
                value={formData.styles || []}
                onChange={(values) => setFormData(prev => ({ ...prev, styles: Array.isArray(values) ? values : [] }))}
                options={styles.map(style => ({ value: style.name, label: style.name }))}
                placeholder="Select or type to create styles"
                multiple={true}
                allowCreate={true}
                hint="Product style descriptors (e.g., Casual, Formal, Vintage, Modern)"
              />
              
              {/* Fits - Multi Select */}
              <Combobox
                label="Fit(s)"
                id="fits"
                value={formData.fits || []}
                onChange={(values) => setFormData(prev => ({ ...prev, fits: Array.isArray(values) ? values : [] }))}
                options={fits.map(fit => ({ value: fit.name, label: fit.name }))}
                placeholder="Select or type to create fits"
                multiple={true}
                allowCreate={true}
                hint="Fit type for clothing/apparel (e.g., Regular, Slim, Loose, Athletic)"
              />
              
              {/* Patterns - Multi Select */}
              <Combobox
                label="Pattern(s)"
                id="patterns"
                value={formData.patterns || []}
                onChange={(values) => setFormData(prev => ({ ...prev, patterns: Array.isArray(values) ? values : [] }))}
                options={patterns.map(pattern => ({ value: pattern.name, label: pattern.name }))}
                placeholder="Select or type to create patterns"
                multiple={true}
                allowCreate={true}
                hint="Design patterns or prints (e.g., Solid, Striped, Floral, Geometric)"
              />
            </div>
          )}

          {/* --- Section 3: Pricing Tiers (Critical Hybrid Model Inputs) --- */}
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

          {/* --- Section 4: Margin Summary --- */}
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
              {submitLabel}
            </CTAButton>
          </motion.div>
        </form>
      </motion.div>
  );
}
