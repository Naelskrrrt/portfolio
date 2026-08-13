"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { LanguageSwitcher } from "../LanguageSwitcher";

/** Rendered by app/[locale]/cv/pdf/route.tsx (React PDF), prerendered at build. */
const pdfByLocale: Record<string, string> = {
  fr: "/cv/pdf",
  en: "/en/cv/pdf",
};

export function CvToolbar() {
  const t = useTranslations("CV.toolbar");
  const locale = useLocale();
  const pdfHref = pdfByLocale[locale] ?? pdfByLocale.fr;

  return (
    <div className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-md print:hidden">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{t("back")}</span>
        </Link>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={pdfHref}
            download="CV-LALASON-Annael.pdf"
            aria-label={t("printAria")}
            className="h-8 px-2.5 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("print")}</span>
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}
