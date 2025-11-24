// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-12">
      {/* 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop"
            width={600}
            height={500}
            alt="About Image"
            className="rounded-xl shadow-lg object-cover"
          />
        </motion.div>

        {/* Right - Heading + Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* PAGE HEADER MOVED HERE */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 4,
              type: "spring",
              stiffness: 1000,
              delay: 0.2,
            }}
            className="text-5xl font-semibold mb-6 absolute top-32 left-1/2 ml-5"
          >
            About Us
          </motion.h1>

          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We are a modern e-commerce brand dedicated to delivering
            premium-quality products at the best prices. Our mission is to make
            shopping effortless, enjoyable, and accessible for everyone.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            With a curated selection of fashion, electronics, lifestyle
            products, and home essentials, we bring you items that elevate your
            everyday life. Customer satisfaction and trust are at the core of
            everything we do.
          </p>
        </motion.div>
      </div>

      {/* Promise Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-16 bg-white/60 dark:bg-black/30 p-10 rounded-xl backdrop-blur-md shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Our Promise</h2>
        <ul className="space-y-3 text-muted-foreground text-center">
          <li>✔ Premium quality products only</li>
          <li>✔ Fast & secure delivery</li>
          <li>✔ Reliable customer support</li>
          <li>✔ 100% secure transactions</li>
        </ul>
      </motion.div>
    </div>
  );
}
