"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ConstellationBackground } from "./ConstellationBackground";

const PUNCHLINE_COUNT = 10;

const socialLinks = [
  {
    name: "GitHub",
    href: "https://www.github.com/NaelSkrrrt",
    icon: GithubIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/lalasonnael",
    icon: LinkedinIcon,
  },
  { name: "X", href: "https://www.x.com/lalasonnael29", icon: XIcon },
  { name: "CV", href: "/cv", icon: CvIcon, internal: true },
];

const socialLinkClass =
  "h-8 px-3 rounded-md border border-border bg-background/80 backdrop-blur-sm shadow-xs flex items-center gap-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70";

function getRandomIndex() {
  return Math.floor(Math.random() * PUNCHLINE_COUNT);
}

export function Hero() {
  const t = useTranslations("Hero");
  const [punchlineIndex, setPunchlineIndex] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPunchlineIndex(getRandomIndex());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const shufflePunchline = () => {
    let newIndex = getRandomIndex();
    while (newIndex === punchlineIndex && PUNCHLINE_COUNT > 1) {
      newIndex = getRandomIndex();
    }
    setPunchlineIndex(newIndex);
  };

  return (
    <section className="relative py-8 lg:py-16 px-4 min-h-[400px]">
      {/* Background */}
      <ConstellationBackground />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
            <Image
              src="/photo-profile.png"
              alt={t("profileAlt")}
              fill
              priority
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-elegant tracking-tight">
              <span>LALASON</span> Anna&#235;l
            </h1>
            <p className="text-muted-foreground">{t("role")}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-green-500">{t("available")}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2 max-w-xl">
          <p className="text-muted-foreground font-light italic">
            {t(`punchlines.${punchlineIndex}`)}
          </p>
          <button
            onClick={shufflePunchline}
            className="text-muted-foreground/60 hover:text-foreground hover:scale-110 active:scale-95 transition-all mt-1 shrink-0 p-1 rounded-md hover:bg-accent"
            aria-label={t("shuffleLabel")}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
          </button>
        </div>

        {/* Secondary links */}
        <div className="flex items-center gap-2 flex-wrap">
          {socialLinks.map((link) =>
            "internal" in link ? (
              <Link key={link.name} href={link.href} className={socialLinkClass}>
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ) : (
              <a key={link.name} href={link.href} className={socialLinkClass}>
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function CvIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h4v1h-4v-1zm0 2h4v1h-4v-1zm-2-4h1v6H8v-6zm0-1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
