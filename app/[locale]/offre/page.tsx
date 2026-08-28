import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BookingLink } from "@/components/BookingLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PixelSceneBackground } from "@/components/PixelScene";
import { OfferFaq } from "@/components/offre/OfferFaq";
import { PilotBento } from "@/components/offre/PilotBento";
import {
  RoiCalculator,
  type RoiCalculatorCopy,
} from "@/components/offre/RoiCalculator";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { FOUNDING_OFFER, OFFER_PRICES, formatPrice } from "@/lib/offer";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro"
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ locale: string }>;
};

type PricingCard = {
  id: "framing" | "pilot" | "system";
  title: string;
  pricePrefix: string;
  decision: string;
  result: string;
  duration: string;
};

type ScopeMetric = {
  value: string;
  label: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

function localizedOfferPath(locale: string) {
  return locale === routing.defaultLocale ? "/offre" : `/${locale}/offre`;
}

function absoluteOfferUrl(locale: string) {
  return `${BASE_URL}${localizedOfferPath(locale)}`;
}

function taxedPrice(locale: string, amount: number, monthly = false) {
  const taxLabel = locale === "fr" ? "HT" : "excl. VAT";
  const cadence = monthly ? (locale === "fr" ? " / mois" : " / month") : "";

  return `${formatPrice(locale, amount)} ${taxLabel}${cadence}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Offre.meta" });
  const canonical = absoluteOfferUrl(locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        fr: absoluteOfferUrl("fr"),
        en: absoluteOfferUrl("en"),
        "x-default": absoluteOfferUrl(routing.defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: canonical,
      siteName: "Annaël Lalason · Flow AI Studio",
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

export default async function OfferPage({ params }: PageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Offre" });
  const pageUrl = absoluteOfferUrl(locale);
  const pricingCards = t.raw("pricing.cards") as PricingCard[];
  const roiCopy = t.raw("roi") as RoiCalculatorCopy & {
    eyebrow: string;
    title: string;
    body: string;
  };
  const proofMetrics = t.raw("proof.metrics") as ScopeMetric[];
  const scopeMetrics = t.raw("scopeSummary.metrics") as ScopeMetric[];
  const scopeIncluded = t.raw("scopeSummary.included") as string[];
  const scopeLimits = t.raw("scopeSummary.limits") as string[];
  const guarantees = t.raw("scopeSummary.guarantees") as string[];
  const foundingExchange = t.raw("pricing.foundingExchange") as string[];
  const faqItems = t.raw("executiveFaq.items") as FaqItem[];

  const offers = [
    ...pricingCards.map((card) => {
      const price = card.id === "pilot" ? FOUNDING_OFFER.price : OFFER_PRICES[card.id];

      return {
        "@type": "Offer" as const,
        "@id": `${pageUrl}#offer-${card.id}`,
        name: card.title,
        description: card.result,
        url: `${pageUrl}#tarifs`,
        price,
        priceCurrency: "EUR",
        ...(card.id === "pilot"
          ? { priceValidUntil: FOUNDING_OFFER.validThrough }
          : {}),
        priceSpecification: {
          "@type": "UnitPriceSpecification" as const,
          price,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
        },
      };
    }),
    {
      "@type": "Offer" as const,
      "@id": `${pageUrl}#offer-run`,
      name: t("run.title"),
      description: t("pricing.runBody"),
      url: `${pageUrl}#tarifs`,
      price: OFFER_PRICES.run,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification" as const,
        price: OFFER_PRICES.run,
        priceCurrency: "EUR",
        valueAddedTaxIncluded: false,
        unitCode: "MON",
      },
    },
    {
      "@type": "Offer" as const,
      "@id": `${pageUrl}#offer-cartography`,
      name: t("cartography.title"),
      description: t("pricing.mappingBody"),
      url: `${pageUrl}#tarifs`,
      price: OFFER_PRICES.cartography,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification" as const,
        price: OFFER_PRICES.cartography,
        priceCurrency: "EUR",
        valueAddedTaxIncluded: false,
      },
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t("meta.title"),
        description: t("meta.description"),
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
        mainEntity: { "@id": `${pageUrl}#service` },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: t("meta.title"),
        description: t("hero.body"),
        url: pageUrl,
        provider: { "@id": `${BASE_URL}/#person` },
        areaServed: ["FR", "MG"],
        availableLanguage: ["fr", "en"],
        hasOfferCatalog: { "@id": `${pageUrl}#catalog` },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${pageUrl}#catalog`,
        name: t("pricing.title"),
        itemListElement: offers,
      },
    ],
  };

  return (
    <>
      <Header />

      <style>{`.galaxy-journey { display: none !important; }`}</style>

      <main id="main-content" className="offer-page min-h-screen bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <section className="border-b border-border px-4 pb-14 pt-12 sm:pb-20 sm:pt-18">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                {t("hero.eyebrow")}
              </p>
              <h1 className="mt-5 max-w-3xl font-elegant text-4xl leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("hero.body")}
              </p>

              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <BookingLink
                  location="offer_hero"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  {t("hero.cta")}
                </BookingLink>
                <a
                  href="#roi"
                  className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {t("hero.secondaryCta")}
                </a>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {t("hero.note")}
              </p>

              <div className="mt-6 flex max-w-xl items-center gap-3 border-t border-border pt-5">
                <Image
                  src="/photo-profile.png"
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-full border border-border object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t("hero.byline")}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {t("hero.bylineRole")}
                  </p>
                </div>
              </div>
            </div>

            <aside className="border-t-2 border-primary lg:border-l lg:border-t-0 lg:pl-8" aria-label={t("decision.eyebrow")}>
              <p className="py-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary lg:pt-0">
                {t("decision.eyebrow")}
              </p>
              <dl>
                <div className="border-t border-border py-4">
                  <dt className="text-xs text-muted-foreground">{t("decision.investmentLabel")}</dt>
                  <dd className="mt-1 font-elegant text-3xl leading-none text-foreground">
                    {t("decision.investmentPrefix")} {taxedPrice(locale, FOUNDING_OFFER.price)}
                  </dd>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {t("decision.investmentNote")}
                  </p>
                </div>
                <div className="border-t border-border py-4">
                  <dt className="text-xs text-muted-foreground">{t("decision.deliveryLabel")}</dt>
                  <dd className="mt-1 text-xl font-semibold text-foreground">{t("decision.deliveryValue")}</dd>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {t("decision.deliveryNote")}
                  </p>
                </div>
                <div className="border-y border-border py-4">
                  <dt className="text-xs text-muted-foreground">{t("decision.referenceLabel")}</dt>
                  <dd className="mt-1 text-xl font-semibold text-primary">{t("decision.referenceValue")}</dd>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {t("decision.referenceNote")}
                  </p>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section id="preuve" aria-labelledby="proof-title" className="border-b border-border bg-muted/35 px-4 py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-start lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                {t("proof.eyebrow")}
              </p>
              <h2 id="proof-title" className="mt-3 max-w-3xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                {t("proof.title")}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("proof.body")}
              </p>
              <nav aria-label={t("proof.navigationLabel")} className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
                <Link
                  href="/services"
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                >
                  {t("proof.servicesCta")}
                </Link>
                <Link
                  href="/projets"
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                >
                  {t("proof.casesCta")}
                </Link>
              </nav>
            </div>

            <div>
              <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-1">
                {proofMetrics.map((metric) => (
                  <div key={metric.label} className="grid grid-cols-[auto_1fr] items-baseline gap-4 bg-background p-4 sm:block lg:grid">
                    <dt className="font-elegant text-3xl leading-none text-primary">{metric.value}</dt>
                    <dd className="text-xs leading-relaxed text-muted-foreground sm:mt-2 lg:mt-0">{metric.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="roi" aria-labelledby="roi-title" className="scroll-mt-24 border-b border-border px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                  {roiCopy.eyebrow}
                </p>
                <h2 id="roi-title" className="mt-3 max-w-3xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                  {roiCopy.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {roiCopy.body}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <RoiCalculator
                locale={locale}
                investment={FOUNDING_OFFER.price}
                monthlyRun={OFFER_PRICES.run}
                copy={roiCopy}
              />
            </div>
          </div>
        </section>

        <section id="tarifs" aria-labelledby="pricing-title" className="scroll-mt-24 border-b border-border px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                {t("pricing.eyebrow")}
              </p>
              <h2 id="pricing-title" className="mt-3 font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                {t("pricing.title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("pricing.intro")}
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-6">
              {pricingCards.map((card) => {
                const featured = card.id === "pilot";

                return (
                  <article
                    key={card.id}
                    className={`relative flex min-w-0 flex-col p-5 sm:p-6 md:col-span-3 ${
                      featured ? "bg-primary/[0.07]" : "bg-background"
                    }`}
                  >
                    {featured ? (
                      <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                        {t("pricing.recommended")}
                      </span>
                    ) : null}
                    <h3
                      className={`text-lg font-semibold text-foreground ${
                        featured ? "pr-24" : ""
                      }`}
                    >
                      {card.title}
                    </h3>
                    {featured ? (
                      <div className="mt-5">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {t("pricing.catalogPriceLabel")}{" "}
                          <span className="line-through decoration-primary/70">
                            {taxedPrice(locale, OFFER_PRICES.pilot)}
                          </span>
                        </p>
                        <p className="mt-2 font-elegant text-3xl leading-none text-foreground">
                          {taxedPrice(locale, FOUNDING_OFFER.price)}
                        </p>
                        <p className="mt-2 text-xs font-semibold leading-relaxed text-primary">
                          {t("pricing.foundingAvailability")}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-5 font-elegant text-3xl leading-none text-foreground">
                        {card.pricePrefix ? `${card.pricePrefix} ` : ""}
                        {taxedPrice(locale, OFFER_PRICES[card.id])}
                      </p>
                    )}

                    <dl className="mt-7 flex flex-1 flex-col gap-5 border-t border-border pt-5">
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {t("pricing.decisionLabel")}
                        </dt>
                        <dd className="mt-2 text-sm font-semibold leading-relaxed text-foreground">{card.decision}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {t("pricing.resultLabel")}
                        </dt>
                        <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.result}</dd>
                      </div>
                      <div className="mt-auto">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {t("pricing.durationLabel")}
                        </dt>
                        <dd className="mt-2 text-sm font-medium text-foreground">{card.duration}</dd>
                      </div>
                    </dl>
                    {featured ? (
                      <>
                        <div className="mt-6 border-t border-primary/25 pt-5">
                          <p className="text-xs font-semibold leading-relaxed text-foreground">
                            {t("pricing.foundingExchangeLabel")}
                          </p>
                          <ul className="mt-3 space-y-2">
                            {foundingExchange.map((item) => (
                              <li
                                key={item}
                                className="grid grid-cols-[1rem_1fr] gap-2 text-xs leading-relaxed text-muted-foreground"
                              >
                                <span aria-hidden="true" className="text-primary">
                                  +
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <BookingLink
                          location="offer_pricing_pilot"
                          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:ring-offset-4"
                        >
                          {t("pricing.cta")}
                        </BookingLink>
                      </>
                    ) : null}
                  </article>
                );
              })}
              <div className="bg-background p-5 sm:p-6 md:col-span-3">
                <p className="text-sm font-semibold text-foreground">{t("pricing.runLabel")}</p>
                <p className="mt-1 font-elegant text-xl leading-none text-primary">
                  {taxedPrice(locale, OFFER_PRICES.run, true)}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("pricing.runBody")}</p>
              </div>
              <div className="bg-background p-5 sm:p-6 md:col-span-3">
                <p className="text-sm font-semibold text-foreground">{t("pricing.mappingLabel")}</p>
                <p className="mt-1 font-elegant text-xl leading-none text-primary">
                  {taxedPrice(locale, OFFER_PRICES.cartography)}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("pricing.mappingBody")}</p>
              </div>

              <div className="flex items-start gap-2.5 bg-foreground px-5 py-3 text-xs font-medium leading-relaxed text-background sm:px-6 md:col-span-6">
                <span aria-hidden="true" className="shrink-0 text-primary">
                  ✓
                </span>
                <p>{t("pricing.creditNote")}</p>
              </div>
            </div>
          </div>
        </section>

        <PilotBento
          eyebrow={t("scopeSummary.eyebrow")}
          title={t("scopeSummary.title")}
          intro={t("scopeSummary.intro")}
          metrics={scopeMetrics}
          includedTitle={t("scopeSummary.includedTitle")}
          included={scopeIncluded}
          limitsTitle={t("scopeSummary.limitsTitle")}
          limits={scopeLimits}
          interfaceTitle={t("scopeSummary.interfaceTitle")}
          interfaceBody={t("scopeSummary.interfaceBody")}
          videoCaption={t("scopeSummary.videoCaption")}
          videoFallback={t("scopeSummary.videoFallback")}
          guarantees={guarantees}
        />

        <section aria-labelledby="faq-title" className="border-b border-border px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 id="faq-title" className="max-w-3xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
              {t("executiveFaq.title")}
            </h2>
            <div className="mt-9 max-w-4xl">
              <OfferFaq items={faqItems} />
            </div>
          </div>
        </section>

        <section aria-labelledby="final-title" className="bg-primary px-4 py-14 text-primary-foreground sm:py-18">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
            <div>
              <h2 id="final-title" className="max-w-3xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                {t("final.title")}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                {t("final.body")}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-primary-foreground/70">{t("final.note")}</p>
            </div>
            <BookingLink
              location="offer_final"
              className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-primary"
            >
              {t("final.cta")}
            </BookingLink>
          </div>
        </section>
      </main>

      <PixelSceneBackground>
        <Footer />
      </PixelSceneBackground>
    </>
  );
}
