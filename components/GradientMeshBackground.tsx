"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useMemo, memo } from "react";

export const GradientMeshBackground = memo(function GradientMeshBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(() => !mounted || resolvedTheme === "dark", [mounted, resolvedTheme]);

  // Memoize blob styles to prevent recalculation
  const blobStyles = useMemo(() => ({
    blob1: {
      background: isDark
        ? "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)",
    },
    blob2: {
      background: isDark
        ? "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(244, 114, 182, 0.2) 0%, transparent 70%)",
    },
    blob3: {
      background: isDark
        ? "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)",
    },
    blob4: {
      background: isDark
        ? "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)",
    },
  }), [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #0a0a0a 0%, #0f0f1a 50%, #0a0a0a 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #ffffff 100%)",
        }}
      />

      {/* Blob 1 - Top Left */}
      <div
        className="absolute rounded-full animate-blob-1 transition-[background] duration-700 will-change-transform"
        style={{
          width: "400px",
          height: "400px",
          top: "-15%",
          left: "-10%",
          ...blobStyles.blob1,
          filter: "blur(50px)",
        }}
      />

      {/* Blob 2 - Top Right */}
      <div
        className="absolute rounded-full animate-blob-2 transition-[background] duration-700 will-change-transform"
        style={{
          width: "350px",
          height: "350px",
          top: "-10%",
          right: "-5%",
          ...blobStyles.blob2,
          filter: "blur(50px)",
        }}
      />

      {/* Blob 3 - Center */}
      <div
        className="absolute rounded-full animate-blob-3 transition-[background] duration-700 will-change-transform"
        style={{
          width: "500px",
          height: "500px",
          top: "10%",
          left: "20%",
          ...blobStyles.blob3,
          filter: "blur(60px)",
        }}
      />

      {/* Blob 4 - Bottom */}
      <div
        className="absolute rounded-full animate-blob-4 transition-[background] duration-700 will-change-transform"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-15%",
          right: "10%",
          ...blobStyles.blob4,
          filter: "blur(50px)",
        }}
      />

      {/* Bottom fade to background */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)"
            : "linear-gradient(to bottom, transparent 0%, #ffffff 100%)",
        }}
      />
    </div>
  );
});
