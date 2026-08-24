export const OFFER_PATH_IDS = [
  "qualification",
  "framing",
  "pilot",
  "system",
  "run",
] as const;

export type OfferPathId = (typeof OFFER_PATH_IDS)[number];

export const OFFER_PRICES = {
  qualification: 0,
  framing: 290,
  pilot: 4_500,
  system: 7_000,
  run: 390,
  cartography: 890,
} as const satisfies Record<OfferPathId | "cartography", number>;

export const FOUNDING_OFFER = {
  price: 1_500,
  places: 1,
  validThrough: "2026-09-30",
} as const;

export type OfferPriceKey = keyof typeof OFFER_PRICES;

export function formatPrice(locale: string, amount: number): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
