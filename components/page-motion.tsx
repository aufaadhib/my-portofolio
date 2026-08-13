"use client";

import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Coordinates route motion without mutating server-rendered descendants. */
export function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const isAdmin = usePathname().startsWith("/admin");

  useEffect(() => {
    if (!root.current || isAdmin) return;
    const scope = root.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      scope.classList.add("is-revealed");
      return;
    }

    let started = false;
    const reveal = () => {
      if (started) return;
      started = true;
      window.__portfolioRevealPending = false;
      gsap.delayedCall(0, () => scope.classList.add("is-revealed"));
    };

    window.addEventListener("portfolio:reveal", reveal, { once: true });
    const overlay = document.querySelector<HTMLElement>(".page-transition");
    if (window.__portfolioRevealPending || !overlay || getComputedStyle(overlay).visibility === "hidden") reveal();

    return () => {
      window.removeEventListener("portfolio:reveal", reveal);
      gsap.killTweensOf(scope);
    };
  }, [isAdmin]);

  return <div ref={root} className={`page-motion${isAdmin ? " is-revealed" : ""}`}>{children}</div>;
}
