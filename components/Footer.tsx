"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const projects = [
  { name: "Télavie", href: "#" as const },
  { name: "GrowIt", href: "#" as const },
  { name: "Mojo APP", href: "#" as const },
];

const socials = [
  { name: "GitHub", href: "https://www.github.com/NaelSkrrrt" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/lalasonnael" },
  { name: "X (Twitter)", href: "https://www.x.com/lalasonnael29" },
  { name: "WhatsApp", href: "https://wa.me/261389570760" },
];

export function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Footer");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Projects */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground">
              {t("projects")}
            </h3>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.name}>
                  <Link
                    href={project.href}
                    className="text-primary font-mono text-xs hover:underline transition-colors"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground">
              {t("findMe")}
            </h3>
            <ul className="space-y-2">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-mono text-xs hover:underline transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-center space-y-4 pt-8 border-t border-border/30">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold text-foreground hover:text-muted-foreground transition-colors inline-block"
          >
            LALASON Annaël
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <div className="flex items-center justify-center">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/50 bg-background/50 backdrop-blur-sm text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <>
                    <SunIcon className="w-3.5 h-3.5" />
                    <span>{t("lightMode")}</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-3.5 h-3.5" />
                    <span>{t("darkMode")}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LALASON Annaël — Architecte Systèmes & IA
          </p>
        </div>
      </div>
    </footer>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
