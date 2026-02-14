import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lalason.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: BASE_URL,
          en: `${BASE_URL}/en`,
        },
      },
    },
  ];
}
