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

  const matching = useMemo(() => {
    const projects =
      active === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.categories.includes(active));

    return [...projects].sort(
      (first, second) =>
        Number(Boolean(second.caseStudySlug)) -
        Number(Boolean(first.caseStudySlug))
    );
  }, [active]);

  const documented = matching.filter((project) => project.caseStudySlug);
  const visible = expanded
    ? matching
    : documented.length > 0
      ? documented
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
              project.caseStudySlug &&
                "border-primary/30 bg-primary/[0.045]",
              project.featured && "sm:col-span-2"
            )}
          >
            {project.caseStudySlug ? (
              <span className="flex w-fit items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-primary">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-primary"
                />
                {t("caseStudyBadge")}
              </span>
            ) : project.featured ? (
              <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-primary">
                {t("featuredBadge")}
              </span>
            ) : null}

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
                className="group/case-study inline-flex min-h-10 w-full items-center justify-between gap-4 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span>{t("caseStudyCta")}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover/case-study:translate-x-0.5"
                >
                  →
                </span>
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
