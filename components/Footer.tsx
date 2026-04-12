"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const socials = [
  { name: "GitHub", href: "https://www.github.com/NaelSkrrrt", whatsapp: false },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/lalasonnael", whatsapp: false },
  { name: "X (Twitter)", href: "https://www.x.com/lalasonnael29", whatsapp: false },
  { name: "WhatsApp", href: "https://wa.me/261389570760", whatsapp: true },
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
        {/* Socials */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold mb-4 text-foreground">
            {t("findMe")}
          </h3>
          <ul className="space-y-2">
            {socials.map((social) => (
              <li key={social.name}>
                {social.whatsapp ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium transition-colors"
                    style={{ color: "#25D366" }}
                  >
                    <WhatsAppIcon className="w-3 h-3" />
                    {social.name}
                  </a>
                ) : (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-mono text-xs hover:underline transition-colors"
                  >
                    {social.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
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
