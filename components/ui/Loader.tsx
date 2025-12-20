'use client';

import { motion } from 'framer-motion';
import { useLoading } from '@/contexts/LoadingContext';

export default function Loader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Background blurred interface effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-purple-900/20 to-transparent blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-900/20 to-transparent blur-3xl" />
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Central Animation Container */}
        <div className="relative mb-8 h-64 w-64">
          {/* Outer Golden Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-amber-400/60"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Particle Swirl Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Purple particles (left/top) */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`purple-${i}`}
                className="absolute h-2 w-2 rounded-full bg-purple-400"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [
                    Math.cos((i * 18) * Math.PI / 180) * 60,
                    Math.cos((i * 18) * Math.PI / 180) * 100,
                    Math.cos((i * 18) * Math.PI / 180) * 60,
                  ],
                  y: [
                    Math.sin((i * 18) * Math.PI / 180) * 60,
                    Math.sin((i * 18) * Math.PI / 180) * 100,
                    Math.sin((i * 18) * Math.PI / 180) * 60,
                  ],
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.3, 0.9, 0.3],
                }}
                transition={{
                  duration: 2 + (i * 0.1),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }}
              />
            ))}

            {/* Orange/Yellow particles (right/bottom) */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`orange-${i}`}
                className="absolute h-2 w-2 rounded-full bg-orange-400"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [
                    Math.cos((i * 18 + 180) * Math.PI / 180) * 60,
                    Math.cos((i * 18 + 180) * Math.PI / 180) * 100,
                    Math.cos((i * 18 + 180) * Math.PI / 180) * 60,
                  ],
                  y: [
                    Math.sin((i * 18 + 180) * Math.PI / 180) * 60,
                    Math.sin((i * 18 + 180) * Math.PI / 180) * 100,
                    Math.sin((i * 18 + 180) * Math.PI / 180) * 60,
                  ],
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.3, 0.9, 0.3],
                }}
                transition={{
                  duration: 2 + (i * 0.1),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }}
              />
            ))}

            {/* Central dark void */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-black/40 blur-xl" />
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="mb-6 flex items-center gap-2">
          {/* Left quotation mark */}
          <motion.span
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            «
          </motion.span>

          {/* VZ Logo Circle */}
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-2xl font-bold text-white">VZ</span>
          </motion.div>
        </div>

        {/* Brand Name */}
        <motion.h1
          className="mb-2 text-4xl font-bold uppercase tracking-wider text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          VELVET ZENITH
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-sm uppercase tracking-widest text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.4,
          }}
        >
          SECURELY ACCESSING YOUR REALM....
        </motion.p>

        {/* Bottom-right icon */}
        <motion.div
          className="absolute bottom-8 right-8"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            delay: 0.5,
          }}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

