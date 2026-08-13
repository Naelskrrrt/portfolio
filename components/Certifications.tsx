import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { certifications } from "@/lib/certifications";

export function Certifications() {
  const t = useTranslations("Certifications");

  return (
    <Section title={t("title")}>
      <ul className="space-y-5">
        {certifications.map((cert, index) => (
          <li key={index} className="flex items-start gap-3">
            <Image
              src={cert.logo}
              alt={cert.logoAlt}
              width={28}
              height={28}
              className="shrink-0 rounded-md mt-0.5"
            />
            <div className="flex flex-col gap-0.5">
              <Link
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline hover:text-muted-foreground transition-colors"
              >
                {t(`items.${index}.name`)}
              </Link>
              <span className="text-muted-foreground text-sm">
                {t(`items.${index}.issuer`)} · {t(`items.${index}.date`)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
