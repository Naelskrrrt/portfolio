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

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro"
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ locale: string }>;
};

type Metric = { value: string; label: string };
type ServiceItem = {
  id: string;
  title: string;
  for: string;
  outcome: string;
  body: string;
  included: string[];
};
type ApproachStep = { number: string; title: string; body: string };

function localizedServicesPath(locale: string) {
  return locale === routing.defaultLocale ? "/services" : `/${locale}/services`;
}

function absoluteServicesUrl(locale: string) {
  return `${BASE_URL}${localizedServicesPath(locale)}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Services.meta" });
  const canonical = absoluteServicesUrl(locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        fr: absoluteServicesUrl("fr"),
        en: absoluteServicesUrl("en"),
        "x-default": absoluteServicesUrl(routing.defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: canonical,
      siteName: "LALASON Annaël · Flow AI Studio",
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

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Services" });
  const pageUrl = absoluteServicesUrl(locale);
  const metrics = t.raw("proof.metrics") as Metric[];
  const services = t.raw("catalog.items") as ServiceItem[];
  const steps = t.raw("approach.steps") as ApproachStep[];
  const fits = t.raw("qualification.fits") as string[];
  const limits = t.raw("qualification.limits") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t("meta.title"),
        description: t("meta.description"),
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
        mainEntity: { "@id": `${pageUrl}#services` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#services`,
        name: t("catalog.title"),
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            "@id": `${pageUrl}#${service.id}`,
            name: service.title,
            description: service.body,
            provider: { "@id": `${BASE_URL}/#person` },
            areaServed: ["FR", "MG"],
            availableLanguage: ["fr", "en"],
          },
        })),
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

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
              <BookingLink
                location="services_hero"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("hero.primaryCta")}
              </BookingLink>
              <Link
                href="/projets"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                {t("hero.secondaryCta")}
              </Link>
            </div>

            <p className="mt-5 max-w-3xl border-l-2 border-primary/60 pl-4 text-xs leading-relaxed text-muted-foreground">
              {t("hero.note")}
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-muted/30 px-4 py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {t("proof.eyebrow")}
              </p>
              <h2 className="mt-3 max-w-3xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                {t("proof.title")}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("proof.body")}
              </p>
            </div>

            <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
              {metrics.map((metric) => (
                <div key={metric.label} className="grid grid-cols-[auto_1fr] items-baseline gap-5 bg-background p-5">
                  <dt className="font-elegant text-3xl leading-none text-primary">{metric.value}</dt>
                  <dd className="text-xs leading-relaxed text-muted-foreground">{metric.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-b border-border px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {t("catalog.eyebrow")}
              </p>
              <h2 className="mt-3 font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                {t("catalog.title")}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("catalog.intro")}
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
              {services.map((service, index) => (
                <article id={service.id} key={service.id} className="scroll-mt-24 bg-background p-5 sm:p-7">
                  <p className="font-mono text-[11px] text-primary">0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold leading-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{service.body}</p>

                  <dl className="mt-6 space-y-5 border-t border-border pt-5">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {t("catalog.forLabel")}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed text-foreground">{service.for}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {t("catalog.outcomeLabel")}
                      </dt>
                      <dd className="mt-2 text-sm font-semibold leading-relaxed text-primary">{service.outcome}</dd>
                    </div>
                  </dl>

                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t("catalog.includedLabel")}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {service.included.map((item) => (
                      <li key={item} className="grid grid-cols-[1rem_1fr] gap-2 text-xs leading-relaxed text-muted-foreground">
                        <span aria-hidden="true" className="text-primary">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {t("approach.eyebrow")}
            </p>
            <h2 className="mt-3 font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
              {t("approach.title")}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("approach.body")}
            </p>

            <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {steps.map((step) => (
                <li key={step.number} className="bg-background p-5 sm:p-6">
                  <span className="font-mono text-[11px] text-primary">{step.number}</span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border bg-muted/30 px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="max-w-3xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
              {t("qualification.title")}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("qualification.body")}
            </p>

            <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
              <div className="bg-background p-5 sm:p-7">
                <h3 className="text-sm font-semibold text-foreground">{t("qualification.fitsTitle")}</h3>
                <ul className="mt-4 space-y-3">
                  {fits.map((item) => (
                    <li key={item} className="grid grid-cols-[1rem_1fr] gap-2 text-sm leading-relaxed text-muted-foreground">
                      <span aria-hidden="true" className="text-primary">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-background p-5 sm:p-7">
                <h3 className="text-sm font-semibold text-foreground">{t("qualification.limitsTitle")}</h3>
                <ul className="mt-4 space-y-3">
                  {limits.map((item) => (
                    <li key={item} className="grid grid-cols-[1rem_1fr] gap-2 text-sm leading-relaxed text-muted-foreground">
                      <span aria-hidden="true" className="text-primary">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
                location="services_final"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                {t("final.primaryCta")}
              </BookingLink>
              <Link
                href="/offre"
                className="text-sm font-semibold text-primary-foreground underline underline-offset-4"
              >
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
