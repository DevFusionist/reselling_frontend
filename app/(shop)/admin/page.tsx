"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag, Wallet, Users, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
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

    setLoading(false);
  }, [user, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your e-commerce platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <Link href="/admin/products">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage products and categories
              </p>
              <Button variant="ghost" className="mt-4 w-full">
                Manage <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <Link href="/admin/orders">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage all orders
              </p>
              <Button variant="ghost" className="mt-4 w-full">
                Manage <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <Link href="/admin/payouts">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Approve or reject payout requests
              </p>
              <Button variant="ghost" className="mt-4 w-full">
                Manage <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <Link href="/admin/categories">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage product categories
              </p>
              <Button variant="ghost" className="mt-4 w-full">
                Manage <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
