import { Suspense } from "react";
import { ProductDetails } from "@/components/server/ProductDetails";
import { ProductSkeleton } from "@/components/ui/skeletons";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ shareId?: string }>;
}

// 1. Dynamic Metadata (Server-Side)
export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { shareId } = await searchParams;

  const apiUrl =
    process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const product = await fetch(
      `${apiUrl}/products/${slug}/meta?shareId=${shareId || ""}`,
      {
        cache: "no-store",
      }
    ).then((r) => r.json());

    return {
      title: product.dealTitle || product.name,
      description: `Get it for ₹${product.price}`,
      openGraph: {
        title: product.dealTitle || product.name,
        description: `Get it for ₹${product.price}`,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch (error) {
    return {
      title: "Product",
      description: "View our product",
    };
  }
}

// 2. Main Page with Streaming
export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { shareId } = await searchParams;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Suspense allows the page shell (header/footer) to load instantly.
        The ProductDetails component streams in when the backend responds.
      */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails slug={slug} shareId={shareId} />
      </Suspense>
    </main>
  );
}

