"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";

// Soleil (Light mode) ou Lune (Dark mode) - flottant
export function CelestialBody() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(() => !mounted || resolvedTheme === "dark", [mounted, resolvedTheme]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none">
      {isDark ? <PixelMoon /> : <PixelSun />}
    </div>
  );
}

// Satellite animé qui orbite
export function Satellite() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(() => !mounted || resolvedTheme === "dark", [mounted, resolvedTheme]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none animate-satellite">
      <div className="relative">
        {/* Satellite body */}
        <svg width="32" height="20" viewBox="0 0 16 10" className="drop-shadow-lg">
          {/* Solar panels left */}
          <rect x="0" y="3" width="4" height="4" fill={isDark ? "#60a5fa" : "#3b82f6"} />
          <rect x="1" y="4" width="2" height="2" fill={isDark ? "#93c5fd" : "#60a5fa"} />

          {/* Main body */}
          <rect x="5" y="2" width="6" height="6" fill={isDark ? "#d4d4d8" : "#a1a1aa"} />
          <rect x="6" y="3" width="4" height="4" fill={isDark ? "#f4f4f5" : "#d4d4d8"} />

          {/* Antenna */}
          <rect x="7" y="0" width="2" height="2" fill={isDark ? "#fbbf24" : "#f59e0b"} />

          {/* Solar panels right */}
          <rect x="12" y="3" width="4" height="4" fill={isDark ? "#60a5fa" : "#3b82f6"} />
          <rect x="13" y="4" width="2" height="2" fill={isDark ? "#93c5fd" : "#60a5fa"} />
        </svg>

        {/* Signal waves */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div className="flex gap-0.5">
            <div
              className="w-0.5 h-1 rounded-full animate-pulse"
              style={{
                backgroundColor: isDark ? "rgba(251, 191, 36, 0.6)" : "rgba(245, 158, 11, 0.6)",
                animationDelay: "0s"
              }}
            />
            <div
              className="w-0.5 h-1.5 rounded-full animate-pulse"
              style={{
                backgroundColor: isDark ? "rgba(251, 191, 36, 0.8)" : "rgba(245, 158, 11, 0.8)",
                animationDelay: "0.2s"
              }}
            />
            <div
              className="w-0.5 h-1 rounded-full animate-pulse"
              style={{
                backgroundColor: isDark ? "rgba(251, 191, 36, 0.6)" : "rgba(245, 158, 11, 0.6)",
                animationDelay: "0.4s"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lune pixel art
function PixelMoon() {
  return (
    <div className="relative animate-float">
      {/* Moon glow */}
      <div className="absolute -inset-8 bg-yellow-100/10 rounded-full blur-2xl" />
      <div className="absolute -inset-4 bg-yellow-100/20 rounded-full blur-lg" />

      {/* Pixel moon - 16x16 style */}
      <svg width="64" height="64" viewBox="0 0 16 16" className="relative drop-shadow-lg">
        {/* Outer edge */}
        <rect x="5" y="0" width="6" height="1" fill="#fef9c3" />
        <rect x="3" y="1" width="2" height="1" fill="#fef9c3" />
        <rect x="11" y="1" width="2" height="1" fill="#fef9c3" />
        <rect x="2" y="2" width="1" height="1" fill="#fef9c3" />
        <rect x="13" y="2" width="1" height="1" fill="#fef9c3" />
        <rect x="1" y="3" width="1" height="2" fill="#fef9c3" />
        <rect x="14" y="3" width="1" height="2" fill="#fef9c3" />
        <rect x="0" y="5" width="1" height="6" fill="#fef9c3" />
        <rect x="15" y="5" width="1" height="6" fill="#fef9c3" />
        <rect x="1" y="11" width="1" height="2" fill="#fef9c3" />
        <rect x="14" y="11" width="1" height="2" fill="#fef9c3" />
        <rect x="2" y="13" width="1" height="1" fill="#fef9c3" />
        <rect x="13" y="13" width="1" height="1" fill="#fef9c3" />
        <rect x="3" y="14" width="2" height="1" fill="#fef9c3" />
        <rect x="11" y="14" width="2" height="1" fill="#fef9c3" />
        <rect x="5" y="15" width="6" height="1" fill="#fef9c3" />

        {/* Inner fill */}
        <rect x="3" y="2" width="10" height="12" fill="#fef3c7" />
        <rect x="2" y="3" width="12" height="10" fill="#fef3c7" />
        <rect x="1" y="5" width="14" height="6" fill="#fef3c7" />

        {/* Craters */}
        <rect x="4" y="4" width="2" height="2" fill="#fde68a" />
        <rect x="10" y="6" width="2" height="2" fill="#fde68a" />
        <rect x="6" y="9" width="3" height="2" fill="#fde68a" />
        <rect x="3" y="11" width="1" height="1" fill="#fde68a" />
      </svg>
    </div>
  );
}

// Soleil pixel art
function PixelSun() {
  return (
    <div className="relative animate-sun-pulse">
      {/* Sun glow */}
      <div className="absolute -inset-12 bg-yellow-400/10 rounded-full blur-3xl" />
      <div className="absolute -inset-6 bg-yellow-300/20 rounded-full blur-xl" />

      {/* Sun rays - animated */}
      <div className="absolute -inset-10 animate-spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-yellow-400/40 rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-yellow-400/40 rounded-full" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-yellow-400/40 rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-yellow-400/40 rounded-full" />
        {/* Diagonal rays */}
        <div className="absolute top-1 left-1 w-1 h-3 bg-yellow-400/30 rounded-full rotate-45 origin-bottom" />
        <div className="absolute top-1 right-1 w-1 h-3 bg-yellow-400/30 rounded-full -rotate-45 origin-bottom" />
        <div className="absolute bottom-1 left-1 w-1 h-3 bg-yellow-400/30 rounded-full -rotate-45 origin-top" />
        <div className="absolute bottom-1 right-1 w-1 h-3 bg-yellow-400/30 rounded-full rotate-45 origin-top" />
      </div>

      {/* Pixel sun - 16x16 style */}
      <svg width="64" height="64" viewBox="0 0 16 16" className="relative drop-shadow-lg">
        {/* Outer edge */}
        <rect x="5" y="0" width="6" height="1" fill="#fcd34d" />
        <rect x="3" y="1" width="2" height="1" fill="#fcd34d" />
        <rect x="11" y="1" width="2" height="1" fill="#fcd34d" />
        <rect x="2" y="2" width="1" height="1" fill="#fcd34d" />
        <rect x="13" y="2" width="1" height="1" fill="#fcd34d" />
        <rect x="1" y="3" width="1" height="2" fill="#fcd34d" />
        <rect x="14" y="3" width="1" height="2" fill="#fcd34d" />
        <rect x="0" y="5" width="1" height="6" fill="#fcd34d" />
        <rect x="15" y="5" width="1" height="6" fill="#fcd34d" />
        <rect x="1" y="11" width="1" height="2" fill="#fcd34d" />
        <rect x="14" y="11" width="1" height="2" fill="#fcd34d" />
        <rect x="2" y="13" width="1" height="1" fill="#fcd34d" />
        <rect x="13" y="13" width="1" height="1" fill="#fcd34d" />
        <rect x="3" y="14" width="2" height="1" fill="#fcd34d" />
        <rect x="11" y="14" width="2" height="1" fill="#fcd34d" />
        <rect x="5" y="15" width="6" height="1" fill="#fcd34d" />

        {/* Inner fill - gradient effect */}
        <rect x="3" y="2" width="10" height="12" fill="#fbbf24" />
        <rect x="2" y="3" width="12" height="10" fill="#fbbf24" />
        <rect x="1" y="5" width="14" height="6" fill="#fbbf24" />

        {/* Bright center */}
        <rect x="5" y="5" width="6" height="6" fill="#fcd34d" />
        <rect x="6" y="6" width="4" height="4" fill="#fef3c7" />
      </svg>
    </div>
  );
}

// Étoiles filantes occasionnelles
export function ShootingStar() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    // Créer quelques étoiles filantes avec des délais aléatoires
    const newStars = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60, // Position X entre 20% et 80%
      delay: i * 8 + Math.random() * 5, // Délai échelonné
    }));
    setStars(newStars);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute pointer-events-none animate-shooting-star"
          style={{
            left: `${star.x}%`,
            top: "5%",
            animationDelay: `${star.delay}s`,
          }}
        >
          <div className="w-0.5 h-8 bg-gradient-to-b from-white via-white/50 to-transparent rotate-[135deg] rounded-full" />
        </div>
      ))}
    </>
  );
}
