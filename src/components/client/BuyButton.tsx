"use client";

import { useState } from "react";
import { addToCart } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface BuyButtonProps {
  productId: string;
  shareId?: string;
}

export function BuyButton({ productId, shareId }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("productId", productId);
    if (shareId) {
      formData.append("shareId", shareId);
    }

    const result = await addToCart(formData);
    setLoading(false);

    if (result.success) {
      router.push("/cart");
    } else {
      alert(result.error || "Failed to add to cart");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Adding to cart..." : "Add to Cart"}
    </button>
  );
}

