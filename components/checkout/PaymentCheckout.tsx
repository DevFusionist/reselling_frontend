"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payments";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentCheckoutProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}

export function PaymentCheckout({
  orderId,
  amount,
  currency = "INR",
  onSuccess,
  onError,
}: PaymentCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading, please wait...");
      return;
    }

    setLoading(true);
    try {
      // Get current user ID from localStorage or context
      const userId = localStorage.getItem("userId") || "";

      // Create Razorpay order
      const { razorpayOrder } = await paymentService.createRazorpayOrder({
        orderId,
        userId,
        amount,
        currency,
        method: "CARD",
      });

      // Initialize Razorpay Checkout
      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Reseller E-commerce",
        description: `Order ${orderId}`,
        order_id: razorpayOrder.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          try {
            // Payment successful - webhook will handle verification
            toast.success("Payment successful!");
            onSuccess();
          } catch (error: any) {
            toast.error("Payment verification failed");
            onError?.("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "+919999999999",
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            onError?.("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initialize payment");
      onError?.(error.response?.data?.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !razorpayLoaded}
      className="w-full"
      size="lg"
    >
      {loading ? "Processing..." : `Pay ${formatPrice(amount)}`}
    </Button>
  );
}

