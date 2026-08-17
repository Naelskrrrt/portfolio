# Architecture de marque — LALASON Annaël × Flow AI Studio

> Décision arrêtée le 17 août 2026.
> Portée : positionnement, structure de marque, funnel, séquencement commercial.
> Ne couvre pas : l'implémentation technique (voir le plan d'implémentation associé).

---

## 1. La question posée

Deux actifs existaient en parallèle :

| Actif | Nature | État au 17/08/2026 |
|---|---|---|
| `www.lalason.pro` | Portfolio personnel, one-page bilingue fr/en | Live. `Person` + `WebPage` schema. 2 pages indexées. Plan SEO écrit, non exécuté. |
| `www.flow-ai.studio` | Marque commerciale / studio | Live. 4 URLs. Échelle d'offres complète, funnel de diagnostic, témoignage nommé. |

L'hésitation initiale était formulée comme un choix binaire : vendre en freelance via lalason.pro, ou développer Flow AI Studio comme agence.

**Ce n'était pas le bon arbitrage.** La vraie question est la dissociation de deux rôles : *qui crée la confiance* et *qui signe la facture*. Ces deux rôles peuvent être portés par la même entité ou séparés — c'est ça qui devait être tranché.

## 2. Le brief

Réponses collectées le 17/08/2026 :

| Axe | Réponse | Conséquence sur la décision |
|---|---|---|
| Canaux d'acquisition à 90 jours | LinkedIn perso + réseau, prospection sortante, inbound SEO | Deux canaux sur trois convertissent vers **une personne** |
| Capacité | Temps plein à court terme | La structure doit tenir la charge d'un revenu principal |
| Modèles de revenus visés | Les quatre : régie, forfait, récurrent, produit | **Signal de dispersion** — à séquencer, pas à empiler |
| Vision 24 mois | Indéterminée | **Critère décisif : l'architecture doit être réversible à coût faible** |

Le critère de réversibilité domine tous les autres. On ne choisit pas la structure finale, on choisit celle qui coûte le moins cher à changer une fois la vision connue.

## 3. Les trois architectures évaluées

### Option A — Personne-first, studio endossé ✅ **retenue**

Un seul site (`lalason.pro`). Flow AI Studio devient le nom de la structure et du système de delivery : devis, factures, livrables, méthode. La personne est la raison de faire confiance, le studio est la raison d'acheter.

### Option B — Studio-first, fondateur visible ❌ écartée

`flow-ai.studio` devient le site commercial, `lalason.pro` se replie sur le personal branding.

Écartée parce qu'elle **conserve la friction** qu'on cherchait à supprimer (LinkedIn perso → site inconnu), impose deux sites à nourrir pour une personne seule, et engage le coût le plus élevé pour une option qui pourrait ne jamais être exercée.

### Option C — Deux sites, deux fonctions strictes ❌ écartée

lalason.pro pour la crédibilité, flow-ai.studio pour la conversion.

C'est l'architecture instinctive, et c'est le piège. Défendable avec du trafic sur les deux domaines et une équipe pour les alimenter. Avec une personne seule et zéro autorité établie, elle double le travail pour un bénéfice qui n'existe qu'à un volume non atteint.

### Ce qui porte réellement A

1. **Le canal le plus rapide est personnel.** LinkedIn et réseau produiront les premiers euros bien avant le SEO. Un saut vers une marque inconnue casse la chaîne de confiance au moment où elle est la plus forte.
2. **L'objection « la prospection à froid exige une structure » ne tient pas.** Les agences IA sont la catégorie la plus spammée du marché ; un message d'agence inconnue est mort à l'ouverture. Un expert nommé, avec un poste vérifiable et des chiffres, passe. Signer en son nom avec Flow AI Studio en signature donne les deux.
3. **Réversibilité asymétrique.** A → B coûte quelques semaines, plus tard, avec des preuves. B → A coûte une crédibilité brûlée.

### Argument explicitement écarté

L'antériorité SEO de lalason.pro **n'est pas** un argument valable : 2 pages indexées d'un côté, un domaine de mars 2026 et 4 URLs de l'autre. **Aucun des deux domaines n'a d'autorité mesurable.**

C'est une bonne nouvelle stratégique : la réorganisation est quasi gratuite aujourd'hui. Avec du trafic et des backlinks dans 12 mois, elle coûterait cher. La fenêtre est ouverte maintenant.

## 4. Audit flow-ai.studio — constats

Audit conduit le 17/08/2026 sur le repo `Naelskrrrt/flow-ai-studio` (privé) et sur la production.

### 4.1 Capture de leads cassée en production 🔴

Le site est servi par **Vercel** (en-tête `server: Vercel`), mais toute la couche serveur est configurée pour **Netlify**.

- `diagnostic-wizard.tsx:27` : `const SUBMIT_ENDPOINT = "/api/diagnostic"`
- `POST` et `GET` sur `https://www.flow-ai.studio/api/diagnostic` → **404**
- Seule implémentation serveur du repo : `netlify/functions/diagnostic.mts`, exposée via `netlify.toml`. Vercel ne déploie pas les fonctions Netlify.
- Pas de `vercel.json`, aucun rewrite dans `next.config.ts` (`output: "export"` seul)

**Chaque visiteur qui termine le funnel Score Flow voit son lead partir dans le vide.** Le scoring serveur (`src/lib/diagnostic.ts`) et la livraison (`src/lib/leads.ts`) ne s'exécutent jamais en production.

Vérifié fonctionnel en revanche : le proxy PostHog `/flux/*` (200) et `/opengraph-image` (servi en `image/png`).

### 4.2 Deux entités déconnectées pour Google

| Site | Schema en production |
|---|---|
| lalason.pro | `Person` + `WebPage` |
| flow-ai.studio | `Organization` + `Service` + `FAQPage` + `ContactPoint` |

Aucun `founder`, aucun `sameAs` entre les deux. Google n'a aucun moyen d'établir qu'il s'agit de la même personne — ce qui contredit directement le §3 de `docs/seo/SEO-STRATEGY.md`, qui fait de la cohérence d'entité le cœur de la stratégie.

**Cause identifiée :** `src/lib/founder.ts` existe et est délibérément vide (`name`, `role`, `bio`, `photo` à `""`). Son commentaire indique que tant que ces champs sont vides, le schema n'émet aucun `founder`. **La passerelle entre les deux marques a été conçue et jamais activée.**

### 4.3 Trois identités nominales en circulation

`LALASON Annaël` (lalason.pro) · `Naël` (footer flow-ai.studio) · `Naelskrrrt` (GitHub).

Contradiction avec la règle écrite : « cohérence stricte du nom, même orthographe, même accent ».

### 4.4 Voix incohérente — cause racine de la confusion freelance/agence

Sur une seule et même page :

- Hero : « **Je** conçois des agents IA… »
- H2 : « **Nos** services », « **Notre** processus de livraison »
- Page offre : « ce que **nous** refusons d'automatiser »
- Footer : « © 2026 Naël »

La question « est-ce un freelance ou une agence ? » n'est pas provoquée par l'existence de deux sites. **Elle est provoquée par une seule page.** Le copy pose la question tout seul.

### 4.5 Collision de roadmaps SEO

| lalason.pro prévoyait | flow-ai.studio a déjà / recommandait |
|---|---|
| `/services/automatisation-ia` | `/offre` + `/automatisation-workflows` |
| `/projets/*` | `/cas-clients` |
| `/a-propos` | `/a-propos` |
| `/blog` | `/blog` |

Mêmes mots-clés français, deux domaines, une seule personne pour écrire. Le dispositif était à quelques semaines de se cannibaliser. C'est le constat qui valide le plus l'option A.

### 4.6 Incohérence host / canonical

`canonical`, `og:url` et les 4 URLs du sitemap pointent vers l'apex `flow-ai.studio`. La production sert `www`, et l'apex renvoie un 308 vers `www`. **100 % des URLs du sitemap sont des redirections.** Non corrigé (voir §5).

### 4.7 Actifs présents sur flow-ai.studio, absents de lalason.pro

À ne pas perdre :

- Échelle d'offres à 4 barreaux, prix affichés, périmètre de refus explicite
- Funnel de diagnostic avec scoring serveur et qualification par domaine email
- **Témoignage audio nominatif** (`temoignage-julien-m.mp3`) — or `SEO-STRATEGY.md` §6 liste « témoignages clients nominatifs » comme manquant
- Page cas clients filtrable + `FAQPage` à 6 Q/R éligible aux rich snippets
- PostHog cookieless instrumenté

## 5. Contrainte : flow-ai.studio en lecture seule

**Décision du 17/08/2026 : aucune modification de flow-ai.studio, y compris les correctifs techniques.**

Conséquences actées :

1. **Pas de redirection 301.** flow-ai.studio reste live et gelé. Statut : vitrine secondaire non maintenue.
2. **Pas de migration — une reproduction.** Les actifs sont réécrits sur lalason.pro, pas copiés. Bénéfice collatéral : pas de duplicate content, et le bilingue fr/en que flow-ai.studio n'a pas.
3. **Le lien d'entité reste unidirectionnel.** Déclaré depuis lalason.pro seulement : `Organization` « Flow AI Studio » avec `founder` → `/#person` et `sameAs: https://flow-ai.studio`. C'est la manière standard de revendiquer une autre présence web ; plus faible qu'un lien croisé, mais fonctionnel sans toucher à l'autre site.
4. **Le correctif de `/api/diagnostic` est abandonné.** Le funnel de flow-ai.studio continuera de perdre ses leads tant que le site est live. Seule parade compatible avec la contrainte : **ne plus y envoyer de trafic.**
5. **`docs/seo-audit.md` et le §4.6 restent non corrigés** sur flow-ai.studio. Documenté, non traité.

### Gain décliné volontairement

Remplir les quatre champs de `src/lib/founder.ts` (`name`, `role`, `bio`, `photo`) rendrait le lien d'entité **bidirectionnel** — un fichier, quatre chaînes, aucune refonte. Ce gain a été proposé et **décliné au profit d'une lecture seule stricte**.

C'est un choix documenté, pas un oubli. Il est réversible à tout moment et reste le premier levier à activer si le classement sur le nom propre stagne.

### Action rendue possible par la contrainte

lalason.pro linke aujourd'hui vers `flow-ai.studio/cas-clients`. **Ces liens sortants sont à retirer au profit des pages internes.** La friction de parcours identifiée au départ est fabriquée depuis lalason.pro — elle est donc supprimable sans toucher à l'autre site.

## 6. Le design retenu

### 6.1 Rôles

| | Rôle | Existe où |
|---|---|---|
| **Annaël Lalason** | La personne à qui on fait confiance. Auteur, expert, signataire. | Site, LinkedIn, contenu, emails sortants, schema `Person` |
| **Flow AI Studio** | La structure qui livre. Nom de la méthode, des offres, de la facture. | Devis, factures, livrables, page `/studio`, schema `Organization` |

**Formulation canonique, sans variante :**

> **Flow AI Studio** — le studio d'automatisation IA d'**Annaël Lalason**

### 6.2 Règles de voix — non négociables

- Ce qui raconte, explique, prend position → **« je »**
- Ce qui décrit le processus, le périmètre, l'engagement → **« Flow AI Studio »** comme nom, jamais « nous »
- **« Nous » est interdit tant que la structure est mono-personne.** C'est ce mot qui fabrique le doute.
- Signature publique unique : **Annaël Lalason**. Jamais « Naël », jamais « LALASON Annaël » en capitales dans le copy commercial (les capitales restent réservées au schema `Person` et aux documents administratifs).

### 6.3 Où vit quoi

Site unique : **www.lalason.pro**.

| Contenu à produire | URL | Remplace / complète |
|---|---|---|
| Échelle d'offres + Pilote + prix | `/offre` | Remplace le `/services/*` prévu — URL courte, meilleure conversion |
| Cas clients et résultats | `/projets` | Étend l'existant, ne le duplique pas |
| Funnel de diagnostic | `/diagnostic` | Nouveau — lead magnet, exige un endpoint serveur fonctionnel |
| Flow AI Studio : méthode, périmètre de refus | `/studio` | Nouveau |
| Bio longue indexable | `/a-propos` | Conforme au plan SEO existant |
| Témoignage audio Julien M. | one-page + `/offre` | Preuve la plus forte — au-dessus de la ligne de flottaison |

`/blog` et les pages services par mot-clé : **différés jusqu'à trois références livrées.**

### 6.4 Funnel

```
LinkedIn / sortant / SEO  →  www.lalason.pro  →  1 CTA  →  Calendly
```

Un domaine, un calendrier, un lead magnet. Le saut de site disparaît par construction.

### 6.5 Entité SEO

Trois ajouts sur lalason.pro qui règlent le §4.2 dans la limite de la contrainte :

- `Organization` « Flow AI Studio » avec `founder` → `/#person` et `sameAs: https://flow-ai.studio`
- `Person` avec `worksFor` → l'`Organization`, plus `alumniOf`, `knowsLanguage`, `email` (déjà prévus au plan SEO)
- `hasCredential` sur les certifications affichées

Résultat visé : Google voit **une personne qui a fondé un studio**, pas deux inconnus.

## 7. Échelle d'offres

Reprise telle quelle de `flow-ai.studio/src/lib/offer.ts` — la conception est validée, seul son emplacement change.

| Barreau | Prix | Rôle |
|---|---|---|
| Diagnostic Score Flow | gratuit | Lead magnet |
| **Cartographie** | 890 € | Produit d'appel — qualifie et se fait payer |
| **Flow Solo** | 4 500 € | 1 processus, jusqu'à 3 outils |
| **Flow Duo** | 7 000 € | 2 processus enchaînés, jusqu'à 5 outils |
| **Flow Ops** | 9 500 € | 3 processus + tableau de bord |
| **Run Essentiel / Actif / Pilote** | 390 / 690 / 1 200 €/mois | Récurrent |

**Offre de lancement « Pilote Flow »** : 1 500 € au lieu de 4 500 € (−67 %), cartographie offerte, Run à 290 €/mois. **3 places, échéance 30 septembre 2026.**

Contreparties exigées, non négociables :

1. Un témoignage nommé, avec fonction et entreprise
2. L'accès aux chiffres avant / après du processus automatisé
3. Un appel de référence pour un futur prospect, une fois le système en production

La mécanique de contrepartie plutôt que de remise est juste, et les trois contreparties produisent **précisément les actifs que `SEO-STRATEGY.md` §6 liste comme manquants**.

## 8. Séquencement des quatre modèles de revenus

**Déjà séquencés dans l'échelle** — produit d'appel payant (Cartographie), forfait (Build), récurrent (Run). Aucune décision à prendre.

**Régie / TJM — hors menu.** Décision actée : jamais affichée, jamais tarifée publiquement. Vendre des jours détruit la grille au forfait — un client qui connaît le TJM divise 4 500 € par ce chiffre et négocie. Utilisable en opportuniste pour la trésorerie, sur sollicitation, sans jamais devenir une offre. Réversible.

**Produit / templates — différé.** On productise ce qui se répète ; rien ne s'est encore répété. **Déclencheur : 3 clients Run actifs.** Avant, c'est de la dispersion déguisée en scalabilité.

## 9. Plan 90 jours

Contrainte structurante : **l'échéance du Pilote Flow est le 30 septembre 2026, soit 44 jours après cette décision.** L'offre conçue pour produire les trois premières références nommées expire dans six semaines, et son formulaire de capture ne fonctionne pas. La priorité n'est pas l'architecture de marque — c'est de faire atterrir un funnel qui fonctionne avant fin septembre. L'architecture A sert ce but ; elle doit être livrée en version minimale, pas complète.

| Période | Objectif | Livrables |
|---|---|---|
| **S1-S2** (17 – 30 août) | Le minimum vital | `/offre` (échelle + Pilote + compte à rebours), `/diagnostic` avec endpoint fonctionnel, un seul Calendly, retrait des liens sortants vers flow-ai.studio. Rien d'autre. |
| **S3-S6** (31 août – 30 sept.) | Remplir les 3 places du Pilote | LinkedIn perso + réseau + sortant, tout pointant vers `/offre`. Le compte à rebours est l'argument. Phase de vente, pas de construction. |
| **S7-S12** (1er oct. – 15 nov.) | Encaisser les contreparties | Publication des 3 témoignages nommés et des chiffres sur `/projets`. Passage de la grille pilote à la grille pleine. |

Le `/blog` et les pages services par mot-clé n'entrent qu'après trois références publiées.

## 10. Déclencheurs de bascule vers B

La vision à 24 mois est indéterminée. Ces seuils décideront :

| Déclencheur | Conséquence |
|---|---|
| Un recrutement | flow-ai.studio redevient le site principal — la marque doit accueillir des gens qui ne sont pas Annaël |
| Run > 5 clients | La continuité devient un argument de vente ; la structure prime sur la personne |
| Ticket > 30 k€ ou appel d'offres | Une structure est requise contractuellement |
| Aucun des trois avant 12 mois | Positionnement consultant solo premium confirmé — flow-ai.studio peut être archivé définitivement |

Tant qu'aucun ne se déclenche, A reste le bon choix et rien n'est à repenser.

## 11. Risques et garde-fous

| Risque | Gravité | Mitigation |
|---|---|---|
| Leads perdus sur flow-ai.studio tant qu'il est live | Élevée | Ne plus y envoyer de trafic. Retirer les liens sortants depuis lalason.pro. Accepté comme conséquence de la lecture seule. |
| Duplicate content entre les deux sites | Moyenne | Réécrire, ne pas copier. Version lalason.pro bilingue et plus riche. Le domaine sans autorité perd naturellement. |
| Lien d'entité unidirectionnel plus faible qu'un lien croisé | Moyenne | Accepté. `founder.ts` reste le premier levier si le classement sur le nom propre stagne. |
| Échéance du 30 septembre manquée | Élevée | Livrer `/offre` et `/diagnostic` en 2 semaines maximum. Reporter tout le reste. Si l'échéance est manquée, la re-dater explicitement plutôt que de la laisser expirer en silence. |
| Retour du « nous » dans le copy | Faible | Règle §6.2. À vérifier à chaque publication. |
| Réapparition de la dispersion (4 modèles en parallèle) | Moyenne | §8. Les déclencheurs sont chiffrés, pas intuitifs. |
| Trois variantes du nom en circulation | Moyenne | Signature unique §6.2. Le footer de flow-ai.studio (« Naël ») reste non corrigé — conséquence assumée de la lecture seule. |

## 12. Décisions actées

1. **Architecture A** — personne-first, studio endossé. Un seul site : `www.lalason.pro`.
2. **flow-ai.studio en lecture seule stricte** — gelé, live, aucune modification, pas de 301.
3. **Reproduction et non migration** des actifs commerciaux, réécrits et bilingues.
4. **Lien d'entité unidirectionnel** depuis lalason.pro. `founder.ts` non rempli : gain décliné, documenté, réversible.
5. **« Nous » interdit** tant que la structure est mono-personne. Signature publique : Annaël Lalason.
6. **Régie / TJM hors menu** — jamais affichée ni tarifée publiquement.
7. **Produit / templates différé** jusqu'à 3 clients Run actifs.
8. **Priorité absolue jusqu'au 30 septembre 2026** : `/offre` et `/diagnostic` fonctionnels, puis vente. Le blog et les pages services par mot-clé viennent après trois références.
