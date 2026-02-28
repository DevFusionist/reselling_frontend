import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { productService } from "@/services/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import Script from "next/script";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await productService.getProductBySlug(params.slug);
    return {
      title: product.name,
      description: product.description || `Buy ${product.name} at the best price`,
      openGraph: {
        title: product.name,
        description: product.description || "",
        images: product.images[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  try {
    product = await productService.getProductBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const basePrice = product.variants[0]?.price
    ? typeof product.variants[0].price === "string"
      ? parseFloat(product.variants[0].price)
      : product.variants[0].price
    : 0;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: basePrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-square w-full bg-muted">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </Card>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-square w-full bg-muted">
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
            )}
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold text-primary">
              {formatPrice(basePrice)}
            </p>
          </div>

          {product.description && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {product.variants.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Variants</h2>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <Card key={variant.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{variant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {variant.stock}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(
                          typeof variant.price === "string"
                            ? parseFloat(variant.price)
                            : variant.price
                        )}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <AddToCartButton
            productId={product.id}
            variantId={product.variants[0]?.id}
            disabled={basePrice === 0}
          />
        </div>
      </div>
      </div>
    </>
  );
}

