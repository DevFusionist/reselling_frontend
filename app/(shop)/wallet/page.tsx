"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { walletService } from "@/services/wallet";
import { Wallet, WalletTransaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet as WalletIcon, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { CreatePayoutDialog } from "@/components/wallet/CreatePayoutDialog";

export default function WalletPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
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

    const fetchData = async () => {
      if (!user) return;
      try {
        const [walletData, transactionsData] = await Promise.all([
          walletService.getWallet(user.id),
          walletService.getTransactions(user.id, { take: 20 }),
        ]);
        setWallet(walletData);
        setTransactions(transactionsData.data);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, router]);

  const getTransactionIcon = (type: string) => {
    if (type.includes("CREATED") || type.includes("UNLOCKED")) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    if (type.includes("PAYOUT")) {
      return <TrendingDown className="h-4 w-4 text-blue-500" />;
    }
    return <ArrowUpRight className="h-4 w-4" />;
  };

  const getTransactionColor = (type: string) => {
    if (type.includes("CREATED") || type.includes("UNLOCKED")) {
      return "text-green-600 dark:text-green-400";
    }
    if (type.includes("PAYOUT")) {
      return "text-blue-600 dark:text-blue-400";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Wallet not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableBalance = parseFloat(wallet.availableBalance.toString());
  const pendingBalance = parseFloat(wallet.pendingBalance.toString());
  const totalEarnings = availableBalance + pendingBalance;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your earnings and payouts</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Balance Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(availableBalance)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatPrice(pendingBalance)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Awaiting order delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatPrice(totalEarnings)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              All-time earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="my-6 flex gap-4">
        <CreatePayoutDialog
          sellerId={user?.id || ""}
          availableBalance={availableBalance}
          onSuccess={() => {
            // Refresh wallet data
            if (user) {
              walletService.getWallet(user.id).then(setWallet);
            }
          }}
        />
        <Button asChild variant="outline">
          <Link href="/wallet/payouts">View Payout Requests</Link>
        </Button>
      </div>

      {/* Transactions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">{transaction.type.replace(/_/g, " ")}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description || "Transaction"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${getTransactionColor(transaction.type)}`}
                    >
                      {transaction.type.includes("PAYOUT") ? "-" : "+"}
                      {formatPrice(parseFloat(transaction.amount.toString()))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {formatPrice(parseFloat(transaction.balanceAfter.toString()))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

