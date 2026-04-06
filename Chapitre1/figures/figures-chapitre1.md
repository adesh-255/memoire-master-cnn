# Figures & Tableaux — Chapitre 1

> **Mémoire :** Détection des maladies pulmonaires par CNN
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 — 2026-04-04
> **Statut :** Prêt à insérer dans le .docx

---

## TABLEAU 1.1 — Comparatif des trois pathologies pulmonaires

### Légende (à placer AU-DESSUS du tableau dans Word)

*Tableau 1.1 — Comparatif des trois principales pathologies pulmonaires ciblées dans ce travail : caractéristiques épidémiologiques, radiographiques et performances de détection automatique rapportées dans la littérature.*

### Contenu du tableau

| Pathologie | Agent causal | Prévalence mondiale (2023) | Présentation radiographique | Détectabilité CNN (littérature) |
|---|---|---|---|---|
| Pneumonie | *Streptococcus pneumoniae*, virus influenza, VRS | 610 000 décès enfants <5 ans (OMS, 2024b) | Opacités alvéolaires, consolidations, épanchement pleural | F1 = 0,435 — CheXNet dépasse 4 radiologues humains (Rajpurkar et al., 2017) |
| Tuberculose | *Mycobacterium tuberculosis* | 10,8 M nouveaux cas ; 1,25 M décès (OMS, 2024a) | Infiltrats apicaux, cavernes, adénopathies hilaires, nodules calcifiés | AUC > 0,99 sur Montgomery & Shenzhen (revues systématiques) |
| COVID-19 | SARS-CoV-2 | >6 M décès officiels (2020–2023) | Opacités en verre dépoli bilatérales, distribution périphérique et basale | Sensibilité 91–98,75 % selon architecture (Wang et al., 2020 ; Apostolopoulos & Mpesiana, 2020) |

### Texte de renvoi à insérer dans le corps du texte
> "Le Tableau 1.1 synthétise les caractéristiques épidémiologiques, radiographiques et les niveaux de détectabilité automatique rapportés pour chacune de ces trois pathologies."

---

## FIGURE 1.1 — Radiographies thoraciques : normal vs pneumonie

### Instructions pour l'auteur

**Source des images :** RSNA Pneumonia Detection Challenge 2018
Disponible sur Kaggle : https://www.kaggle.com/c/rsna-pneumonia-detection-challenge/data

**Cliché (a) — normal :**
- Dossier : `stage_2_train_images/`
- Sélectionner un patient annoté classe `Normal` (label = 0)
- Critères visuels : champs pulmonaires clairs et symétriques, silhouette cardiaque nette, pas de condensation visible

**Cliché (b) — pneumonie :**
- Même dossier, patient annoté `Lung Opacity` (label = 1)
- Critères visuels : opacité dense localisée, asymétrie droite/gauche, condensation lobaire
- Préférer une consolidation lobaire droite (la plus pédagogique)

**Mise en page dans Word :**
- Deux images côte à côte, taille identique (~7 cm × 7 cm chacune)
- Étiquettes sous chaque image : **(a) Poumon normal** | **(b) Pneumonie — consolidation lobaire droite**
- Cadre fin (0,5 pt) autour de chaque image
- Centré sur la page

### Légende (à placer SOUS la figure dans Word)

*Figure 1.1 — Exemples de radiographies thoraciques de face : (a) cliché normal présentant des champs pulmonaires clairs et une silhouette cardiaque régulière ; (b) pneumonie avec consolidation alvéolaire lobaire droite se traduisant par une opacité dense et une perte de transparence du champ pulmonaire droit. Source : RSNA Pneumonia Detection Challenge dataset (Shih et al., 2019).*

### Texte de renvoi
> "La Figure 1.1 illustre la différence radiographique entre un poumon sain et un poumon atteint de pneumonie, soulignant la nature des signes visuels que le modèle CNN devra apprendre à identifier."

---

## FIGURE 1.2 — Timeline de l'évolution de l'IA en imagerie médicale

### Contenu (à reproduire dans PowerPoint ou Word SmartArt)

```
ÉVOLUTION DE L'IA EN IMAGERIE MÉDICALE (1990–2024)
════════════════════════════════════════════════════════════

PÉRIODE 1 — Systèmes CAD classiques (1990–2011)
────────────────────────────────────────────────
  • Extraction manuelle de features (SIFT, HOG, filtres morphologiques)
  • Classifieurs : SVM, forêts aléatoires
  • Performances limitées, faible généralisation inter-domaines
  • Nécessité de redéfinir les descripteurs pour chaque pathologie

        ↓

PÉRIODE 2 — Rupture Deep Learning (2012–2016)
──────────────────────────────────────────────
  ★ 2012 — AlexNet (Krizhevsky et al.)
    Erreur top-5 ImageNet : 26,2 % → 15,3 %
    Apprentissage automatique de features (end-to-end)

  ★ 2015 — LeCun, Bengio & Hinton — synthèse fondatrice
    Théorisation du deep learning comme paradigme dominant

        ↓

PÉRIODE 3 — Dépassement des experts humains (2017–2019)
─────────────────────────────────────────────────────────
  ★ 2017 — CheXNet (Rajpurkar et al., Stanford)
    DenseNet-121, 112 000 radiographies
    F1 pneumonie : 0,435 > 4 radiologues humains (0,387)

  ★ 2017 — Litjens et al. — revue systématique
    >300 articles, 20 spécialités médicales : CNN > méthodes classiques

  ★ 2019 — EfficientNet (Tan & Le)
    84,4 % top-1 ImageNet, 8,4× moins de paramètres

        ↓

PÉRIODE 4 — Consolidation et régulation (2020–2024)
────────────────────────────────────────────────────
  ★ 2020 — COVID-Net (Wang et al.) : 91 % sensibilité COVID-19
  ★ 2022 — Meedeniya et al. : ResNet/VGG/DenseNet architectures dominantes
  ★ 2023 — Ahmad et al. : CNN ≥ radiologues dans 80 % des études
  ★ 2023–2024 — Régulation IA médicale (CE AI Act, FDA guidelines)
    Explainabilité (Grad-CAM) comme prérequis d'acceptabilité clinique

════════════════════════════════════════════════════════════
```

### Instructions PowerPoint
- 4 rectangles arrondis empilés verticalement, reliés par des flèches épaisses
- Dégradé de couleur : bleu très clair (1990) → bleu marine (2024)
- Jalons ★ en gras, taille 10 pt
- Largeur : pleine page (15 cm) ; hauteur totale : ~18 cm

### Légende (SOUS la figure)

*Figure 1.2 — Chronologie de l'évolution de l'intelligence artificielle en imagerie médicale (1990–2024) : des systèmes d'aide au diagnostic à extraction manuelle de caractéristiques aux réseaux de neurones convolutionnels atteignant des performances diagnostiques comparables à celles des radiologues humains. Jalons principaux : Krizhevsky et al. (2012), Rajpurkar et al. (2017), Litjens et al. (2017). Conception personnelle, 2026.*

### Texte de renvoi
> "La Figure 1.2 retrace les étapes clés de cette évolution, de l'émergence des systèmes CAD aux architectures CNN modernes atteignant des performances diagnostiques comparables à celles des radiologues."

---

## FIGURE 1.3 — Architecture générique d'un CNN

### Schéma détaillé (draw.io / PowerPoint)

```
ARCHITECTURE GÉNÉRIQUE D'UN CNN — CLASSIFICATION D'IMAGE MÉDICALE
═══════════════════════════════════════════════════════════════════

 ┌─────────────────────┐
 │   IMAGE D'ENTRÉE    │  224 × 224 × 3 pixels (RGB ou niveaux de gris)
 └──────────┬──────────┘
            ↓
 ┌──────────────────────────────────────────┐  [BLEU]
 │  BLOC CONVOLUTIF 1                       │
 │  Conv2D — 64 filtres (3×3) → ReLU        │  → 224×224×64 feature maps
 │  MaxPooling (2×2)                        │  → 112×112×64
 └──────────────────────┬───────────────────┘
                        ↓
 ┌──────────────────────────────────────────┐  [BLEU]
 │  BLOC CONVOLUTIF 2                       │
 │  Conv2D — 128 filtres (3×3) → ReLU       │  → 112×112×128
 │  MaxPooling (2×2)                        │  → 56×56×128
 └──────────────────────┬───────────────────┘
                        ↓
 ┌──────────────────────────────────────────┐  [BLEU]
 │  BLOC CONVOLUTIF 3                       │
 │  Conv2D — 256 filtres (3×3) → ReLU       │  → 56×56×256
 │  MaxPooling (2×2)                        │  → 28×28×256
 └──────────────────────┬───────────────────┘
                        ↓
 ┌──────────────────────────────────────────┐  [GRIS]
 │  APLATISSEMENT (Flatten)                 │  → 200 704 valeurs
 └──────────────────────┬───────────────────┘
                        ↓
 ┌──────────────────────────────────────────┐  [VIOLET]
 │  COUCHE ENTIÈREMENT CONNECTÉE (FC 512)   │
 │  → ReLU → Dropout (p = 0,5)             │
 └──────────────────────┬───────────────────┘
                        ↓
 ┌──────────────────────────────────────────┐  [ROUGE]
 │  COUCHE DE CLASSIFICATION (FC N classes) │
 │  N = 2 (normal / pneumonie)              │
 │  N = 14 (ChestX-ray14)                  │
 │  → Softmax                               │
 └──────────────────────┬───────────────────┘
                        ↓
 ┌──────────────────────────────────────────┐
 │  SORTIE — Vecteur de probabilités        │
 │  ex. [0,03 (normal), 0,97 (pneumonie)]   │
 └──────────────────────────────────────────┘

LÉGENDE COULEURS :
  [BLEU]   = Couche de convolution + activation ReLU + pooling
  [VIOLET] = Couche entièrement connectée (fully connected)
  [ROUGE]  = Couche de classification (Softmax)
  [GRIS]   = Opération d'aplatissement (reshape)
═══════════════════════════════════════════════════════════════════
```

### Légende (SOUS la figure)

*Figure 1.3 — Architecture générique d'un réseau de neurones convolutionnel (CNN) appliqué à la classification d'images médicales. Les blocs convolutifs extraient des représentations hiérarchiques (bords dans les premières couches, structures anatomiques dans les couches profondes) ; les couches entièrement connectées réalisent la classification finale. Les dimensions indiquées correspondent à une image d'entrée standard de 224×224 pixels. Adapté de LeCun et al. (1998) et Goodfellow et al. (2016).*

### Texte de renvoi
> "La Figure 1.3 schématise l'architecture générique d'un CNN, depuis l'image d'entrée jusqu'au vecteur de probabilités en sortie, en détaillant le rôle de chaque type de couche dans l'extraction progressive des représentations."

---

## TABLEAU 1.2 — Comparatif des architectures CNN de référence

### Légende (AU-DESSUS du tableau)

*Tableau 1.2 — Comparatif des principales architectures CNN de référence utilisées en imagerie médicale pulmonaire : caractéristiques techniques et performances sur le benchmark ImageNet (ILSVRC).*

### Contenu du tableau

| Modèle | Année | Auteurs | Profondeur | Paramètres (M) | Top-5 ImageNet (%) | Usage médical dominant |
|---|---|---|---|---|---|---|
| AlexNet | 2012 | Krizhevsky et al. | 8 couches | 60 | 84,7 | Référence historique |
| VGG-16 | 2015 | Simonyan & Zisserman | 16 couches | 138 | 92,7 | Transfer learning TB, pneumonie |
| VGG-19 | 2015 | Simonyan & Zisserman | 19 couches | 144 | 93,1 | COVID-19 (Apostolopoulos, 2020) |
| ResNet-50 | 2016 | He et al. | 50 couches | 25 | 92,1 | COVID-19 (Sethy, 2020), TB |
| ResNet-152 | 2016 | He et al. | 152 couches | 60 | 96,4 | Classification multi-pathologie |
| DenseNet-121 | 2017 | Huang et al. | 121 couches | 8 | 92,2 | **CheXNet** — pneumonie (Rajpurkar, 2017) |
| EfficientNet-B7 | 2019 | Tan & Le | ~813 couches | 66 | 97,1 | Benchmarks récents |

> *Note : M = millions de paramètres. Valeurs top-5 issues des publications originales.*

### Texte de renvoi
> "Le Tableau 1.2 compare les principales architectures CNN selon leurs caractéristiques techniques et leurs usages dominants dans la littérature de détection des maladies pulmonaires."

---

## TABLEAU 1.3 — Synthèse des travaux antérieurs

### Légende (AU-DESSUS du tableau)

*Tableau 1.3 — Synthèse des principaux travaux de détection automatique des maladies pulmonaires par réseaux de neurones convolutionnels : architecture utilisée, données d'entraînement, métrique principale et résultat obtenu.*

### Contenu du tableau

| Auteurs | Année | Pathologie | Architecture | Dataset | Métrique | Résultat |
|---|---|---|---|---|---|---|
| Rajpurkar et al. | 2017 | Pneumonie | DenseNet-121 (CheXNet) | ChestX-ray14 (112 000 img.) | F1-score | 0,435 vs 0,387 (radiologues) |
| Kermany et al. | 2018 | Pneumonie | Inception V3 | Kaggle pédiatrique (5 856 img.) | Précision | > 90 % |
| Shih et al. | 2019 | Pneumonie | Divers (challenge) | RSNA 2018 (30 000 img.) | IoU localisation | Variable / top teams > 0,25 IoU |
| Jaeger et al. | 2014 | Tuberculose | — (dataset référence) | Montgomery (138) + Shenzhen (662) | AUC | > 0,99 (travaux ultérieurs) |
| Wang et al. | 2020 | COVID-19 | COVID-Net (custom) | COVIDx (13 975 img.) | Sensibilité | 91,0 % |
| Sethy & Behera | 2020 | COVID-19 | ResNet-50 + SVM | Multi-sources | Précision / Sens. / Spéc. | 95,38 % / 97,2 % / 93,4 % |
| Apostolopoulos & Mpesiana | 2020 | COVID-19 | VGG-19 (transfer learning) | Dataset limité (224 img.) | Sensibilité | 98,75 % |
| Meedeniya et al. | 2022 | Multi-pathologie | Revue (68 études) | Multiple | — | ResNet/VGG/DenseNet dominants |
| Ahmad et al. | 2023 | Multi-pathologie | Revue (46 études) | Multiple | — | CNN ≥ radiologues dans majorité |

### Texte de renvoi
> "Le Tableau 1.3 synthétise les contributions majeures de la littérature, permettant de situer la présente démarche par rapport à l'état de l'art et d'identifier les axes d'amélioration poursuivis."

---

## Récapitulatif — Instructions d'insertion dans Word

| Élément | Type | Placement dans le .docx | Statut |
|---|---|---|---|
| Tableau 1.1 | Tableau Word | Après §COVID-19, section 1.1 | Prêt à copier ✅ |
| Figure 1.1 | 2 images RSNA à insérer | Après §1 de la section 1.2 | À récupérer sur Kaggle ⚠️ |
| Figure 1.2 | Schéma PowerPoint | Après §Litjens 2017, section 1.3 | À créer dans PPT ⚠️ |
| Figure 1.3 | Schéma draw.io/PPT | Après intro section 1.4 | À créer dans PPT/draw.io ⚠️ |
| Tableau 1.2 | Tableau Word | Après §EfficientNet, section 1.4 | Prêt à copier ✅ |
| Tableau 1.3 | Tableau Word | Fin section 1.5 | Prêt à copier ✅ |

---

*Figures conçues par /memoire-figure — 2026-04-04*
