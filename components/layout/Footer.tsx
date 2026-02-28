import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Reseller</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted e-commerce platform for amazing products and great
              prices.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/orders"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Reseller. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

