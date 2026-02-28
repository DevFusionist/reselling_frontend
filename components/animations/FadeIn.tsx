"use client";

import { useEffect, useRef } from "react";
import { useAnimation } from "@/hooks/useGSAP";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { fadeIn } = useAnimation();

  useEffect(() => {
    if (ref.current) {
      fadeIn(ref.current, delay);
    }
  }, [delay, fadeIn]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

