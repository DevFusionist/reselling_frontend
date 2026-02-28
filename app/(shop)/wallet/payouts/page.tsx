"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { walletService } from "@/services/wallet";
import { PayoutRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PayoutRequestsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.roles.includes("RESELLER")) {
      router.push("/");
      return;
    }

    const fetchPayouts = async () => {
      if (!user) return;
      try {
        const data = await walletService.getPayoutRequests({ sellerId: user.id });
        setPayouts(data.data);
      } catch (error) {
        console.error("Failed to fetch payout requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [user, isAuthenticated, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      case "PROCESSED":
        return "default";
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
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/wallet">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Payout Requests</h1>
          <p className="text-muted-foreground">View your payout request history</p>
        </div>
      </div>

      {payouts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No payout requests found.</p>
            <Button asChild className="mt-4">
              <Link href="/wallet">Back to Wallet</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Request #{payout.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(payout.createdAt)}
                    </p>
                    {payout.updatedAt !== payout.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        Updated: {formatDate(payout.updatedAt)}
                      </p>
                    )}
                  </div>
                  <Badge variant={getStatusColor(payout.status) as any}>
                    {payout.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(parseFloat(payout.amount.toString()))}
                    </span>
                  </div>
                  {payout.bankAccount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Account</span>
                      <span>{payout.bankAccount}</span>
                    </div>
                  )}
                  {payout.notes && (
                    <div>
                      <span className="text-muted-foreground">Notes: </span>
                      <span>{payout.notes}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
