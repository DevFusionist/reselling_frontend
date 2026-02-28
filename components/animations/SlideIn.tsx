"use client";

import { useEffect, useRef } from "react";
import { useAnimation } from "@/hooks/useGSAP";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  className,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { slideIn } = useAnimation();

  useEffect(() => {
    if (ref.current) {
      slideIn(ref.current, direction, delay);
    }
  }, [direction, delay, slideIn]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

