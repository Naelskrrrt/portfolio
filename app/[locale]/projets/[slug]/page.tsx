import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BookingLink } from "@/components/BookingLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PixelSceneBackground } from "@/components/PixelScene";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/lib/projects";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro"
).replace(/\/$/, "");
const DATE_MODIFIED = "2026-08-28";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function localizedCasePath(locale: string, slug: string) {
  const path = `/projets/${slug}`;
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

function absoluteCaseUrl(locale: string, slug: string) {
  return `${BASE_URL}${localizedCasePath(locale, slug)}`;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDIES.map((project) => ({
      locale,
      slug: project.caseStudySlug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getCaseStudyBySlug(slug);

  if (!hasLocale(routing.locales, locale) || !project) notFound();

  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const canonical = absoluteCaseUrl(locale, slug);
  const title = t(`items.${project.id}.metaTitle`);
  const description = t(`items.${project.id}.metaDescription`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: absoluteCaseUrl("fr", slug),
        en: absoluteCaseUrl("en", slug),
        "x-default": absoluteCaseUrl(routing.defaultLocale, slug),
      },
    },
    openGraph: {
      type: "article",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: canonical,
      siteName: "LALASON Annaël",
      title,
      description,
      modifiedTime: DATE_MODIFIED,
      authors: [BASE_URL],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const project = getCaseStudyBySlug(slug);

  if (!hasLocale(routing.locales, locale) || !project) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const tProjects = await getTranslations({ locale, namespace: "Projects" });
  const pageUrl = absoluteCaseUrl(locale, slug);
  const projectsUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/projets`
      : `${BASE_URL}/${locale}/projets`;

  const title = tProjects(`items.${project.id}.name`);
  const description = tProjects(`items.${project.id}.description`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: title,
        description,
        url: pageUrl,
        dateModified: DATE_MODIFIED,
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
        author: { "@id": `${BASE_URL}/#person` },
        publisher: { "@id": `${BASE_URL}/#person` },
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        about: project.categories.map((category) => ({
          "@type": "Thing",
          name: tProjects(`filters.${category}`),
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        isPartOf: { "@id": `${projectsUrl}#webpage` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("labels.back"),
            item: projectsUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <style>{`.galaxy-journey { display: none !important; }`}</style>

      <main id="main-content" className="min-h-screen bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <article>
          <header className="border-b border-border px-4 pb-14 pt-10 sm:pb-20 sm:pt-16">
            <div className="mx-auto max-w-5xl">
              <Link
                href="/projets"
                className="text-xs font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                ← {t("labels.back")}
              </Link>
              <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {tProjects(`items.${project.id}.client`)}
              </p>
              <h1 className="mt-4 max-w-4xl font-elegant text-5xl leading-[0.96] tracking-[-0.045em] text-foreground sm:text-7xl">
                {title}
              </h1>
              <p className="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{t("labels.updated")}</span>
                <span aria-hidden="true">·</span>
                <span>{tProjects(`items.${project.id}.outcome`)}</span>
              </div>
            </div>
          </header>

          <section aria-labelledby="results-title" className="border-b border-border bg-muted/30 px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-5xl">
              <h2 id="results-title" className="font-elegant text-3xl tracking-tight sm:text-4xl">
                {t("labels.results")}
              </h2>
              <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                {project.results.map((value, index) => (
                  <div key={`${value}-${index}`} className="bg-background p-5 sm:p-6">
                    <dt className="font-elegant text-4xl leading-none text-primary">{value}</dt>
                    <dd className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {tProjects(`items.${project.id}.results.${index}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <div className="border-b border-border px-4 py-14 sm:py-20">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] lg:gap-16">
              <div className="space-y-12">
                <section aria-labelledby="problem-title">
                  <h2 id="problem-title" className="font-elegant text-4xl tracking-tight">
                    {t("labels.problem")}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {tProjects(`items.${project.id}.problem`)}
                  </p>
                </section>

                <section aria-labelledby="system-title">
                  <h2 id="system-title" className="font-elegant text-4xl tracking-tight">
                    {t("labels.system")}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {tProjects(`items.${project.id}.solution`)}
                  </p>
                </section>

                <section aria-labelledby="lesson-title" className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-5 sm:p-7">
                  <h2 id="lesson-title" className="font-elegant text-3xl tracking-tight text-foreground">
                    {t("labels.lesson")}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {t(`items.${project.id}.lesson`)}
                  </p>
                </section>
              </div>

              <aside className="space-y-8 lg:border-l lg:border-border lg:pl-8">
                <section aria-labelledby="architecture-title">
                  <h2 id="architecture-title" className="text-sm font-semibold text-foreground">
                    {t("labels.architecture")}
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="reading-note-title" className="border-t border-border pt-7">
                  <h2 id="reading-note-title" className="text-sm font-semibold text-foreground">
                    {t("labels.readingNote")}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {t(`items.${project.id}.readingNote`)}
                  </p>
                </section>

                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {t("labels.external")} ↗
                  </a>
                ) : null}
              </aside>
            </div>
          </div>

          <section className="bg-primary px-4 py-14 text-primary-foreground sm:py-20">
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <h2 className="max-w-3xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                  {t("final.title")}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                  {t("final.body")}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <BookingLink
                  location={`case_study_${project.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
                >
                  {t("final.primaryCta")}
                </BookingLink>
                <Link href="/services" className="text-sm font-semibold text-primary-foreground underline underline-offset-4">
                  {t("final.secondaryCta")}
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      <PixelSceneBackground>
        <Footer />
      </PixelSceneBackground>
    </>
  );
}
