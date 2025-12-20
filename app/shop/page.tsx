"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import Input from "@/components/ui/Input";
import Combobox from "@/components/ui/Combobox";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { FaSlidersH, FaSortAmountDown, FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient, Product, ProductImage } from "@/lib/api";
import { useApiWithLoader } from "@/hooks/useApiWithLoader";
import { useLoading } from "@/contexts/LoadingContext";
import { useIsMobile } from "@/hooks/useIsMobile";

const categories = [
  "All Categories",
  "Timepieces",
  "Leather Goods",
  "Accessories",
  "Decor",
  "Fragrances",
];
const sortOptions = [
  { value: "newest", label: "Newest", sort_by: "created_at", sort_order: "desc" },
  { value: "price-low", label: "Price: Low to High", sort_by: "base_price", sort_order: "asc" },
  { value: "price-high", label: "Price: High to Low", sort_by: "base_price", sort_order: "desc" },
  { value: "name-asc", label: "Name: A-Z", sort_by: "title", sort_order: "asc" },
  { value: "name-desc", label: "Name: Z-A", sort_by: "title", sort_order: "desc" },
];

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { callWithLoader } = useApiWithLoader();
  const { isLoading } = useLoading();
  const isMobile = useIsMobile();
  
  // Initialize state from URL query params
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Categories"
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "newest"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || ""
  );
  
  // Additional filters from URL params
  const [subCategory, setSubCategory] = useState(
    searchParams.get("sub_category") || ""
  );
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [color, setColor] = useState(searchParams.get("color") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [material, setMaterial] = useState(searchParams.get("material") || "");
  const [style, setStyle] = useState(searchParams.get("style") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [inStock, setInStock] = useState<boolean | undefined>(
    searchParams.get("in_stock") === "true" ? true : 
    searchParams.get("in_stock") === "false" ? false : 
    undefined
  );
  const [isFeatured, setIsFeatured] = useState<boolean | undefined>(
    searchParams.get("is_featured") === "true" ? true : 
    searchParams.get("is_featured") === "false" ? false : 
    undefined
  );
  const [showFilters, setShowFilters] = useState(false);
  const isInitialMount = useRef(true);
  const prevParamsRef = useRef<string>("");
  const isUpdatingFromState = useRef(false);

  // Sync state from URL params when URL changes externally (browser navigation, nav links)
  useEffect(() => {
    // Skip if we're updating URL from state changes
    if (isUpdatingFromState.current) {
      isUpdatingFromState.current = false;
      return;
    }

    const urlCategory = searchParams.get("category") || "All Categories";
    const urlSort = searchParams.get("sort") || "newest";
    const urlSearch = searchParams.get("search") || "";
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlSubCategory = searchParams.get("sub_category") || "";
    const urlBrand = searchParams.get("brand") || "";
    const urlColor = searchParams.get("color") || "";
    const urlSize = searchParams.get("size") || "";
    const urlMaterial = searchParams.get("material") || "";
    const urlStyle = searchParams.get("style") || "";
    const urlMinPrice = searchParams.get("min_price") || "";
    const urlMaxPrice = searchParams.get("max_price") || "";
    const urlInStock = searchParams.get("in_stock");
    const urlIsFeatured = searchParams.get("is_featured");

    // Update state only if URL params differ from current state
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    if (urlSort !== selectedSort) {
      setSelectedSort(urlSort);
    }
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
      setDebouncedSearch(urlSearch);
    }
    if (urlPage !== page) {
      setPage(urlPage);
    }
    if (urlSubCategory !== subCategory) {
      setSubCategory(urlSubCategory);
    }
    if (urlBrand !== brand) {
      setBrand(urlBrand);
    }
    if (urlColor !== color) {
      setColor(urlColor);
    }
    if (urlSize !== size) {
      setSize(urlSize);
    }
    if (urlMaterial !== material) {
      setMaterial(urlMaterial);
    }
    if (urlStyle !== style) {
      setStyle(urlStyle);
    }
    if (urlMinPrice !== minPrice) {
      setMinPrice(urlMinPrice);
    }
    if (urlMaxPrice !== maxPrice) {
      setMaxPrice(urlMaxPrice);
    }
    
    const urlInStockValue = urlInStock === "true" ? true : urlInStock === "false" ? false : undefined;
    if (urlInStockValue !== inStock) {
      setInStock(urlInStockValue);
    }
    
    const urlIsFeaturedValue = urlIsFeatured === "true" ? true : urlIsFeatured === "false" ? false : undefined;
    if (urlIsFeaturedValue !== isFeatured) {
      setIsFeatured(urlIsFeaturedValue);
    }
  }, [searchParams, selectedCategory, selectedSort, searchQuery, page, subCategory, brand, color, size, material, style, minPrice, maxPrice, inStock, isFeatured]);

  // Update URL when filters change
  useEffect(() => {
    // Skip URL update on initial mount (state is already initialized from URL)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Mark that we're updating URL from state
    isUpdatingFromState.current = true;

    const params = new URLSearchParams();
    
    if (selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }
    if (subCategory) {
      params.set("sub_category", subCategory);
    }
    if (brand) {
      params.set("brand", brand);
    }
    if (color) {
      params.set("color", color);
    }
    if (size) {
      params.set("size", size);
    }
    if (material) {
      params.set("material", material);
    }
    if (style) {
      params.set("style", style);
    }
    if (minPrice) {
      params.set("min_price", minPrice);
    }
    if (maxPrice) {
      params.set("max_price", maxPrice);
    }
    if (inStock !== undefined) {
      params.set("in_stock", inStock.toString());
    }
    if (isFeatured !== undefined) {
      params.set("is_featured", isFeatured.toString());
    }
    if (selectedSort !== "newest") {
      params.set("sort", selectedSort);
    }
    if (page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : "/shop";
    const currentUrl = searchParams.toString() ? `/shop?${searchParams.toString()}` : "/shop";
    
    // Only update if URL is different to prevent unnecessary updates
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, selectedCategory, selectedSort, subCategory, brand, color, size, material, style, minPrice, maxPrice, inStock, isFeatured]);

  // Fetch products when filters change
  useEffect(() => {
    const sortOption = sortOptions.find(opt => opt.value === selectedSort);
    const apiParams: any = {
      page,
      limit: 20,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(selectedCategory !== "All Categories" && { category: selectedCategory }),
      ...(subCategory && { sub_category: subCategory }),
      ...(brand && { brand }),
      ...(color && { color }),
      ...(size && { size }),
      ...(material && { material }),
      ...(style && { style }),
      ...(minPrice && { min_price: parseFloat(minPrice) }),
      ...(maxPrice && { max_price: parseFloat(maxPrice) }),
      ...(inStock !== undefined && { in_stock: inStock }),
      ...(isFeatured !== undefined && { is_featured: isFeatured }),
      ...(sortOption && { sort_by: sortOption.sort_by, sort_order: sortOption.sort_order }),
    };

    // Create a string representation of params to compare
    const paramsString = JSON.stringify(apiParams);
    
    // Only fetch if params actually changed
    if (prevParamsRef.current === paramsString) {
      return;
    }
    
    prevParamsRef.current = paramsString;

    const fetchProducts = async () => {
      try {
        setError(null);

        console.log('Fetching products with params:', apiParams);
        const response = await callWithLoader(() => apiClient.getProducts(apiParams));

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
      }
    };

    fetchProducts();
  }, [page, debouncedSearch, selectedCategory, selectedSort, subCategory, brand, color, size, material, style, minPrice, maxPrice, inStock, isFeatured]);

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

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSubCategory("");
    setBrand("");
    setColor("");
    setSize("");
    setMaterial("");
    setStyle("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(undefined);
    setIsFeatured(undefined);
    setPage(1);
  };

  // Get total results count for display
  const totalResults = products.length > 0 ? `(${products.length} items)` : '';

  return (
    <div className="min-h-screen bg-base-navy font-body py-20 pt-32">
      <motion.div
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header & Title */}
        <motion.div className="mb-8" variants={filterItemVariants}>
          <h1 className="font-headings text-4xl md:text-6xl text-text-cream font-semibold mb-2">
            {selectedCategory !== "All Categories" ? selectedCategory : "Shop"}
          </h1>
          <p className="font-body text-lg text-text-lavender">
            {totalResults}
          </p>
        </motion.div>

        {/* Search Bar - Above sidebar/grid */}
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

        {/* Mobile Filter Button */}
        {isMobile && (
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="mb-6 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-card-taupe text-text-cream rounded-lg border border-divider-silver hover:border-cta-copper transition-colors"
            variants={filterItemVariants}
          >
            <FaSlidersH className="text-cta-copper" />
            <span>Filter & Sort</span>
          </motion.button>
        )}

        {/* Sidebar + Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters (Desktop) */}
          {!isMobile && (
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              isMobile={false}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              subCategory={subCategory}
              onSubCategoryChange={(val) => {
                setSubCategory(val);
                setPage(1);
              }}
              brand={brand}
              onBrandChange={(val) => {
                setBrand(val);
                setPage(1);
              }}
              color={color}
              onColorChange={(val) => {
                setColor(val);
                setPage(1);
              }}
              size={size}
              onSizeChange={(val) => {
                setSize(val);
                setPage(1);
              }}
              material={material}
              onMaterialChange={(val) => {
                setMaterial(val);
                setPage(1);
              }}
              style={style}
              onStyleChange={(val) => {
                setStyle(val);
                setPage(1);
              }}
              minPrice={minPrice}
              onMinPriceChange={(val) => {
                setMinPrice(val);
                setPage(1);
              }}
              maxPrice={maxPrice}
              onMaxPriceChange={(val) => {
                setMaxPrice(val);
                setPage(1);
              }}
              inStock={inStock}
              onInStockChange={(val) => {
                setInStock(val);
                setPage(1);
              }}
              isFeatured={isFeatured}
              onIsFeaturedChange={(val) => {
                setIsFeatured(val);
                setPage(1);
              }}
              onClearFilters={clearFilters}
              categories={categories}
            />
          )}

          {/* Mobile Filter Overlay */}
          {isMobile && (
            <FilterSidebar
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              isMobile={true}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setPage(1);
                setShowFilters(false);
              }}
              subCategory={subCategory}
              onSubCategoryChange={(val) => {
                setSubCategory(val);
                setPage(1);
              }}
              brand={brand}
              onBrandChange={(val) => {
                setBrand(val);
                setPage(1);
              }}
              color={color}
              onColorChange={(val) => {
                setColor(val);
                setPage(1);
              }}
              size={size}
              onSizeChange={(val) => {
                setSize(val);
                setPage(1);
              }}
              material={material}
              onMaterialChange={(val) => {
                setMaterial(val);
                setPage(1);
              }}
              style={style}
              onStyleChange={(val) => {
                setStyle(val);
                setPage(1);
              }}
              minPrice={minPrice}
              onMinPriceChange={(val) => {
                setMinPrice(val);
                setPage(1);
              }}
              maxPrice={maxPrice}
              onMaxPriceChange={(val) => {
                setMaxPrice(val);
                setPage(1);
              }}
              inStock={inStock}
              onInStockChange={(val) => {
                setInStock(val);
                setPage(1);
              }}
              isFeatured={isFeatured}
              onIsFeaturedChange={(val) => {
                setIsFeatured(val);
                setPage(1);
              }}
              onClearFilters={clearFilters}
              categories={categories}
            />
          )}

          {/* Main Content Area - Right Side */}
          <div className="flex-1">
            {/* Sort Bar */}
            <motion.div
              className="flex items-center justify-between mb-6 p-4 bg-card-taupe rounded-lg"
              variants={filterItemVariants}
            >
              <div className="flex items-center space-x-2">
                <FaSortAmountDown className="text-text-lavender" />
                <span className="text-text-lavender text-sm hidden sm:inline">Sort By:</span>
              </div>
              <Combobox
                id="sort"
                value={selectedSort}
                onChange={(value) => {
                  setSelectedSort(Array.isArray(value) ? value[0] || selectedSort : value);
                  setPage(1);
                }}
                options={sortOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                placeholder="Select sort option"
                allowCreate={false}
                multiple={false}
                className="text-sm"
              />
            </motion.div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="font-body text-highlight-wine text-xl">{error}</p>
          </div>
        )}

            {/* Product Grid: Dense 3-4 column layout */}
            {!isLoading && !error && (
              <>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={transformProduct(product)}
                    />
                  ))}
                </motion.div>

                {products.length === 0 && (
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
                      className="px-4 py-2 bg-card-taupe text-text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cta-copper transition-colors"
                    >
                      Previous
                    </button>
                    <span className="font-body text-text-lavender">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-card-taupe text-text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cta-copper transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-20">
                <p className="font-body text-highlight-wine text-xl">{error}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
