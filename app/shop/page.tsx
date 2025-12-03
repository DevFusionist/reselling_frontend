"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { FaSlidersH, FaSortAmountDown, FaSearch } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { apiClient, Product, ProductImage } from "@/lib/api";

const categories = [
  "All Categories",
  "Timepieces",
  "Leather Goods",
  "Accessories",
  "Decor",
  "Fragrances",
];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];

// Framer Motion Variants for a soft entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const filterItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.getProducts({
          page,
          limit: 20,
          search: debouncedSearch || undefined,
        });

        if (response.success && response.data) {
          setProducts(response.data.products || []);
          setImages(response.data.images || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setError(response.message || "Failed to load products");
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, debouncedSearch]);

  // Debounce searchQuery → debouncedSearch
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // optional: reset page when debounced search updates
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Transform API product to ProductCard format
  const transformProduct = (product: Product) => {
    // Find images for this product, sorted by display_order
    const productImages = images
      .filter((img) => img.product_id === product.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => img.image_url);

    // Use images from API response, fallback to product.image_url/image_urls, then placeholder
    const imageUrl =
      productImages[0] ||
      product.image_url ||
      product.image_urls?.[0] ||
      "https://placehold.co/400x400/28242D/F0EAD6?text=Product";

    // Handle base_price as string or number
    const price = typeof product.base_price === 'string' 
      ? parseFloat(product.base_price) 
      : product.base_price;

    return {
      id: product.id.toString(),
      name: product.title,
      price: price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      imagePlaceholder: imageUrl,
      slug: product.id.toString(),
    };
  };

  // Filter and sort products (client-side for now, can be moved to backend)
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply category filter (if categories are implemented in backend)
    // For now, we'll just show all products

    // Apply sorting
    if (selectedSort === "Price: Low to High") {
      filtered.sort((a, b) => {
        const priceA = typeof a.base_price === 'string' ? parseFloat(a.base_price) : a.base_price;
        const priceB = typeof b.base_price === 'string' ? parseFloat(b.base_price) : b.base_price;
        return priceA - priceB;
      });
    } else if (selectedSort === "Price: High to Low") {
      filtered.sort((a, b) => {
        const priceA = typeof a.base_price === 'string' ? parseFloat(a.base_price) : a.base_price;
        const priceB = typeof b.base_price === 'string' ? parseFloat(b.base_price) : b.base_price;
        return priceB - priceA;
      });
    }
    // 'Newest' is default (already sorted by backend)

    return filtered;
  }, [products, selectedSort]);

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

        {/* Search Bar */}
        <motion.div className="mb-6" variants={filterItemVariants}>
          <Input
            label=""
            id="search"
            type="text"
            placeholder="Search products..."
            icon={FaSearch}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="md:w-96"
          />
        </motion.div>

        {/* --- Controls: Filters and Sorting --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 p-4 bg-card-taupe rounded-soft-lg shadow-luxury-soft">
          {/* Category Filters */}
          <motion.div
            className="flex flex-wrap items-center space-x-3 mb-4 md:mb-0"
            variants={containerVariants}
          >
            <FaSlidersH className="text-cta-copper text-xl mr-2 hidden sm:block" />
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                                    font-body text-sm px-4 py-2 rounded-full transition-colors duration-300
                                    ${
                                      selectedCategory === category
                                        ? "bg-cta-copper text-text-cream shadow-md"
                                        : "bg-transparent text-text-lavender border border-divider-silver hover:border-cta-copper hover:text-cta-copper"
                                    }
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
            <div className="hidden sm:block">
              <Select
                label="Sort By:"
                id="sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                options={sortOptions.map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="text-sm"
              />
            </div>
            <div className="sm:hidden">
              <Select
                id="sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                options={sortOptions.map((option) => ({
                  value: option,
                  label: option,
                }))}
                className="text-sm"
              />
            </div>
          </motion.div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <p className="font-body text-text-lavender text-xl">
              Loading products...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="font-body text-highlight-wine text-xl">{error}</p>
          </div>
        )}

        {/* --- Product Grid: 4-up Layout --- */}
        {!loading && !error && (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id.toString()}
                  product={transformProduct(product)}
                />
              ))}
            </motion.div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-headings text-text-lavender text-2xl">
                  No items found.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-card-taupe text-text-cream rounded-soft-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cta-copper transition-colors"
                >
                  Previous
                </button>
                <span className="font-body text-text-lavender">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-card-taupe text-text-cream rounded-soft-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cta-copper transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
