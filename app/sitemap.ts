import type { MetadataRoute } from "next";

import { CASE_STUDIES } from "@/lib/projects";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro"
).replace(/\/$/, "");

function alternates(frPath: string, enPath: string) {
  return {
    languages: {
      fr: `${BASE_URL}${frPath}`,
      en: `${BASE_URL}${enPath}`,
      "x-default": `${BASE_URL}${frPath}`,
    },
  };
}

const LAST_MODIFIED = new Date("2026-08-28");

function localizedEntries(
  path: string,
  priority: number,
  changeFrequency: "monthly" | "yearly" = "monthly",
): MetadataRoute.Sitemap {
  const enPath = `/en${path}`;

  return [
    {
      url: `${BASE_URL}${path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: alternates(path, enPath),
    },
    {
      url: `${BASE_URL}${enPath}`,
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority: Math.max(priority - 0.1, 0.1),
      alternates: alternates(path, enPath),
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
      alternates: alternates("", "/en"),
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: alternates("", "/en"),
    },
    ...localizedEntries("/cv", 0.8, "yearly"),
    ...localizedEntries("/offre", 0.9),
    ...localizedEntries("/services", 0.9),
    ...localizedEntries("/projets", 0.8),
    ...CASE_STUDIES.flatMap((project) =>
      localizedEntries(`/projets/${project.caseStudySlug}`, 0.7),
    ),
  ];
}
