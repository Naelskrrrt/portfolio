"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { ProjectModal } from "./ProjectModal";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  PROJECT_CATEGORIES,
  PROJECTS,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";

export function Projects() {
  const t = useTranslations("Projects");
  const [active, setActive] = useState<ProjectCategory>("all");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  const matching = useMemo(
    () =>
      active === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.categories.includes(active)),
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
        {PROJECT_CATEGORIES.map((category) => {
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

            {project.caseStudySlug ? (
              <Link
                href={`/projets/${project.caseStudySlug}`}
                className="w-fit rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] text-primary transition-colors hover:bg-primary/20"
              >
                {t("caseStudyCta")}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSelected(project)}
                aria-haspopup="dialog"
                className="w-fit rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {t("detail")}
              </button>
            )}
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

      <Link
        href="/projets"
        className="w-fit text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
      >
        {t("allCases")}
      </Link>

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
