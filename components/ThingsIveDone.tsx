import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const ITEM_COUNT = 5;
const METRIC_COUNT = 3;

const itemLinks: Record<number, string | null> = {
  0: "#",
  1: "#",
  2: null,
  3: null,
  4: null,
};

export function ThingsIveDone() {
  const t = useTranslations("ThingsIveDone");

  return (
    <Section title={t("title")}>
      <div className="flex flex-col gap-6">
        {/* Metric cards */}
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: METRIC_COUNT }, (_, index) => (
            <div
              key={index}
              className="h-8 px-3 rounded-md border border-border bg-background/80 backdrop-blur-sm shadow-xs flex items-center gap-2 text-sm transition-colors"
            >
              <span className="font-semibold text-foreground">
                {t(`metrics.${index}.value`)}
              </span>
              <span className="text-muted-foreground">
                {t(`metrics.${index}.label`)}
              </span>
            </div>
          ))}
        </div>

        {/* Detail list */}
        <ul className="space-y-3 text-muted-foreground">
          {Array.from({ length: ITEM_COUNT }, (_, index) => {
            const text = t(`items.${index}.text`);
            const linkText = t(`items.${index}.linkText`);
            const suffix = t(`items.${index}.suffix`);
            const href = itemLinks[index];

            return (
              <li key={index} className="flex gap-3">
                <span className="text-muted-foreground/50 shrink-0 mt-1.5">&#x2022;</span>
                <span>
                  {text}{" "}
                  {href && linkText && (
                    <Link
                      href={href}
                      className="text-foreground underline hover:text-muted-foreground not-italic transition-colors"
                    >
                      {linkText}
                    </Link>
                  )}{" "}
                  {suffix}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
