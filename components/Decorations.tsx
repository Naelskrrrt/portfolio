"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const DawnSideRays = lazy(() => import("./SideRays").then((module) => ({ default: module.DawnSideRays })));
const GalaxyJourney = lazy(() => import("./GalaxyJourney").then((module) => ({ default: module.GalaxyJourney })));

export function Decorations() {
  const [idle, setIdle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Let the browser paint the content before loading the decorative WebGL layer.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 1000 });
      return () => window.cancelIdleCallback(id);
    }
    const frame = requestAnimationFrame(() => setIdle(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    // The satellite and celestial body are invisible until the visitor scrolls.
    const onScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="contents print:hidden">
      <Suspense fallback={null}>{idle ? <DawnSideRays /> : null}</Suspense>
      <Suspense fallback={null}>{scrolled ? <GalaxyJourney /> : null}</Suspense>
    </div>
  );
}
