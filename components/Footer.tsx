"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";

type SocialIconName = "github" | "linkedin" | "x" | "whatsapp";

const socials: Array<{
  name: string;
  href: string;
  icon: SocialIconName;
  hoverClass: string;
}> = [
  {
    name: "GitHub",
    href: "https://www.github.com/NaelSkrrrt",
    icon: "github",
    hoverClass: "hover:text-foreground",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/lalasonnael",
    icon: "linkedin",
    hoverClass: "hover:border-[#0A66C2]/60 hover:text-[#0A66C2]",
  },
  {
    name: "X",
    href: "https://www.x.com/lalasonnael29",
    icon: "x",
    hoverClass: "hover:text-foreground",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/261389570760",
    icon: "whatsapp",
    hoverClass: "hover:border-[#25D366]/60 hover:text-[#25D366]",
  },
];

export function Footer() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Footer");
  const pathname = usePathname();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const isDark = resolvedTheme === "dark";
  const isPortfolio = pathname === "/";

  if (isPortfolio) {
    return (
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-8 sm:py-10">
          <nav aria-label={t("navigationLabel")}>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              <li>
                <Link href="/services" className="transition-colors hover:text-foreground">
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link href="/projets" className="transition-colors hover:text-foreground">
                  {t("projects")}
                </Link>
              </li>
              <li>
                <Link href="/offre" className="transition-colors hover:text-foreground">
                  {t("offer")}
                </Link>
              </li>
              <li>
                <Link href="/cv" className="transition-colors hover:text-foreground">
                  {t("cv")}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-muted-foreground">
            <nav aria-label={t("findMe")}>
              <ul className="flex items-center gap-1">
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      className={`inline-flex size-9 items-center justify-center rounded-full transition-[color,background-color,transform] hover:-translate-y-0.5 hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 motion-reduce:hover:translate-y-0 ${social.hoverClass}`}
                    >
                      <SocialIcon name={social.icon} className="size-4" />
                      <span className="sr-only">{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {mounted ? (
              <>
                <span className="mx-2 h-4 w-px bg-border/70" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 text-[11px] transition-colors hover:bg-background/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  {isDark ? (
                    <SunIcon className="size-3.5" />
                  ) : (
                    <MoonIcon className="size-3.5" />
                  )}
                  <span>{t(isDark ? "lightMode" : "darkMode")}</span>
                </button>
              </>
            ) : null}
          </div>

          <p className="mt-4 text-center text-[11px] tracking-wide text-muted-foreground/80">
            © {new Date().getFullYear()} LALASON Annaël
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-12 sm:pb-32 sm:pt-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
          <div>
            <p className="font-elegant text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
              LALASON Annaël
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("role")}
            </p>

            <nav className="mt-7" aria-label={t("navigationLabel")}>
              <ul className="flex flex-wrap gap-2.5">
                <li>
                  <Link
                    href="/"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-border/70 bg-transparent px-4 text-sm font-semibold text-foreground backdrop-blur-[2px] transition-[color,border-color,background-color] hover:border-primary/60 hover:bg-background/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-border/70 bg-transparent px-4 text-sm font-semibold text-foreground backdrop-blur-[2px] transition-[color,border-color,background-color] hover:border-primary/60 hover:bg-background/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {t("services")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projets"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-border/70 bg-transparent px-4 text-sm font-semibold text-foreground backdrop-blur-[2px] transition-[color,border-color,background-color] hover:border-primary/60 hover:bg-background/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {t("projects")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/offre"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-border/70 bg-transparent px-4 text-sm font-semibold text-foreground backdrop-blur-[2px] transition-[color,border-color,background-color] hover:border-primary/60 hover:bg-background/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {t("offer")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cv"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-border/70 bg-transparent px-4 text-sm font-semibold text-foreground backdrop-blur-[2px] transition-[color,border-color,background-color] hover:border-primary/60 hover:bg-background/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {t("cv")}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <section aria-labelledby="footer-socials-title" className="md:min-w-52">
            <h2
              id="footer-socials-title"
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              {t("findMe")}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className={`group inline-flex size-11 items-center justify-center rounded-md border border-border/70 bg-transparent text-muted-foreground backdrop-blur-[2px] transition-[color,border-color,background-color,transform] hover:-translate-y-0.5 hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:hover:translate-y-0 ${social.hoverClass}`}
                  >
                    <SocialIcon name={social.icon} className="size-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LALASON Annaël — {t("role")}
          </p>

          {mounted ? (
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-border/70 bg-transparent px-3 text-xs text-muted-foreground backdrop-blur-[2px] transition-[color,border-color,background-color] hover:border-border hover:bg-background/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              {isDark ? (
                <>
                  <SunIcon className="size-3.5" />
                  <span>{t("lightMode")}</span>
                </>
              ) : (
                <>
                  <MoonIcon className="size-3.5" />
                  <span>{t("darkMode")}</span>
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name, className }: { name: SocialIconName; className?: string }) {
  if (name === "github") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .7A11.3 11.3 0 0 0 8.4 22.8c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.6 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3 0 0 1-.3 3.1 1.2a10.8 10.8 0 0 1 5.7 0c2.2-1.5 3.1-1.2 3.1-1.2.6 1.5.2 2.7.1 3 .7.8 1.2 1.8 1.2 3 0 4.3-2.8 5.3-5.4 5.6.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.3 11.3 0 0 0 12 .7Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3h-17A2.5 2.5 0 0 0 1 5.5v13A2.5 2.5 0 0 0 3.5 21h17a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 20.5 3ZM8 18H5V9h3v9ZM6.5 7.8A1.75 1.75 0 1 1 6.5 4.3a1.75 1.75 0 0 1 0 3.5ZM19 18h-3v-4.4c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V18h-3V9h2.9v1.2h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.7V18H19Z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-.9-.3-.1-.5-.2-.7.1l-.9 1.2c-.2.2-.4.2-.7.1a8.1 8.1 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2c-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5L9 7.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4 0-.2-.2-.3-.5-.4ZM12.1 21.8a9.9 9.9 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.7-.2-.4A9.9 9.9 0 1 1 12.1 21.8Zm0-21.8A11.9 11.9 0 0 0 1.8 17.8L.1 24l6.3-1.7A11.9 11.9 0 1 0 12.1 0Z" />
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
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
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
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
