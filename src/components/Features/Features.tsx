"use client";

import { motion } from "framer-motion";

export default function Features() {
  const featureData = [
    {
      title: "Premium Quality",
      text: "Only the best, hand-picked items for your lifestyle.",
    },
    {
      title: "Fast Delivery",
      text: "Quick and reliable delivery across the country.",
    },
    {
      title: "Secure Payments",
      text: "Your transactions are encrypted and protected.",
    },
  ];

  return (
    <section className="py-24 px-6 sm:px-16 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-semibold mb-12"
      >
        Why Shop With Us?
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {featureData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.15, // stagger animation
            }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border shadow-sm bg-white/60 dark:bg-black/30 backdrop-blur-md"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
