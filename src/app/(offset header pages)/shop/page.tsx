// app/shop/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Dummy product data
const products = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    price: 2499,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Modern Ceramic Vase",
    price: 799,
    category: "Home Decor",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Men's Classic Hoodie",
    price: 1299,
    category: "Fashion",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Smart Fitness Watch",
    price: 1899,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1539883371375-a5a5f0c59f56?q=80&w=800&auto=format&fit=crop",
  }
];

const categories = ["All", "Electronics", "Fashion", "Home Decor"];

export default function ShopPage() {
    const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 3000]);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-4 gap-10">
      {/* Filters Sidebar */}
      <aside className="space-y-8 sm:col-span-1 bg-white/60 dark:bg-black/20 backdrop-blur-md p-6 rounded-xl shadow-sm h-fit">
        <h2 className="text-xl font-semibold">Filters</h2>

        {/* Search */}
        <div>
          <label className="text-sm font-medium">Search</label>
          <Input
            placeholder="Search products..."
            className="mt-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <div className="flex flex-col gap-2 mt-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={cat === selectedCategory ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="w-fit"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium">Price Range (₹)</label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={3000}
            step={100}
            className="mt-4"
          />
          <p className="text-sm mt-2">₹{priceRange[0]} - ₹{priceRange[1]}</p>
        </div>
      </aside>

      {/* Products */}
      <div className="sm:col-span-3">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold mb-6"
        >
          Shop All Products
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-xl transition rounded-xl cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
                <Image
                  src={product.img}
                  width={400}
                  height={300}
                  alt={product.title}
                  className="object-cover w-full h-56"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-primary font-bold text-xl">₹{product.price}</p>
                  <Button className="w-full mt-2 rounded-full">Add to Cart</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
