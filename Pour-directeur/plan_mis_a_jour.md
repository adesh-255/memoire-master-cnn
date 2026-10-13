# Plan du mémoire (mise à jour)

**Auteur :** ALAWO Adeshina Néhémiah · Master professionnel IA-BD, ESGIS · année académique 2024-2025
**Version :** octobre 2026. Remplace le plan d'avril 2026.

## Sujet

**Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques**

## État d'avancement

Le travail a bien avancé depuis avril : le projet a été recentré, les expérimentations sont lancées et la rédaction est en cours. Je prévois de finaliser le mémoire d'ici la semaine prochaine. Avant cela, je souhaiterais convenir avec vous d'un plan pour cette dernière étape et recueillir vos remarques sur les orientations ci-dessous.

## Résumé

Le mémoire évalue la capacité d'un CNN à détecter la pneumonie et la tuberculose sur radiographie thoracique, et examine ce que ses performances mesurent réellement. Un modèle DenseNet-121 pré-entraîné sur ImageNet est adapté par apprentissage par transfert, sur deux corpus publics annotés par des cliniciens : 5 856 radiographies pédiatriques (Kermany) et 800 radiographies d'adultes (Montgomery et Shenzhen). L'évaluation repose sur un partitionnement par patient, des intervalles de confiance et une analyse Grad-CAM. Les premiers résultats sont très élevés pour la pneumonie et plus modestes pour la tuberculose. Un test de masquage suggère toutefois qu'une partie de la performance sur la pneumonie pourrait reposer sur des indices étrangers à la maladie, ce qui oriente la discussion vers la question : que mesure réellement une bonne performance sur un corpus public ?

## Changements par rapport au plan d'avril

- **Corpus réduit à deux sources.** Kermany (pneumonie) et Montgomery + Shenzhen (tuberculose), soit 6 656 images au lieu de ~388 000. Critères : annotation par des cliniciens, identifiant patient disponible, volume compatible avec un GPU unique.
- **ChestX-ray14, CheXpert et RSNA écartés :** étiquettes extraites automatiquement des comptes rendus, et temps de calcul hors de portée.
- **COVID-19 retiré de la partie expérimentale.** COVIDx agrège des sources sans identifiant patient fiable, et DeGrave et al. (2021) ont montré que les modèles y apprennent la provenance des images plutôt que la maladie. Le COVID-19 reste traité dans l'état de l'art.
- **Trois expériences complémentaires ajoutées :** test de raccourci par masquage, validation croisée entre hôpitaux, comparaison d'architectures.
- **Objectifs reformulés :** la comparaison directe avec des radiologues n'est plus promise (aucun radiologue n'a lu les mêmes images) ; l'hypothèse est discutée et jugée partiellement vérifiée.

## Données utilisées

| Base | Contenu | Rôle | Lien |
|---|---|---|---|
| Kermany et al. (2018) | 5 856 radiographies pédiatriques : normales, pneumonies bactériennes et virales | Pneumonie ; bactérienne ou virale | [Kaggle](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia) |
| Montgomery + Shenzhen (Jaeger et al., 2014) | 800 radiographies d'adultes : 406 normales, 394 tuberculoses | Tuberculose ; validation croisée entre hôpitaux | [Kaggle](https://www.kaggle.com/datasets/kmader/pulmonary-chest-xray-abnormalities) |

## Plan détaillé

### Introduction générale

- Contexte : poids épidémiologique des maladies pulmonaires et manque de radiologues en Afrique subsaharienne
- Problématique : fiabilité, transférabilité et acceptabilité clinique des CNN
- Hypothèse : un CNN entraîné sur des données variées peut rivaliser avec les radiologues
- Cinq objectifs, démarche et plan

### Chapitre 1 : Revue de littérature

- 1.1 Les maladies pulmonaires : pneumonie, tuberculose, COVID-19
- 1.2 La radiographie thoracique et ses limites
- 1.3 L'intelligence artificielle en imagerie médicale
- 1.4 Réseaux de neurones convolutionnels : principes et architectures
- 1.5 Travaux antérieurs sur la détection automatique

### Chapitre 2 : Matériels et méthodes

- 2.1 Sources de données : bases retenues, bases écartées, trois tâches de classification
- 2.2 Prétraitement et augmentation des images
- 2.3 DenseNet-121 : justification et adaptation (apprentissage par transfert en deux phases)
- 2.4 Entraînement et validation : partition par patient, hyperparamètres, seuil de Youden, environnement
- 2.5 Métriques : matrice de confusion, précision, rappel, spécificité, F1, AUC, intervalles de confiance, Grad-CAM
- **2.6 Expériences complémentaires (nouveau) :** masquage, validation croisée, comparaison d'architectures

### Chapitre 3 : Résultats et discussion

- 3.1 Résultats quantitatifs ; 3.2 Analyse des erreurs ; 3.3 Comparaison avec l'état de l'art ; 3.4 Grad-CAM
- **3.5 Test de raccourci (nouveau, contribution principale) ; 3.6 Validation croisée entre hôpitaux ; 3.7 Comparaison d'architectures**
- 3.8 Limites, implications cliniques et éthiques

### Conclusion générale

- Bilan et contributions, portée, limites et perspectives, recommandations pour un déploiement responsable

## Points sur lesquels j'aimerais votre avis

1. **Réduction du corpus et retrait du COVID-19 :** ce recentrage vous convient-il ?
2. **Structure en trois chapitres :** le canevas en décrit quatre ; la section 3.8 (limites et perspectives) peut devenir un Chapitre 4 si vous le préférez.
3. **Lecture des cartes Grad-CAM :** certaines activations semblent porter sur du matériel médical visible en bord de cliché ; votre regard, ou celui d'un radiologue, serait précieux.
4. **Choix méthodologiques :** perte pondérée plutôt que suréchantillonnage, PyTorch, seuil de décision fixé par l'indice de Youden.
5. **Calendrier :** je vise une finalisation d'ici la semaine prochaine. Pourrions-nous fixer un rendez-vous pour faire le point et arrêter ensemble un plan jusqu'au dépôt (date limite, modalités de la soutenance) ?
