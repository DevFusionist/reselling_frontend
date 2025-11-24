"use client";

import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    bg: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop",
    title: "Discover the Art of Shopping",
    subtitle:
      "Experience premium fashion, gadgets, and home essentials — curated for the modern shopper.",
    float1:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
    float2:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  },
  {
    bg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
    title: "Style That Speaks",
    subtitle: "Premium outfits & accessories to elevate your personality.",
    float1:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    float2:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
  },
  {
    bg: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1600&auto=format&fit=crop",
    title: "Gadgets You’ll Love",
    subtitle:
      "From smart wearables to audio gear — shop the latest arrivals.",
    float1:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    float2:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Hero() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [active, setActive] = React.useState(0);

useEffect(() => {
  if (!emblaApi) return undefined; // Explicit return fixes the TS error

  const handler = () => {
    setActive(emblaApi.selectedScrollSnap());
  };

  emblaApi.on("select", handler);

  return () => {
    emblaApi.off("select", handler);
  };
}, [emblaApi]);


  return (
    <div className="relative w-full overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <motion.section
              key={i}
              className="relative flex-[0_0_100%] h-[90vh] flex items-center justify-center text-center px-6 sm:px-16 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center -z-10"
                style={{ backgroundImage: `url(${s.bg})`, opacity: 0.65 }}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/20 -z-10" />

              {/* Floating Left */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="absolute left-10 top-1/2 w-40 sm:w-52 rounded-xl overflow-hidden shadow-xl"
              >
                <img
                  src={s.float1}
                  className="object-cover w-full h-full"
                  alt="float"
                />
              </motion.div>

              {/* Floating Right */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="absolute right-10 bottom-20 w-40 sm:w-52 rounded-xl overflow-hidden shadow-xl"
              >
                <img
                  src={s.float2}
                  className="object-cover w-full h-full"
                  alt="float"
                />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="z-10 flex flex-col items-center gap-6"
              >
                <h1 className="text-5xl sm:text-6xl font-semibold text-white">
                  {s.title}
                </h1>
                <p className="text-gray-200 max-w-xl">{s.subtitle}</p>

                <Button
                  size="lg"
                  className="rounded-full mt-4 flex items-center gap-2 bg-primary text-primary-foreground hover:scale-105 transition"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-white transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-white transition"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-3 h-3 rounded-full transition ${
              active === i ? "bg-primary" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
