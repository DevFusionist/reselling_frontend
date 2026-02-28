"use client";

import { ShareLink } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ShareLinkPageContentProps {
  shareLink: ShareLink;
}

export function ShareLinkPageContent({ shareLink }: ShareLinkPageContentProps) {
  if (shareLink.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-4">
            Special Offer
          </Badge>
          <h1 className="text-3xl font-bold">{shareLink.product.name}</h1>
          {shareLink.sellerPrice && (
            <p className="mt-2 text-2xl font-bold text-primary">
              Special Price: {formatPrice(shareLink.sellerPrice)}
            </p>
          )}
        </div>
        <ProductCard product={shareLink.product} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Welcome!</h1>
          <p className="text-muted-foreground">
            This is a share link. Browse our products to find great deals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

