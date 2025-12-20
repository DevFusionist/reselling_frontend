'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/Input';
import { FaTimes, FaSlidersH } from 'react-icons/fa';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  // Filter states
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  subCategory: string;
  onSubCategoryChange: (value: string) => void;
  brand: string;
  onBrandChange: (value: string) => void;
  color: string;
  onColorChange: (value: string) => void;
  size: string;
  onSizeChange: (value: string) => void;
  material: string;
  onMaterialChange: (value: string) => void;
  style: string;
  onStyleChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  inStock: boolean | undefined;
  onInStockChange: (value: boolean | undefined) => void;
  isFeatured: boolean | undefined;
  onIsFeaturedChange: (value: boolean | undefined) => void;
  onClearFilters: () => void;
  categories: string[];
}

export default function FilterSidebar({
  isOpen,
  onClose,
  isMobile,
  selectedCategory,
  onCategoryChange,
  subCategory,
  onSubCategoryChange,
  brand,
  onBrandChange,
  color,
  onColorChange,
  size,
  onSizeChange,
  material,
  onMaterialChange,
  style,
  onStyleChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  inStock,
  onInStockChange,
  isFeatured,
  onIsFeaturedChange,
  onClearFilters,
  categories,
}: FilterSidebarProps) {
  const sidebarContent = (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headings text-2xl text-text-cream font-semibold flex items-center">
            <FaSlidersH className="mr-2 text-cta-copper" />
            Filters
          </h3>
          {isMobile && (
            <button
              onClick={onClose}
              className="text-text-lavender hover:text-cta-copper transition-colors"
              aria-label="Close filters"
            >
              <FaTimes className="text-xl" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-body text-text-lavender mb-3 font-medium">
            Category
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => onCategoryChange(category)}
                  className="w-4 h-4 text-cta-copper rounded"
                />
                <span className="text-text-cream text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-body text-text-lavender mb-3 font-medium">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label=""
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              placeholder="Min"
              min="0"
              step="0.01"
              className="text-sm"
            />
            <Input
              label=""
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              placeholder="Max"
              min="0"
              step="0.01"
              className="text-sm"
            />
          </div>
        </div>

        {/* Other Filters */}
        <div className="space-y-4 mb-6">
          <Input
            label="Sub Category"
            id="subCategory"
            type="text"
            value={subCategory}
            onChange={(e) => onSubCategoryChange(e.target.value)}
            placeholder="e.g., Watches"
            className="text-sm"
          />
          <Input
            label="Brand"
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Brand name"
            className="text-sm"
          />
          <Input
            label="Color"
            id="color"
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="e.g., Black"
            className="text-sm"
          />
          <Input
            label="Size"
            id="size"
            type="text"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
            placeholder="e.g., M, 42mm"
            className="text-sm"
          />
          <Input
            label="Material"
            id="material"
            type="text"
            value={material}
            onChange={(e) => onMaterialChange(e.target.value)}
            placeholder="e.g., Leather"
            className="text-sm"
          />
          <Input
            label="Style"
            id="style"
            type="text"
            value={style}
            onChange={(e) => onStyleChange(e.target.value)}
            placeholder="Style"
            className="text-sm"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock === true}
              onChange={(e) => onInStockChange(e.target.checked ? true : undefined)}
              className="w-4 h-4 text-cta-copper rounded"
            />
            <span className="text-text-lavender text-sm">In Stock Only</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured === true}
              onChange={(e) => onIsFeaturedChange(e.target.checked ? true : undefined)}
              className="w-4 h-4 text-cta-copper rounded"
            />
            <span className="text-text-lavender text-sm">Featured Only</span>
          </label>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 bg-transparent border border-divider-silver text-text-lavender rounded-lg hover:border-cta-copper hover:text-cta-copper transition-colors text-sm"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-card-taupe z-50 shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: Always visible sidebar
  return (
    <div className="w-64 flex-shrink-0 bg-card-taupe rounded-lg shadow-luxury-soft h-fit sticky top-24">
      {sidebarContent}
    </div>
  );
}

