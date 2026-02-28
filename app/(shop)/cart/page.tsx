"use client";

import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productService } from "@/services/products";
import { Product } from "@/types";
import Image from "next/image";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const productMap: Record<string, Product> = {};
      for (const item of items) {
        try {
          const product = await productService.getProduct(item.productId);
          productMap[item.productId] = product;
        } catch (error) {
          console.error(`Failed to fetch product ${item.productId}:`, error);
        }
      }
      setProducts(productMap);
      setLoading(false);
    };

    if (items.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [items]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Start shopping to add items to your cart
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const total = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const product = products[item.productId];
                const variant = product?.variants.find((v) => v.id === item.variantId);
                const image = product?.images.find((img) => img.isPrimary) || product?.images[0];
                const price = item.sellerPrice || (variant?.price ? (typeof variant.price === "string" ? parseFloat(variant.price) : variant.price) : 0);

                return (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-4 border-b pb-4 last:border-0"
                  >
                    {image && (
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={image.url}
                          alt={image.alt || product?.name || "Product"}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{product?.name || "Product"}</h3>
                        {variant && <p className="text-sm text-muted-foreground">{variant.name}</p>}
                        <p className="font-semibold text-primary">{formatPrice(price)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="h-8 w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

