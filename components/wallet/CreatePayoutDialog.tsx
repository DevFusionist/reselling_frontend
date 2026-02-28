"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { walletService } from "@/services/wallet";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface CreatePayoutDialogProps {
  sellerId: string;
  availableBalance: number;
  onSuccess?: () => void;
}

export function CreatePayoutDialog({
  sellerId,
  availableBalance,
  onSuccess,
}: CreatePayoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amountNum > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    setLoading(true);
    try {
      await walletService.createPayoutRequest(sellerId, {
        amount: amountNum,
        bankAccount: bankAccount || undefined,
        notes: notes || undefined,
      });
      toast.success("Payout request created successfully");
      setOpen(false);
      setAmount("");
      setBankAccount("");
      setNotes("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create payout request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Request Payout</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Available balance: {formatPrice(availableBalance)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account (Optional)</Label>
              <Input
                id="bankAccount"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Account ending in 1234"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

