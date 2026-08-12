import { useTranslations } from "next-intl";
import { Section } from "./Section";

const EXPERIENCE_COUNT = 5;

const experienceLinks: Record<number, string | null> = {
  0: "https://flow-ai.studio",
  1: "https://www.monambassadeur.com",
  2: "https://accesbanque.mg",
  3: "https://www.toamasina-port.com/",
  4: null,
};

// Indexes whose site exists but is temporarily down — shows a badge instead of a link
const maintenanceIndexes = new Set<number>();

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
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium underline underline-offset-2 hover:text-muted-foreground transition-colors w-fit"
                  >
                    {company}
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-foreground font-medium">
                    {company}
                    {maintenanceIndexes.has(index) && (
                      <span className="text-[11px] font-normal text-muted-foreground border border-border rounded-full px-2 py-px">
                        {t("maintenance")}
                      </span>
                    )}
                  </span>
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
