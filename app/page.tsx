import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideIn } from "@/components/animations/SlideIn";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover amazing products with the best prices",
};

export default async function HomePage() {
  // Fetch featured products for homepage
  const productsData = await productService.getProducts({
    take: 8,
    isActive: true,
  });

  return (
    <>
      <Header />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <SlideIn direction="up" className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Reseller
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Discover amazing products with the best prices. Shop now and enjoy
              fast delivery.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Check out our most popular products
            </p>
          </div>

          {productsData.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productsData.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No products available at the moment.
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}

