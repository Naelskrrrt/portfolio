import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const technologies = [
  { name: "Next.js", href: "https://nextjs.org" },
  { name: "TypeScript", href: "https://www.typescriptlang.org" },
  { name: "Python", href: "https://python.org" },
  { name: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { name: "LangChain", href: "https://langchain.com" },
  { name: "CrewAI", href: "https://crewai.com" },
  { name: "Hugging Face", href: "https://huggingface.co" },
  { name: "n8n / Make", href: "https://n8n.io" },
  { name: "PostgreSQL", href: "https://www.postgresql.org" },
  { name: "Prisma", href: "https://www.prisma.io" },
];

export function TechILove() {
  const t = useTranslations("TechILove");

  return (
    <Section title={t("title")}>
      <ul className="space-y-2">
        {technologies.map((tech, index) => (
          <li key={tech.name} className="flex items-baseline gap-2">
            <Link
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-muted-foreground transition-colors font-medium"
            >
              {tech.name}
            </Link>
            <span className="text-muted-foreground font-light italic text-sm">
              {t(`techs.${index}.description`)}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
