"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { walletService } from "@/services/wallet";
import { PayoutRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPayoutsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.roles.includes("ADMIN")) {
      router.push("/");
      return;
    }

    fetchPayouts();
  }, [user, isAuthenticated, router]);

  const fetchPayouts = async () => {
    try {
      const data = await walletService.getPayoutRequests();
      setPayouts(data.data);
    } catch (error) {
      console.error("Failed to fetch payouts:", error);
      toast.error("Failed to load payout requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPayout) return;

    setUpdating(true);
    try {
      // We need to add this method to walletService
      await walletService.updatePayoutStatus(selectedPayout.id, {
        status: newStatus,
        notes: notes || undefined,
      });
      toast.success(`Payout ${newStatus.toLowerCase()} successfully`);
      setStatusDialogOpen(false);
      setSelectedPayout(null);
      setNotes("");
      fetchPayouts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update payout status");
    } finally {
      setUpdating(false);
    }
  };

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

  const pendingPayouts = payouts.filter((p) => p.status === "PENDING");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payout Management</h1>
        <p className="text-muted-foreground">
          Manage reseller payout requests
        </p>
      </div>

      {pendingPayouts.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-300">
              {pendingPayouts.length} Pending Payout Request{pendingPayouts.length > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {payouts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No payout requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payout Request #{payout.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Seller: {payout.sellerId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(payout.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(payout.status) as any}>
                    {payout.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(parseFloat(payout.amount.toString()))}
                    </p>
                    {payout.bankAccount && (
                      <p className="text-sm text-muted-foreground">
                        Account: {payout.bankAccount}
                      </p>
                    )}
                    {payout.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {payout.notes}
                      </p>
                    )}
                  </div>
                  {payout.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedPayout(payout);
                          setNewStatus("APPROVED");
                          setStatusDialogOpen(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedPayout(payout);
                          setNewStatus("REJECTED");
                          setStatusDialogOpen(true);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === "APPROVED" ? "Approve" : "Reject"} Payout Request
            </DialogTitle>
            <DialogDescription>
              Update the status of payout request #{selectedPayout?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this action"
                disabled={updating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusDialogOpen(false);
                setSelectedPayout(null);
                setNotes("");
              }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updating}
              variant={newStatus === "REJECTED" ? "destructive" : "default"}
            >
              {updating ? "Updating..." : `${newStatus === "APPROVED" ? "Approve" : "Reject"} Payout`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
