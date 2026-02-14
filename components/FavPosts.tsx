import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "./Section";

const posts = [
  {
    title: "Publishing your work increases your luck",
    href: "https://news.ycombinator.com/item?id=46397991",
  },
  {
    title: "Thinking in Systems — Donella Meadows",
    href: "https://donellameadows.org/systems-thinking-resources/",
  },
  {
    title: "The Architecture of Complexity — Herbert Simon",
    href: "https://www2.econ.iastate.edu/tesfatsi/ArchitectureOfComplexity.HSimon1962.pdf",
  },
  {
    title: "Building AI agents that actually work",
    href: "https://www.anthropic.com/engineering/building-effective-agents",
  },
];

export function FavPosts() {
  const t = useTranslations("FavPosts");

  return (
    <Section title={t("title")}>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.title}>
            <Link
              href={post.href}
              className="text-foreground underline hover:text-muted-foreground transition-colors"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
