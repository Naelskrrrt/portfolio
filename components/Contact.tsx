import Link from "next/link";
import { useTranslations } from "next-intl";
import { BookingLink } from "./BookingLink";

export function Contact() {
  const t = useTranslations("Contact");

  return (
    <section className="py-8 lg:py-16 px-4 border-t border-border/30">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <h2 className="text-3xl lg:text-4xl font-elegant tracking-tight">
          {t("title")}
        </h2>
        <div className="flex flex-col gap-3">
          <Link
            href="mailto:contact@lalason.pro"
            className="text-foreground underline hover:text-muted-foreground transition-colors"
          >
            contact@lalason.pro
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <BookingLink
              location="contact"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <CalendarIcon className="h-4 w-4" />
              {t("cta")}
            </BookingLink>
          </div>
        </div>
      </div>
    </section>
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
