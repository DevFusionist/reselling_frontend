'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/cards/ProductCard'; // Assuming path from previous interaction
import { FaSlidersH, FaSortAmountDown } from 'react-icons/fa';
import { useState } from 'react';

// Mock Product Data (Matches the structure used in the PDP and Homepage)
const mockProducts = [
  { id: 1, name: 'Obsidian Chronograph', price: '9,450.00', category: 'Timepieces', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Watch' },
  { id: 2, name: 'Aetherial Wallet', price: '1,200.00', category: 'Leather Goods', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Wallet' },
  { id: 3, name: 'Siena Leather Bag', price: '14,800.00', category: 'Leather Goods', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Handbag' },
  { id: 4, name: 'Reserve Pen Set', price: '3,100.00', category: 'Accessories', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Pen+Set' },
  { id: 5, name: 'Nocturne Lumina Globe', price: '9,800.00', category: 'Decor', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Globe' },
  { id: 6, name: 'Amber Glow Parfum', price: '450.00', category: 'Fragrances', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Perfume' },
  { id: 7, name: 'The Diplomat Briefcase', price: '18,500.00', category: 'Leather Goods', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Briefcase' },
  { id: 8, name: 'Titanium Cufflinks', price: '890.00', category: 'Accessories', imagePlaceholder: 'https://placehold.co/400x400/28242D/F0EAD6?text=Cufflinks' },
];

const categories = ['All Categories', 'Timepieces', 'Leather Goods', 'Accessories', 'Decor', 'Fragrances'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low'];

// Framer Motion Variants for a soft entrance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05, // Subtle stagger for grid items
            ease: [0.25, 0.1, 0.25, 1.0]
        }
    },
};

const filterItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedSort, setSelectedSort] = useState('Newest');

    const filteredProducts = mockProducts.filter(p => 
        selectedCategory === 'All Categories' || p.category === selectedCategory
    );

    return (
        <div className="min-h-screen bg-base-navy font-body py-20 pt-32">
            <motion.div 
                className="max-w-7xl mx-auto px-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header & Title */}
                <motion.h1 
                    className="font-headings text-6xl text-text-cream font-semibold mb-2"
                    variants={filterItemVariants}
                >
                    The Curated Collection
                </motion.h1>
                <motion.p 
                    className="font-body text-xl text-text-lavender mb-12"
                    variants={filterItemVariants}
                >
                    An exclusive selection of high-ticket luxury items.
                </motion.p>

                {/* --- Controls: Filters and Sorting --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 p-4 bg-card-taupe rounded-soft-lg shadow-luxury-soft">
                    
                    {/* Category Filters */}
                    <motion.div 
                        className="flex flex-wrap items-center space-x-3 mb-4 md:mb-0"
                        variants={containerVariants}
                    >
                        <FaSlidersH className="text-cta-copper text-xl mr-2 hidden sm:block" />
                        {categories.map((category, index) => (
                            <motion.button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`
                                    font-body text-sm px-4 py-2 rounded-full transition-colors duration-300
                                    ${selectedCategory === category 
                                        ? 'bg-cta-copper text-text-cream shadow-md' 
                                        : 'bg-transparent text-text-lavender border border-divider-silver hover:border-cta-copper hover:text-cta-copper'}
                                `}
                                variants={filterItemVariants}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Sorting Dropdown */}
                    <motion.div 
                        className="flex items-center space-x-2"
                        variants={filterItemVariants}
                    >
                        <FaSortAmountDown className="text-text-lavender" />
                        <label htmlFor="sort" className="text-text-lavender text-sm hidden sm:block">Sort By:</label>
                        <select
                            id="sort"
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="bg-base-navy text-text-cream border border-divider-silver rounded-soft-lg p-2 text-sm focus:border-cta-copper focus:shadow-lavender-glow transition-all"
                        >
                            {sortOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </motion.div>
                </div>

                {/* --- Product Grid: 4-up Layout --- */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredProducts.map((product, index) => (
                        // ProductCard already has its own entrance (whileInView) animation
                        <ProductCard key={product.id.toString()} product={{ ...product, id: product.id.toString() }} />
                    ))}
                </motion.div>
                
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="font-headings text-text-lavender text-2xl">No items found in this category.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}