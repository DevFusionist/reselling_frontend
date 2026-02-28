"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FadeIn } from "@/components/animations/FadeIn";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const basePrice = product.variants[0]?.price
    ? typeof product.variants[0].price === "string"
      ? parseFloat(product.variants[0].price)
      : product.variants[0].price
    : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        productId: product.id,
        variantId: product.variants[0]?.id,
        quantity: 1,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <FadeIn>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 font-semibold transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="mb-2 text-sm text-muted-foreground">{product.category.name}</p>
        )}
        <p className="text-lg font-bold text-primary">{formatPrice(basePrice)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isAdding || basePrice === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
    </FadeIn>
  );
}

