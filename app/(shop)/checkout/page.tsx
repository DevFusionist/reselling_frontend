"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { orderService } from "@/services/orders";
import { paymentService } from "@/services/payments";
import { PaymentCheckout } from "@/components/checkout/PaymentCheckout";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  const handleCreateOrder = async () => {
    if (!user || !shippingAddress.trim()) {
      toast.error("Please provide a shipping address");
      return;
    }

    setLoading(true);
    try {
      const orderData = await orderService.createOrder({
        userId: user.id,
        shippingAddress,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          sellerPrice: item.sellerPrice || 0,
        })),
      });

      setOrder(orderData);
      toast.success("Order created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/orders/${order.id}?success=true`);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const total = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your shipping address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  disabled={!!order}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">Product {item.productId}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice((item.sellerPrice || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              {!order ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreateOrder}
                  disabled={loading || !shippingAddress.trim()}
                >
                  {loading ? "Creating Order..." : "Create Order"}
                </Button>
              ) : (
                <PaymentCheckout
                  orderId={order.id}
                  amount={parseFloat(order.totalAmount.toString())}
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

