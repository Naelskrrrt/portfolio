"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function PixelSceneBackground({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <div className="relative">
      {/* Pixel Scene Background - Fixed at bottom */}
      <div className="absolute inset-0 overflow-hidden">
        {isDark ? <NightScene /> : <DayScene />}
      </div>

      {/* Gradient fade from top (background color to transparent) */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, #0a0e1a 0%, #0a0e1a 20%, transparent 100%)"
            : "linear-gradient(to bottom, #ffffff 0%, #ffffff 20%, transparent 100%)"
        }}
      />

      {/* Content on top */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}

function NightScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]">
      {/* Stars */}
      <div className="absolute inset-0">
        {/* Layer 1 - Twinkling stars */}
        <Star x={5} y={15} size={2} className="animate-twinkle star-1" />
        <Star x={15} y={30} size={3} className="animate-twinkle star-2" />
        <Star x={25} y={12} size={2} className="animate-twinkle star-3" />
        <Star x={35} y={35} size={2} className="animate-twinkle star-4" />
        <Star x={45} y={20} size={3} className="animate-twinkle star-5" />
        <Star x={55} y={40} size={2} className="animate-twinkle star-6" />
        <Star x={65} y={18} size={2} className="animate-twinkle star-7" />
        <Star x={75} y={32} size={3} className="animate-twinkle star-8" />
        <Star x={85} y={22} size={2} className="animate-twinkle star-1" />
        <Star x={92} y={38} size={2} className="animate-twinkle star-3" />

        {/* Layer 2 - Delayed twinkling stars */}
        <Star x={10} y={50} size={1} className="animate-twinkle-delayed star-2" />
        <Star x={20} y={55} size={2} className="animate-twinkle-delayed star-4" />
        <Star x={30} y={48} size={1} className="animate-twinkle-delayed star-6" />
        <Star x={40} y={52} size={2} className="animate-twinkle-delayed star-8" />
        <Star x={50} y={58} size={1} className="animate-twinkle-delayed star-1" />
        <Star x={60} y={50} size={2} className="animate-twinkle-delayed star-3" />
        <Star x={70} y={55} size={1} className="animate-twinkle-delayed star-5" />
        <Star x={80} y={48} size={2} className="animate-twinkle-delayed star-7" />
        <Star x={90} y={52} size={1} className="animate-twinkle-delayed star-2" />

        {/* Static dim stars */}
        <Star x={8} y={25} size={1} className="opacity-40" />
        <Star x={18} y={20} size={1} className="opacity-30" />
        <Star x={28} y={28} size={1} className="opacity-50" />
        <Star x={38} y={24} size={1} className="opacity-40" />
        <Star x={48} y={30} size={1} className="opacity-30" />
        <Star x={58} y={26} size={1} className="opacity-50" />
        <Star x={68} y={28} size={1} className="opacity-40" />
        <Star x={78} y={22} size={1} className="opacity-30" />
        <Star x={88} y={30} size={1} className="opacity-50" />
        <Star x={95} y={15} size={1} className="opacity-40" />
      </div>

      {/* Dawn breaking behind the mountains — journey's end, where the sun rises */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none animate-dawn-breathe"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 72% 105%, rgba(232, 133, 58, 0.22) 0%, rgba(201, 106, 31, 0.08) 45%, transparent 70%)",
        }}
      />

      {/* Mountains silhouette */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 400 80"
          className="w-full h-20 md:h-24"
          preserveAspectRatio="none"
        >
          {/* Far mountains */}
          <polygon
            points="0,80 0,50 30,35 60,45 90,30 120,40 150,25 180,38 210,28 240,42 270,32 300,45 330,30 360,40 390,35 400,45 400,80"
            fill="#0f0f1a"
          />
          {/* Near mountains */}
          <polygon
            points="0,80 0,60 40,45 80,55 120,40 160,52 200,38 240,50 280,42 320,55 360,45 400,52 400,80"
            fill="#1a1a2e"
          />
        </svg>
      </div>

      {/* Pixel trees */}
      <div className="absolute bottom-6 left-[10%]">
        <PixelTree color="#0f0f1a" />
      </div>
      <div className="absolute bottom-6 left-[25%]">
        <PixelTree color="#1a1a2e" size="sm" />
      </div>
      <div className="absolute bottom-6 right-[20%]">
        <PixelTree color="#0f0f1a" />
      </div>
      <div className="absolute bottom-6 right-[35%]">
        <PixelTree color="#1a1a2e" size="sm" />
      </div>
    </div>
  );
}

function DayScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F6FF]">
      {/* Clouds */}
      <div className="absolute top-[20%] left-[10%] animate-float-slow cloud-1">
        <PixelCloud />
      </div>
      <div className="absolute top-[35%] left-[40%] animate-float-slow cloud-2">
        <PixelCloud size="sm" />
      </div>
      <div className="absolute top-[25%] right-[25%] animate-float-slow cloud-3">
        <PixelCloud />
      </div>

      {/* Rolling hills */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 400 100"
          className="w-full h-24 md:h-32"
          preserveAspectRatio="none"
        >
          {/* Far hill */}
          <ellipse cx="100" cy="100" rx="150" ry="60" fill="#86efac" />
          <ellipse cx="300" cy="100" rx="180" ry="70" fill="#86efac" />

          {/* Near hill */}
          <ellipse cx="200" cy="110" rx="250" ry="80" fill="#4ade80" />
          <ellipse cx="50" cy="115" rx="100" ry="50" fill="#4ade80" />
          <ellipse cx="380" cy="115" rx="120" ry="55" fill="#4ade80" />

          {/* Ground */}
          <rect x="0" y="85" width="400" height="20" fill="#22c55e" />
        </svg>
      </div>

      {/* Pixel trees */}
      <div className="absolute bottom-8 left-[8%]">
        <PixelTreeDay />
      </div>
      <div className="absolute bottom-10 left-[22%]">
        <PixelTreeDay size="sm" />
      </div>
      <div className="absolute bottom-8 right-[15%]">
        <PixelTreeDay />
      </div>
      <div className="absolute bottom-10 right-[30%]">
        <PixelTreeDay size="sm" />
      </div>
      <div className="absolute bottom-9 left-[45%]">
        <PixelTreeDay size="sm" />
      </div>

      {/* Flowers */}
      <div className="absolute bottom-4 left-[15%]">
        <PixelFlower color="#f472b6" />
      </div>
      <div className="absolute bottom-4 left-[35%]">
        <PixelFlower color="#fbbf24" />
      </div>
      <div className="absolute bottom-4 right-[40%]">
        <PixelFlower color="#f87171" />
      </div>
      <div className="absolute bottom-4 right-[22%]">
        <PixelFlower color="#a78bfa" />
      </div>
    </div>
  );
}

// Pixel Art Components

function Star({ x, y, size, className = "" }: { x: number; y: number; size: number; className?: string }) {
  return (
    <div
      className={`absolute bg-white ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size * 2}px`,
        height: `${size * 2}px`,
        boxShadow: `0 0 ${size}px ${size / 2}px rgba(255, 255, 255, 0.5)`,
      }}
    />
  );
}

function PixelMoon() {
  return (
    <div className="relative">
      {/* Moon glow */}
      <div className="absolute -inset-4 bg-yellow-100/20 rounded-full blur-lg" />

      {/* Pixel moon - 8x8 grid style */}
      <svg width="32" height="32" viewBox="0 0 8 8" className="relative">
        <rect x="2" y="0" width="4" height="1" fill="#fef9c3" />
        <rect x="1" y="1" width="1" height="1" fill="#fef9c3" />
        <rect x="2" y="1" width="4" height="1" fill="#fef3c7" />
        <rect x="6" y="1" width="1" height="1" fill="#fef9c3" />
        <rect x="0" y="2" width="1" height="4" fill="#fef9c3" />
        <rect x="1" y="2" width="6" height="4" fill="#fef3c7" />
        <rect x="7" y="2" width="1" height="4" fill="#fef9c3" />
        {/* Craters */}
        <rect x="2" y="3" width="1" height="1" fill="#fde68a" />
        <rect x="5" y="4" width="1" height="1" fill="#fde68a" />
        <rect x="3" y="5" width="1" height="1" fill="#fde68a" />
        <rect x="1" y="6" width="1" height="1" fill="#fef9c3" />
        <rect x="2" y="6" width="4" height="1" fill="#fef3c7" />
        <rect x="6" y="6" width="1" height="1" fill="#fef9c3" />
        <rect x="2" y="7" width="4" height="1" fill="#fef9c3" />
      </svg>
    </div>
  );
}

function PixelSun() {
  return (
    <div className="relative animate-sun-rays">
      {/* Sun glow */}
      <div className="absolute -inset-6 bg-yellow-300/30 rounded-full blur-xl" />

      {/* Sun rays */}
      <div className="absolute -inset-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-yellow-300/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-yellow-300/60" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-yellow-300/60" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-yellow-300/60" />
      </div>

      {/* Pixel sun - 8x8 grid */}
      <svg width="40" height="40" viewBox="0 0 8 8" className="relative">
        <rect x="2" y="0" width="4" height="1" fill="#fcd34d" />
        <rect x="1" y="1" width="6" height="1" fill="#fbbf24" />
        <rect x="0" y="2" width="8" height="4" fill="#f59e0b" />
        <rect x="1" y="2" width="6" height="4" fill="#fbbf24" />
        <rect x="2" y="3" width="4" height="2" fill="#fcd34d" />
        <rect x="1" y="6" width="6" height="1" fill="#fbbf24" />
        <rect x="2" y="7" width="4" height="1" fill="#fcd34d" />
      </svg>
    </div>
  );
}

function PixelCloud({ size = "md" }: { size?: "sm" | "md" }) {
  const scale = size === "sm" ? 0.7 : 1;

  return (
    <svg
      width={48 * scale}
      height={24 * scale}
      viewBox="0 0 12 6"
      className="opacity-90"
    >
      <rect x="2" y="2" width="8" height="3" fill="white" />
      <rect x="1" y="3" width="1" height="2" fill="white" />
      <rect x="10" y="3" width="1" height="2" fill="white" />
      <rect x="3" y="1" width="2" height="1" fill="white" />
      <rect x="6" y="0" width="3" height="2" fill="white" />
      <rect x="9" y="1" width="1" height="2" fill="white" />
    </svg>
  );
}

function PixelTree({ color, size = "md" }: { color: string; size?: "sm" | "md" }) {
  const scale = size === "sm" ? 0.6 : 1;

  return (
    <svg
      width={16 * scale}
      height={24 * scale}
      viewBox="0 0 8 12"
    >
      {/* Tree top */}
      <rect x="2" y="0" width="4" height="2" fill={color} />
      <rect x="1" y="2" width="6" height="2" fill={color} />
      <rect x="0" y="4" width="8" height="2" fill={color} />
      {/* Trunk */}
      <rect x="3" y="6" width="2" height="6" fill="#1a1a1a" />
    </svg>
  );
}

function PixelTreeDay({ size = "md" }: { size?: "sm" | "md" }) {
  const scale = size === "sm" ? 0.6 : 1;

  return (
    <svg
      width={16 * scale}
      height={24 * scale}
      viewBox="0 0 8 12"
    >
      {/* Tree top - green */}
      <rect x="2" y="0" width="4" height="2" fill="#16a34a" />
      <rect x="1" y="2" width="6" height="2" fill="#22c55e" />
      <rect x="0" y="4" width="8" height="2" fill="#16a34a" />
      {/* Trunk - brown */}
      <rect x="3" y="6" width="2" height="6" fill="#92400e" />
    </svg>
  );
}

function PixelFlower({ color }: { color: string }) {
  return (
    <svg width="8" height="10" viewBox="0 0 4 5">
      {/* Petals */}
      <rect x="1" y="0" width="2" height="1" fill={color} />
      <rect x="0" y="1" width="1" height="1" fill={color} />
      <rect x="3" y="1" width="1" height="1" fill={color} />
      {/* Center */}
      <rect x="1" y="1" width="2" height="2" fill="#fbbf24" />
      {/* Stem */}
      <rect x="1.5" y="3" width="1" height="2" fill="#22c55e" />
    </svg>
  );
}
