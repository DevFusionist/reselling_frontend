import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSlider from "@/components/cart/CartSlider";

// 🔠 Typography Pairing Implementation
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Light/Semi-Bold/Bold
  variable: "--font-cormorant-garamond",
  display: "swap", // Ensures smooth font loading
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"], // Regular/Medium
  variable: "--font-poppins",
  display: "swap",
});

// 🔍 Basic SEO Metadata (Technical SEO)
export const metadata: Metadata = {
  title: "Velvet Zenith | Luxury Hybrid E-commerce",
  description:
    "Exclusive platform for luxury goods, curated for buyers and high-performance resellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <CartSlider />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
