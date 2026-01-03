import Link from "next/link";
import { Wallet, Package, LogOut, Home } from "lucide-react";
import { LogoutButton } from "@/components/client/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h1 className="text-xl font-bold text-gray-900">CommerceOS</h1>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Package className="h-5 w-5" />
              <span>My Products</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Home className="h-5 w-5" />
              <span>Store</span>
            </Link>
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700">
              <LogOut className="h-5 w-5" />
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

