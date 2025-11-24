// app/product/[id]/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

// Dummy Product Data
const product = {
  id: 1,
  title: "Premium Wireless Headphones",
  price: 2499,
  category: "Electronics",
  description:
    "Experience immersive sound with deep bass, noise cancellation, and premium build quality. Perfect for travel, gym, or daily use.",
  images: [
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590658268037-6e045c1f3f87?q=80&w=1200&auto=format&fit=crop",
  ],
  variants: {
    colors: ["Black", "Silver", "Blue"],
    storage: ["32GB", "64GB", "128GB"],
  },
};

export default function ProductDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(product.variants.storage[0]);

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Image Gallery */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-[450px] rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src={selectedImage}
            width={800}
            height={600}
            alt="Main Product"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Thumbnails */}
        <div className="flex gap-4 mt-6">
          {product.images.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`w-24 h-24 rounded-lg overflow-hidden cursor-pointer border ${
                selectedImage === img ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                width={100}
                height={100}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-semibold"
        >
          {product.title}
        </motion.h1>

        <p className="text-primary font-bold text-3xl mt-3">₹{product.price}</p>

        <p className="text-muted-foreground mt-6 leading-relaxed">
          {product.description}
        </p>

        {/* Variants */}
        <div className="mt-10 space-y-6">
          {/* Color Variant */}
          <div>
            <h3 className="font-medium mb-2">Color</h3>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-4">
              {product.variants.colors.map((c) => (
                <div key={c} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer">
                  <RadioGroupItem value={c} />
                  <label>{c}</label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Storage Variant */}
          <div>
            <h3 className="font-medium mb-2">Storage</h3>
            <RadioGroup
              value={selectedStorage}
              onValueChange={setSelectedStorage}
              className="flex gap-4"
            >
              {product.variants.storage.map((s) => (
                <div key={s} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer">
                  <RadioGroupItem value={s} />
                  <label>{s}</label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Add to Cart */}
        <Button className="mt-10 w-full py-6 text-lg rounded-full">Add to Cart</Button>

        {/* Additional Info */}
        <Card className="mt-10 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Why you'll love it</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✔ Premium build quality</li>
            <li>✔ Long battery life</li>
            <li>✔ Bluetooth 5.3 for stable connection</li>
            <li>✔ Noise cancellation support</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
