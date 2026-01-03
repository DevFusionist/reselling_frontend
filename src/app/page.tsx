import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CommerceOS</h1>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900">
            Welcome to CommerceOS
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Multi-Model E-Commerce Platform with Direct Sales and Reseller
            Commissions
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/product/example-product"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              View Products
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
