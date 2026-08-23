# Copy de référence — page `/offre`

> Version dirigeant, centrée sur l’investissement, le seuil de rentabilité et la décision. Elle remplace la page longue fondée sur le problème et le parcours en cinq étapes.

## Contrat éditorial

- **Cible :** dirigeants de PME, holdings et entrepreneurs qui pilotent plusieurs équipes sans DSI dédiée.
- **Objectif :** obtenir un appel de qualification de 30 minutes autour d’un processus concret.
- **Question principale :** combien investir, quel résultat acheter et à partir de quel gain le projet devient-il rationnel ?
- **Produit principal :** le Pilote Flow, pas la cartographie ni le support mensuel.
- **Règle de preuve :** aucune économie n’est garantie. Les hypothèses du simulateur sont modifiables et les gains du cas réel restent présentés comme l’estimation d’un dirigeant sur un système plus large.
- **Source unique des prix :** `lib/offer.ts`. Les montants injectés dans la page ne doivent pas être dupliqués dans les traductions.

## Hiérarchie de la page

1. Problème concret, prix, délai, identité du prestataire et appel gratuit dans le premier écran.
2. Cas réel anonymisé, avec métriques et limites de la preuve explicites.
3. Simulateur de seuil de rentabilité avec hypothèses visibles.
4. Comparatif de trois engagements et appel à l’action sur le Pilote recommandé.
5. Périmètre exact du Pilote et démonstration vidéo réelle sur WhatsApp.
6. Cinq questions de décision, dont les données et les accès.
7. Appel à l’action final.

Les anciennes sections autonomes « problème », « exemples », « parcours », « système complet », « Run », « cartographie » et « garde-fous » ne doivent pas réapparaître. Leurs informations essentielles sont fusionnées dans les blocs ci-dessus. La preuve anonymisée reste un bloc autonome pour séparer clairement le cas observé des hypothèses du simulateur.

## Hero

**H1**

> Votre équipe ne manque pas d’outils. Elle perd du temps à les recoller.

**Corps**

> Je transforme un processus prioritaire en un flux opérationnel en 2 à 3 semaines, dès 1 500 € HT. Vos informations restent reliées à leurs sources et vous validez chaque action sensible.

**Repères visibles immédiatement**

- Pilote dès 1 500 € HT ;
- mise en production en deux à trois semaines ;
- 35 à 50 heures récupérées par mois sur le système observé, selon l’estimation du dirigeant et sans garantie de reproductibilité ;
- appel de qualification gratuit de 30 minutes.
- conception et livraison par Annaël Lalason, interlocuteur unique du cadrage à la mise en production.

## Simulateur de ROI

Le simulateur part du prix d’entrée du Pilote et permet au visiteur de modifier :

- le temps manuel mensuel consacré au processus ;
- la part raisonnablement récupérable ;
- le coût horaire chargé ;
- l’inclusion ou non de Flow Run au prix de départ.

Il calcule :

```text
heures récupérées = heures manuelles × part récupérable
valeur brute mensuelle = heures récupérées × coût horaire
valeur nette mensuelle = valeur brute − coût récurrent simulé
amortissement = investissement initial ÷ valeur nette mensuelle
ROI 12 mois = (valeur 12 mois − coût total 12 mois) ÷ coût total 12 mois
```

Scénario initial affiché, explicitement modifiable et non contractuel : 40 heures manuelles, 40 % récupérables, 60 € par heure et Flow Run inclus. Il produit 16 heures récupérées, 960 € de valeur brute mensuelle, 570 € de valeur nette, 2,6 mois d’amortissement et 86,4 % de ROI indicatif à 12 mois.

Les outils tiers, l’adoption, la qualité des données, les variations de périmètre, les gains de revenu et la réduction du risque ne sont pas inclus dans ce calcul.

## Échelle commerciale

| Décision | Engagement | Prix | Délai |
| --- | --- | ---: | --- |
| Faut-il automatiser ce processus ? | Cadrage express | 290 € HT | Sous 5 jours ouvrés |
| La valeur existe-t-elle en production ? | Pilote Flow | Dès 1 500 € HT | 2 à 3 semaines |
| Faut-il étendre à plusieurs processus ? | Système complet | Dès 4 500 € HT | Selon le périmètre |

- Les 290 € du cadrage sont déduits si un Pilote ou un système démarre dans les 30 jours.
- Flow Run est optionnel, dès 390 € HT par mois.
- La cartographie complète est une option autonome à 890 € HT, jamais un prérequis.

## Périmètre du Pilote

**Ce que le prix de départ achète :** un processus prioritaire réellement mis en production, pas une maquette.

- un processus et une équipe ;
- jusqu’à trois outils ou sources ;
- un déclencheur, un parcours principal, ses exceptions essentielles et un résultat concret exploitable par l’équipe ;
- validations humaines avant les actions sensibles ;
- tests, journal d’exécution, alerte d’échec et mise en production ;
- documentation, passation et critère de succès défini avant de construire ;
- quatorze jours de stabilisation corrective.

Le prix de départ exclut les autres processus ou équipes, un tableau de bord sur mesure, une application mobile, le remplacement d’un ERP ou CRM, les abonnements, la consommation d’API et les services tiers.

Une démonstration vidéo réelle montre une demande formulée depuis WhatsApp, puis le brief opérationnel produit à partir du contexte connecté. WhatsApp est l’interface visible ; le produit vendu reste le flux relié aux outils du client, pas un chatbot isolé.

## FAQ de décision

La page répond uniquement à cinq questions :

1. Que couvre le prix de départ du Pilote ?
2. Comment le ROI est-il mesuré ?
3. Quels frais peuvent s’ajouter ?
4. Que se passe-t-il après les quatorze jours de stabilisation ?
5. Que deviennent les données et les accès ?

## CTA final

**H2**

> Apportez un processus et trois chiffres. Repartez avec une décision.

Le premier échange utilise le volume mensuel, le temps passé et le coût chargé pour tester si le gain potentiel justifie un cadrage ou un Pilote. L’appel reste gratuit, sans audit caché ni engagement sur la suite.
