# LALASON Annaël — Portfolio

Portfolio personnel de **LALASON Annaël**, Architecte Systèmes & IA.

> "L'architecte des systèmes intelligents"

## Stack

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Langage | TypeScript |
| Style | Tailwind CSS v4 |
| i18n | next-intl (fr / en) |
| Thème | next-themes (dark / light) |
| Analytics | Vercel Analytics |
| Fonts | Geist Sans, Geist Mono, Instrument Serif |

## Structure

```
app/
  [locale]/
    layout.tsx       # Layout principal, metadata, JSON-LD, i18n
    page.tsx         # Page d'accueil
    opengraph-image  # OG image dynamique
    twitter-image    # Twitter card image
  globals.css        # Variables CSS, thème, animations
  robots.ts          # robots.txt
  sitemap.ts         # sitemap.xml

components/
  Header.tsx              # Navigation + bouton WhatsApp + langue + thème
  Hero.tsx                # Présentation, photo, punchlines aléatoires
  ThingsIveDone.tsx       # Expériences professionnelles
  ThingsIveBuild.tsx      # Projets construits
  Projects.tsx            # Projets sélectionnés
  TechILove.tsx           # Stack technique
  Certifications.tsx      # Certifications
  FavPosts.tsx            # Articles favoris
  Activities.tsx          # Activités
  Contact.tsx             # Section contact
  Footer.tsx              # Footer avec réseaux sociaux
  GalaxyJourney.tsx       # Animation fond (soleil/lune + satellite au scroll)
  ConstellationBackground # Canvas constellation animé (Hero)
  PixelScene.tsx          # Scène pixel art 8-bit (Contact + Footer)
  Rocket.tsx              # Easter egg fusée
  ThemeProvider.tsx       # Wrapper next-themes
  ThemeToggle.tsx         # Bouton toggle thème
  LanguageSwitcher.tsx    # Sélecteur langue fr/en
  Section.tsx             # Composant section réutilisable

i18n/
  routing.ts             # Configuration des locales (fr, en)
  navigation.ts          # Link/redirect i18n

messages/
  fr.json               # Traductions françaises
  en.json               # Traductions anglaises

public/
  photo-profile.png     # Photo de profil
  noise.gif             # Texture grain (hébergé localement)
  favicon/              # Favicons toutes tailles + manifest
  logos/                # Logos certifications
  CV Lalason Annael.pdf # CV téléchargeable
```

## Lancer en local

```bash
npm install
npm run dev       # http://localhost:3000
```

## Build & production

```bash
npm run build
npm run start     # http://localhost:3000
```

## Lighthouse scores (production)

| Métrique | Score |
|---|---|
| Performance | mesuré au déploiement |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | ~200 ms |
| CLS | 0.00 |

## Déploiement

Hébergé sur [Vercel](https://vercel.com). Chaque push sur `main` déclenche un déploiement de production automatique.

```bash
vercel --prod
```

## Fonctionnalités notables

- **i18n** — Français et anglais, routing basé sur les locales (`/fr`, `/en`)
- **Thème** — Dark/light avec transition fluide, persisté en cookie
- **Galaxy Journey** — Soleil/Lune + satellite qui bougent au scroll
- **Constellation** — Canvas animé en arrière-plan du Hero (30 FPS cappé)
- **Pixel Scene** — Scène 8-bit animée sous le footer (jour/nuit selon thème)
- **Easter egg** — Fusée à lancer en cliquant sur le soleil/lune
- **JSON-LD** — Schema.org `Person` pour Google Rich Results
- **Grain** — Texture noise hébergée localement pour l'ambiance visuelle
- **CV** — Téléchargeable directement depuis le Hero
