# Introduction Générale

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 — 2026-04-04
> **Statut :** Relu et validé ✓

---

## Contexte

Chaque année, des millions de personnes meurent de maladies pulmonaires dont le diagnostic aurait pu être posé plus tôt. En 2023, la tuberculose a tué 1,25 million de personnes — pour 10,8 millions de nouveaux cas recensés dans le monde (OMS, 2024a) — tandis que la pneumonie emportait 610 000 enfants de moins de cinq ans, dont plus de la moitié en Afrique subsaharienne (OMS, 2024b). Ces données ne sont pas des abstractions statistiques : elles traduisent une réalité clinique brutale, celle de systèmes de santé débordés, souvent incapables d'assurer un dépistage précoce dans des délais compatibles avec une prise en charge efficace. La pandémie de COVID-19 n'a fait qu'accentuer cette fragilité, révélant à quel point les infrastructures diagnostiques restent insuffisantes là où le besoin est le plus urgent.

La radiographie thoracique est, dans ce tableau, l'outil de premier recours. Accessible, relativement peu coûteuse, elle permet de visualiser les anomalies parenchymateuses caractéristiques de la plupart des affections pulmonaires — et c'est précisément ce qui en fait une ressource précieuse dans les environnements à faibles ressources. Mais son utilité se heurte à une contrainte difficilement contournable : l'interprétation d'un cliché exige un radiologue qualifié. Or, en Afrique subsaharienne, on compte à peine 0,9 radiologue par million d'habitants, contre 47 à 110 en Europe (Auteurs à confirmer, 2023) [À VALIDER — référence [10]]. De fait, les images s'accumulent, les rapports tardent, et des patients attendent un diagnostic que personne n'est disponible pour formuler.

C'est face à ce goulot d'étranglement que l'intelligence artificielle — les réseaux de neurones convolutionnels (CNN) en particulier — a commencé à s'imposer comme une réponse plausible, sinon incontournable. LeCun et al. (2015) ont montré que ces architectures sont capables d'extraire, directement depuis les pixels, des représentations hiérarchiques que nul ingénieur n'aurait su formaliser à la main. Quelques années plus tard, Rajpurkar et al. (2017) franchissaient un seuil symbolique avec CheXNet : ce modèle fondé sur l'architecture DenseNet-121, entraîné sur plus de 100 000 radiographies, surpassait en score F1 la performance diagnostique moyenne de quatre radiologues humains sur la détection de pneumonie. Ces avancées soulèvent cependant autant de questions qu'elles n'en résolvent.

## Problématique

Les résultats obtenus en laboratoire sont convaincants. Ils ne règlent pas pour autant les questions que pose le passage à la pratique clinique. Entraîner un CNN performant requiert des corpus d'images annotées par des experts — une ressource rare, longue à constituer et rarement disponible dans les contextes où le besoin diagnostique est le plus pressant. La transférabilité des modèles pose un problème distinct : un algorithme calibré sur la population nord-américaine ou européenne peut se comporter différemment face à des radiographies issues d'équipements moins récents ou de profils épidémiologiques différents. Et derrière ces difficultés techniques se profile une question plus fondamentale, celle de la lisibilité des décisions automatiques : dans un domaine où une erreur peut engager la vie d'un patient, l'opacité d'un réseau de neurones n'est pas anodine.

Ces tensions — entre performance algorithmique et validité clinique, entre passage à l'échelle et équité, entre automatisation et responsabilité médicale — dessinent la problématique qui structure ce travail : comment développer et évaluer un modèle de réseau de neurones convolutionnels capable de détecter efficacement et de manière fiable les maladies pulmonaires à partir d'images radiographiques, tout en répondant aux contraintes cliniques et éthiques du domaine médical ?

## Hypothèse

Nous faisons l'hypothèse qu'un CNN correctement dimensionné et entraîné sur un jeu de données suffisamment diversifié peut atteindre — voire dépasser — les performances diagnostiques de radiologues humains pour la détection des maladies pulmonaires à partir de radiographies thoraciques. Cette position n'est pas spéculative : elle s'ancre dans les preuves empiriques apportées par Rajpurkar et al. (2017), dont les résultats constituent, pour ce travail, à la fois un point de départ et un étalon de comparaison. C'est cette hypothèse que les chapitres suivants s'attacheront à éprouver, à travers des métriques standardisées et une comparaison rigoureuse avec l'état de l'art. C'est à cette vérification que les objectifs suivants sont consacrés.

## But et objectifs

Ce mémoire a pour ambition de concevoir et d'évaluer un modèle CNN dédié à la détection automatique des maladies pulmonaires à partir de radiographies thoraciques, dans une perspective d'amélioration de l'accès au diagnostic dans les zones sous-médicalisées. Cinq objectifs jalonnent cette démarche :

1. Constituer et prétraiter un corpus d'images radiographiques à partir de bases de données de référence (Wang et al., 2017 ; Rajpurkar et al., 2017) ;
2. Définir et optimiser une architecture CNN répondant aux exigences de précision et de robustesse propres au contexte médical ;
3. Mesurer les performances du modèle sur les indicateurs usuels — précision, rappel, F1-score et aire sous la courbe ROC (AUC, *Area Under the Curve*) — afin d'en quantifier l'efficacité diagnostique ;
4. Situer ces résultats par rapport aux performances d'experts humains et aux modèles publiés dans la littérature récente ;
5. Dégager les limites de l'approche retenue et formuler des recommandations à l'intention des praticiens et décideurs concernés par un éventuel déploiement clinique.

## Démarche et plan du mémoire

La progression du mémoire suit une logique hypothético-déductive en trois temps. Le premier chapitre installe le cadre théorique : épidémiologie des maladies pulmonaires, place de la radiographie thoracique dans la pratique clinique, fondements des CNN et panorama des travaux qui ont posé les jalons de ce champ. Le deuxième chapitre entre dans le concret de la mise en œuvre — choix des données, procédures de prétraitement, architecture du modèle, protocole d'entraînement et métriques retenues. Le troisième chapitre présente et discute les résultats, les confronte à la littérature, et interroge leurs implications cliniques et éthiques. Une conclusion générale vient clore l'ensemble, en synthétisant les apports de ce travail et en ouvrant sur les perspectives qu'il dessine.

---

## Notes de relecture

| Statut | Item |
|---|---|
| ⚠️ À VALIDER | Référence [10] — auteurs complets de l'étude sur la densité de radiologues en Afrique subsaharienne |
| ✅ Corrigé | CNN formalisé à la première occurrence (§ Contexte, §3) |
| ✅ Corrigé | AUC défini à la première occurrence (§ Objectifs, point 3) |
| ✅ Corrigé | Transition Contexte → Problématique ajoutée |
| ✅ Corrigé | Transition Hypothèse → Objectifs ajoutée |
| ✅ Corrigé | "bute sur" → "se heurte à" |
| ✅ Corrigé | "scalabilité" → "passage à l'échelle" |
| ✅ Corrigé | "continent africain" → "Afrique subsaharienne" (harmonisé avec source OMS) |

---

*~2,8 pages | APA 7 | Relu par /memoire-reviewer | Humanisé par /memoire-humanizer*
