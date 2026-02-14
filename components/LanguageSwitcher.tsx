"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = routing.locales.find((l) => l !== locale)!;

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <button
      onClick={switchLocale}
      className="h-8 px-2 rounded-md border border-border bg-background/80 backdrop-blur-sm text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label={`Switch to ${localeLabels[otherLocale]}`}
    >
      {localeLabels[otherLocale]}
    </button>
  );
}
