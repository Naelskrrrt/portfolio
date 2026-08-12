"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { ProjectModal } from "./ProjectModal";
import { cn } from "@/lib/utils";

const CATEGORIES = ["all", "agentic", "automation", "saas", "data"] as const;

type Category = (typeof CATEGORIES)[number];

export type Project = {
  id: string;
  categories: Exclude<Category, "all">[];
  metric: string;
  stack: string[];
  // Figures shown in the detail modal. Their labels live in
  // messages/ under items.<id>.results.<index>, matched by position.
  results: string[];
  href?: string;
  featured?: boolean;
  // Shown before the reader expands the section. At least two per filter so no
  // category ever collapses to a single lonely card.
  highlight?: boolean;
};

// Metrics, stacks and links are language-neutral, so they live here rather than
// in messages/. Everything readable is translated under the Projects namespace.
const projects: Project[] = [
  {
    id: "minia",
    results: ["35-50h", "21", "6+"],
    categories: ["agentic"],
    metric: "35-50h",
    stack: [
      "Hermes Agent",
      "Orchestration multi-agent",
      "FastAPI + SQLite",
      "Telegram / WhatsApp",
      "Gmail / CRM / Pennylane",
    ],
    href: "https://minia-landing.netlify.app",
    featured: true,
    highlight: true,
  },
  {
    id: "prospection",
    results: ["400+", "3×", "0"],
    categories: ["agentic", "automation"],
    metric: "400+",
    stack: ["n8n", "Agents IA", "Clay", "Lemlist"],
    highlight: true,
  },
  {
    id: "datahub",
    results: ["+25h", "10+", "1"],
    categories: ["data"],
    metric: "+25h",
    stack: ["Data warehouse", "Monitoring IA", "API REST"],
    highlight: true,
  },
  {
    id: "orchestrateur",
    results: ["+82%", "4", "0"],
    categories: ["agentic"],
    metric: "+82%",
    stack: ["Telegram Bot", "Orchestration IA", "OpenClaw"],
  },
  {
    id: "support",
    results: ["80%", "-45%", "<30s"],
    categories: ["agentic"],
    metric: "80%",
    stack: ["RAG", "WhatsApp API", "Zendesk"],
  },
  {
    id: "rh",
    results: ["-60%", "18j", "300+"],
    categories: ["automation"],
    metric: "-60%",
    stack: ["NLP", "n8n", "Google Calendar", "Notion"],
  },
  {
    id: "stocks",
    results: ["-35%", "+8%", "-20%"],
    categories: ["data"],
    metric: "-35%",
    stack: ["ML / Python", "ERP SAP", "API temps réel"],
    highlight: true,
  },
  {
    id: "reporting",
    results: ["2j → 15min", "8", "100%"],
    categories: ["automation"],
    metric: "2j → 15min",
    stack: ["Shopify API", "n8n", "Notion", "GPT-4"],
    highlight: true,
  },
  {
    id: "telavie",
    results: ["3", "HDS", "Socket"],
    categories: ["saas"],
    metric: "3",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Serveur HDS", "SWR", "Socket"],
    href: "https://www.telavie.fr",
    highlight: true,
  },
  {
    id: "talentfindr",
    results: ["800M+", "1 500+", "10+"],
    categories: ["saas", "agentic"],
    metric: "800M+",
    stack: ["Retool", "Xano", "n8n", "OpenAI"],
    href: "https://www.talentfindr.ai",
    highlight: true,
  },
  {
    id: "growit",
    results: ["4", "1", "0"],
    categories: ["agentic"],
    metric: "4",
    stack: ["Agents IA", "CRM"],
  },
  {
    id: "mojo",
    results: ["24/7", "3", "1"],
    categories: ["saas", "agentic"],
    metric: "24/7",
    stack: ["WhatsApp", "Agents IA"],
  },
  {
    id: "automations",
    results: ["2 000+", "4", "2"],
    categories: ["automation"],
    metric: "2 000+",
    stack: ["n8n", "Make"],
  },
];

export function Projects() {
  const t = useTranslations("Projects");
  const [active, setActive] = useState<Category>("all");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  const matching = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.categories.includes(active)),
    [active]
  );

  const visible = expanded
    ? matching
    : matching.filter((project) => project.highlight);
  const hiddenCount = matching.length - visible.length;

  return (
    <Section title={t("title")}>
      <p className="text-muted-foreground text-sm italic">{t("intro")}</p>

      <div
        role="group"
        aria-label={t("filterLabel")}
        className="flex flex-wrap gap-1.5 pt-1"
      >
        {CATEGORIES.map((category) => {
          const isActive = category === active;

          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                setExpanded(false);
              }}
              aria-pressed={isActive}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              )}
            >
              {t(`filters.${category}`)}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {t("countLabel", { count: visible.length })}
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map((project) => (
          <li
            key={project.id}
            className={cn(
              "flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-primary/40",
              project.featured && "sm:col-span-2"
            )}
          >
            {project.featured && (
              <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-primary">
                {t("featuredBadge")}
              </span>
            )}

            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "font-elegant text-primary leading-none",
                  project.featured ? "text-4xl sm:text-5xl" : "text-3xl"
                )}
              >
                {project.metric}
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t(`items.${project.id}.metricLabel`)}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-muted-foreground">
                {t(`items.${project.id}.client`)}
              </span>
              <h3 className="text-foreground font-medium">
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
                  >
                    {t(`items.${project.id}.name`)}
                  </a>
                ) : (
                  t(`items.${project.id}.name`)
                )}
              </h3>
            </div>

            <p className="text-muted-foreground text-sm italic">
              {t(`items.${project.id}.description`)}
            </p>

            {project.stack.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-auto flex gap-1.5 pt-1 text-xs text-primary">
              <span aria-hidden="true">↗</span>
              {t(`items.${project.id}.outcome`)}
            </p>

            <button
              type="button"
              onClick={() => setSelected(project)}
              aria-haspopup="dialog"
              className="w-fit rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              {t("detail")}
            </button>
          </li>
        ))}
      </ul>

      {(hiddenCount > 0 || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="w-fit rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors"
        >
          {expanded ? t("showLess") : t("showAll", { count: hiddenCount })}
        </button>
      )}

      <a
        href="https://flow-ai.studio/cas-clients"
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
      >
        {t("more")}
      </a>

      {selected && (
        <ProjectModal
          key={selected.id}
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </Section>
  );
}
