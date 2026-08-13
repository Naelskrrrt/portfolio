import { renderToBuffer } from "@react-pdf/renderer";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import path from "node:path";
import { routing } from "@/i18n/routing";
import { CvPdfDocument, type CvPdfData } from "@/components/cv/CvPdfDocument";
import { certifications } from "@/lib/certifications";
import { CONTACT } from "@/lib/cv-contact";

/** Prerendered at build time, then served as a static asset. */
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const FILENAME: Record<string, string> = {
  fr: "CV-LALASON-Annael.pdf",
  en: "Resume-LALASON-Annael.pdf",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "CV" });
  const tCert = await getTranslations({ locale, namespace: "Certifications" });

  const data: CvPdfData = {
    name: "LALASON Annaël",
    role: t("header.role"),
    contact: [
      ...CONTACT.map((item) => ({
        label: t(`header.labels.${item.key}`),
        value: item.value,
      })),
      { label: t("header.labels.location"), value: t("header.location") },
    ],
    summary: {
      title: t("summary.title"),
      body: t("summary.body"),
      quote: t("summary.quote"),
    },
    metrics: t.raw("impact.metrics"),
    expertise: {
      title: t("expertise.title"),
      areas: t.raw("expertise.areas"),
    },
    skills: { title: t("skills.title"), groups: t.raw("skills.groups") },
    experience: {
      title: t("experience.title"),
      stackLabel: t("experience.stackLabel"),
      items: t.raw("experience.items"),
    },
    projects: {
      title: t("projects.title"),
      resultLabel: t("projects.resultLabel"),
      items: t.raw("projects.items"),
    },
    education: {
      title: t("education.title"),
      items: t.raw("education.items"),
    },
    certifications: {
      title: t("certifications.title"),
      items: certifications.map((_, index) => ({
        name: tCert(`items.${index}.name`),
        issuer: tCert(`items.${index}.issuer`),
        date: tCert(`items.${index}.date`),
      })),
    },
    languages: { title: t("languages.title"), items: t.raw("languages.items") },
    soft: { title: t("soft.title"), items: t.raw("soft.items") },
    photo: path.join(process.cwd(), "public", "photo-profile.png"),
    pageLabel: t("pdf.pageLabel"),
  };

  const pdf = await renderToBuffer(<CvPdfDocument data={data} />);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${
        FILENAME[locale] ?? FILENAME.fr
      }"`,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
