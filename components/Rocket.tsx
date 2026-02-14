"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

interface RocketProps {
  isLaunching: boolean;
  onLaunchComplete: () => void;
}

type Phase = "idle" | "countdown" | "launch" | "flying" | "done";

export function Rocket({ isLaunching, onLaunchComplete }: RocketProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [rocketProgress, setRocketProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const FLIGHT_DURATION = 3500;

  // Main launch sequence
  useEffect(() => {
    if (!isLaunching || hasStartedRef.current) return;

    hasStartedRef.current = true;
    setRocketProgress(0);
    setCountdownNumber(3);

    // First, scroll to bottom of page before countdown
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll, behavior: "smooth" });

    // Start countdown after scroll completes
    const timerStart = setTimeout(() => {
      setPhase("countdown");
    }, 400);

    // Countdown sequence (adjusted timing to account for initial delay)
    const timer1 = setTimeout(() => {
      setCountdownNumber(2);
    }, 1100);

    const timer2 = setTimeout(() => {
      setCountdownNumber(1);
    }, 1800);

    const timer3 = setTimeout(() => {
      setPhase("launch");
    }, 2500);

    const timer4 = setTimeout(() => {
      setPhase("flying");
      startTimeRef.current = performance.now();
      // Ensure we're at bottom before flying
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, scrollMax);

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) return;

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / FLIGHT_DURATION, 1);
        // Easing: start slow, accelerate
        const easedProgress = progress * progress * (3 - 2 * progress);

        setRocketProgress(easedProgress);

        // Sync scroll with rocket - scroll UP as rocket goes UP
        // When progress=0, we're at maxScroll (bottom)
        // When progress=1, we're at 0 (top)
        const currentMaxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = currentMaxScroll * (1 - easedProgress);
        window.scrollTo(0, targetScroll);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setPhase("done");
          onLaunchComplete();
          hasStartedRef.current = false;

          setTimeout(() => {
            setPhase("idle");
            setRocketProgress(0);
            setCountdownNumber(3);
          }, 500);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, 3000);

    return () => {
      clearTimeout(timerStart);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLaunching, onLaunchComplete]);

  // Reset when not launching
  useEffect(() => {
    if (!isLaunching) {
      hasStartedRef.current = false;
    }
  }, [isLaunching]);

  if (phase === "idle") return null;

  // Rocket position: starts at bottom (5%), flies up past the top (125%)
  // Using bottom positioning: higher value = higher on screen
  const rocketBottomPercent = phase === "flying"
    ? 5 + rocketProgress * 120  // Goes from 5% to 125% (bottom to top and off screen)
    : phase === "launch"
      ? 5  // Launch position at bottom
      : phase === "done"
        ? 125  // Off screen at top
        : -20;  // Hidden below screen initially

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <div className={phase === "launch" ? "animate-screen-shake" : ""}>
        {/* Countdown */}
        {phase === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              key={countdownNumber}
              className="text-9xl font-black text-white animate-countdown-pop"
              style={{
                textShadow: "0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,200,100,0.5)",
              }}
            >
              {countdownNumber}
            </div>
          </div>
        )}

        {/* Rocket */}
        {(phase === "launch" || phase === "flying" || phase === "done") && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: `${rocketBottomPercent}%`,
            }}
          >
            <div className={phase === "flying" ? "animate-rocket-wobble" : ""}>
              <PixelRocket isDark={isDark} />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <ExhaustFlames intensity={phase === "flying" ? "high" : "medium"} />
              </div>
            </div>
          </div>
        )}

        {/* Smoke */}
        {(phase === "launch" || phase === "flying") && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <SmokeCloud />
          </div>
        )}

        {/* Particles */}
        {phase === "flying" && <ParticleTrail rocketProgress={rocketProgress} />}

        {/* Star streaks */}
        {phase === "flying" && <StarStreaks />}
      </div>
    </div>
  );
}

function PixelRocket({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-orange-500/40 rounded-full blur-2xl animate-pulse" />
      <svg width="80" height="120" viewBox="0 0 16 24" className="relative drop-shadow-2xl">
        {/* Nose cone */}
        <rect x="7" y="0" width="2" height="1" fill="#f3f4f6" />
        <rect x="6" y="1" width="4" height="1" fill="#e5e7eb" />
        <rect x="5" y="2" width="6" height="2" fill="#d1d5db" />

        {/* Body */}
        <rect x="4" y="4" width="8" height="4" fill="#f9fafb" />
        <rect x="4" y="8" width="8" height="4" fill="#e5e7eb" />

        {/* Window */}
        <rect x="6" y="5" width="4" height="3" fill={isDark ? "#3b82f6" : "#2563eb"} />
        <rect x="7" y="5" width="2" height="1" fill={isDark ? "#93c5fd" : "#60a5fa"} />

        {/* Stripes */}
        <rect x="5" y="9" width="2" height="2" fill="#ef4444" />
        <rect x="9" y="9" width="2" height="2" fill="#ef4444" />

        {/* Bottom */}
        <rect x="4" y="12" width="8" height="4" fill="#9ca3af" />

        {/* Fins */}
        <rect x="1" y="14" width="3" height="6" fill="#ef4444" />
        <rect x="12" y="14" width="3" height="6" fill="#ef4444" />

        {/* Engine */}
        <rect x="5" y="16" width="6" height="4" fill="#4b5563" />
        <rect x="6" y="20" width="4" height="4" fill="#1f2937" />
      </svg>
    </div>
  );
}

function ExhaustFlames({ intensity }: { intensity: "medium" | "high" }) {
  const size = intensity === "high" ? { w: 72, h: 140 } : { w: 56, h: 100 };

  return (
    <div className="relative flex justify-center animate-flame-flicker">
      <svg
        width={size.w}
        height={size.h}
        viewBox="0 0 18 35"
        className="drop-shadow-[0_0_20px_rgba(251,146,60,1)]"
      >
        {/* Core - white/yellow */}
        <rect x="7" y="0" width="4" height="3" fill="#fefce8" />
        <rect x="6" y="3" width="6" height="3" fill="#fef9c3" />
        <rect x="7" y="6" width="4" height="3" fill="#fde68a" />

        {/* Middle - orange */}
        <rect x="5" y="3" width="8" height="4" fill="#fdba74" />
        <rect x="4" y="7" width="10" height="4" fill="#fb923c" />
        <rect x="5" y="11" width="8" height="4" fill="#f97316" />

        {/* Outer - red */}
        <rect x="6" y="15" width="6" height="5" fill="#ea580c" />
        <rect x="7" y="20" width="4" height="5" fill="#dc2626" />
        <rect x="7" y="25" width="4" height="5" fill="#b91c1c" opacity="0.8" />
        <rect x="8" y="30" width="2" height="5" fill="#991b1b" opacity="0.5" />
      </svg>

      {/* Side flames */}
      <svg width="24" height="50" viewBox="0 0 6 12" className="absolute -left-4 top-2 animate-flame-flicker-alt">
        <rect x="4" y="0" width="2" height="2" fill="#fde68a" />
        <rect x="3" y="2" width="2" height="2" fill="#fb923c" />
        <rect x="2" y="4" width="2" height="3" fill="#f97316" />
        <rect x="1" y="7" width="2" height="3" fill="#ea580c" />
        <rect x="0" y="10" width="2" height="2" fill="#dc2626" opacity="0.7" />
      </svg>
      <svg width="24" height="50" viewBox="0 0 6 12" className="absolute -right-4 top-2 animate-flame-flicker">
        <rect x="0" y="0" width="2" height="2" fill="#fde68a" />
        <rect x="1" y="2" width="2" height="2" fill="#fb923c" />
        <rect x="2" y="4" width="2" height="3" fill="#f97316" />
        <rect x="3" y="7" width="2" height="3" fill="#ea580c" />
        <rect x="4" y="10" width="2" height="2" fill="#dc2626" opacity="0.7" />
      </svg>
    </div>
  );
}

function SmokeCloud() {
  return (
    <div className="relative w-96 h-48">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gray-300 animate-smoke-expand"
          style={{
            width: `${60 + Math.random() * 80}px`,
            height: `${60 + Math.random() * 80}px`,
            left: `${20 + (i % 5) * 15}%`,
            bottom: `${Math.random() * 40}%`,
            animationDelay: `${i * 0.05}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

function ParticleTrail({ rocketProgress }: { rocketProgress: number }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rocketY = 95 - rocketProgress * 120;
      setParticles(prev => [
        ...prev.slice(-25),
        {
          id: Date.now() + Math.random(),
          x: 46 + Math.random() * 8,
          y: Math.max(5, rocketY + 10),
          size: 4 + Math.random() * 6,
        },
      ]);
    }, 50);

    return () => clearInterval(interval);
  }, [rocketProgress]);

  return (
    <div className="absolute inset-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-orange-400 animate-particle-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 8px 3px rgba(251, 146, 60, 0.7)",
          }}
        />
      ))}
    </div>
  );
}

function StarStreaks() {
  return (
    <div className="absolute inset-0">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 rounded-full bg-gradient-to-b from-white via-white/70 to-transparent animate-star-streak"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-5%",
            height: `${50 + Math.random() * 100}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.3 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
