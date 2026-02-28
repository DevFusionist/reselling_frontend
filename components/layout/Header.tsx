"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Reseller</span>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Products
          </Link>
          {isAuthenticated && user?.roles.includes("RESELLER") && (
            <>
              <Link
                href="/wallet"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Wallet
              </Link>
              <Link
                href="/share-links"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Share Links
              </Link>
            </>
          )}
          {isAuthenticated && user?.roles.includes("ADMIN") && (
            <Link
              href="/admin"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.roles.join(", ")}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

