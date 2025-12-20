'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { label: 'Timepieces', href: '/shop?category=Timepieces', image: '/images/watch.png' },
  { label: 'Leather Goods', href: '/shop?category=Leather Goods', image: '/images/handbag.png' },
  { label: 'Accessories', href: '/shop?category=Accessories', image: '/images/wallet.png' },
  { label: 'Fragrances', href: '/shop?category=Fragrances', image: '/images/scent.png' },
  { label: 'Decor', href: '/shop?category=Decor', image: '/images/watch.png' },
  { label: 'New Arrivals', href: '/shop?sort=newest', image: '/images/handbag.png' },
  { label: 'Best Sellers', href: '/shop?sort=best-selling', image: '/images/watch.png' },
  { label: 'Sale', href: '/shop?sort=price-low', image: '/images/wallet.png' },
];

export default function CategoryLinks() {
  return (
    <section className="py-12 bg-base-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={category.href} className="block group">
                <div className="aspect-square rounded-full overflow-hidden bg-card-taupe mb-3 flex items-center justify-center border-2 border-divider-silver group-hover:border-cta-copper transition-colors">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/200x200/28242D/F0EAD6?text=Category';
                    }}
                  />
                </div>
                <p className="text-center text-sm text-text-lavender group-hover:text-cta-copper transition-colors font-medium">
                  {category.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

