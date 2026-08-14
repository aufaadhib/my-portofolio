"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);
type MotionVars = Parameters<typeof gsap.to>[1];

/** Coordinates one intro timeline and scroll reveals across non-home public routes. */
export function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // GSAP must wait until React has completed hydration. CSS owns the initial
  // hidden state, so there is no need for a pre-hydration inline gsap.set().
  useEffect(() => {
    const frame = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useGSAP(() => {
    if (!hydrated) return;
    const scope = root.current;
    if (!scope || isAdmin) return;
    let readyFrame = 0;
    let readyChecks = 0;
    const announceReady = () => {
      const marker = scope.querySelector("main [data-home-intro], main [data-page-intro]");
      if (!marker && readyChecks < 180) {
        readyChecks += 1;
        readyFrame = requestAnimationFrame(announceReady);
        return;
      }
      window.__portfolioPageReadyPath = pathname;
      window.dispatchEvent(new CustomEvent("portfolio:page-ready", { detail: { pathname } }));
    };
    announceReady();
    if (pathname === "/") return () => {
      cancelAnimationFrame(readyFrame);
      if (window.__portfolioPageReadyPath === pathname) delete window.__portfolioPageReadyPath;
    };
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 901px) and (pointer: fine)", mobile: "(max-width: 900px), (pointer: coarse)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { desktop, reduce } = context.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
      const collect = () => ({
        intro: gsap.utils.toArray<HTMLElement>("[data-page-intro]", scope),
        reveals: gsap.utils.toArray<HTMLElement>("[data-reveal]", scope),
        rules: gsap.utils.toArray<HTMLElement>("[data-rule]", scope),
        mediaImages: gsap.utils.toArray<HTMLElement>("[data-motion-media] img", scope),
        cardGroups: gsap.utils.toArray<HTMLElement>(".project-grid", scope),
        serviceGroups: gsap.utils.toArray<HTMLElement>(".service-list-page", scope),
        staggerGroups: gsap.utils.toArray<HTMLElement>("[data-motion-stagger]", scope),
      });
      if (reduce) {
        scope.classList.add("is-motion-ready");
        return () => scope.classList.remove("is-motion-ready");
      }

      let started = false;
      let retryFrame = 0;
      let retries = 0;
      const revealPage = () => {
        if (started) return;
        const { intro, reveals, rules, mediaImages, cardGroups, serviceGroups, staggerGroups } = collect();
        if (!intro.length && !reveals.length && retries < 30) {
          retries += 1;
          retryFrame = requestAnimationFrame(revealPage);
          return;
        }
        started = true;
        window.__portfolioRevealPending = false;
        // Remove the CSS fallback transform before GSAP writes y/yPercent.
        // Keeping both creates a stacked translate3d and causes visible jumps.
        scope.classList.add("is-motion-ready");
        if (intro.length) gsap.set(intro, { yPercent: 105, autoAlpha: 0, force3D: true });
        if (reveals.length) gsap.set(reveals, { y: desktop ? 62 : 34, autoAlpha: 0, force3D: true });
        if (rules.length) gsap.set(rules, { scaleX: 0, transformOrigin: "0% 50%", force3D: true });
        if (mediaImages.length) gsap.set(mediaImages, { scale: 1.045, transformOrigin: "50% 50%", force3D: true });
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (intro.length) timeline.to(intro, { yPercent: 0, autoAlpha: 1, duration: desktop ? 1.15 : .82, stagger: desktop ? .12 : .08, overwrite: "auto", clearProps: "transform,opacity,visibility" });
        if (rules.length) timeline.to(rules, { scaleX: 1, duration: .95, ease: "power3.inOut", clearProps: "transform" }, intro.length ? "-=.9" : 0);
        const grouped = new Set<HTMLElement>();
        const animateGroup = (group: HTMLElement, targets: HTMLElement[], from: MotionVars, to: MotionVars, start: string) => {
          if (!targets.length) return;
          targets.forEach((target) => grouped.add(target));
          gsap.fromTo(targets, from, { ...to, scrollTrigger: { trigger: group, start, once: true } });
        };
        cardGroups.forEach((group) => animateGroup(group, gsap.utils.toArray<HTMLElement>("[data-reveal]", group), { y: 86, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.05, stagger: .14, ease: "power3.out", overwrite: "auto", clearProps: "transform,opacity,visibility" }, "top 84%"));
        serviceGroups.forEach((group) => animateGroup(group, gsap.utils.toArray<HTMLElement>("[data-reveal]", group), { x: desktop ? 46 : 0, y: desktop ? 0 : 30, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: .85, stagger: .12, ease: "power3.out", overwrite: "auto", clearProps: "transform,opacity,visibility" }, "top 86%"));
        staggerGroups.forEach((group) => animateGroup(group, gsap.utils.toArray<HTMLElement>(":scope > [data-reveal]", group), { y: desktop ? 74 : 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: desktop ? 1.05 : .76, stagger: .1, ease: "power3.out", overwrite: "auto", clearProps: "transform,opacity,visibility" }, desktop ? "top 78%" : "top 86%"));
        reveals.filter((target) => !grouped.has(target)).forEach((target) => gsap.to(target, { y: 0, autoAlpha: 1, duration: desktop ? 1.05 : .76, ease: "power3.out", overwrite: "auto", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: target, start: desktop ? "top 78%" : "top 86%", once: true } }));
        mediaImages.forEach((image) => { if (image.parentElement) gsap.to(image, { scale: 1, duration: 1.25, ease: "power3.out", overwrite: "auto", clearProps: "transform", scrollTrigger: { trigger: image.parentElement, start: "top 88%", once: true } }); });
        ScrollTrigger.refresh();
      };
      window.addEventListener("portfolio:reveal", revealPage, { once: true });
      const overlay = document.querySelector<HTMLElement>(".page-transition");
      if (window.__portfolioRevealPending || !overlay || getComputedStyle(overlay).visibility === "hidden") revealPage();

      return () => {
        cancelAnimationFrame(retryFrame);
        scope.classList.remove("is-motion-ready");
        window.removeEventListener("portfolio:reveal", revealPage);
      };
    });
    return () => {
      cancelAnimationFrame(readyFrame);
      if (window.__portfolioPageReadyPath === pathname) delete window.__portfolioPageReadyPath;
      media.revert();
    };
  }, { scope: root, dependencies: [hydrated, isAdmin, pathname], revertOnUpdate: true });

  return <div ref={root} className="page-motion">{children}</div>;
}
