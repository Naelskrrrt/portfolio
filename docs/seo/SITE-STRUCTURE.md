# Architecture cible — www.lalason.pro

> Évolution : one-page (hub de marque) → hub + rayons (services, projets, blog).
> Toutes les URLs existent en /fr et /en (next-intl, hreflang déjà configuré).

## Arborescence

```
/{locale}                          ← one-page actuelle (hub entité) — INCHANGÉE
├── /services                      ← index des offres (ProfessionalService schema)
│   ├── /automatisation-ia         ← n8n, Make, agents IA (mot-clé principal FR)
│   ├── /architecture-systemes     ← conception, gouvernance technique
│   └── /applications-web          ← Next.js/React de bout en bout
├── /projets                       ← index études de cas (3-5 au lancement)
│   └── /{slug}                    ← 1 000+ mots : contexte → approche → résultats chiffrés
├── /blog                          ← thought leadership, 2 posts/mois
│   └── /{slug}                    ← Article schema + author → Person @id
└── /a-propos                      ← bio longue indexable (ProfilePage schema)
```

## Mapping mots-clés → pages

| Page | Requête cible primaire | Secondaires |
|---|---|---|
| / (one-page) | LALASON Annaël | architecte systèmes IA Madagascar |
| /services/automatisation-ia | consultant automatisation IA | expert n8n freelance, agent IA sur mesure |
| /services/architecture-systemes | architecte logiciel freelance | gouvernance technique startup |
| /services/applications-web | développeur Next.js freelance | application web sur mesure |
| /projets/* | études de cas automatisation | ROI automatisation PME |
| /blog/* | longue traîne (how-to, comparatifs) | n8n vs Make, coût automatisation… |
| /a-propos | qui est LALASON Annaël | parcours architecte IA |

## Maillage interne

- One-page : chaque section pointe vers sa page profonde (Impact → /projets, Parcours → /a-propos, CTA → /services)
- Chaque page service ↔ 1-2 études de cas liées ↔ articles de blog pertinents
- Blog : chaque article lie 1 page service (CTA) + 1 étude de cas
- Footer global : services + derniers projets + à-propos

## Schema par type de page

| Page | Schema |
|---|---|
| One-page | Person (@id /#person) ✅ + ProfilePage |
| /services/* | Service + ProfessionalService (provider → Person @id) |
| /projets/* | Article + about → Service |
| /blog/* | BlogPosting (author → Person @id) |
| /a-propos | ProfilePage + Person (référence @id, pas de duplication) |

## Sitemap & indexation

- `app/sitemap.ts` : ajouter les nouvelles routes avec priorités (1.0 home, 0.8 services, 0.7 projets, 0.6 blog)
- Soumettre à GSC après chaque ajout de section
- Quality gate : ne publier une page que si ≥ 800 mots utiles (éviter le thin content)
