# Roadmap SEO — www.lalason.pro

> Effort estimé : 2-4 h/semaine. Chaque phase a un critère de sortie mesurable.

## Phase 1 — Fondation entité (semaines 1-4) 🎯 « qu'on trouve ma tête »

- [x] Person schema : `image`, `@id`, sameAs canoniques *(fait 2026-07)*
- [x] `twitter:card` → summary_large_image *(fait 2026-07)*
- [x] Photo pro détourée cohérente avec le branding *(fait 2026-07)*
- [x] **Google Search Console** : propriété vérifiée, sitemap soumis et premières URL demandées à l’indexation *(fait 2026-08)*
- [ ] Compléter le schema : `worksFor` (Mon Ambassadeur), `alumniOf`, `knowsLanguage: ["fr","en"]`
- [ ] Cohérence du nom exact « LALASON Annaël » sur LinkedIn, GitHub, X
- [ ] Lien vers www.lalason.pro depuis : bio LinkedIn (champ site), README profil GitHub, bio X
- [ ] `llms.txt` à la racine (GEO)
- [ ] GA4 ou Vercel Analytics events sur le CTA contact (mesure des leads)

**Sortie :** site indexé, top 3 sur « LALASON Annaël », baseline GSC capturée.

## Phase 2 — Pages commerciales (semaines 5-12)

- [x] Créer le hub `/services` en français et en anglais *(fait 2026-08)*
- [ ] Créer 3 pages services dédiées (contenu utile et spécifique, fr puis en)
- [x] Schema `Service` sur le hub services *(fait 2026-08)*
- [ ] Schema `Service` sur chaque future page service
- [x] 4 premières études de cas dans `/projets` avec contexte des métriques *(fait 2026-08)*
- [ ] /a-propos (bio longue, ProfilePage)
- [x] Mettre à jour `sitemap.ts` + maillage interne depuis la one-page et `/offre` *(fait 2026-08)*
- [ ] Demander 2-3 témoignages clients nominatifs

**Sortie :** 8+ pages indexées, premières impressions GSC sur requêtes commerciales.

## Phase 3 — Contenu & longue traîne (semaines 13-24)

- [ ] Lancer /blog — cadence 2 articles/mois (voir CONTENT-CALENDAR.md)
- [ ] 3e-5e études de cas
- [ ] 1 guest post ou interview sur un site du secteur (backlink d'autorité)
- [ ] Optimiser les pages selon les données GSC réelles (requêtes → contenus)
- [x] Version EN du hub services et des 4 études de cas *(fait 2026-08)*
- [ ] Version EN des futures pages services dédiées

**Sortie :** 15+ pages indexées, 8 mots-clés top 10, 3 leads organiques/mois.

## Phase 4 — Autorité (mois 7-12)

- [ ] Contenu signature : 1 ressource originale citable (benchmark n8n/Make, template library)
- [ ] Présence externe : 2-3 publications invitées, 1 podcast/interview
- [ ] Surveiller citations IA (ChatGPT/Perplexity) sur les requêtes cibles
- [ ] Viser le knowledge panel (entité consolidée + mentions externes)
- [ ] Revue trimestrielle des KPI, itération

**Sortie :** knowledge panel ou photo systématique sur le nom, 20 mots-clés top 10, 8 leads/mois.

## Dépendances & points de vigilance

- GSC (Phase 1) conditionne toute mesure — À FAIRE EN PREMIER
- Les pages services (Phase 2) conditionnent la conversion du trafic blog (Phase 3)
- Ne jamais publier de page < 800 mots utiles (quality gate anti thin-content)
- CWV 100/100 : re-tester après chaque ajout de section (le WebGL side-rays est à surveiller sur mobile)
