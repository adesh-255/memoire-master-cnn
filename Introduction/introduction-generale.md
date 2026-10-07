# Introduction générale

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.1 (2026-10-06)
> **Statut :** Relu et validé ✓, style revu (tirets cadratins supprimés)

---

## Contexte

Chaque année, des millions de personnes meurent de maladies pulmonaires qui auraient pu être diagnostiquées plus tôt. En 2023, la tuberculose a fait 1,25 million de morts, pour 10,8 millions de nouveaux cas dans le monde (OMS, 2024a), et la pneumonie a emporté 610 000 enfants de moins de cinq ans, dont plus de la moitié en Afrique subsaharienne (OMS, 2024b). Derrière ces chiffres, il y a des systèmes de santé débordés, souvent incapables de dépister assez tôt pour que la prise en charge reste efficace. La pandémie de COVID-19 a encore aggravé cette fragilité et montré combien les moyens de diagnostic manquent là où ils seraient le plus utiles.

Dans ce contexte, la radiographie thoracique est l'examen de premier recours. Accessible et relativement peu coûteuse, elle montre les anomalies du parenchyme qui caractérisent la plupart des affections pulmonaires, ce qui en fait un outil précieux dans les régions aux ressources limitées. Son intérêt se heurte toutefois à une contrainte de taille : lire un cliché demande un radiologue qualifié. Or l'Afrique subsaharienne compte à peine 0,9 radiologue par million d'habitants, contre 47 à 110 en Europe (Karera et al., 2024). Les images s'accumulent, les comptes rendus tardent, et des patients attendent un diagnostic que personne n'est disponible pour poser.

C'est pour desserrer ce goulot d'étranglement que l'intelligence artificielle, et en particulier les réseaux de neurones convolutionnels (CNN), s'est imposée comme une piste sérieuse. LeCun et al. (2015) ont montré que ces architectures savent extraire directement des pixels des représentations hiérarchiques qu'aucun ingénieur n'aurait pu formaliser à la main. Quelques années plus tard, Rajpurkar et al. (2017) franchissaient un cap symbolique avec CheXNet. Fondé sur l'architecture DenseNet-121 et entraîné sur plus de 100 000 radiographies, ce modèle dépassait en score F1 la performance moyenne de quatre radiologues dans la détection de la pneumonie. Ces progrès ouvrent pourtant au moins autant de questions qu'ils n'en referment.

## Problématique

Les résultats obtenus en laboratoire sont convaincants, mais ils ne disent pas grand-chose de ce qui se passera à l'hôpital. Pour entraîner un CNN performant, il faut des corpus d'images annotées par des experts, une ressource rare, longue à constituer et souvent absente là où le besoin de diagnostic est le plus pressant. La transférabilité des modèles pose un autre problème : un algorithme mis au point sur des patients nord-américains ou européens peut se comporter tout autrement face à des radiographies prises sur des appareils plus anciens, ou chez des populations dont le profil épidémiologique diffère. Reste enfin une question plus profonde, celle de la lisibilité des décisions automatiques. Quand une erreur peut coûter la vie d'un patient, l'opacité d'un réseau de neurones pèse lourd.

Performance algorithmique et validité clinique, passage à l'échelle et équité, automatisation et responsabilité médicale : de ces tensions naît la problématique de ce travail. Comment développer et évaluer un modèle de réseau de neurones convolutionnels capable de détecter efficacement et de manière fiable les maladies pulmonaires à partir d'images radiographiques, tout en répondant aux contraintes cliniques et éthiques du domaine médical ?

## Hypothèse

Nous faisons l'hypothèse qu'un CNN correctement dimensionné, entraîné sur un jeu de données suffisamment diversifié, peut atteindre, voire dépasser, les performances diagnostiques de radiologues dans la détection des maladies pulmonaires sur radiographie thoracique. Cette hypothèse s'appuie sur les résultats de Rajpurkar et al. (2017), qui servent ici à la fois de point de départ et d'étalon. Les chapitres suivants la mettent à l'épreuve à l'aide de métriques standardisées et d'une comparaison avec l'état de l'art, selon les objectifs exposés ci-dessous.

## But et objectifs

Ce mémoire vise à concevoir et à évaluer un modèle CNN de détection automatique des maladies pulmonaires sur radiographie thoracique, avec l'idée d'améliorer l'accès au diagnostic dans les zones sous-médicalisées. Cinq objectifs structurent la démarche :

1. Constituer et prétraiter un corpus d'images radiographiques à partir de bases de données de référence (Wang et al., 2017 ; Rajpurkar et al., 2017) ;
2. Définir et optimiser une architecture CNN qui réponde aux exigences de précision et de robustesse propres au contexte médical ;
3. Mesurer les performances du modèle selon les indicateurs usuels, à savoir la précision, le rappel, le F1-score et l'aire sous la courbe ROC (AUC, *Area Under the Curve*), afin d'en quantifier l'efficacité diagnostique ;
4. Situer ces résultats par rapport aux performances d'experts humains et aux modèles publiés dans la littérature récente ;
5. Dégager les limites de l'approche retenue et formuler des recommandations à l'intention des praticiens et des décideurs concernés par un éventuel déploiement clinique.

## Démarche et plan du mémoire

Le mémoire suit une démarche hypothético-déductive en trois temps. Le premier chapitre pose le cadre théorique : épidémiologie des maladies pulmonaires, place de la radiographie thoracique dans la pratique clinique, fondements des CNN et principaux travaux du domaine. Le deuxième décrit la mise en œuvre, du choix des données au prétraitement, à l'architecture du modèle, au protocole d'entraînement et aux métriques retenues. Le troisième présente et discute les résultats, les compare à la littérature et en examine les implications cliniques et éthiques. La conclusion générale fait le bilan des apports de ce travail et des perspectives qu'il ouvre.

---

## Notes de relecture

| Statut | Item |
|---|---|
| ✅ Corrigé | Chiffre 0,9/million (Afrique subsaharienne) attribué à Karera et al. (2024), source confirmant directement ce chiffre et la comparaison à l'Europe (47 à 110/million) |
| ✅ Corrigé | CNN formalisé à la première occurrence (§ Contexte, §3) |
| ✅ Corrigé | AUC défini à la première occurrence (§ Objectifs, point 3) |
| ✅ Corrigé | Transition Contexte → Problématique ajoutée |
| ✅ Corrigé | Transition Hypothèse → Objectifs ajoutée |
| ✅ Corrigé | "bute sur" → "se heurte à" |
| ✅ Corrigé | "scalabilité" → "passage à l'échelle" |
| ✅ Corrigé | "continent africain" → "Afrique subsaharienne" (harmonisé avec source OMS) |
| ✅ Style | v1.1 : tirets cadratins supprimés, tournures reformulées |
| ⚠️ À harmoniser | Objectif 1 cite Wang et al. (2017) (ChestX-ray14), base écartée au Ch.2 v2 ; la mention du COVID-19 dans le contexte peut rester. À trancher après validation du corpus par l'encadreur |

---

*~2,8 pages | APA 7*
