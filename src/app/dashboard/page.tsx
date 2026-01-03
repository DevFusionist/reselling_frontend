"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";

interface WalletData {
  balance: number;
  totalEarnings: number;
  pendingCommission: number;
  transactions: Array<{
    id: string;
    type: "credit" | "debit";
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await axios.get(`${apiUrl}/wallet`, {
          withCredentials: true,
        });
        setWalletData(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load wallet data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading wallet data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!walletData) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your earnings and commissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ₹{walletData.balance.toLocaleString("en-IN")}
              </p>
            </div>
            <Wallet className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                ₹{walletData.totalEarnings.toLocaleString("en-IN")}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Commission</p>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                ₹{walletData.pendingCommission.toLocaleString("en-IN")}
              </p>
            </div>
            <TrendingDown className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y">
          {walletData.transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions yet
            </div>
          ) : (
            walletData.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-6"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`text-lg font-semibold ${
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"}₹
                  {transaction.amount.toLocaleString("en-IN")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

