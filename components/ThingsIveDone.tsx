import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const ITEM_COUNT = 5;

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
      <ul className="list-disc list-inside space-y-2 text-muted-foreground italic">
        {Array.from({ length: ITEM_COUNT }, (_, index) => {
          const text = t(`items.${index}.text`);
          const linkText = t(`items.${index}.linkText`);
          const suffix = t(`items.${index}.suffix`);
          const href = itemLinks[index];

          return (
            <li key={index}>
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
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
