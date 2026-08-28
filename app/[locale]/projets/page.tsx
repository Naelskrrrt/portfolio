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
import { CASE_STUDIES } from "@/lib/projects";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro"
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ locale: string }>;
};

function localizedProjectsPath(locale: string) {
  return locale === routing.defaultLocale ? "/projets" : `/${locale}/projets`;
}

function absoluteProjectsUrl(locale: string) {
  return `${BASE_URL}${localizedProjectsPath(locale)}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "CaseStudies.meta" });
  const canonical = absoluteProjectsUrl(locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        fr: absoluteProjectsUrl("fr"),
        en: absoluteProjectsUrl("en"),
        "x-default": absoluteProjectsUrl(routing.defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: canonical,
      siteName: "LALASON Annaël",
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const tProjects = await getTranslations({ locale, namespace: "Projects" });
  const pageUrl = absoluteProjectsUrl(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: t("meta.title"),
    description: t("meta.description"),
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: CASE_STUDIES.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${pageUrl}/${project.caseStudySlug}`,
        name: tProjects(`items.${project.id}.name`),
      })),
    },
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

        <section className="border-b border-border px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-5 max-w-4xl font-elegant text-5xl leading-[0.96] tracking-[-0.045em] text-foreground sm:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.body")}
            </p>
            <BookingLink
              location="case_studies_hero"
              className="mt-9 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("hero.cta")}
            </BookingLink>
          </div>
        </section>

        <section className="border-b border-border px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
              {CASE_STUDIES.map((project) => (
                <li key={project.id} className="flex flex-col bg-background p-5 sm:p-7">
                  <p className="text-[11px] text-muted-foreground">
                    {tProjects(`items.${project.id}.client`)}
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-5">
                    <div>
                      <p className="font-elegant text-4xl leading-none text-primary">{project.metric}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {tProjects(`items.${project.id}.metricLabel`)}
                      </p>
                    </div>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold leading-tight text-foreground">
                    {tProjects(`items.${project.id}.name`)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {tProjects(`items.${project.id}.description`)}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <li key={tech} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-xs font-semibold leading-relaxed text-primary">
                    {tProjects(`items.${project.id}.outcome`)}
                  </p>
                  <Link
                    href={`/projets/${project.caseStudySlug}`}
                    className="mt-6 inline-flex min-h-11 w-fit items-center justify-center rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    {t("cardCta")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

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
                location="case_studies_final"
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
      </main>

      <PixelSceneBackground>
        <Footer />
      </PixelSceneBackground>
    </>
  );
}
