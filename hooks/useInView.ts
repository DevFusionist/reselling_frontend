'use client';

import { useEffect, useState, useRef } from "react";

export function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
