"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  variantId,
  disabled,
  className,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        productId,
        variantId,
        quantity: 1,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      size="lg"
      className={className}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

