"use client";

import { useState, useCallback } from "react";
import { CartItem } from "@/types";
import toast from "react-hot-toast";

const CART_STORAGE_KEY = "reseller_cart";

interface UseCartReturn {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "product" | "variant">) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const saveToStorage = useCallback((cartItems: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, []);

  const addToCart = useCallback(
    async (item: Omit<CartItem, "product" | "variant">) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = prev.map((i, idx) =>
            idx === existingIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          newItems = [...prev, item as CartItem];
        }

        saveToStorage(newItems);
        return newItems;
      });
      toast.success("Added to cart!");
    },
    [saveToStorage]
  );

  const removeFromCart = useCallback(
    (productId: string, variantId?: string) => {
      setItems((prev) => {
        const newItems = prev.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        );
        saveToStorage(newItems);
        return newItems;
      });
      toast.success("Removed from cart");
    },
    [saveToStorage]
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, variantId);
        return;
      }

      setItems((prev) => {
        const newItems = prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i
        );
        saveToStorage(newItems);
        return newItems;
      });
    },
    [saveToStorage, removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    saveToStorage([]);
  }, [saveToStorage]);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => {
      const price = item.sellerPrice || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };
}

