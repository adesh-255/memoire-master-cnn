# Figures et tableaux du Chapitre 2

> **Mémoire :** Détection des maladies pulmonaires par CNN
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 (2026-04-06)
> **Statut :** Prêt à insérer dans le .docx

---

## TABLEAU 2.1 : Récapitulatif des datasets

### Légende (AU-DESSUS du tableau)

*Tableau 2.1 : Bases de données radiographiques retenues : origine, population, effectifs par classe, type d'annotation et tâches de classification qu'elles alimentent.*

### Contenu

| Base | Origine | Population | Effectifs par classe | Annotation | Tâche(s) |
|---|---|---|---|---|---|
| Kermany et al. (2018) | Guangzhou Women and Children's Medical Center (Chine) | Enfants de 1 à 5 ans | 1 583 normales · 2 780 pneumonies bactériennes · 1 493 pneumonies virales | Médecins experts, contrôle par un 3ᵉ lecteur | Pneumonie ; bactérienne vs virale |
| Montgomery (Jaeger et al., 2014) | Comté de Montgomery, Maryland (États-Unis) | Adultes | 80 normales · 58 tuberculoses | Cliniciens, diagnostic confirmé | Tuberculose |
| Shenzhen (Jaeger et al., 2014) | Shenzhen No. 3 People's Hospital (Chine) | Adultes | 326 normales · 336 tuberculoses | Cliniciens, diagnostic confirmé | Tuberculose |
| **Total** |  |  | **6 656 radiographies** |  | 3 tâches binaires |

**Note de bas de tableau :** effectifs issus de la documentation des auteurs ; ils sont vérifiés à l'exécution du notebook. Bases écartées (cf. § 2.1) : ChestX-ray14, CheXpert, RSNA 2018, COVIDx.

### Texte de renvoi
> "Le Tableau 2.1 synthétise les caractéristiques des bases retenues, précisant leur origine, la population représentée, les effectifs par classe et les tâches de classification qu'elles alimentent."

---

## TABLEAU 2.2 : Répartition des données par tâche et par ensemble

### Légende (AU-DESSUS du tableau)

*Tableau 2.2 : Effectifs des ensembles d'entraînement, de validation et de test pour chaque tâche, après partitionnement au niveau patient (70 / 15 / 15 %, stratifié par classe).*

### Contenu

Source : `memoire_resultats/repartition_donnees.csv` (exécution du 2026-10-06).

| Tâche | Ensemble | Patients | Images | Négatifs | Positifs |
|---|---|---|---|---|---|
| Pneumonie (normal / pneumonie) | Entraînement | 1 952 | 4 085 | 1 107 | 2 978 |
| | Validation | 419 | 846 | 224 | 622 |
| | Test | 419 | 925 | 252 | 673 |
| Tuberculose (normal / tuberculose) | Entraînement | 559 | 559 | 284 | 275 |
| | Validation | 121 | 121 | 61 | 60 |
| | Test | 120 | 120 | 61 | 59 |
| Bactérienne / virale | Entraînement | 1 171 | 3 008 | 1 960 | 1 048 |
| | Validation | 251 | 619 | 404 | 215 |
| | Test | 252 | 646 | 416 | 230 |

**Note de bas de tableau :** pour la sous-tâche étiologique, les négatifs sont les pneumonies bactériennes et les positifs les pneumonies virales. La répartition est faite sur les patients (70 / 15 / 15 %) ; les proportions d'images varient légèrement car un patient peut avoir plusieurs radiographies.

### Texte de renvoi
> "Les effectifs obtenus pour chaque tâche sont détaillés dans le Tableau 2.2."

---

## FIGURE 2.1 : Pipeline de prétraitement

### Schéma (à reproduire dans PowerPoint)

```
PIPELINE DE PRÉTRAITEMENT DES IMAGES RADIOGRAPHIQUES
══════════════════════════════════════════════════════════════════════

┌─────────────────┐
│  IMAGE BRUTE    │  Taille variable (quelques centaines à ~5 000 px de côté)
│  (dataset brut) │  8 bits ou plus (Montgomery), contraste hétérogène
└────────┬────────┘
         ↓
┌─────────────────────────────┐
│  NIVEAUX DE GRIS 8 BITS     │  Normalisation min-max si codage > 8 bits
│  + CACHE 256 × 256          │  Interpolation de Lanczos (calcul unique)
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  REDIMENSIONNEMENT          │  → 224 × 224 pixels
│  (Resize)                   │     (standard DenseNet-121 / ImageNet)
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  CONVERSION 3 CANAUX        │  Niveaux de gris → RGB
│  (Channel duplication)      │     Duplication du canal unique × 3
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  NORMALISATION              │  μ = [0.485, 0.456, 0.406]
│  (ImageNet stats)           │  σ = [0.229, 0.224, 0.225]
└────────┬────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  AUGMENTATION DE DONNÉES (train uniquement)         │
│  • Rotation aléatoire  ±15°                         │
│  • Retournement horizontal (flip)                   │
│  • Zoom aléatoire  ×[0,9 – 1,1]                    │
│  • Ajustement luminosité/contraste  ±20 %           │
│  • Découpage aléatoire (random crop, 85–100 %)      │
└────────┬────────────────────────────────────────────┘
         ↓
┌─────────────────────────────┐
│  CONSTITUTION DES BATCHS    │  Batch size = 32 images
│  (DataLoader)               │  Mélange aléatoire (shuffle=True)
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  MODÈLE CNN (DenseNet-121)  │
└─────────────────────────────┘

⚠️  L'augmentation est appliquée UNIQUEMENT aux données d'entraînement.
    Les données de validation et de test reçoivent uniquement
    le redimensionnement et la normalisation.
══════════════════════════════════════════════════════════════════════
```

### Instructions PowerPoint
- 6 boîtes rectangulaires arrondies verticales, reliées par flèches ↓
- **Gris clair** : image brute | **Bleu clair** : standardisation (×3 blocs) | **Orange** : augmentation | **Bleu foncé** : batch + CNN
- Encadré orange hachuré avec note "train uniquement"
- Largeur : 12 cm, centré sur la page

### Légende (SOUS la figure)
*Figure 2.1 : Pipeline de prétraitement appliqué aux images radiographiques avant entraînement du modèle. Les étapes de redimensionnement, conversion et normalisation sont appliquées à toutes les partitions (entraînement, validation, test) ; l'augmentation de données est réservée aux données d'entraînement afin de ne pas biaiser l'évaluation. Conception personnelle, 2026.*

### Texte de renvoi
> "La Figure 2.1 présente l'ensemble du pipeline de prétraitement, depuis l'image radiographique brute jusqu'au batch normalisé et augmenté soumis au modèle CNN."

---

## FIGURE 2.2 : Architecture DenseNet-121 adaptée

### Schéma (à reproduire dans PowerPoint/draw.io)

```
ARCHITECTURE DENSENET-121 ADAPTÉE À LA CLASSIFICATION THORACIQUE
═══════════════════════════════════════════════════════════════════

 ┌──────────────────────────────────────┐
 │  POIDS PRÉ-ENTRAÎNÉS (ImageNet)      │  1,2 M images / 1 000 classes
 │  DenseNet-121 base                   │  ← GELÉS en Phase 1
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [BLEU FONCÉ]
 │  Convolution initiale                │
 │  Conv2D 7×7, stride 2, 64 filtres   │  → 112×112×64
 │  + BatchNorm + ReLU + MaxPool        │  → 56×56×64
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [BLEU]
 │  DENSE BLOCK 1  (6 couches)          │
 │  Connexions denses : chaque couche   │
 │  reçoit les outputs de TOUTES        │  Growth rate k = 32
 │  les couches précédentes             │  → 56×56×256
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [GRIS]
 │  TRANSITION LAYER 1                  │
 │  Conv 1×1 + AvgPool 2×2             │  → 28×28×128
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [BLEU]
 │  DENSE BLOCK 2  (12 couches)         │  → 28×28×512
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [GRIS]
 │  TRANSITION LAYER 2                  │  → 14×14×256
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [BLEU]
 │  DENSE BLOCK 3  (24 couches)         │  → 14×14×1024
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [GRIS]
 │  TRANSITION LAYER 3                  │  → 7×7×512
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [BLEU]
 │  DENSE BLOCK 4  (16 couches)         │  → 7×7×1024
 │  + BatchNorm finale + ReLU           │  (cartes utilisées par Grad-CAM)
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [GRIS]
 │  GLOBAL AVERAGE POOLING              │  7×7×1024 → 1×1×1024
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [ORANGE] ← COUCHES AJOUTÉES
 │  DROPOUT  (p = 0,5)                  │  Régularisation
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐  [ROUGE]
 │  FC (1 neurone)                      │  1 024 → 1  (1 025 paramètres)
 └─────────────────┬────────────────────┘
                   ↓
 ┌──────────────────────────────────────┐
 │  Sigmoïde → probabilité pathologique │  décision : seuil fixé en validation
 └──────────────────────────────────────┘

  LÉGENDE COULEURS :
  [BLEU]   = Couches DenseNet pré-entraînées (ImageNet)
  [ORANGE] = Couches ajoutées / remplacées
  [ROUGE]  = Couche de classification finale
  Phase 1 : [ORANGE]+[ROUGE] entraînées uniquement (lr = 1e-4)
  Phase 2 (lr = 1e-5) : Dense Block 4 + BatchNorm finale dès l'époque 1,
           puis Transition 3 + Dense Block 3 dès l'époque 6
           Dense Blocks 1-2 restent gelés
═══════════════════════════════════════════════════════════════════
```

### Instructions PowerPoint/draw.io
- Blocs arrondis : bleu (DenseNet), orange (ajouté), rouge (sortie)
- Flèches bidirectionnelles internes dans les Dense Blocks (connexions denses)
- Dimensions annotées à droite de chaque bloc
- Encadré pointillé autour de la base : "Poids ImageNet gelés (Phase 1)"
- Format portrait, largeur 10 cm

### Légende (SOUS la figure)
*Figure 2.2 : Architecture DenseNet-121 adaptée à la classification de radiographies thoraciques. Les blocs en bleu correspondent aux couches pré-entraînées sur ImageNet ; les couches en orange et rouge sont ajoutées et entraînées pour la tâche médicale. Transfer learning en deux phases : extraction de features (Phase 1, base gelée), puis fine-tuning progressif (Phase 2). Adapté de Huang et al. (2017) et Rajpurkar et al. (2017). Conception personnelle, 2026.*

### Texte de renvoi
> "La Figure 2.2 illustre l'architecture DenseNet-121 adaptée, distinguant les couches pré-entraînées sur ImageNet (bleu) des couches ajoutées pour la classification des pathologies pulmonaires (orange et rouge)."

---

## FIGURE 2.3 : Partitionnement des données

### Schéma (à reproduire dans PowerPoint)

```
PARTITIONNEMENT DES DONNÉES : SÉPARATION AU NIVEAU PATIENT
═══════════════════════════════════════════════════════════════════

 ┌────────────────────────────────────────────────────────────┐
 │                    CORPUS TOTAL                            │
 │   Pour chaque tâche : N patients (voir Tableau 2.2)        │
 │      Stratification par classe (proportions conservées)    │
 └─────────────┬──────────────────┬──────────────┬────────────┘
               │                  │              │
       ┌───────▼──────┐   ┌───────▼──────┐  ┌───▼──────────┐
       │ ENTRAÎNEMENT │   │  VALIDATION  │  │     TEST     │
       │    70 %      │   │    15 %      │  │    15 %      │
       │              │   │              │  │              │
       │  N_train     │   │   N_val      │  │   N_test     │
       │  patients    │   │   patients   │  │   patients   │
       └──────┬───────┘   └──────┬───────┘  └──────┬───────┘
              ↓                  ↓                  ↓
     ┌────────────────┐  ┌───────────────┐  ┌──────────────────┐
     │  Optimisation  │  │  Ajustement   │  │   Évaluation     │
     │  des poids du  │  │  hyperpa-     │  │   FINALE         │
     │  modèle        │  │  ramètres     │  │   (utilisé UNE   │
     │  (rétropropa-  │  │  Early        │  │   SEULE fois,    │
     │  gation)       │  │  Stopping     │  │   à la fin du    │
     └────────────────┘  └───────────────┘  │   protocole)     │
                                            └──────────────────┘

⚠️  Séparation STRICTE au niveau patient :
    toutes les images d'un même patient → même partition
    → prévention de la fuite d'information (data leakage)
═══════════════════════════════════════════════════════════════════
```

### Instructions PowerPoint
- 1 grande boîte en haut (corpus total, gris)
- 3 boîtes en bas : **bleu** (70% train) | **orange** (15% val) | **vert** (15% test)
- Flèches vers usages respectifs
- Note rouge encadrée en bas : "Séparation au niveau patient, prévention du data leakage"
- Format paysage, pleine largeur

### Légende (SOUS la figure)
*Figure 2.3 : Schéma de partitionnement du corpus de données en sous-ensembles d'entraînement (70 %), de validation (15 %) et de test (15 %). La séparation est effectuée au niveau patient afin de prévenir toute fuite d'information (data leakage). La stratification par classe garantit le respect des proportions originales dans chaque sous-ensemble. Conception personnelle, 2026.*

### Texte de renvoi
> "La Figure 2.3 illustre le schéma de partitionnement adopté, soulignant la séparation stricte au niveau patient entre les trois sous-ensembles et les usages distincts qui leur sont assignés."

---

## FIGURE 2.4 : Courbe ROC (placeholder)

### Code Python Matplotlib (à exécuter après expérimentation)

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(6, 6))

# Diagonale aléatoire
ax.plot([0, 1], [0, 1], 'k--', lw=1.5, label='Aléatoire (AUC = 0.50)')

# Zone placeholder
ax.fill_between([0, 1], [0, 1], alpha=0.08, color='gray')
ax.text(0.5, 0.45, '[Courbe du modèle\nà compléter après\nexpérimentation]',
        ha='center', va='center', fontsize=11, color='gray', style='italic',
        bbox=dict(boxstyle='round', facecolor='white', alpha=0.7))

# Annotation AUC
ax.text(0.72, 0.12, 'AUC = [?]', fontsize=12, fontweight='bold',
        bbox=dict(boxstyle='round', facecolor='lightyellow',
                  edgecolor='gray', linestyle='--'))

ax.set_xlabel("Taux de Faux Positifs (1 − Spécificité)", fontsize=12)
ax.set_ylabel("Sensibilité (Rappel)", fontsize=12)
ax.set_title("Courbe ROC : détection de la pneumonie", fontsize=13)
ax.set_xlim([0, 1]); ax.set_ylim([0, 1])
ax.legend(loc='lower right', fontsize=10)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("figure_2_4_roc_placeholder.png", dpi=300)
```

### Légende (SOUS la figure)
*Figure 2.4 : Courbe ROC (Receiver Operating Characteristic) du modèle DenseNet-121 pour la tâche de détection de pneumonie (placeholder, valeurs à compléter après expérimentation). L'axe des abscisses représente le taux de faux positifs (1 − Spécificité) ; l'axe des ordonnées représente la sensibilité. La diagonale en pointillés correspond à une classification aléatoire (AUC = 0,50) ; une courbe idéale se rapprocherait du coin supérieur gauche (AUC = 1,0).*

### Texte de renvoi
> "La Figure 2.4 présente la structure de la courbe ROC produite à l'issue de l'expérimentation, permettant d'évaluer la capacité discriminante du modèle pour l'ensemble des seuils de classification."

---

## FIGURE 2.5 : Matrice de confusion (placeholder)

### Structure (tableau Word/Excel)

```
MATRICE DE CONFUSION : CLASSIFICATION BINAIRE (placeholder)
═══════════════════════════════════════════════════════════════

                         PRÉDICTION DU MODÈLE
                    ┌──────────────┬──────────────┐
                    │   POSITIF    │   NÉGATIF    │
                    │ (Patholog.)  │   (Normal)   │
    ┌───────────────┼──────────────┼──────────────┤
    │   POSITIF     │     TP       │     FN       │
    │  (Patholog.)  │  Vrais +     │  Faux −      │
 R  │               │  [VERT FONCÉ]│  [ROUGE]     │
 É  │               │  N = [?]     │  N = [?]     │
 E  ├───────────────┼──────────────┼──────────────┤
 L  │   NÉGATIF     │     FP       │     TN       │
    │   (Normal)    │  Faux +      │  Vrais −     │
    │               │  [ORANGE]    │  [VERT CLAIR]│
    │               │  N = [?]     │  N = [?]     │
    └───────────────┴──────────────┴──────────────┘

CODES COULEUR Word/Excel :
  TP [VERT FONCÉ]  : #1a7a4a, texte blanc, bold
  TN [VERT CLAIR]  : #c8e6c9, texte noir
  FP [ORANGE]      : #ff9800, texte blanc
  FN [ROUGE FONCÉ] : #c62828, texte blanc, bold

INTERPRÉTATION :
  TP : malades correctement détectés → traitement possible ✓
  TN : sains correctement identifiés → pas d'alarme inutile ✓
  FN : ⚠️ CRITIQUE : malades non détectés → risque clinique grave
  FP : sains alarmés à tort → examens complémentaires injustifiés
═══════════════════════════════════════════════════════════════
```

### Légende (SOUS la figure)
*Figure 2.5 : Structure de la matrice de confusion pour la classification binaire (normal / pathologique). Les cases diagonales (TP en vert foncé, TN en vert clair) indiquent les prédictions correctes ; les cases hors diagonale (FP en orange, FN en rouge) indiquent les erreurs. Les faux négatifs (FN) constituent l'erreur la plus critique en contexte médical. Les valeurs numériques seront complétées à l'issue de l'expérimentation. Conception personnelle, 2026.*

### Texte de renvoi
> "La Figure 2.5 présente la structure de la matrice de confusion mobilisée pour l'évaluation, en distinguant les quatre types de résultats possibles et leur interprétation clinique respective."

---

## Récapitulatif : instructions d'insertion dans Word

| Élément | Type | Placement dans le .docx | Statut |
|---|---|---|---|
| Tableau 2.1 | Tableau Word | Fin § Bases retenues, section 2.1 | ✅ Prêt à copier |
| Tableau 2.2 | Tableau Word | Après Figure 2.3, section 2.4 | ✅ Valeurs définitives |
| Figure 2.1 | Schéma PowerPoint | Fin section 2.2 | ⚠️ À créer dans PPT |
| Figure 2.2 | Schéma PowerPoint/draw.io | Après §adaptation, section 2.3 | ⚠️ À créer dans PPT |
| Figure 2.3 | Schéma PowerPoint | Après §partitionnement, section 2.4 | ⚠️ À créer dans PPT |
| Figure 2.4 | Graphique Matplotlib (placeholder) | Section 2.5, après §AUC | ⚠️ Code Python fourni |
| Figure 2.5 | Tableau Word coloré (placeholder) | Section 2.5, après §matrice confusion | ⚠️ À créer dans Word |

---

*Figures conçues par /memoire-figure (2026-04-06)*
