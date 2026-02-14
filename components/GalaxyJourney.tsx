"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CelestialBody, Satellite } from "./GalaxyElements";
import { Rocket } from "./Rocket";

export function GalaxyJourney() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCelestialClick = useCallback(() => {
    if (!isRocketLaunching) {
      setIsRocketLaunching(true);
      // The rocket component handles the scroll sync
    }
  }, [isRocketLaunching]);

  const handleLaunchComplete = useCallback(() => {
    setIsRocketLaunching(false);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[50] overflow-hidden"
    >
      {/* Rocket Easter Egg */}
      <Rocket isLaunching={isRocketLaunching} onLaunchComplete={handleLaunchComplete} />

      {/* Celestial Body (Sun/Moon) - appears later in the scroll, positioned at right side */}
      <div
        className="absolute right-[8%] transition-all duration-1000 ease-out pointer-events-auto cursor-pointer hover:scale-110"
        style={{
          top: `${30 + scrollProgress * 25}%`,
          opacity: scrollProgress > 0.35 ? Math.min((scrollProgress - 0.35) * 2, 0.85) : 0,
          transform: `scale(${0.7 + scrollProgress * 0.4})`,
        }}
        onClick={handleCelestialClick}
        title="Click me! 🚀"
      >
        <CelestialBody />
      </div>

      {/* Satellite - orbits across the screen */}
      <div
        className="absolute transition-all duration-1000 ease-out"
        style={{
          left: `${5 + scrollProgress * 60}%`,
          top: `${25 + Math.sin(scrollProgress * Math.PI * 2) * 10}%`,
          opacity: scrollProgress > 0.15 && scrollProgress < 0.85
            ? Math.min((scrollProgress - 0.15) * 3, 0.9)
            : scrollProgress >= 0.85
              ? Math.max(0, (1 - scrollProgress) * 6)
              : 0,
          transform: `rotate(${scrollProgress * 15}deg)`,
        }}
      >
        <Satellite />
      </div>

    </div>
  );
}
