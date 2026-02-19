import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const certifications = [
  {
    href: "https://www.udemy.com/certificate/UC-fb836542-89c0-4cc1-82f0-cc28dc336594/",
    logo: "/logos/recruitment_certification_course_udemy_logo.jpg",
    logoAlt: "Udemy",
  },
  {
    href: "https://www.udemy.com/certificate/UC-1c42077e-8fe4-4f3d-827a-a88b0a8c304e/",
    logo: "/logos/recruitment_certification_course_udemy_logo.jpg",
    logoAlt: "Udemy",
  },
  {
    href: "https://www.udemy.com/certificate/UC-54fc20cc-38bb-4502-ab23-c6523b7b2bac/",
    logo: "/logos/recruitment_certification_course_udemy_logo.jpg",
    logoAlt: "Udemy",
  },
  {
    href: "https://www.codingame.com/certification/9vOviglZDSNbEDBI9TDEMw",
    logo: "/logos/codingame_logo.jpg",
    logoAlt: "CodinGame",
  },
];

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
