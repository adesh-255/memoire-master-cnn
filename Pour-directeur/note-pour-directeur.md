# Note de présentation — Mémoire de Master
**Auteur :** ALAWO Adeshina Néhémiah
**Date :** Avril 2026
**Institution :** ESGIS — École Supérieure de Gestion d'Informatique et des Sciences

---

## Sujet

**Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques**

---

## Résumé

Les maladies pulmonaires — pneumonie, tuberculose, COVID-19 — représentent un enjeu de santé publique majeur, particulièrement dans les pays à ressources limitées où le manque de radiologues qualifiés compromet le diagnostic précoce. En Afrique subsaharienne, on compte à peine 0,9 radiologue par million d'habitants, contre 47 à 110 en Europe, tandis que la tuberculose causait 1,25 million de décès et la pneumonie 610 000 décès d'enfants de moins de cinq ans en 2023 (OMS, 2024).

Face à ce déficit structurel, l'intelligence artificielle — et plus précisément les réseaux de neurones convolutionnels (CNN) — offre une réponse prometteuse. Depuis la publication de CheXNet par Stanford en 2017, qui a démontré qu'un CNN entraîné sur 112 000 radiographies pouvait dépasser la performance diagnostique moyenne de quatre radiologues humains, le domaine a connu un essor considérable.

Ce mémoire vise à concevoir et évaluer un modèle CNN fondé sur l'architecture DenseNet-121 pour la détection automatique des maladies pulmonaires à partir de radiographies thoraciques. Le corpus expérimental mobilise six bases de données publiques complémentaires (ChestX-ray14, CheXpert, Kermany, RSNA 2018, COVIDx, Montgomery & Shenzhen), totalisant environ 388 000 images. Les performances sont évaluées selon les métriques standards — précision, rappel, F1-score, AUC-ROC — et complétées par une analyse qualitative via Grad-CAM pour garantir la cohérence anatomique des décisions du modèle. L'objectif final est de contribuer au développement d'outils de triage diagnostique automatisé adaptés aux contextes sous-médicalisés.

**Mots-clés :** réseaux de neurones convolutionnels, radiographie thoracique, pneumonie, tuberculose, COVID-19, deep learning, transfer learning, DenseNet-121, imagerie médicale, diagnostic automatisé.

---

## Plan du mémoire

### Introduction Générale *(rédigée)*
- Contexte : fardeau épidémiologique des maladies pulmonaires et déficit en radiologues
- Problématique : fiabilité, transférabilité et acceptabilité clinique des CNN
- Hypothèse : un CNN entraîné sur un corpus diversifié peut rivaliser avec les radiologues humains
- But et objectifs spécifiques (5 objectifs)
- Démarche et structure du mémoire

---

### Chapitre 1 — État de l'Art *(rédigé, ~13 pages)*

**1.1 Les maladies pulmonaires : enjeux épidémiologiques et cliniques**
Présentation de la pneumonie, de la tuberculose et du COVID-19 — épidémiologie mondiale, caractéristiques radiographiques et défi diagnostique dans les zones à faibles ressources.

**1.2 La radiographie thoracique : outil de référence et ses limites**
Principes de la CXR, place dans le parcours de soin, limites de sensibilité (69 % pour le COVID-19), variabilité inter-observateur (jusqu'à 30 % de désaccord), taux de faux négatifs documentés, et déficit mondial en radiologues.

**1.3 L'intelligence artificielle en imagerie médicale**
Évolution historique — des systèmes CAD classiques au deep learning (rupture AlexNet 2012) — et panorama des applications actuelles des CNN en radiologie, appuyé sur les revues systématiques de Litjens et al. (2017) et Ahmad et al. (2023).

**1.4 Réseaux de neurones convolutionnels : principes et architectures**
Fonctionnement des couches convolutives, pooling, activation ReLU, backpropagation, régularisation. Présentation comparative des architectures de référence : AlexNet, VGG-16/19, ResNet-50/152, DenseNet-121, EfficientNet. Transfer learning et Grad-CAM.

**1.5 Travaux antérieurs sur la détection automatique**
Revue des études clés : CheXNet (Rajpurkar et al., 2017), datasets de référence (Wang et al., 2017 ; Kermany et al., 2018 ; RSNA 2018), détection COVID-19 (Wang et al., 2020 ; Sethy & Behera, 2020 ; Apostolopoulos & Mpesiana, 2020), revues systématiques (Meedeniya et al., 2022 ; Ahmad et al., 2023).

---

### Chapitre 2 — Matériels et Méthodes *(rédigé, ~11 pages)*

**2.1 Sources de données**
Corpus multi-sources de ~388 000 images : ChestX-ray14 (112 120 images, NIH), CheXpert (224 316 images, Stanford), Kermany (5 856 images pédiatriques), RSNA 2018 (30 000 images avec boîtes englobantes), COVIDx (13 975 images), Montgomery & Shenzhen (~800 images, tuberculose). Justification de la complémentarité pathologique, populationnelle et méthodologique.

**2.2 Prétraitement des images**
Redimensionnement à 224×224 px, conversion pseudo-RGB, normalisation ImageNet (μ = [0.485, 0.456, 0.406]). Gestion du déséquilibre des classes (class-weighted loss / oversampling). Augmentation de données (rotations ±15°, flips horizontaux, zoom ±10%, ajustements luminosité) strictement réservée à l'entraînement.

**2.3 Architecture CNN choisie : DenseNet-121**
Justification par les travaux de Rajpurkar et al. (2017) et Meedeniya et al. (2022). Adaptation : remplacement de la tête de classification par Global Average Pooling + Dropout (0,5) + couche fully connected. Stratégie de transfer learning en deux phases : feature extraction (backbone gelé) puis fine-tuning progressif.

**2.4 Stratégie d'entraînement et de validation**
Partitionnement au niveau patient (70/15/15 %, stratifié par classe). Optimiseur Adam (lr = 1×10⁻⁴, ReduceLROnPlateau). Taille de lot : 32. Early Stopping (patience = 10 époques). Régularisation : Dropout 0,5 + L2 weight decay. Graine aléatoire : 42.

**2.5 Métriques d'évaluation**
Matrice de confusion, précision, rappel, spécificité, F1-score, courbe ROC / AUC. Analyse qualitative par cartes Grad-CAM pour validation anatomique des décisions du modèle.

---

### Chapitre 3 — Résultats et Discussion *(cadre rédigé, métriques à compléter après implémentation)*

**3.1 Résultats quantitatifs**
Tableau de métriques par pathologie (précision, rappel, spécificité, F1, AUC). Benchmarks : F1 = 0,435 (CheXNet, Rajpurkar et al., 2017) ; AUC 0,87–0,96 (Ahmad et al., 2023).

**3.2 Visualisations et analyse qualitative**
Matrices de confusion, courbes ROC comparatives, analyse asymétrique faux positifs / faux négatifs, sous-tâche bactérien vs viral (dataset Kermany).

**3.3 Comparaison avec l'état de l'art**
Positionnement par rapport à CheXNet, COVID-Net, Sethy & Behera (2020), Apostolopoulos & Mpesiana (2020). Discussion des conditions de comparabilité.

**3.4 Cartes Grad-CAM et explainabilité**
Validation de la cohérence anatomique : activation sur les zones de consolidation (pneumonie), les apex (tuberculose), les opacités périphériques bilatérales (COVID-19). Analyse des cas problématiques.

**3.5 Limites, implications cliniques et éthiques**
Limites : bruit d'annotation NLP, biais géographique du corpus, volume insuffisant sur la tuberculose, absence de validation prospective. Implications cliniques : usage comme outil CAD de triage, non comme autorité diagnostique. Dimensions éthiques : responsabilité médicale, opacité algorithmique, équité, cadre réglementaire (EU AI Act, FDA). Perspectives : Vision Transformers, federated learning, modèles multimodaux, corpus africains.

---

### Conclusion Générale *(à rédiger après complétion des résultats)*
- Bilan des contributions
- Limites et perspectives
- Recommandations pour un déploiement clinique responsable

---

## État d'avancement

| Section | Statut | Volume |
|---|---|---|
| Introduction Générale | Rédigée et validée | ~3 pages |
| Chapitre 1 — État de l'Art | Rédigé et validé | ~13 pages |
| Chapitre 2 — Matériels et Méthodes | Rédigé et validé | ~11 pages |
| Chapitre 3 — Résultats et Discussion | Cadre rédigé, métriques à compléter | ~13 pages |
| Conclusion Générale | À rédiger | ~3 pages |
| Pages liminaires (résumé, abstract, sigles) | À rédiger | ~3 pages |
| Bibliographie | Constituée (27 références APA 7) | — |

**Volume rédigé actuel : ~40 pages sur ~50 estimées**

---

## Points en attente de validation par le directeur

1. **Structure : 3 ou 4 chapitres ?** Le canevas ESGIS prévoit 4 chapitres (le Chapitre 4 "Discussion et Perspectives" étant distinct du Chapitre 3). La structure actuelle fusionne résultats et discussion dans un seul chapitre (3). À valider.
2. **Framework d'implémentation :** PyTorch ou TensorFlow/Keras ? À confirmer pour le Chapitre 2.
3. **Infrastructure de calcul disponible :** GPU accessible (local, Google Colab, cloud) ? Le temps d'entraînement estimé en dépend.
4. **Gestion du déséquilibre des classes :** class-weighted loss ou oversampling ? À arbitrer selon les résultats de validation.

---

*Document préparé par ALAWO Adeshina Néhémiah — Avril 2026*
