"use client";

import { Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-muted/40 border-t mt-24">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-16 py-16 grid grid-cols-1 sm:grid-cols-4 gap-12">
        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for the latest updates and exclusive
            deals.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border bg-background"
            />
            <button className="bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sitemap */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sitemap</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">Home</li>
            <li className="hover:text-foreground cursor-pointer">Shop</li>
            <li className="hover:text-foreground cursor-pointer">Categories</li>
            <li className="hover:text-foreground cursor-pointer">About Us</li>
            <li className="hover:text-foreground cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">FAQs</li>
            <li className="hover:text-foreground cursor-pointer">
              Shipping & Returns
            </li>
            <li className="hover:text-foreground cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-foreground cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Social + Payment Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex items-center gap-4 mb-6">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-primary transition" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-primary transition" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-primary transition" />
            <Youtube className="w-5 h-5 cursor-pointer hover:text-primary transition" />
          </div>

          <h4 className="text-md font-semibold mb-3">Payment Methods</h4>
          <div className="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              className="h-6"
              alt="Visa"
            />

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              className="h-6"
              alt="Mastercard"
            />

            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-stripe-3521720-2944983.png"
              className="h-6"
              alt="Stripe"
            />

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              className="h-6"
              alt="PayPal"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Horekmal — All rights reserved.
      </div>
    </footer>
  );
}
