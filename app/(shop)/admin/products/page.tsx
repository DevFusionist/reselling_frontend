"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { productService } from "@/services/products";
import { Product } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import apiClient from "@/lib/api/client";

export default function AdminProductsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.roles.includes("ADMIN")) {
      router.push("/");
      return;
    }

    fetchProducts();
  }, [user, isAuthenticated, router]);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts({ take: 100 });
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await apiClient.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage all products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No products found.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/products/create">Create First Product</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const basePrice = product.variants[0]?.price
              ? typeof product.variants[0].price === "string"
                ? parseFloat(product.variants[0].price)
                : product.variants[0].price
              : 0;

            return (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {product.category && (
                      <p className="text-sm text-muted-foreground">
                        {product.category.name}
                      </p>
                    )}
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(basePrice)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.variants.length} variant(s)
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
