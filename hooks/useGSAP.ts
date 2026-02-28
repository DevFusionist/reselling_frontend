"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAP(callback: (ctx: gsap.Context) => void, deps: unknown[] = []) {
  const container = useRef<HTMLDivElement>(null);
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (container.current) {
      ctx.current = gsap.context(() => {
        const innerCtx = gsap.context(() => {});
        callback(innerCtx);
      }, container.current);
    }

    return () => {
      ctx.current?.revert();
    };
  }, deps);

  return container;
}

export function useAnimation() {
  const fadeIn = (element: HTMLElement | string, delay = 0) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
    );
  };

  const slideIn = (element: HTMLElement | string, direction: "left" | "right" | "up" | "down" = "up", delay = 0) => {
    const directions = {
      left: { x: -100 },
      right: { x: 100 },
      up: { y: 100 },
      down: { y: -100 },
    };

    gsap.fromTo(
      element,
      { ...directions[direction], opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.6, delay, ease: "power2.out" }
    );
  };

  const scaleIn = (element: HTMLElement | string, delay = 0) => {
    gsap.fromTo(
      element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, delay, ease: "back.out(1.7)" }
    );
  };

  return { fadeIn, slideIn, scaleIn };
}

