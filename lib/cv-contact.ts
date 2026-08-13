export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro";

export const EMAIL = "contact@lalason.pro";
export const PHONE = "+261 38 95 707 60";
export const PHONE_HREF = "https://wa.me/261389570760";

/**
 * Contact rows, shared by the CV page and the generated PDF.
 * Values are identical in both locales — only the labels are translated,
 * under `CV.header.labels.<key>`.
 */
export const CONTACT = [
  { key: "email", value: EMAIL, href: `mailto:${EMAIL}` },
  { key: "phone", value: PHONE, href: PHONE_HREF },
  { key: "site", value: "www.lalason.pro", href: SITE_URL },
  {
    key: "linkedin",
    value: "linkedin.com/in/lalasonnael",
    href: "https://www.linkedin.com/in/lalasonnael",
  },
  {
    key: "github",
    value: "github.com/NaelSkrrrt",
    href: "https://github.com/NaelSkrrrt",
  },
] as const;
