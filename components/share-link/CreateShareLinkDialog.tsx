"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shareLinkService } from "@/services/shareLinks";
import { productService } from "@/services/products";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface CreateShareLinkDialogProps {
  sellerId: string;
  onSuccess?: () => void;
}

export function CreateShareLinkDialog({
  sellerId,
  onSuccess,
}: CreateShareLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [sellerPrice, setSellerPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productService.getProducts({ take: 100, isActive: true });
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await shareLinkService.createShareLink({
        sellerId,
        productId: productId || undefined,
        sellerPrice: sellerPrice ? parseFloat(sellerPrice) : undefined,
      });
      toast.success("Share link created successfully!");
      setOpen(false);
      setProductId("");
      setSellerPrice("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create share link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Share Link</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Share Link</DialogTitle>
            <DialogDescription>
              Create a shareable link for your products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product (Optional)</Label>
              <select
                id="product"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={loading || loadingProducts}
              >
                <option value="">Select a product (optional)</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Seller Price (Optional)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={sellerPrice}
                onChange={(e) => setSellerPrice(e.target.value)}
                placeholder="Enter your selling price"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

