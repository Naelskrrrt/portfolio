# Stratégie SEO — Portfolio LALASON Annaël (www.lalason.pro)

> Architecte Systèmes & IA — Tech Lead & Architecte Automatisation @ Mon Ambassadeur
> Plan établi le 2026-07-02. Template : Agency/Consultancy (adapté solo consultant).

## 1. Découverte

| Axe | État |
|---|---|
| Type | Portfolio personnel / consultant indépendant (one-page, fr/en) |
| Stack | Next.js 16, next-intl, Vercel — Lighthouse 100/100 |
| Objectif #1 | **Ranker #1 sur le nom** ("LALASON Annaël") avec photo/knowledge panel |
| Objectif #2 | Capter des requêtes commerciales (automatisation IA, n8n, architecte systèmes) |
| Audience | Entrepreneurs & PME francophones + international EN ; collaborations stratégiques |
| Signaux d'impact | +15 clients, +25 projets, +2 000 templates, ROI +3 000 $ < 2 mois, 40 h/mois restituées |
| Hypothèses | Solo, ~2-4 h/semaine dédiées au SEO/contenu. Budget outillage ≈ 0 (GSC/GA4 gratuits). |

## 2. Analyse concurrentielle (synthèse)

SERP FR « consultant automatisation IA / n8n » : dominé par des **sites de services multi-pages**
(consultantautomatisation.fr, devflows.eu, ze-kairos.com, afconsulting.site, webanalyste.com).
Tous ont : pages services dédiées, blog actif, études de cas, schema ProfessionalService.

**Conséquences stratégiques :**
1. La one-page actuelle ne peut PAS ranker sur les requêtes commerciales — il faut des pages dédiées.
2. Le nom propre est un espace sans concurrence : verrouillable en semaines (entité + off-page).
3. Différenciateurs exploitables : positionnement "architecte" (vs "prestataire"), bilinguisme fr/en,
   métriques d'impact chiffrées, ancrage Madagascar/Océan Indien (longue traîne géo sans concurrence).

## 3. Positionnement entité (le cœur du plan)

Google doit comprendre : **LALASON Annaël = entité Person unique** = Architecte Systèmes & IA.

- Person schema `@id` stable (`/#person`) + `image` + `sameAs` canoniques → ✅ fait (2026-07)
- Cohérence stricte du nom sur LinkedIn / GitHub / X (même orthographe, même accent)
- Liens retour des 3 profils vers www.lalason.pro (bio + champ site web)
- À ajouter au schema : `worksFor` (Mon Ambassadeur), `alumniOf`, `knowsLanguage`, `email`
- GEO : llms.txt, contenu citable (voir §5)

## 4. Architecture cible (évolution one-page → hub)

Voir SITE-STRUCTURE.md. Résumé : conserver la one-page comme hub de marque,
ajouter `/services/*` (3 pages), `/projets/*` (3-5 études de cas), `/blog` (cadence 2/mois).

## 5. GEO / AI Search (ChatGPT, Perplexity, AI Overviews)

- [ ] `llms.txt` à la racine décrivant qui tu es + liens clés
- [ ] Études de cas avec métriques précises et citables (« +3 000 $ de ROI en 2 mois »)
- [ ] Phrases d'expertise quotables dans les pages services (une définition nette par page)
- [ ] Autoriser GPTBot/PerplexityBot/ClaudeBot dans robots (par défaut ouvert actuellement)
- [ ] Surveiller les mentions dans les réponses IA sur « consultant automatisation Madagascar »

## 6. E-E-A-T

- Photo pro ✅ (2026-07, détourée, cohérente avec le branding)
- Bio détaillée avec parcours daté ✅ (section Parcours)
- Certifications affichées ✅ — à baliser en schema `hasCredential`
- Manquant : témoignages clients nominatifs, page « à propos » indexable dédiée,
  publications externes (guest posts, interviews)

## 7. KPI

| Métrique | Baseline (07/2026) | 3 mois | 6 mois | 12 mois |
|---|---|---|---|---|
| Position sur "LALASON Annaël" | à mesurer (GSC absent) | #1 + photo | #1 + 3 profils top 5 | Knowledge panel |
| Trafic organique /mois | ~0 (inconnu) | 100 | 400 | 1 200 |
| Pages indexées | 2 (/fr, /en) | 8 | 15 | 25+ |
| Mots-clés top 10 | 0 | 3 (nom + géo) | 8 | 20 |
| Leads organiques /mois | 0 | 1 | 3 | 8 |
| CWV (mobile) | 100/100 ✅ | maintenir | maintenir | maintenir |

Baseline exacte à capturer en Phase 1 via Google Search Console (action #1 du roadmap).

## 8. Risques & garde-fous

| Risque | Mitigation |
|---|---|
| Pas de temps pour le contenu | Cadence minimale 1 article/mois ; prioriser les 3 pages services d'abord |
| Contenu dupliqué fr/en | hreflang déjà en place ; traduire (pas dupliquer), adapter les exemples |
| Requêtes commerciales trop compétitives (FR France) | Attaquer par la longue traîne géo (Madagascar, Océan Indien, "remote") et n8n spécifique |
| Homonymie / entité diluée | `@id` stable + sameAs + cohérence de nom stricte |
