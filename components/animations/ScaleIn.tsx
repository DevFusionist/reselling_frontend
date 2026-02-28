"use client";

import { useEffect, useRef } from "react";
import { useAnimation } from "@/hooks/useGSAP";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, className }: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scaleIn } = useAnimation();

  useEffect(() => {
    if (ref.current) {
      scaleIn(ref.current, delay);
    }
  }, [delay, scaleIn]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

