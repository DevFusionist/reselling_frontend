"use client";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/store/useWishlist";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();

  return (
    <div className="px-6 sm:px-16 py-24">
      <h1 className="text-4xl font-semibold mb-10">Your Wishlist</h1>

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-lg text-center py-24"
        >
          <Heart className="w-10 h-10 mx-auto mb-4 opacity-40" />
          Nothing saved yet — browse products and click the ❤️ icon.
        </motion.div>
      )}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Remove Button */}
              <Button
                onClick={() => toggle(item)}
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 text-xs text-red-600 rounded-full shadow hover:bg-white active:scale-95 transition"
              >
                Remove
              </Button>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-primary font-bold text-md">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
