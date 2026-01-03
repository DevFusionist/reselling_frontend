import { notFound } from "next/navigation";
import Image from "next/image";
import { BuyButton } from "@/components/client/BuyButton";

interface ProductDetailsProps {
  slug: string;
  shareId?: string;
}

export async function ProductDetails({ slug, shareId }: ProductDetailsProps) {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const response = await fetch(`${apiUrl}/products/${slug}?shareId=${shareId || ""}`, {
      cache: "no-store", // Dynamic rendering for reseller links
    });

    if (!response.ok) {
      notFound();
    }

    const product = await response.json();

    return (
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={product.image || product.thumbnail || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.dealTitle && (
              <p className="mt-2 text-lg text-gray-600">{product.dealTitle}</p>
            )}
          </div>

          {/* Price Display */}
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xl text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {/* Buy Button */}
          <BuyButton productId={product.id} shareId={shareId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}

