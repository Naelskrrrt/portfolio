import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const EXPERIENCE_COUNT = 4;

const experienceLinks: Record<number, string | null> = {
  0: null,
  1: null,
  2: null,
  3: null,
};

export function ThingsIveBuild() {
  const t = useTranslations("ThingsIveBuild");

  return (
    <Section title={t("title")}>
      <ul className="space-y-6">
        {Array.from({ length: EXPERIENCE_COUNT }, (_, index) => {
          const role = t(`experiences.${index}.role`);
          const company = t(`experiences.${index}.company`);
          const period = t(`experiences.${index}.period`);
          const description = t(`experiences.${index}.description`);
          const href = experienceLinks[index];

          return (
            <li key={index} className="flex gap-4">
              <div className="flex flex-col items-end pt-1 shrink-0 w-[140px] max-sm:hidden">
                <span className="text-muted-foreground text-sm whitespace-nowrap">
                  {period}
                </span>
              </div>
              <div className="relative flex flex-col gap-1 flex-1 pl-4 border-l border-border">
                <div className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-muted-foreground/50" />
                {href ? (
                  <Link
                    href={href}
                    className="text-foreground font-medium underline hover:text-muted-foreground transition-colors"
                  >
                    {company}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{company}</span>
                )}
                <span className="text-muted-foreground text-sm">{role}</span>
                <span className="text-muted-foreground text-sm sm:hidden">
                  {period}
                </span>
                <p className="text-muted-foreground text-sm italic mt-1">
                  {description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
