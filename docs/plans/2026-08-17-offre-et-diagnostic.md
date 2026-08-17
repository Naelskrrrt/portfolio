# Pages `/offre` et `/diagnostic` — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en ligne sur lalason.pro la page d'offre avec prix affichés et le funnel de diagnostic avec une capture de leads qui fonctionne réellement, afin que la séquence de prospection puisse démarrer avant l'échéance du Pilote Flow du 30 septembre 2026.

**Architecture:** Deux nouvelles sous-routes sous `app/[locale]/`, suivant exactement le patron de `app/[locale]/cv/page.tsx` (`generateStaticParams`, `generateMetadata`, `setRequestLocale`, copy dans `messages/*.json`). Toute la logique du diagnostic vit dans un module pur `lib/diagnostic.ts`, testé unitairement, consommé à la fois par le wizard côté client (affichage immédiat du résultat) et par le route handler `app/api/diagnostic/route.ts` (recalcul serveur avant enregistrement du lead, pour ne pas faire confiance au client). Les données de prix vivent dans un seul module `lib/offer.ts`.

**Tech Stack:** Next.js 16.1.6 (App Router), React 19.2.3, next-intl 4.8.2, Tailwind CSS 4, TypeScript 5, Vitest (ajouté par ce plan, uniquement pour la logique pure).

**Spec:** [docs/strategy/2026-08-17-architecture-marque-design.md](../strategy/2026-08-17-architecture-marque-design.md)
**Copy source:** [docs/marketing/offre-copy.md](../marketing/offre-copy.md)

---

## Global Constraints

Ces contraintes s'appliquent à **toutes** les tâches. Chaque tâche les inclut implicitement.

- **Le mot « nous » est interdit** dans tout texte visible par un visiteur, en français comme en anglais (`we`, `our`). Voix « je » exclusivement. Source : spec §6.2.
- **Signature publique : `Annaël Lalason`.** Jamais « Naël », jamais « LALASON Annaël » en capitales dans le copy commercial — les capitales restent réservées au schema `Person` et aux documents administratifs (spec §6.2).
- **Formulation canonique de la marque, sans variante :** `Flow AI Studio — le studio d'automatisation IA d'Annaël Lalason` (spec §6.1).
- **Prix, valeurs exactes** (spec §7) : Cartographie `890` € · Flow Solo `4500` € · Flow Duo `7000` € · Flow Ops `9500` € · Run Essentiel `390` €/mois · Run Actif `690` €/mois · Run Pilote `1200` €/mois. Pilote Flow : `1500` € (prix grille `4500` €), run pilote `290` €/mois, `3` places, échéance `2026-09-30`.
- **Aucun chiffre client non vérifiable.** Le gain du cas Minia s'écrit toujours comme une estimation du client, jamais comme une mesure. Valeurs autorisées : `21` automatisations actives, `6+` agents spécialisés, `35-50 h/mois (estimation)`.
- **Bilingue obligatoire.** Toute clé ajoutée à `messages/fr.json` doit exister dans `messages/en.json`. Un build passe même avec une clé EN manquante — la vérification est manuelle et fait partie de chaque tâche qui touche au copy.
- **Aucune modification de `flow-ai.studio`** (repo `Naelskrrrt/flow-ai-studio`). Il est en lecture seule (spec §5).
- **Le slug est identique en FR et EN** (`/offre`, `/en/offre`), comme `/cv` aujourd'hui. Les chemins localisés (`pathnames` next-intl) sont hors périmètre.

---

## File Structure

| Fichier | Responsabilité |
|---|---|
| `lib/offer.ts` | **Créer.** Source unique des prix, paliers et données du Pilote. Aucun JSX, aucun texte marketing (le texte vit dans `messages/*.json`). |
| `lib/diagnostic.ts` | **Créer.** Logique pure : définition des 8 questions, barème, calcul du score, validation des réponses. Aucun import Next/React. |
| `lib/diagnostic.test.ts` | **Créer.** Tests unitaires de `lib/diagnostic.ts`. |
| `lib/booking.ts` | **Créer.** URL Calendly unique, lue depuis l'environnement, avec garde-fou explicite si absente. |
| `app/api/diagnostic/route.ts` | **Créer.** Endpoint POST de capture de lead. Hors `[locale]` — pas d'i18n sur une API. |
| `app/[locale]/offre/page.tsx` | **Créer.** Page d'offre. Assemble les composants, émet le JSON-LD `Service` + `Offer`. |
| `app/[locale]/diagnostic/page.tsx` | **Créer.** Page du diagnostic. Coquille serveur qui monte le wizard client. |
| `components/offre/OfferLadder.tsx` | **Créer.** Les 4 marches et les tableaux de prix. |
| `components/offre/PilotBanner.tsx` | **Créer.** Encart Pilote + compte à rebours. Client (calcul de date). |
| `components/offre/ObjectionList.tsx` | **Créer.** Les 6 objections en `<details>`. |
| `components/diagnostic/DiagnosticWizard.tsx` | **Créer.** Wizard 8 questions + capture email optionnelle. Client. |
| `components/diagnostic/DiagnosticResult.tsx` | **Créer.** Affichage du score, de la bande et des priorités. |
| `components/BookingButton.tsx` | **Créer.** CTA unique réutilisé partout. |
| `messages/fr.json`, `messages/en.json` | **Modifier.** Namespaces `Offre` et `Diagnostic`. |
| `app/sitemap.ts` | **Modifier.** Ajouter les 4 nouvelles URLs (2 pages × 2 locales). |
| `app/[locale]/layout.tsx` | **Modifier.** Ajouter `Organization` Flow AI Studio avec `founder` → `/#person`, et `worksFor` sur le `Person`. |
| `components/Projects.tsx` | **Modifier.** Retirer le lien sortant vers flow-ai.studio. |
| `package.json` | **Modifier.** Ajouter `vitest` en devDependency et les scripts `test`. |

**Note sur les tests.** Le projet n'a aujourd'hui **aucun framework de test**. Ce plan en ajoute un pour la seule partie qui le mérite : la logique pure du diagnostic (barème, validation). C'est précisément la couche qui a silencieusement cassé sur flow-ai.studio. Les pages et le copy se vérifient par `npm run build`, `npx tsc --noEmit`, `npm run lint` et une vérification navigateur — pas par des tests de rendu, disproportionnés pour deux pages de contenu.

---

### Task 1: Socle — données de l'offre et CTA unique

**Files:**
- Create: `lib/offer.ts`
- Create: `lib/booking.ts`
- Create: `components/BookingButton.tsx`

**Interfaces:**
- Consumes: rien.
- Produces:
  - `formatPrice(value: number): string`
  - `CARTOGRAPHY_PRICE: 890`
  - `BUILD_TIERS: readonly BuildTier[]` où `BuildTier = { id: string; nameKey: string; price: number }`
  - `RUN_TIERS: readonly RunTier[]` où `RunTier = { id: string; nameKey: string; price: number }`
  - `PILOT: { price: 1500; regularPrice: 4500; runPrice: 290; seats: 3; deadline: "2026-09-30" }`
  - `discountPercent(regularPrice: number, pilotPrice: number): number`
  - `pilotSeatsRemaining(): number` — lit `PILOT_SEATS_REMAINING`, retombe sur `PILOT.seats`
  - `getBookingUrl(): string` — lève une erreur explicite si `NEXT_PUBLIC_BOOKING_URL` est absente
  - `<BookingButton labelKey: string; variant?: "primary" | "ghost" />`

- [ ] **Step 1: Créer `lib/offer.ts`**

```ts
/**
 * Source unique des prix. Toute valeur affichée sur /offre vient d'ici.
 * Le texte marketing vit dans messages/*.json — ce module ne contient que
 * des nombres et des identifiants de clés de traduction.
 */

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => eur.format(value);

export const CARTOGRAPHY_PRICE = 890;

export type BuildTier = { id: string; nameKey: string; price: number };

export const BUILD_TIERS: readonly BuildTier[] = [
  { id: "solo", nameKey: "Flow Solo", price: 4500 },
  { id: "duo", nameKey: "Flow Duo", price: 7000 },
  { id: "ops", nameKey: "Flow Ops", price: 9500 },
] as const;

export type RunTier = { id: string; nameKey: string; price: number };

export const RUN_TIERS: readonly RunTier[] = [
  { id: "essentiel", nameKey: "Run Essentiel", price: 390 },
  { id: "actif", nameKey: "Run Actif", price: 690 },
  { id: "pilote", nameKey: "Run Pilote", price: 1200 },
] as const;

export const PILOT = {
  price: 1500,
  regularPrice: 4500,
  runPrice: 290,
  seats: 3,
  /** Format ISO. Sert au compte à rebours et à la date affichée. */
  deadline: "2026-09-30",
} as const;

export const discountPercent = (regularPrice: number, pilotPrice: number) =>
  Math.round((1 - pilotPrice / regularPrice) * 100);

/**
 * Places restantes. Pilotable sans redéploiement de code via une variable
 * d'environnement, parce que ce chiffre bouge au rythme des signatures et
 * pas au rythme des commits.
 */
export function pilotSeatsRemaining(): number {
  const raw = process.env.PILOT_SEATS_REMAINING;
  if (raw === undefined) return PILOT.seats;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) return PILOT.seats;
  return Math.min(parsed, PILOT.seats);
}
```

- [ ] **Step 2: Créer `lib/booking.ts`**

```ts
/**
 * Un seul point de rendez-vous pour tout le site. Si l'URL manque, on échoue
 * fort et tôt : un bouton de réservation qui ne mène nulle part coûte plus
 * cher qu'un build cassé.
 */
export function getBookingUrl(): string {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_BOOKING_URL est absente. Renseigne l'URL Calendly dans .env.local et dans les variables d'environnement Vercel."
    );
  }
  return url;
}
```

- [ ] **Step 3: Ajouter la variable dans `.env.local`**

```bash
echo 'NEXT_PUBLIC_BOOKING_URL=https://calendly.com/REMPLACER-PAR-LE-VRAI-LIEN' >> .env.local
```

Renseigner ensuite la vraie URL Calendly. **Ne pas laisser la valeur `REMPLACER-PAR-LE-VRAI-LIEN`** : c'est l'erreur exacte qui a rendu flow-ai.studio non convertissant pendant des mois.

- [ ] **Step 4: Créer `components/BookingButton.tsx`**

```tsx
import { getBookingUrl } from "@/lib/booking";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  variant?: "primary" | "ghost";
  className?: string;
};

export function BookingButton({ label, variant = "primary", className }: Props) {
  return (
    <a
      href={getBookingUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "h-10 px-5 rounded-md text-sm font-medium inline-flex items-center transition-opacity",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "border border-border bg-background/80 hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {label}
    </a>
  );
}
```

- [ ] **Step 5: Vérifier que le projet compile**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add lib/offer.ts lib/booking.ts components/BookingButton.tsx
git commit -m "feat(offre): socle des données de prix et CTA de réservation unique"
```

---

### Task 2: Logique du diagnostic, en TDD

**Files:**
- Create: `lib/diagnostic.ts`
- Create: `lib/diagnostic.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: rien.
- Produces:
  - `QUESTIONS: readonly Question[]` où `Question = { id: QuestionId; axis: Axis }` — 8 entrées
  - `type QuestionId = "outils" | "entites" | "brasDroit" | "documentation" | "recopie" | "relances" | "sourcage" | "alertes"`
  - `type Axis = "contexte" | "dependance" | "repetition" | "tracabilite"`
  - `type AnswerValue = 0 | 1 | 2 | 3`
  - `type DiagnosticAnswers = Record<QuestionId, AnswerValue>`
  - `type Band = "structure" | "fragmente" | "critique"`
  - `type DiagnosticScore = { total: number; band: Band; axes: { axis: Axis; score: number; max: number }[]; priorities: Axis[] }`
  - `isValidAnswers(input: unknown): input is DiagnosticAnswers`
  - `computeDiagnostic(answers: DiagnosticAnswers): DiagnosticScore`

- [ ] **Step 1: Installer Vitest**

```bash
npm install --save-dev vitest
```

- [ ] **Step 2: Ajouter les scripts de test dans `package.json`**

Dans la section `"scripts"`, ajouter les deux lignes :

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Écrire les tests, qui doivent échouer**

Créer `lib/diagnostic.test.ts`. Import **relatif** volontaire : évite d'avoir à configurer l'alias `@/` pour Vitest.

```ts
import { describe, expect, it } from "vitest";
import {
  QUESTIONS,
  computeDiagnostic,
  isValidAnswers,
  type DiagnosticAnswers,
  type AnswerValue,
} from "./diagnostic";

const answersAll = (value: AnswerValue): DiagnosticAnswers =>
  Object.fromEntries(
    QUESTIONS.map((question) => [question.id, value])
  ) as DiagnosticAnswers;

describe("QUESTIONS", () => {
  it("contient 8 questions aux identifiants uniques", () => {
    expect(QUESTIONS).toHaveLength(8);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(8);
  });

  it("répartit les questions sur 4 axes, 2 par axe", () => {
    const perAxis = new Map<string, number>();
    for (const question of QUESTIONS) {
      perAxis.set(question.axis, (perAxis.get(question.axis) ?? 0) + 1);
    }
    expect([...perAxis.values()]).toEqual([2, 2, 2, 2]);
  });
});

describe("computeDiagnostic", () => {
  it("donne 0 et la bande structure quand tout est au minimum", () => {
    const result = computeDiagnostic(answersAll(0));
    expect(result.total).toBe(0);
    expect(result.band).toBe("structure");
  });

  it("donne 24 et la bande critique quand tout est au maximum", () => {
    const result = computeDiagnostic(answersAll(3));
    expect(result.total).toBe(24);
    expect(result.band).toBe("critique");
  });

  it("place les bornes de bande au bon endroit", () => {
    const result = computeDiagnostic(answersAll(1));
    expect(result.total).toBe(8);
    expect(result.band).toBe("structure");

    const higher = computeDiagnostic(answersAll(2));
    expect(higher.total).toBe(16);
    expect(higher.band).toBe("fragmente");
  });

  it("remonte les axes les plus douloureux en priorités", () => {
    const answers = answersAll(0);
    answers.recopie = 3;
    answers.relances = 3;

    const result = computeDiagnostic(answers);
    expect(result.priorities[0]).toBe("repetition");
  });

  it("expose un score par axe borné à son maximum", () => {
    const result = computeDiagnostic(answersAll(3));
    expect(result.axes).toHaveLength(4);
    for (const axis of result.axes) {
      expect(axis.max).toBe(6);
      expect(axis.score).toBe(6);
    }
  });

  it("ne retourne jamais plus de 2 priorités", () => {
    const result = computeDiagnostic(answersAll(3));
    expect(result.priorities.length).toBeLessThanOrEqual(2);
  });
});

describe("isValidAnswers", () => {
  it("accepte un jeu de réponses complet et valide", () => {
    expect(isValidAnswers(answersAll(2))).toBe(true);
  });

  it("refuse un jeu incomplet", () => {
    const partial = answersAll(1);
    delete (partial as Record<string, unknown>).alertes;
    expect(isValidAnswers(partial)).toBe(false);
  });

  it("refuse une valeur hors barème", () => {
    const invalid = { ...answersAll(1), outils: 7 };
    expect(isValidAnswers(invalid)).toBe(false);
  });

  it("refuse une valeur non entière ou non numérique", () => {
    expect(isValidAnswers({ ...answersAll(1), outils: 1.5 })).toBe(false);
    expect(isValidAnswers({ ...answersAll(1), outils: "2" })).toBe(false);
  });

  it("refuse null, un tableau et une primitive", () => {
    expect(isValidAnswers(null)).toBe(false);
    expect(isValidAnswers([])).toBe(false);
    expect(isValidAnswers("nope")).toBe(false);
  });

  it("refuse une clé inconnue en plus des 8 attendues", () => {
    expect(isValidAnswers({ ...answersAll(1), inconnue: 2 })).toBe(false);
  });
});
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils échouent**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./diagnostic"`.

- [ ] **Step 5: Écrire l'implémentation minimale**

Créer `lib/diagnostic.ts`.

```ts
/**
 * Logique du diagnostic Score Flow. Module pur : aucun import Next ou React,
 * pour pouvoir être exécuté à l'identique dans le navigateur (affichage
 * immédiat du résultat) et sur le serveur (recalcul avant enregistrement du
 * lead — on ne fait pas confiance au score envoyé par le client).
 *
 * Barème : 8 questions, 4 axes, 2 questions par axe, chaque réponse de 0 à 3.
 * Total de 0 à 24. Plus le score est haut, plus l'organisation est fragmentée.
 */

export type Axis = "contexte" | "dependance" | "repetition" | "tracabilite";

export type QuestionId =
  | "outils"
  | "entites"
  | "brasDroit"
  | "documentation"
  | "recopie"
  | "relances"
  | "sourcage"
  | "alertes";

export type Question = { id: QuestionId; axis: Axis };

export const QUESTIONS: readonly Question[] = [
  { id: "outils", axis: "contexte" },
  { id: "entites", axis: "contexte" },
  { id: "brasDroit", axis: "dependance" },
  { id: "documentation", axis: "dependance" },
  { id: "recopie", axis: "repetition" },
  { id: "relances", axis: "repetition" },
  { id: "sourcage", axis: "tracabilite" },
  { id: "alertes", axis: "tracabilite" },
] as const;

export const AXES: readonly Axis[] = [
  "contexte",
  "dependance",
  "repetition",
  "tracabilite",
] as const;

export type AnswerValue = 0 | 1 | 2 | 3;
export type DiagnosticAnswers = Record<QuestionId, AnswerValue>;
export type Band = "structure" | "fragmente" | "critique";

export type DiagnosticScore = {
  total: number;
  band: Band;
  axes: { axis: Axis; score: number; max: number }[];
  priorities: Axis[];
};

const MAX_PER_QUESTION = 3;
const QUESTIONS_PER_AXIS = 2;
const MAX_PER_AXIS = MAX_PER_QUESTION * QUESTIONS_PER_AXIS;

export function isValidAnswers(input: unknown): input is DiagnosticAnswers {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return false;
  }

  const record = input as Record<string, unknown>;
  const keys = Object.keys(record);

  if (keys.length !== QUESTIONS.length) return false;

  return QUESTIONS.every((question) => {
    const value = record[question.id];
    return (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= MAX_PER_QUESTION
    );
  });
}

function bandFor(total: number): Band {
  if (total <= 8) return "structure";
  if (total <= 16) return "fragmente";
  return "critique";
}

export function computeDiagnostic(answers: DiagnosticAnswers): DiagnosticScore {
  const axes = AXES.map((axis) => {
    const score = QUESTIONS.filter((question) => question.axis === axis).reduce(
      (sum, question) => sum + answers[question.id],
      0
    );
    return { axis, score, max: MAX_PER_AXIS };
  });

  const total = axes.reduce((sum, axis) => sum + axis.score, 0);

  // Priorités : les axes les plus douloureux d'abord, 2 au maximum, et
  // uniquement ceux qui dépassent la moitié de leur maximum. Un axe sain
  // n'est pas une priorité, même s'il est le pire de quatre axes sains.
  const priorities = [...axes]
    .filter((axis) => axis.score > axis.max / 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((axis) => axis.axis);

  return { total, band: bandFor(total), axes, priorities };
}
```

- [ ] **Step 6: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test`
Expected: PASS — 13 tests.

- [ ] **Step 7: Vérifier que le build Next n'est pas cassé par le fichier de test**

Run: `npx tsc --noEmit && npm run build`
Expected: succès. Si `tsc` se plaint des types Vitest, ajouter `"types": ["vitest/globals"]` dans `compilerOptions` de `tsconfig.json` — mais les tests important explicitement depuis `vitest`, ce ne devrait pas être nécessaire.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json lib/diagnostic.ts lib/diagnostic.test.ts
git commit -m "feat(diagnostic): barème et validation en logique pure, couverts par Vitest"
```

---

### Task 3: Endpoint de capture du lead

**Files:**
- Create: `app/api/diagnostic/route.ts`

**Interfaces:**
- Consumes: `isValidAnswers`, `computeDiagnostic`, `type DiagnosticAnswers` depuis `@/lib/diagnostic`.
- Produces: `POST /api/diagnostic`. Corps attendu : `{ answers: DiagnosticAnswers, email?: string, company?: string }`. Réponses : `200 { ok: true }` · `400 { ok: false, error: "invalid_answers" | "invalid_email" }` · `502 { ok: false, error: "delivery_failed" }`.

**Pourquoi cette tâche existe.** C'est le point exact où flow-ai.studio a échoué : l'endpoint était une fonction Netlify sur un hébergement Vercel, donc absent en production, et chaque lead était perdu en silence. Ici l'endpoint est un route handler Next natif, donc il vit avec le site.

- [ ] **Step 1: Créer `app/api/diagnostic/route.ts`**

```ts
import { NextResponse } from "next/server";
import { computeDiagnostic, isValidAnswers } from "@/lib/diagnostic";

/**
 * Réception d'un lead du diagnostic.
 *
 * Le score est recalculé ici à partir des réponses brutes plutôt que de faire
 * confiance à ce que le client envoie, et le secret du webhook reste côté
 * serveur.
 *
 * En cas d'échec de livraison, on renvoie une erreur ET on journalise le
 * payload complet. Un lead perdu en silence est le pire résultat possible —
 * c'est précisément ce qui s'est produit sur l'ancien site.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CONSUMER_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.fr",
  "hotmail.com",
  "hotmail.fr",
  "outlook.com",
  "outlook.fr",
  "live.fr",
  "icloud.com",
]);

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_answers" },
      { status: 400 }
    );
  }

  const body = payload as Record<string, unknown> | null;

  // Extrait dans une constante locale : TypeScript ne rétrécit pas de façon
  // fiable le type d'un accès par signature d'index (`body.answers`) via un
  // prédicat de type. Sans cette étape, `computeDiagnostic` reçoit `unknown`
  // et le build échoue.
  const answers = body?.answers;

  if (!isValidAnswers(answers)) {
    return NextResponse.json(
      { ok: false, error: "invalid_answers" },
      { status: 400 }
    );
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (email && !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    );
  }

  const score = computeDiagnostic(answers);
  const domain = email.split("@")[1]?.toLowerCase() ?? "";

  const lead = {
    receivedAt: new Date().toISOString(),
    email: email || null,
    company: typeof body?.company === "string" ? body.company.trim() : null,
    // Domaine grand public : accepté, mais signalé comme moins qualifié.
    isConsumerEmail: domain ? CONSUMER_DOMAINS.has(domain) : null,
    answers,
    score,
  };

  const webhook = process.env.DIAGNOSTIC_WEBHOOK_URL;

  if (!webhook) {
    // Pas de webhook configuré : on journalise et on considère le lead reçu,
    // plutôt que de renvoyer une erreur à un visiteur qui n'y peut rien.
    console.warn("[diagnostic] DIAGNOSTIC_WEBHOOK_URL absente — lead journalisé uniquement", lead);
    return NextResponse.json({ ok: true });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      throw new Error(`webhook a répondu ${response.status}`);
    }
  } catch (error) {
    console.error("[diagnostic] livraison du lead échouée", { error, lead });
    return NextResponse.json(
      { ok: false, error: "delivery_failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Déclarer la variable d'environnement**

```bash
echo 'DIAGNOSTIC_WEBHOOK_URL=' >> .env.local
```

Y mettre une URL de webhook n8n. C'est le choix par défaut délibéré : la stack n8n est déjà maîtrisée, aucun nouveau service à créer, et le routage vers un mail, un Sheet ou un CRM se fait ensuite sans redéploiement.

- [ ] **Step 3: Lancer le serveur de développement**

Ouvrir la prévisualisation avec l'outil de preview (jamais `npm run dev` en Bash).

- [ ] **Step 4: Vérifier le rejet d'un payload invalide**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H 'Content-Type: application/json' -d '{"answers":{"outils":9}}' http://localhost:3000/api/diagnostic
```

Expected: `400`

- [ ] **Step 5: Vérifier l'acceptation d'un payload valide**

```bash
curl -s -X POST -H 'Content-Type: application/json' -d '{"answers":{"outils":3,"entites":2,"brasDroit":3,"documentation":2,"recopie":3,"relances":3,"sourcage":2,"alertes":3},"email":"test@exemple-entreprise.fr"}' http://localhost:3000/api/diagnostic
```

Expected: `{"ok":true}`

- [ ] **Step 6: Vérifier le rejet d'un email malformé**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H 'Content-Type: application/json' -d '{"answers":{"outils":1,"entites":1,"brasDroit":1,"documentation":1,"recopie":1,"relances":1,"sourcage":1,"alertes":1},"email":"pas-un-email"}' http://localhost:3000/api/diagnostic
```

Expected: `400`

- [ ] **Step 7: Commit**

```bash
git add app/api/diagnostic/route.ts
git commit -m "feat(diagnostic): endpoint de capture avec recalcul serveur du score"
```

---

### Task 4: Copy bilingue des deux pages

**Files:**
- Modify: `messages/fr.json`
- Modify: `messages/en.json`

**Interfaces:**
- Consumes: rien.
- Produces: les namespaces `Offre` et `Diagnostic`, consommés par les tâches 5 et 6 via `getTranslations({ locale, namespace: "Offre" })` et `useTranslations("Diagnostic")`.

Le texte français se reprend **intégralement** de [docs/marketing/offre-copy.md](../marketing/offre-copy.md). Ne pas réécrire : il a été validé.

- [ ] **Step 1: Ajouter le namespace `Offre` à `messages/fr.json`**

Structure des clés à créer (le contenu de chaque valeur vient de `offre-copy.md`, section par section) :

```
Offre.meta.title             ← « Offre & tarifs — Annaël Lalason · Flow AI Studio »
Offre.meta.description
Offre.hero.title             ← « Quatre marches. Vous pouvez vous arrêter à chacune. »
Offre.hero.subtitle
Offre.hero.cta               ← « Réserver 30 minutes »
Offre.pilot.title
Offre.pilot.body
Offre.pilot.counterparts     ← tableau de 3 chaînes
Offre.pilot.fallback         ← « Si l'une des trois vous pose un problème… »
Offre.pilot.cta              ← « Prendre une des 3 places »
Offre.pilot.deadlineLabel    ← « 30 septembre 2026 »
Offre.pilot.seatsLabel       ← « {count} places restantes »
Offre.problem.title          ← « Vous ne manquez pas de temps. Vous repartez de zéro. »
Offre.problem.body           ← tableau de 3 paragraphes
Offre.steps.title            ← « Les quatre marches »
Offre.steps.diagnostic.{title,body,cta}
Offre.steps.cartography.{title,body,stop}
Offre.steps.build.{title,intro,scopeNote}
Offre.steps.build.tiers.{solo,duo,ops}.scope
Offre.steps.run.{title,intro,note}
Offre.steps.run.tiers.{essentiel,actif,pilote}.includes  ← tableau de chaînes
Offre.refusal.title          ← « Quatre choses que je ne toucherai pas… »
Offre.refusal.items          ← tableau de 4 objets {title, body}
Offre.refusal.note
Offre.proof.title
Offre.proof.body             ← tableau de paragraphes
Offre.proof.credibility
Offre.objections.title
Offre.objections.items       ← tableau de 6 objets {question, answer}
Offre.final.{title,body,cta,note}
```

- [ ] **Step 2: Ajouter le namespace `Diagnostic` à `messages/fr.json`**

```
Diagnostic.meta.{title,description}
Diagnostic.intro.{title,body,duration}   ← durée : « 8 questions, environ 4 minutes »
Diagnostic.questions.<id>.label           ← une clé par QuestionId de lib/diagnostic.ts
Diagnostic.questions.<id>.options         ← tableau de 4 libellés, indices 0 à 3
Diagnostic.nav.{previous,next,submit,progress}
Diagnostic.result.title
Diagnostic.result.bands.{structure,fragmente,critique}.{label,body}
Diagnostic.result.axes.{contexte,dependance,repetition,tracabilite}.{label,advice}
Diagnostic.result.prioritiesTitle
Diagnostic.result.noPriorities
Diagnostic.capture.{title,body,emailLabel,companyLabel,submit,skip}
Diagnostic.capture.{success,errorInvalid,errorDelivery,errorFallback}
Diagnostic.cta.{title,body,button}
```

Les 8 questions, avec leurs 4 options dans l'ordre croissant de gravité (0 → 3) :

| id | Question | Options 0 → 3 |
|---|---|---|
| `outils` | Pour préparer un dossier, combien d'outils devez-vous ouvrir ? | 1 ou 2 · 3 ou 4 · 5 ou 6 · 7 et plus |
| `entites` | Combien de sociétés ou d'entités dirigez-vous ? | Une · Deux · Trois · Quatre et plus |
| `brasDroit` | Si votre bras droit s'absentait deux semaines, combien de dossiers seraient bloqués ? | Aucun · Un ou deux · Plusieurs · La plupart |
| `documentation` | Vos processus clés sont-ils écrits quelque part ? | Tous documentés · Les principaux · Quelques-uns · Rien d'écrit |
| `recopie` | Combien d'heures par semaine passez-vous, vous ou votre équipe, à recopier des informations d'un outil à un autre ? | Moins de 2 h · 2 à 5 h · 5 à 15 h · Plus de 15 h |
| `relances` | Vos relances clients et prospects dépendent-elles de quelqu'un qui y pense ? | Entièrement automatisées · En partie · Rarement automatisées · Entièrement manuelles |
| `sourcage` | Quand un chiffre est cité en réunion, savez-vous d'où il vient ? | Toujours sourcé · Le plus souvent · Rarement · Presque jamais |
| `alertes` | Êtes-vous alerté quand un processus échoue ? | Oui, monitoring en place · Sur les processus critiques · Rarement · On l'apprend par un client |

- [ ] **Step 3: Traduire les deux namespaces dans `messages/en.json`**

Traduire, pas dupliquer. Adapter les exemples et garder la voix « I ». **Le mot `we` / `our` ne doit apparaître nulle part.**

- [ ] **Step 4: Vérifier la parité des clés entre les deux fichiers**

```bash
python3 -c "
import json
fr=json.load(open('messages/fr.json')); en=json.load(open('messages/en.json'))
def flat(d,p=''):
    out=set()
    if isinstance(d,dict):
        for k,v in d.items(): out|=flat(v,f'{p}.{k}')
    elif isinstance(d,list):
        for i,v in enumerate(d): out|=flat(v,f'{p}[{i}]')
    else: out.add(p)
    return out
a,b=flat(fr),flat(en)
print('manquant en EN:',sorted(a-b) or 'aucun')
print('manquant en FR:',sorted(b-a) or 'aucun')
"
```

Expected: `aucun` des deux côtés.

- [ ] **Step 5: Vérifier l'absence de « nous » et de « we »**

```bash
python3 -c "
import json,re
for loc in ('fr','en'):
    d=json.load(open(f'messages/{loc}.json'))
    blob=json.dumps({k:v for k,v in d.items() if k in ('Offre','Diagnostic')},ensure_ascii=False)
    bad=re.findall(r'\b(nous|notre|nos|we|our|ours)\b',blob,re.I)
    print(loc, sorted(set(bad)) or 'propre')
"
```

Expected: `propre` pour les deux locales. Toute occurrence est une violation de la contrainte globale et doit être réécrite.

- [ ] **Step 6: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "feat(offre): copy bilingue des pages offre et diagnostic"
```

---

### Task 5: Page `/offre`

**Files:**
- Create: `app/[locale]/offre/page.tsx`
- Create: `components/offre/OfferLadder.tsx`
- Create: `components/offre/PilotBanner.tsx`
- Create: `components/offre/ObjectionList.tsx`

**Interfaces:**
- Consumes: `formatPrice`, `CARTOGRAPHY_PRICE`, `BUILD_TIERS`, `RUN_TIERS`, `PILOT`, `discountPercent`, `pilotSeatsRemaining` depuis `@/lib/offer` · `BookingButton` · namespace `Offre`.
- Produces: la route `/offre` et `/en/offre`, plus le JSON-LD `Service`.

- [ ] **Step 1: Créer `components/offre/PilotBanner.tsx`**

Composant serveur : la date d'échéance est fixe, le compte à rebours se calcule au rendu. Pas besoin de client.

```tsx
import { PILOT, discountPercent, formatPrice, pilotSeatsRemaining } from "@/lib/offer";

type Props = {
  title: string;
  body: string;
  counterparts: string[];
  fallback: string;
  seatsLabel: string;
  deadlineLabel: string;
  cta: React.ReactNode;
};

export function PilotBanner({
  title, body, counterparts, fallback, seatsLabel, deadlineLabel, cta,
}: Props) {
  const seats = pilotSeatsRemaining();
  // Plus aucune place : l'encart disparaît entièrement. On n'affiche jamais
  // « complet » — ça vend la place suivante, qui n'existe pas.
  if (seats <= 0) return null;

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(`${PILOT.deadline}T23:59:59Z`).getTime() - Date.now()) / 86_400_000
    )
  );

  return (
    <aside className="rounded-lg border border-primary/40 bg-primary/5 p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-medium text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground">
          {seatsLabel.replace("{count}", String(seats))} · {deadlineLabel} · J-{daysLeft}
        </span>
      </div>

      <p className="text-3xl font-semibold text-foreground">
        {formatPrice(PILOT.price)}{" "}
        <span className="text-base font-normal text-muted-foreground line-through">
          {formatPrice(PILOT.regularPrice)}
        </span>{" "}
        <span className="text-base font-normal text-primary">
          −{discountPercent(PILOT.regularPrice, PILOT.price)} %
        </span>
      </p>

      <p className="text-muted-foreground leading-relaxed">{body}</p>

      <ol className="flex flex-col gap-2">
        {counterparts.map((item, index) => (
          <li key={item} className="flex gap-3 text-sm text-muted-foreground">
            <span className="font-mono text-xs text-primary shrink-0 mt-0.5">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>

      <p className="text-sm text-muted-foreground italic">{fallback}</p>

      <div>{cta}</div>
    </aside>
  );
}
```

- [ ] **Step 2: Créer `components/offre/OfferLadder.tsx`**

```tsx
import { BUILD_TIERS, CARTOGRAPHY_PRICE, RUN_TIERS, formatPrice } from "@/lib/offer";

type TierCopy = { scope: string };
type RunCopy = { includes: string[] };

type Props = {
  diagnostic: { title: string; body: string; cta: React.ReactNode };
  cartography: { title: string; body: string; stop: string };
  build: { title: string; intro: string; scopeNote: string; tiers: Record<string, TierCopy> };
  run: { title: string; intro: string; note: string; tiers: Record<string, RunCopy> };
};

export function OfferLadder({ diagnostic, cartography, build, run }: Props) {
  return (
    <div className="flex flex-col gap-10">
      {/* 1 — Diagnostic */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-medium text-foreground">{diagnostic.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{diagnostic.body}</p>
        <div>{diagnostic.cta}</div>
      </section>

      {/* 2 — Cartographie */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-medium text-foreground">
          {cartography.title} — {formatPrice(CARTOGRAPHY_PRICE)}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{cartography.body}</p>
        <p className="border-l-2 border-primary/60 pl-4 text-foreground/90">
          {cartography.stop}
        </p>
      </section>

      {/* 3 — Le système */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-foreground">
          {build.title} — {formatPrice(BUILD_TIERS[0].price)} à{" "}
          {formatPrice(BUILD_TIERS[BUILD_TIERS.length - 1].price)}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{build.intro}</p>
        <ul className="flex flex-col gap-3">
          {BUILD_TIERS.map((tier) => (
            <li key={tier.id} className="rounded-lg border border-border bg-card/40 p-4 flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-foreground">{tier.nameKey}</span>
                <span className="font-semibold text-foreground">{formatPrice(tier.price)}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {build.tiers[tier.id].scope}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground italic">{build.scopeNote}</p>
      </section>

      {/* 4 — Le run */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-foreground">
          {run.title} — {formatPrice(RUN_TIERS[0].price)} / mois
        </h3>
        <p className="text-muted-foreground leading-relaxed">{run.intro}</p>
        <ul className="flex flex-col gap-3">
          {RUN_TIERS.map((tier) => (
            <li key={tier.id} className="rounded-lg border border-border bg-card/40 p-4 flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-foreground">{tier.nameKey}</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(tier.price)} / mois
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {run.tiers[tier.id].includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-muted-foreground/50 shrink-0">&#x2022;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground italic">{run.note}</p>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Créer `components/offre/ObjectionList.tsx`**

```tsx
type Objection = { question: string; answer: string };

export function ObjectionList({ items }: { items: Objection[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.question}>
          <details className="group rounded-lg border border-border bg-card/40 p-4">
            <summary className="cursor-pointer font-medium text-foreground marker:text-primary">
              {item.question}
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Créer `app/[locale]/offre/page.tsx`**

Suit exactement le patron de `app/[locale]/cv/page.tsx`.

```tsx
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Section } from "@/components/Section";
import { BookingButton } from "@/components/BookingButton";
import { OfferLadder } from "@/components/offre/OfferLadder";
import { PilotBanner } from "@/components/offre/PilotBanner";
import { ObjectionList } from "@/components/offre/ObjectionList";
import { BUILD_TIERS, CARTOGRAPHY_PRICE, RUN_TIERS } from "@/lib/offer";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Offre.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/offre`,
      languages: { fr: `${BASE_URL}/fr/offre`, en: `${BASE_URL}/en/offre` },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${BASE_URL}/${locale}/offre`,
      siteName: "LALASON Annaël",
      title: t("title"),
      description: t("description"),
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export default async function OffrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Offre" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/${locale}/offre#service`,
    name: "Automatisation IA et agents sur mesure",
    serviceType: "Automatisation de processus et agents IA",
    url: `${BASE_URL}/${locale}/offre`,
    provider: { "@id": `${BASE_URL}/#studio` },
    areaServed: { "@type": "Place", name: "France, Madagascar, remote" },
    availableLanguage: ["fr", "en"],
    offers: [
      { "@type": "Offer", name: "Cartographie", price: CARTOGRAPHY_PRICE, priceCurrency: "EUR" },
      ...BUILD_TIERS.map((tier) => ({
        "@type": "Offer" as const,
        name: tier.nameKey,
        price: tier.price,
        priceCurrency: "EUR",
      })),
      ...RUN_TIERS.map((tier) => ({
        "@type": "Offer" as const,
        name: tier.nameKey,
        price: tier.price,
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: tier.price,
          priceCurrency: "EUR",
          billingIncrement: 1,
          unitCode: "MON",
        },
      })),
    ],
  };

  const refusalItems = t.raw("refusal.items") as { title: string; body: string }[];
  const problemBody = t.raw("problem.body") as string[];
  const proofBody = t.raw("proof.body") as string[];

  return (
    <main id="main-content" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="max-w-2xl mx-auto px-4 pt-24 pb-8 flex flex-col gap-5">
        <h1 className="text-4xl lg:text-5xl font-elegant italic tracking-tight">
          {t("hero.title")}
        </h1>
        <p className="text-muted-foreground leading-relaxed">{t("hero.subtitle")}</p>
        <BookingButton label={t("hero.cta")} className="w-fit" />
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <PilotBanner
          title={t("pilot.title")}
          body={t("pilot.body")}
          counterparts={t.raw("pilot.counterparts") as string[]}
          fallback={t("pilot.fallback")}
          seatsLabel={t("pilot.seatsLabel")}
          deadlineLabel={t("pilot.deadlineLabel")}
          cta={<BookingButton label={t("pilot.cta")} />}
        />
      </div>

      <Section title={t("problem.title")}>
        {problemBody.map((paragraph) => (
          <p key={paragraph} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </Section>

      <Section title={t("steps.title")}>
        <OfferLadder
          diagnostic={{
            title: t("steps.diagnostic.title"),
            body: t("steps.diagnostic.body"),
            cta: (
              <Link
                href="/diagnostic"
                className="h-10 px-5 rounded-md border border-border bg-background/80 text-sm inline-flex items-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {t("steps.diagnostic.cta")}
              </Link>
            ),
          }}
          cartography={{
            title: t("steps.cartography.title"),
            body: t("steps.cartography.body"),
            stop: t("steps.cartography.stop"),
          }}
          build={{
            title: t("steps.build.title"),
            intro: t("steps.build.intro"),
            scopeNote: t("steps.build.scopeNote"),
            tiers: t.raw("steps.build.tiers") as Record<string, { scope: string }>,
          }}
          run={{
            title: t("steps.run.title"),
            intro: t("steps.run.intro"),
            note: t("steps.run.note"),
            tiers: t.raw("steps.run.tiers") as Record<string, { includes: string[] }>,
          }}
        />
      </Section>

      <Section title={t("refusal.title")}>
        <ul className="flex flex-col gap-4">
          {refusalItems.map((item) => (
            <li key={item.title} className="flex flex-col gap-1">
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground italic">{t("refusal.note")}</p>
      </Section>

      <Section title={t("proof.title")}>
        {proofBody.map((paragraph) => (
          <p key={paragraph} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
        <p className="rounded-lg border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          {t("proof.credibility")}
        </p>
      </Section>

      <Section title={t("objections.title")}>
        <ObjectionList
          items={t.raw("objections.items") as { question: string; answer: string }[]}
        />
      </Section>

      <Section title={t("final.title")}>
        <p className="text-muted-foreground leading-relaxed">{t("final.body")}</p>
        <BookingButton label={t("final.cta")} className="w-fit" />
        <p className="text-sm text-muted-foreground">{t("final.note")}</p>
      </Section>
    </main>
  );
}
```

- [ ] **Step 5: Vérifier compilation et build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: succès.

- [ ] **Step 6: Vérifier dans le navigateur**

Ouvrir `/offre` puis `/en/offre` dans la prévisualisation. Contrôler :
- les prix affichés sont bien 890 / 4 500 / 7 000 / 9 500 et 390 / 690 / 1 200
- l'encart Pilote affiche 1 500 €, 4 500 € barré, −67 %, le nombre de places et J-N
- le bouton de réservation ouvre bien Calendly (pas une URL placeholder)
- aucun « nous » / « we » visible
- rendu correct en 375 px de large et en thème clair comme sombre

- [ ] **Step 7: Commit**

```bash
git add app/[locale]/offre components/offre messages/fr.json messages/en.json
git commit -m "feat(offre): page offre et tarifs avec échelle complète et encart Pilote"
```

---

### Task 6: Page `/diagnostic`

**Files:**
- Create: `app/[locale]/diagnostic/page.tsx`
- Create: `components/diagnostic/DiagnosticWizard.tsx`
- Create: `components/diagnostic/DiagnosticResult.tsx`

**Interfaces:**
- Consumes: `QUESTIONS`, `AXES`, `computeDiagnostic`, `type DiagnosticAnswers`, `type AnswerValue`, `type DiagnosticScore` depuis `@/lib/diagnostic` · `POST /api/diagnostic` · namespace `Diagnostic`.
- Produces: la route `/diagnostic` et `/en/diagnostic`.

**Règle produit, non négociable :** le résultat s'affiche **sans** demander d'email. Le copy promet « vous repartez avec le résultat même si on ne se parle jamais ». La capture d'email est une étape optionnelle **après** le résultat.

- [ ] **Step 1: Créer `components/diagnostic/DiagnosticResult.tsx`**

```tsx
"use client";

import type { Axis, DiagnosticScore } from "@/lib/diagnostic";

type Props = {
  score: DiagnosticScore;
  bandLabel: string;
  bandBody: string;
  prioritiesTitle: string;
  noPriorities: string;
  axisCopy: Record<Axis, { label: string; advice: string }>;
};

export function DiagnosticResult({
  score, bandLabel, bandBody, prioritiesTitle, noPriorities, axisCopy,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-5xl font-semibold text-foreground">
          {score.total}
          <span className="text-xl font-normal text-muted-foreground"> / 24</span>
        </p>
        <p className="text-lg font-medium text-primary">{bandLabel}</p>
        <p className="text-muted-foreground leading-relaxed">{bandBody}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {score.axes.map((axis) => (
          <li key={axis.axis} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-foreground">{axisCopy[axis.axis].label}</span>
              <span className="text-muted-foreground">
                {axis.score} / {axis.max}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(axis.score / axis.max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-foreground">{prioritiesTitle}</h3>
        {score.priorities.length === 0 ? (
          <p className="text-muted-foreground leading-relaxed">{noPriorities}</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {score.priorities.map((axis, index) => (
              <li key={axis} className="flex gap-3">
                <span className="font-mono text-xs text-primary shrink-0 mt-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{axisCopy[axis].label}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {axisCopy[axis].advice}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Créer `components/diagnostic/DiagnosticWizard.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AXES,
  QUESTIONS,
  computeDiagnostic,
  type Axis,
  type AnswerValue,
  type DiagnosticAnswers,
} from "@/lib/diagnostic";
import { DiagnosticResult } from "./DiagnosticResult";

type Status = "idle" | "sending" | "sent" | "invalid" | "failed";

export function DiagnosticWizard({ mailto }: { mailto: string }) {
  const t = useTranslations("Diagnostic");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({});
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const current = answers[question.id];

  const axisCopy = Object.fromEntries(
    AXES.map((axis) => [
      axis,
      { label: t(`result.axes.${axis}.label`), advice: t(`result.axes.${axis}.advice`) },
    ])
  ) as Record<Axis, { label: string; advice: string }>;

  function choose(value: AnswerValue) {
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  }

  function next() {
    if (current === undefined) return;
    if (isLast) setDone(true);
    else setStep((s) => s + 1);
  }

  async function submitLead(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, email, company }),
      });

      if (response.status === 400) return setStatus("invalid");
      if (!response.ok) return setStatus("failed");
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  // ── Résultat ──────────────────────────────────────────────────────────
  if (done) {
    const score = computeDiagnostic(answers as DiagnosticAnswers);

    return (
      <div className="flex flex-col gap-10">
        <DiagnosticResult
          score={score}
          bandLabel={t(`result.bands.${score.band}.label`)}
          bandBody={t(`result.bands.${score.band}.body`)}
          prioritiesTitle={t("result.prioritiesTitle")}
          noPriorities={t("result.noPriorities")}
          axisCopy={axisCopy}
        />

        {status === "sent" ? (
          <p className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm text-foreground">
            {t("capture.success")}
          </p>
        ) : (
          <form onSubmit={submitLead} className="flex flex-col gap-4 rounded-lg border border-border bg-card/40 p-5">
            <h3 className="font-medium text-foreground">{t("capture.title")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("capture.body")}</p>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted-foreground">{t("capture.emailLabel")}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-background text-foreground"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted-foreground">{t("capture.companyLabel")}</span>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-background text-foreground"
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
            >
              {t("capture.submit")}
            </button>

            {status === "invalid" && (
              <p className="text-sm text-red-500">{t("capture.errorInvalid")}</p>
            )}
            {status === "failed" && (
              <p className="text-sm text-red-500">
                {t("capture.errorDelivery")}{" "}
                <a href={mailto} className="underline underline-offset-2">
                  {t("capture.errorFallback")}
                </a>
              </p>
            )}
          </form>
        )}
      </div>
    );
  }

  // ── Questions ─────────────────────────────────────────────────────────
  const options = t.raw(`questions.${question.id}.options`) as string[];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-mono text-muted-foreground">
        {t("nav.progress")
          .replace("{current}", String(step + 1))
          .replace("{total}", String(QUESTIONS.length))}
      </p>

      <h2 className="text-xl font-medium text-foreground leading-snug">
        {t(`questions.${question.id}.label`)}
      </h2>

      <ul className="flex flex-col gap-2">
        {options.map((option, value) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => choose(value as AnswerValue)}
              aria-pressed={current === value}
              className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                current === value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="h-10 px-4 rounded-md border border-border bg-background/80 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {t("nav.previous")}
          </button>
        )}
        <button
          type="button"
          onClick={next}
          disabled={current === undefined}
          className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40"
        >
          {isLast ? t("nav.submit") : t("nav.next")}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Créer `app/[locale]/diagnostic/page.tsx`**

```tsx
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { BookingButton } from "@/components/BookingButton";
import { DiagnosticWizard } from "@/components/diagnostic/DiagnosticWizard";
import { EMAIL } from "@/lib/cv-contact";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalason.pro";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Diagnostic.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/diagnostic`,
      languages: {
        fr: `${BASE_URL}/fr/diagnostic`,
        en: `${BASE_URL}/en/diagnostic`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${BASE_URL}/${locale}/diagnostic`,
      siteName: "LALASON Annaël",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function DiagnosticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Diagnostic" });

  return (
    <main id="main-content" className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-20 flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl lg:text-5xl font-elegant italic tracking-tight">
            {t("intro.title")}
          </h1>
          <p className="text-muted-foreground leading-relaxed">{t("intro.body")}</p>
          <p className="text-sm text-muted-foreground">{t("intro.duration")}</p>
        </header>

        <DiagnosticWizard mailto={`mailto:${EMAIL}`} />

        <footer className="flex flex-col gap-3 border-t border-border pt-8">
          <h2 className="text-xl font-medium text-foreground">{t("cta.title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("cta.body")}</p>
          <BookingButton label={t("cta.button")} className="w-fit" />
        </footer>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Vérifier compilation et build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: succès. Si `EMAIL` n'est pas exporté par `lib/cv-contact.ts`, vérifier son nom réel d'export et l'ajuster — il est bien importé sous ce nom dans `app/[locale]/cv/page.tsx`.

- [ ] **Step 5: Vérifier le parcours complet dans le navigateur**

Sur `/diagnostic` :
- répondre aux 8 questions, vérifier que « Suivant » reste désactivé sans réponse sélectionnée
- vérifier que « Précédent » conserve la réponse déjà donnée
- au bout des 8, le résultat s'affiche **sans avoir saisi d'email**
- soumettre un email professionnel : message de succès
- vérifier dans les logs du serveur que le lead est bien reçu
- vérifier le rendu à 375 px et dans les deux thèmes

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/diagnostic components/diagnostic
git commit -m "feat(diagnostic): funnel 8 questions avec résultat immédiat et capture optionnelle"
```

---

### Task 7: Entité SEO, sitemap et suppression des liens sortants

**Files:**
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/sitemap.ts`
- Modify: `components/Projects.tsx`
- Modify: `messages/fr.json`, `messages/en.json`
- Modify: `docs/marketing/offre-copy.md`

**Interfaces:**
- Consumes: rien de neuf.
- Produces: un graphe d'entité où `Organization` « Flow AI Studio » (`@id: {baseUrl}/#studio`) a pour `founder` le `Person` (`@id: {baseUrl}/#person`), référencé par le `Service` de la tâche 5.

- [ ] **Step 1: Ajouter l'`Organization` et enrichir le `Person` dans `app/[locale]/layout.tsx`**

Remplacer l'objet `jsonLd` existant par un graphe à deux nœuds. Le `@id` du `Person` reste inchangé — c'est un identifiant stable, le casser réinitialiserait le travail d'entité déjà fait.

Ajouter l'import en tête de fichier : `import { EMAIL } from "@/lib/cv-contact";`

Ce bloc couvre la spec §6.5. Il ajoute `worksFor`, `email` et `knowsLanguage` au `Person` de la page d'accueil — le signal d'entité le plus fort du site. `alumniOf` et `hasCredential` ne sont **pas** dupliqués ici : ils sont déjà émis par `app/[locale]/cv/page.tsx` sous le même `@id`, donc Google les rattache à la même entité. Les recopier dans le layout ajouterait une source de divergence sans gain.

```tsx
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
        knowsAbout: [
          "Intelligence Artificielle",
          "Automatisation",
          "Next.js",
          "Architecture Systèmes",
        ],
        email: `mailto:${EMAIL}`,
        knowsLanguage: [
          { "@type": "Language", name: "Français" },
          { "@type": "Language", name: "Anglais" },
          { "@type": "Language", name: "Malagasy" },
        ],
        nationality: "MG",
        worksFor: [
          {
            "@type": "Organization",
            name: "Mon Ambassadeur",
            url: "https://www.monambassadeur.com",
          },
          { "@id": `${baseUrl}/#studio` },
        ],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/${locale}`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#studio`,
        name: "Flow AI Studio",
        alternateName: "flow-ai.studio",
        url: baseUrl,
        description:
          "Flow AI Studio — le studio d'automatisation IA d'Annaël Lalason.",
        founder: { "@id": `${baseUrl}/#person` },
        // Revendication de l'autre présence web du studio. Le lien est
        // unidirectionnel : flow-ai.studio est en lecture seule et ne peut pas
        // déclarer son founder en retour (voir spec §5).
        sameAs: ["https://flow-ai.studio"],
      },
    ],
  };
```

- [ ] **Step 2: Ajouter les 4 nouvelles URLs à `app/sitemap.ts`**

Ajouter ces entrées au tableau retourné, après celles du CV :

```ts
    {
      url: `${BASE_URL}/fr/offre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: { fr: `${BASE_URL}/fr/offre`, en: `${BASE_URL}/en/offre` },
      },
    },
    {
      url: `${BASE_URL}/en/offre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: { fr: `${BASE_URL}/fr/offre`, en: `${BASE_URL}/en/offre` },
      },
    },
    {
      url: `${BASE_URL}/fr/diagnostic`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/diagnostic`,
          en: `${BASE_URL}/en/diagnostic`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/diagnostic`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/diagnostic`,
          en: `${BASE_URL}/en/diagnostic`,
        },
      },
    },
```

- [ ] **Step 3: Rediriger le lien sortant de `components/Projects.tsx`**

Localiser l'usage de la clé `Projects.more` et remplacer le lien externe vers `flow-ai.studio/cas-clients` par un `Link` interne next-intl vers `/offre`.

```tsx
import { Link } from "@/i18n/navigation";

// … remplacer le <a href="https://flow-ai.studio/cas-clients"> par :
<Link
  href="/offre"
  className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
>
  {t("more")}
</Link>
```

Puis changer la valeur de la clé dans les deux fichiers de messages :

- `messages/fr.json` → `Projects.more` : `"Voir l'offre et les tarifs"`
- `messages/en.json` → `Projects.more` : `"See the offer and pricing"`

- [ ] **Step 4: Vérifier qu'il ne reste aucun lien sortant vers flow-ai.studio**

```bash
grep -rniE 'flow-ai\.studio' app components messages lib | grep -v '"sameAs"' || echo "Aucun lien sortant restant."
```

Expected: seule l'occurrence `sameAs` du layout subsiste. Toute autre occurrence dans `messages/` ou `components/` doit être traitée. La mention textuelle « Flow AI Studio » (nom de marque, sans URL) est légitime et reste.

- [ ] **Step 5: Corriger l'incohérence du nombre de questions dans le copy**

`docs/marketing/offre-copy.md` annonce « Vingt questions sur votre organisation » alors que l'implémentation en compte 8. Remplacer par « Huit questions sur votre organisation » et ajuster la durée annoncée de « 10 minutes » à « 4 minutes ». Vérifier que `Offre.steps.diagnostic.body` et `Diagnostic.intro.duration` disent la même chose dans les deux locales.

- [ ] **Step 6: Vérifier le graphe d'entité**

Run: `npx tsc --noEmit && npm run build`

Puis, sur la page d'accueil servie en local :

```bash
curl -s http://localhost:3000/fr | python3 -c "
import sys,re,json
html=sys.stdin.read()
for block in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',html,re.S):
    data=json.loads(block)
    print(json.dumps(data,ensure_ascii=False,indent=1)[:900])
"
```

Expected: un `@graph` contenant `Person` avec `@id` terminant par `/#person` et `Organization` avec `@id` terminant par `/#studio`, `founder` pointant vers le `Person`, et `sameAs` contenant `https://flow-ai.studio`.

Valider ensuite l'URL de production dans le test de résultats enrichis de Google après déploiement.

- [ ] **Step 7: Commit**

```bash
git add app/[locale]/layout.tsx app/sitemap.ts components/Projects.tsx messages/fr.json messages/en.json docs/marketing/offre-copy.md
git commit -m "feat(seo): graphe d'entité Person/Organization, sitemap étendu, liens sortants supprimés"
```

---

## Après le plan — ce qui n'est pas couvert et pourquoi

Explicitement hors périmètre de ce plan, par décision de la spec :

- **`/studio`, `/a-propos`, `/projets` enrichi, `/blog`** — la spec §9 les place après trois références livrées. Les construire maintenant retarderait l'échéance du 30 septembre.
- **Le témoignage audio de Julien M.** — l'asset vit dans le repo flow-ai.studio, en lecture seule. Le copier suppose une décision sur les droits de réutilisation et un accord du client sur un second domaine : à traiter séparément.
- **Chemins localisés** (`/offer` en anglais plutôt que `/en/offre`) — configuration next-intl supplémentaire, gain SEO marginal, reporté.
- **Les correctifs de flow-ai.studio** (endpoint cassé, canonical apex/www) — interdits par la contrainte de lecture seule (spec §5).

## Vérification avant de lancer la prospection

La séquence sortante ne doit pas démarrer avant que ces cinq points soient vrais **en production** :

- [ ] `https://www.lalason.pro/offre` répond 200 et affiche les bons prix
- [ ] `https://www.lalason.pro/diagnostic` répond 200 et le parcours complet aboutit
- [ ] `POST https://www.lalason.pro/api/diagnostic` avec un payload valide renvoie `{"ok":true}` **et** le lead arrive effectivement à destination — c'est le test qui a manqué sur flow-ai.studio
- [ ] `NEXT_PUBLIC_BOOKING_URL` et `DIAGNOSTIC_WEBHOOK_URL` sont renseignées dans les variables d'environnement Vercel, pas seulement en local
- [ ] Aucun lien sortant vers flow-ai.studio ne subsiste sur lalason.pro
