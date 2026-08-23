import type { MetadataRoute } from "next";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro"
).replace(/\/$/, "");

function alternates(frPath: string, enPath: string) {
  return {
    languages: {
      fr: `${BASE_URL}${frPath}`,
      en: `${BASE_URL}${enPath}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: alternates("", "/en"),
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: alternates("", "/en"),
    },
    {
      url: `${BASE_URL}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: alternates("/cv", "/en/cv"),
    },
    {
      url: `${BASE_URL}/en/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alternates("/cv", "/en/cv"),
    },
    {
      url: `${BASE_URL}/offre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: alternates("/offre", "/en/offre"),
    },
    {
      url: `${BASE_URL}/en/offre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: alternates("/offre", "/en/offre"),
    },
  ];
}
