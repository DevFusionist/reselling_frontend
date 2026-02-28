"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orders";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Order placed successfully!");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(params.id as string);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, isAuthenticated, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "PAID":
        return "default";
      case "SHIPPED":
        return "default";
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Order not found.</p>
            <Button asChild className="mt-4">
              <Link href="/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-muted-foreground">Order #{order.orderNumber}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium">Product {item.productId}</p>
                      {item.variantId && (
                        <p className="text-sm text-muted-foreground">
                          Variant: {item.variantId}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(parseFloat(item.totalPrice.toString()))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(parseFloat(item.unitPrice.toString()))} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.shippingAddress}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                {order.commission && parseFloat(order.commission.toString()) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commission</span>
                    <span>{formatPrice(parseFloat(order.commission.toString()))}</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(parseFloat(order.totalAmount.toString()))}
                  </span>
                </div>
              </div>
              {order.status === "DELIVERED" && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-950 dark:text-green-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Order Delivered</span>
                </div>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href="/orders">Back to Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

