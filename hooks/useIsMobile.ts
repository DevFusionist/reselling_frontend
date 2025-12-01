'use client';

import { useEffect, useState } from "react";

export function useIsMobile(maxWidth = 640) { // Tailwind 'sm' default
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < maxWidth);
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [maxWidth]);

  return isMobile;
}
