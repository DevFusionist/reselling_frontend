import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Reseller E-commerce - Modern Shopping Experience",
    template: "%s | Reseller E-commerce",
  },
  description: "Discover amazing products with the best prices. Shop now and enjoy fast delivery.",
  keywords: ["ecommerce", "shopping", "products", "reseller"],
  authors: [{ name: "Reseller Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reseller.com",
    siteName: "Reseller E-commerce",
    title: "Reseller E-commerce - Modern Shopping Experience",
    description: "Discover amazing products with the best prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reseller E-commerce",
    description: "Discover amazing products with the best prices.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

