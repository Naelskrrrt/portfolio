"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Project } from "./Projects";

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations("Projects");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // showModal() is what gives us the focus trap, Escape handling and the inert
  // background for free — the dialog is rendered closed and opened on mount.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) dialog?.showModal();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const titleId = `project-${project.id}-title`;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={(event) => {
        // Native dialogs close on Escape on their own, but that path is skipped
        // in some embedded webviews. Closing explicitly keeps it deterministic.
        if (event.key === "Escape") {
          event.preventDefault();
          dialogRef.current?.close();
        }
      }}
      onClick={(event) => {
        // A click on the backdrop is reported on the dialog element itself.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby={titleId}
      className="m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-0 text-foreground backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">
              {t(`items.${project.id}.client`)}
            </span>
            <h2 id={titleId} className="text-xl font-medium leading-tight">
              {t(`items.${project.id}.name`)}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={t("close")}
            className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors"
          >
            {t("close")}
          </button>
        </div>

        <section className="flex flex-col gap-1.5">
          <h3 className="font-elegant text-lg text-primary">
            {t("problemTitle")}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(`items.${project.id}.problem`)}
          </p>
        </section>

        <section className="flex flex-col gap-1.5">
          <h3 className="font-elegant text-lg text-primary">
            {t("solutionTitle")}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(`items.${project.id}.solution`)}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-elegant text-lg text-primary">
            {t("resultsTitle")}
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.results.map((value, index) => (
              <div
                key={value}
                className="flex flex-col gap-1 rounded-lg border border-border p-3"
              >
                <dt className="font-elegant text-2xl leading-none text-foreground">
                  {value}
                </dt>
                <dd className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground leading-snug">
                  {t(`items.${project.id}.results.${index}`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {project.stack.length > 0 && (
          <section className="flex flex-col gap-2">
            <h3 className="font-elegant text-lg text-primary">
              {t("stackTitle")}
            </h3>
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
          </section>
        )}

        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs text-primary hover:bg-primary/20 transition-colors"
          >
            {t("visit")} ↗
          </a>
        )}
      </div>
    </dialog>
  );
}
