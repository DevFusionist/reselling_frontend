"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/orders";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.roles.includes("ADMIN")) {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [user, isAuthenticated, router, statusFilter]);

  const fetchOrders = async () => {
    try {
      const params: any = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const data = await orderService.getOrders(params);
      setOrders(data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

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
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      User: {order.userId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item(s)
                    </p>
                    <p className="text-lg font-semibold">
                      Total: {formatPrice(parseFloat(order.totalAmount.toString()))}
                    </p>
                    {order.sellerId && (
                      <p className="text-sm text-muted-foreground">
                        Reseller: {order.sellerId}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button asChild variant="outline">
                      <Link href={`/orders/${order.id}`}>
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
