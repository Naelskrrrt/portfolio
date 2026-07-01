import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GalaxyJourney } from "@/components/GalaxyJourney";
import { DawnSideRays } from "@/components/SideRays";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro";

  return {
    metadataBase: new URL(baseUrl),
    title: t("title"),
    description: t("description"),
    keywords: [
      "architecte IA",
      "systèmes intelligents",
      "automation",
      "Next.js",
      "développeur fullstack",
      "Madagascar",
      "LALASON Annaël",
    ],
    authors: [{ name: "LALASON Annaël", url: baseUrl }],
    creator: "LALASON Annaël",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${baseUrl}/${locale}`,
      siteName: "LALASON Annaël",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/favicon/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "LALASON Annaël — Architecte Systèmes & IA",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@lalasonnael29",
      creator: "@lalasonnael29",
      title: t("title"),
      description: t("description"),
    },
    icons: {
      icon: [
        { url: "/favicon/favicon.ico", sizes: "48x48" },
        { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/favicon/site.webmanifest",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "LALASON Annaël",
    url: baseUrl,
    image: `${baseUrl}/photo-profile.png`,
    sameAs: [
      "https://github.com/NaelSkrrrt",
      "https://www.linkedin.com/in/lalasonnael",
      "https://x.com/lalasonnael29",
    ],
    jobTitle: "Architecte Systèmes & IA",
    description:
      "Architecte des systèmes intelligents — automatisation, IA, stratégie digitale.",
    knowsAbout: ["Intelligence Artificielle", "Automatisation", "Next.js", "Architecture Systèmes"],
    nationality: "MG",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}`,
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:border focus:border-border focus:outline-none"
        >
          {locale === "fr" ? "Aller au contenu principal" : "Skip to main content"}
        </a>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <GalaxyJourney />
            <DawnSideRays />
            <div className="noise relative z-10">{children}</div>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
