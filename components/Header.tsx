import { useTranslations } from "next-intl";
import { BookingLink } from "./BookingLink";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="w-full px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-center gap-1.5 sm:gap-2">
        <div className="ml-auto hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-2 lg:flex">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            {t("availability")}
          </span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0">
          <BookingLink
            location="header"
            ariaLabel={t("cta")}
            className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden md:inline">{t("cta")}</span>
          </BookingLink>
          <div className="[&_button]:!h-11 [&_button]:!min-w-11">
            <LanguageSwitcher />
          </div>
          <div className="[&_button]:!h-11 [&_button]:!w-11">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}
