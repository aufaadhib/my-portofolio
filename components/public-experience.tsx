"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MotionProvider } from "@/components/motion-provider";
import { SiteHeader } from "@/components/site-header";
import { copy, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "portfolio-intro-seen";
const TransitionContext = createContext<(href: string) => void>(() => undefined);
export const usePublicTransition = () => useContext(TransitionContext);

export function PublicExperience({ children, locale }: { children: ReactNode; locale: Locale }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pendingPath = useRef<string | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);

  const reveal = useCallback((firstVisit: boolean) => {
    if (!overlay.current) return;
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay.current, { visibility: "hidden" });
        content.current?.removeAttribute("inert");
        content.current?.setAttribute("aria-busy", "false");
      },
    });
    const startPageMotion = () => {
      window.__portfolioRevealPending = true;
      window.dispatchEvent(new Event("portfolio:reveal"));
    };
    if (firstVisit && !reduce) {
      timeline
        .fromTo(
          "[data-transition-mark]",
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.82, ease: "power3.out" },
        )
        .fromTo(
          "[data-transition-progress]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.18, ease: "power2.inOut" },
          "-=.1",
        )
        .to(overlay.current, { yPercent: -100, duration: 1.08, ease: "power4.inOut" }, "+=.28")
        .call(startPageMotion, [], "+=.1");
    } else {
      timeline
        .fromTo(
          "[data-transition-progress]",
          { scaleX: 0 },
          { scaleX: 1, duration: reduce ? 0.01 : 0.82, ease: "power2.inOut" },
        )
        .to(
          overlay.current,
          { yPercent: -100, duration: reduce ? 0.01 : 0.9, ease: "power4.inOut" },
          "+=.16",
        )
        .call(startPageMotion, [], reduce ? ">" : ">+.08");
    }
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    const frame = requestAnimationFrame(() => {
      const firstVisit = !sessionStorage.getItem(STORAGE_KEY);
      sessionStorage.setItem(STORAGE_KEY, "1");
      setReady(true);
      reveal(firstVisit);
    });
    return () => cancelAnimationFrame(frame);
  }, [isAdmin, reveal]);

  useEffect(() => {
    if (!ready || pendingPath.current === null) return;
    let focusFrame = 0;
    const finishNavigation = () => {
      if (pendingPath.current === null) return;
      pendingPath.current = null;
      reveal(false);
      focusFrame = requestAnimationFrame(() => {
        const main = document.querySelector<HTMLElement>("#page-root main");
        if (main) {
          main.tabIndex = -1;
          main.focus({ preventScroll: true });
        }
      });
    };
    const handlePageReady = (event: Event) => {
      const readyPath = (event as CustomEvent<{ pathname: string }>).detail.pathname;
      if (readyPath === pathname) finishNavigation();
    };
    window.addEventListener("portfolio:page-ready", handlePageReady);
    if (window.__portfolioPageReadyPath === pathname) finishNavigation();
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("portfolio:page-ready", handlePageReady);
    };
  }, [pathname, ready, reveal]);

  const navigate = useCallback(
    (href: string) => {
      if (isAdmin || !overlay.current || href === pathname) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      pendingPath.current = href;
      window.__portfolioPageReadyPath = undefined;
      window.__portfolioRevealPending = false;
      content.current?.setAttribute("inert", "");
      content.current?.setAttribute("aria-busy", "true");
      gsap.set(overlay.current, { visibility: "visible", yPercent: 100 });
      gsap.set("[data-transition-mark]", { autoAlpha: 0 });
      gsap.set("[data-transition-progress]", { scaleX: 0 });
      gsap.to(overlay.current, {
        yPercent: 0,
        duration: reduce ? 0.01 : 0.72,
        ease: "power4.inOut",
        onComplete: () => router.push(href),
      });
      safetyTimer.current = setTimeout(() => {
        pendingPath.current = null;
        reveal(false);
      }, 5000);
    },
    [isAdmin, pathname, reveal, router],
  );

  useEffect(() => {
    if (isAdmin) return;
    const handleClick = (event: globalThis.MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname.startsWith("/admin") ||
        url.pathname === pathname ||
        url.hash
      )
        return;
      event.preventDefault();
      navigate(`${url.pathname}${url.search}`);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isAdmin, navigate, pathname]);

  useEffect(() => {
    if (isAdmin) return;
    const handleHistory = () => {
      if (!overlay.current) return;
      pendingPath.current = "history";
      window.__portfolioPageReadyPath = undefined;
      window.__portfolioRevealPending = false;
      content.current?.setAttribute("inert", "");
      content.current?.setAttribute("aria-busy", "true");
      gsap.set(overlay.current, { visibility: "visible", yPercent: 0 });
      gsap.set("[data-transition-mark]", { autoAlpha: 0 });
      gsap.set("[data-transition-progress]", { scaleX: 0 });
    };
    window.addEventListener("popstate", handleHistory);
    return () => window.removeEventListener("popstate", handleHistory);
  }, [isAdmin]);

  useGSAP(
    () => () => {
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    },
    [],
  );

  if (isAdmin) return children;
  return (
    <TransitionContext.Provider value={navigate}>
      <div
        ref={overlay}
        className="page-transition"
        role="status"
        aria-live="polite"
        aria-label={copy[locale].loading}
      >
        <div className="page-transition-inner">
          <div data-transition-mark className="transition-mark">
            <span>FA</span>
            <small>PORTFOLIO / 2026</small>
          </div>
          <div className="transition-progress">
            <span data-transition-progress />
          </div>
        </div>
      </div>
      <div ref={content} aria-busy="true">
        <a className="skip-link" href="#page-root">
          {copy[locale].skip}
        </a>
        <MotionProvider>
          <SiteHeader locale={locale} labels={copy[locale]} />
          {children}
        </MotionProvider>
      </div>
    </TransitionContext.Provider>
  );
}

export function TransitionLink({
  href,
  onClick,
  ...props
}: LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>) {
  const navigate = useContext(TransitionContext);
  const target = typeof href === "string" ? href : (href.pathname ?? "");
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      !target.startsWith("/") ||
      target.startsWith("/admin") ||
      target.includes("#")
    )
      return;
    event.preventDefault();
    navigate(target);
  }
  return <Link href={href} onClick={handleClick} {...props} />;
}
