"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Coordinates the home-page intro, section reveals, and desktop scroll choreography. */
export function HomeMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scope = root.current;
    if (!scope) return;
    const media = gsap.matchMedia();

    media.add({ desktop: "(min-width: 901px) and (pointer: fine)", mobile: "(max-width: 900px), (pointer: coarse)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { desktop, reduce } = context.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
      const intro = gsap.utils.toArray<HTMLElement>("[data-home-intro]", scope);
      const revealImmediately = () => gsap.set(scope.querySelectorAll("[data-home-intro], [data-home-reveal], [data-home-card], [data-home-service], [data-home-footer]"), { clearProps: "all", autoAlpha: 1 });
      if (reduce) { revealImmediately(); return; }

      gsap.set(intro, { yPercent: 105, autoAlpha: 0 });
      gsap.set("[data-home-portrait-media]", { scale: 1.1, transformOrigin: "50% 50%" });
      gsap.set("[data-home-rule]", { scaleX: 0, transformOrigin: "0% 50%" });
      let introPlayed = false;
      const playIntro = () => {
        if (introPlayed) return;
        introPlayed = true;
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .to(intro, { yPercent: 0, autoAlpha: 1, duration: desktop ? 1.15 : .82, stagger: desktop ? .12 : .08, clearProps: "transform,opacity,visibility" })
          .to("[data-home-portrait-media]", { scale: 1.025, duration: 1.25, ease: "power4.out", clearProps: "transform" }, "-=.82")
          .to("[data-home-rule]", { scaleX: 1, duration: .95, ease: "power3.inOut", clearProps: "transform" }, "-=.9");
      };
      window.addEventListener("portfolio:reveal", playIntro, { once: true });
      const overlay = document.querySelector<HTMLElement>(".page-transition");
      if (window.__portfolioRevealPending || !overlay || getComputedStyle(overlay).visibility === "hidden") playIntro();

      const sections = gsap.utils.toArray<HTMLElement>("[data-home-section]", scope);
      sections.forEach((section) => {
        const heading = section.querySelectorAll<HTMLElement>("[data-home-reveal]");
        const cards = section.querySelectorAll<HTMLElement>("[data-home-card]");
        const services = section.querySelectorAll<HTMLElement>("[data-home-service]");
        const targets = heading.length ? heading : section.children;
        gsap.fromTo(targets, { y: desktop ? 74 : 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: desktop ? 1.05 : .76, stagger: .1, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: section, start: desktop ? "top 78%" : "top 86%", once: true } });
        if (cards.length) gsap.fromTo(cards, { y: 86, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.05, stagger: .14, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: cards[0], start: "top 84%", once: true } });
        if (services.length) gsap.fromTo(services, { x: desktop ? 46 : 0, y: desktop ? 0 : 30, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: .85, stagger: .12, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: services[0], start: "top 86%", once: true } });
      });

      const certificateCards = scope.querySelectorAll<HTMLElement>("[data-home-certificate]");
      if (certificateCards.length) gsap.fromTo(certificateCards, { x: desktop ? 72 : 34, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: desktop ? 1.05 : .78, stagger: .1, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: "[data-home-certificates]", start: desktop ? "top 84%" : "top 90%", once: true } });

      const footerItems = scope.querySelectorAll<HTMLElement>("[data-home-footer]");
      if (footerItems.length) gsap.fromTo(footerItems, { y: 42, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .9, stagger: .1, ease: "power3.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: footerItems[0], start: "top 88%", once: true } });

      if (desktop) {
        gsap.to("[data-home-hero-copy]", { yPercent: -14, ease: "none", scrollTrigger: { trigger: "[data-home-hero]", start: "top top", end: "bottom top", scrub: .8 } });
        scope.querySelectorAll<HTMLElement>("[data-home-image]").forEach((image) => gsap.fromTo(image, { scale: 1.08 }, { scale: 1, ease: "none", scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: .7 } }));
      }
      ScrollTrigger.refresh();
      return () => window.removeEventListener("portfolio:reveal", playIntro);
    });
    return () => media.revert();
  }, { scope: root });

  return <div ref={root} className="home-motion">{children}</div>;
}
