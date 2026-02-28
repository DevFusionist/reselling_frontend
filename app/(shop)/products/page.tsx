import { Metadata } from "next";
import { productService } from "@/services/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our wide selection of products",
};

interface ProductsPageProps {
  searchParams: {
    categoryId?: string;
    search?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || "1");
  const take = 12;
  const skip = (page - 1) * take;

  const productsData = await productService.getProducts({
    skip,
    take,
    categoryId: searchParams.categoryId,
    isActive: true,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          {productsData.total} products available
        </p>
      </div>

      <Suspense fallback={<ProductsSkeleton />}>
        {productsData.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsData.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No products found.
          </div>
        )}
      </Suspense>

      {/* Pagination would go here */}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="mt-4 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

