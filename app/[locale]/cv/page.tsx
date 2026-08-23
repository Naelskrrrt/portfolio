import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { CvSection } from "@/components/cv/CvSection";
import { CvToolbar } from "@/components/cv/CvToolbar";
import { certifications } from "@/lib/certifications";

import { CONTACT, EMAIL, SITE_URL as BASE_URL } from "@/lib/cv-contact";

type Metric = { value: string; label: string };
type Area = { title: string; body: string };
type SkillGroup = { label: string; items: string[] };
type Experience = {
  role: string;
  company: string;
  type: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
  stack: string;
};
type Project = { name: string; context: string; body: string; result: string };
type Education = {
  degree: string;
  school: string;
  location: string;
  detail: string;
  /** Optional line explaining what this training brings to the job */
  edge?: string;
};
type Language = { name: string; level: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CV.meta" });
  const canonical =
    locale === routing.defaultLocale
      ? `${BASE_URL}/cv`
      : `${BASE_URL}/${locale}/cv`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        fr: `${BASE_URL}/cv`,
        en: `${BASE_URL}/en/cv`,
      },
    },
    openGraph: {
      type: "profile",
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

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const pageUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/cv`
      : `${BASE_URL}/${locale}/cv`;

  const t = await getTranslations({ locale, namespace: "CV" });
  const tCert = await getTranslations({ locale, namespace: "Certifications" });

  const metrics = t.raw("impact.metrics") as Metric[];
  const areas = t.raw("expertise.areas") as Area[];
  const skillGroups = t.raw("skills.groups") as SkillGroup[];
  const experiences = t.raw("experience.items") as Experience[];
  const projects = t.raw("projects.items") as Project[];
  const education = t.raw("education.items") as Education[];
  const languages = t.raw("languages.items") as Language[];
  const softSkills = t.raw("soft.items") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profilepage`,
    url: pageUrl,
    name: t("meta.title"),
    description: t("meta.description"),
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    mainEntity: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "LALASON Annaël",
      url: BASE_URL,
      image: `${BASE_URL}/photo-profile.png`,
      jobTitle: t("header.role"),
      description: t("summary.body"),
      email: `mailto:${EMAIL}`,
      telephone: "+261389570760",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Antananarivo",
        addressCountry: "MG",
      },
      sameAs: [
        "https://github.com/NaelSkrrrt",
        "https://www.linkedin.com/in/lalasonnael",
        "https://x.com/lalasonnael29",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Mon Ambassadeur",
        url: "https://www.monambassadeur.com",
      },
      alumniOf: [...new Set(education.map((item) => item.school))].map(
        (school) => ({
          "@type": "CollegeOrUniversity",
          name: school,
        })
      ),
      knowsLanguage: languages.map((language) => ({
        "@type": "Language",
        name: language.name,
      })),
      knowsAbout: skillGroups.flatMap((group) => group.items),
      hasCredential: certifications.map((certification, index) => ({
        "@type": "EducationalOccupationalCredential",
        name: tCert(`items.${index}.name`),
        url: certification.href,
        credentialCategory: "certificate",
        recognizedBy: {
          "@type": "Organization",
          name: tCert(`items.${index}.issuer`),
        },
      })),
    },
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CvToolbar />

      <article className="cv-page max-w-3xl mx-auto px-4 pb-16">
        {/* ---------- Identity ---------- */}
        <header className="cv-block pt-10 pb-8">
          <div className="cv-identity flex items-start gap-5">
            <div className="cv-photo relative w-24 h-24 shrink-0 rounded-full overflow-hidden border border-border max-sm:w-20 max-sm:h-20">
              <Image
                src="/photo-profile.png"
                alt={t("header.photoAlt")}
                fill
                priority
                sizes="96px"
                className="object-cover"
              />
            </div>

            <div className="cv-idtext flex flex-col gap-1.5">
              <h1 className="text-3xl lg:text-4xl font-elegant tracking-tight">
                LALASON Anna&#235;l
              </h1>
              <p className="text-muted-foreground">{t("header.role")}</p>
              <p className="flex items-center gap-1.5 text-xs text-green-500 print:hidden">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                {t("header.available")}
              </p>
            </div>
          </div>

          {/* Contact — plain text, one label/value pair per row (ATS-parsable) */}
          <dl className="cv-contact mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
            {CONTACT.map((item) => (
              <div key={item.key} className="flex gap-2">
                <dt className="text-muted-foreground shrink-0">
                  {t(`header.labels.${item.key}`)}
                </dt>
                <dd className="min-w-0">
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors break-words"
                  >
                    {item.value}
                  </a>
                </dd>
              </div>
            ))}
            <div className="flex gap-2 sm:col-span-2">
              <dt className="text-muted-foreground shrink-0">
                {t("header.labels.location")}
              </dt>
              <dd className="text-foreground">{t("header.location")}</dd>
            </div>
          </dl>
        </header>

        {/* ---------- Profile ---------- */}
        <CvSection title={t("summary.title")}>
          <div className="cv-summary flex flex-col gap-5">
            <p className="text-muted-foreground leading-relaxed">
              {t("summary.body")}
            </p>

            <p className="cv-quote border-l-2 border-primary/60 pl-4 font-elegant italic text-lg text-foreground/90">
              {t("summary.quote")}
            </p>

            <ul className="cv-chips flex items-center gap-2 flex-wrap">
              {metrics.map((metric) => (
                <li
                  key={metric.label}
                  className="cv-chip h-8 px-3 rounded-md border border-border bg-background/80 backdrop-blur-sm shadow-xs flex items-center gap-2 text-sm"
                >
                  <span className="font-semibold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-muted-foreground">{metric.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </CvSection>

        {/* ---------- Areas of expertise ---------- */}
        <CvSection title={t("expertise.title")}>
          <ul className="cv-areas grid grid-cols-1 sm:grid-cols-2 gap-4">
            {areas.map((area, index) => (
              <li
                key={area.title}
                className="cv-block cv-card rounded-lg border border-border bg-card/40 p-4 flex flex-col gap-1.5"
              >
                <span className="cv-index font-mono text-[11px] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="cv-inline-title font-medium text-foreground">
                  {area.title}
                </h3>
                <p className="cv-inline-body text-sm text-muted-foreground leading-relaxed">
                  {area.body}
                </p>
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ---------- Technical skills ---------- */}
        <CvSection title={t("skills.title")}>
          <div className="cv-groups flex flex-col gap-5">
            {skillGroups.map((group) => (
              <div key={group.label} className="cv-block flex flex-col gap-2">
                <h3 className="cv-inline-title text-sm font-medium text-foreground">
                  {group.label}
                </h3>
                <ul className="cv-chips flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="cv-chip px-2 py-0.5 rounded-md border border-border bg-background/60 text-xs text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>

        {/* ---------- Professional experience ---------- */}
        <CvSection title={t("experience.title")}>
          <ul className="cv-exp-list space-y-8">
            {experiences.map((experience) => (
              <li
                key={`${experience.company}-${experience.period}`}
                className="cv-block flex gap-4"
              >
                <div className="cv-exp-side flex flex-col items-end pt-1 shrink-0 w-[150px] max-sm:hidden text-right">
                  <span className="text-muted-foreground text-sm">
                    {experience.period}
                  </span>
                  <span className="text-muted-foreground/70 text-xs mt-0.5">
                    {experience.location}
                  </span>
                </div>

                <div className="cv-exp-body relative flex flex-col gap-1 flex-1 pl-4 border-l border-border">
                  <div className="cv-exp-dot absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-muted-foreground/50" />

                  <h3 className="text-foreground font-medium">
                    {experience.role}
                  </h3>
                  <p className="cv-exp-org text-sm text-muted-foreground">
                    {experience.company}
                    {experience.type && ` · ${experience.type}`}
                  </p>
                  <p className="cv-exp-inline text-muted-foreground text-sm sm:hidden">
                    {experience.period} · {experience.location}
                  </p>

                  <p className="cv-exp-summary text-muted-foreground text-sm italic mt-1">
                    {experience.summary}
                  </p>

                  <ul className="cv-bullets mt-2 space-y-1.5">
                    {experience.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="text-muted-foreground/50 shrink-0 mt-1">
                          &#x2022;
                        </span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {experience.stack && (
                    <p className="cv-exp-stack mt-2.5 text-xs text-muted-foreground/80">
                      <span className="text-foreground/70">
                        {t("experience.stackLabel")} :
                      </span>{" "}
                      {experience.stack}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ---------- Selected work ---------- */}
        <CvSection title={t("projects.title")}>
          <ul className="space-y-5">
            {projects.map((project) => (
              <li
                key={project.name}
                className="cv-block cv-card rounded-lg border border-border bg-card/40 p-4 flex flex-col gap-1.5"
              >
                <h3 className="cv-proj-name font-medium text-foreground">
                  {project.name}
                </h3>
                <p className="cv-proj-context text-xs text-muted-foreground/80">
                  {project.context}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.body}
                </p>
                <p className="cv-proj-result text-sm mt-1">
                  <span className="text-foreground/70">
                    {t("projects.resultLabel")} :
                  </span>{" "}
                  <span className="text-foreground font-medium">
                    {project.result}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ---------- Education ---------- */}
        <CvSection title={t("education.title")}>
          <ul className="space-y-5">
            {education.map((item) => (
              <li key={item.degree} className="cv-block flex flex-col gap-0.5">
                <h3 className="text-foreground font-medium">{item.degree}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.school} · {item.location}
                </p>
                <p className="text-sm text-muted-foreground italic mt-1">
                  {item.detail}
                </p>
                {item.edge && (
                  <p className="cv-quote mt-2 border-l-2 border-primary/60 pl-3 text-sm text-foreground/80">
                    {item.edge}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ---------- Certifications ---------- */}
        <CvSection title={t("certifications.title")}>
          <ul className="space-y-3">
            {certifications.map((certification, index) => (
              <li key={certification.href} className="cv-block flex flex-col gap-0.5">
                <a
                  href={certification.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-cert-name text-foreground font-medium underline underline-offset-2 hover:text-muted-foreground transition-colors w-fit"
                >
                  {tCert(`items.${index}.name`)}
                </a>
                <span className="text-sm text-muted-foreground">
                  {tCert(`items.${index}.issuer`)} ·{" "}
                  {tCert(`items.${index}.date`)}
                </span>
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ---------- Languages ---------- */}
        <CvSection title={t("languages.title")}>
          <ul className="space-y-2">
            {languages.map((language) => (
              <li
                key={language.name}
                className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2"
              >
                <span className="cv-lang-name text-foreground font-medium shrink-0">
                  {language.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {language.level}
                </span>
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ---------- Ways of working ---------- */}
        <CvSection title={t("soft.title")}>
          <ul className="cv-chips flex flex-wrap gap-1.5">
            {softSkills.map((skill) => (
              <li
                key={skill}
                className="cv-chip px-2 py-0.5 rounded-md border border-border bg-background/60 text-xs text-muted-foreground"
              >
                {skill}
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ---------- Outro (screen only) ---------- */}
        <CvSection title={t("outro.title")} className="print:hidden">
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground leading-relaxed">
              {t("outro.body")}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${EMAIL}`}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
              >
                {t("outro.cta")}
              </a>
              <Link
                href="/"
                className="h-9 px-4 rounded-md border border-border bg-background/80 text-sm flex items-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {t("outro.portfolio")}
              </Link>
            </div>
          </div>
        </CvSection>
      </article>
    </main>
  );
}
