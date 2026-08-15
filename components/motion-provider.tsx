"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Provides desktop smooth scrolling without mutating route content. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const lenis = new Lenis({
            autoRaf: false,
            lerp: 0.1,
            smoothWheel: true,
            syncTouch: false,
          });
          const raf = (time: number) => lenis.raf(time * 1000);
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(raf);
          return () => {
            gsap.ticker.remove(raf);
            lenis.destroy();
          };
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} id="page-root">
      {children}
    </div>
  );
}
