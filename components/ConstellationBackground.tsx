"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  /** Ember star: tinted with the dawn's amber instead of the cold night blue */
  warm: boolean;
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number>(undefined);
  const lastFrameTime = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(
    () => !mounted || resolvedTheme === "dark",
    [mounted, resolvedTheme],
  );

  // Function to initialize/reinitialize points based on current dimensions
  const initializePoints = useCallback((width: number, height: number) => {
    const numPoints = 35;
    pointsRef.current = [];

    for (let i = 0; i < numPoints; i++) {
      pointsRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1 + 1, // Subtle points (1 - 2px)
        warm: Math.random() < 0.2, // ~1 in 5 stars glows amber, announcing the dawn
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dimensionsRef.current = { width, height };

      // Reinitialize points on resize
      initializePoints(width, height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const connectionDistance = 120;
    const connectionDistanceSq = connectionDistance * connectionDistance;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime.current;
      if (deltaTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = currentTime - (deltaTime % frameInterval);

      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      const points = pointsRef.current;

      // Update positions - allow points to go slightly outside and wrap
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < -20) point.vx = Math.abs(point.vx);
        if (point.x > width + 20) point.vx = -Math.abs(point.vx);
        if (point.y < -20) point.vy = Math.abs(point.vy);
        if (point.y > height + 20) point.vy = -Math.abs(point.vy);
      }

      // Draw connections - subtle
      ctx.lineWidth = 0.5;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const p1 = points[i];
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < connectionDistanceSq) {
            const opacity = 1 - Math.sqrt(distanceSq) / connectionDistance;
            // Subtle opacity
            ctx.strokeStyle = isDark
              ? `rgba(150, 180, 220, ${(opacity * 0.15).toFixed(2)})`
              : `rgba(100, 130, 180, ${(opacity * 0.12).toFixed(2)})`;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw points - subtle
      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        // Subtle glow in dark mode only
        if (isDark) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = point.warm
            ? "rgba(232, 133, 58, 0.12)"
            : "rgba(150, 180, 220, 0.08)";
          ctx.fill();
        }

        // Core point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.warm
          ? isDark
            ? "rgba(240, 165, 100, 0.65)"
            : "rgba(201, 106, 31, 0.4)"
          : isDark
            ? "rgba(200, 210, 230, 0.5)"
            : "rgba(100, 130, 180, 0.35)";
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, mounted, initializePoints]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base background */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
        }}
      />

      {/* Canvas for constellation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: mounted ? 1 : 0 }}
      />

      {/* Bottom fade to background */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, #0a0e1a 100%)"
            : "linear-gradient(to bottom, transparent 0%, #ffffff 100%)",
        }}
      />

    </div>
  );
}
