import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const PROJECT_COUNT = 4;

const projectLinks: Record<number, string | null> = {
  0: null,
  1: null,
  2: null,
  3: null,
};

export function Projects() {
  const t = useTranslations("Projects");

  return (
    <Section title={t("title")}>
      <ul className="space-y-6">
        {Array.from({ length: PROJECT_COUNT }, (_, index) => {
          const name = t(`items.${index}.name`);
          const description = t(`items.${index}.description`);
          const href = projectLinks[index];

          return (
            <li key={index} className="flex flex-col gap-1">
              {href ? (
                <Link
                  href={href}
                  className="text-foreground font-medium underline hover:text-muted-foreground transition-colors"
                >
                  {name}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{name}</span>
              )}
              <p className="text-muted-foreground text-sm italic">
                {description}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
