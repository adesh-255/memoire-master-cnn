# CLAUDE.md — Rédaction Mémoire de Master

> **Auteur** : ALAWO Adeshina Néhémiah
> **Niveau** : Master
> **Sujet** : Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques

---

## Contexte du mémoire

### Problématique centrale
Comment développer et évaluer un modèle de réseau de neurones convolutionnels capable de détecter efficacement et de manière fiable les maladies pulmonaires à partir d'images radiographiques, tout en répondant aux contraintes cliniques et éthiques du domaine médical ?

### Hypothèse
Un CNN correctement conçu et entraîné sur un ensemble de données diversifié peut offrir une précision comparable, voire supérieure, à celle des radiologues humains pour la détection des maladies pulmonaires.

### But
Concevoir et évaluer un modèle CNN pour détecter automatiquement les maladies pulmonaires à partir de radiographies thoraciques, afin de contribuer à l'amélioration des soins dans les zones à ressources limitées.

---

## Structure cible du mémoire

```
Dédicaces
Remerciements
Sommaire
Liste des figures
Liste des tableaux
Liste des sigles et abréviations
Résumé / Abstract
│
├── Introduction Générale
│   ├── Contexte
│   ├── Problématique
│   ├── Hypothèse
│   ├── But & Objectifs
│   └── Démarche / Méthodologie
│
├── Chapitre 1 — Revue de littérature
│   ├── Maladies pulmonaires (pneumonie, tuberculose, COVID-19)
│   ├── Radiographie thoracique : utilisation et limites
│   ├── Intelligence artificielle en imagerie médicale
│   ├── Réseaux de neurones convolutionnels (CNN) : principes
│   └── Travaux antérieurs sur la détection automatique
│
├── Chapitre 2 — Matériels et Méthodes
│   ├── Sources de données (ChestX-ray14, COVIDx, autres)
│   ├── Prétraitement des images
│   ├── Architecture CNN choisie (ResNet, VGG, etc.)
│   ├── Stratégie d'entraînement et validation
│   └── Métriques d'évaluation
│
├── Chapitre 3 — Résultats et Discussion
│   ├── Résultats quantitatifs (précision, rappel, F1, AUC)
│   ├── Visualisations (matrices de confusion, courbes ROC)
│   ├── Comparaison avec l'état de l'art
│   ├── Limites du modèle
│   └── Implications cliniques et éthiques
│
└── Conclusion Générale
    ├── Bilan des contributions
    ├── Limites et perspectives
    └── Recommandations
│
Bibliographie
Table des matières
Annexes
```

---

## Objectifs spécifiques

1. Collecter et prétraiter un ensemble de données d'images radiographiques
2. Concevoir et optimiser l'architecture CNN (précision + robustesse)
3. Évaluer les performances : précision, rappel, F1-score, AUC-ROC
4. Comparer avec experts humains et autres approches automatiques
5. Identifier les limites et formuler des recommandations cliniques

---

## Références clés

### Datasets
- **ChestX-ray14** (NIH) — 112 000 images, 14 pathologies
- **COVIDx** — détection COVID-19 sur radiographies
- **RSNA Pneumonia Detection Challenge** dataset
- **Montgomery & Shenzhen** — tuberculose

### Architectures CNN à couvrir
- ResNet-50 / ResNet-152 (apprentissage résiduel)
- VGG-16 / VGG-19
- DenseNet-121 (CheXNet)
- EfficientNet
- Transfer learning depuis ImageNet

### Auteurs/Travaux de référence
- Rajpurkar et al. (2017) — CheXNet (Stanford)
- Wang et al. (2017) — ChestX-ray14
- Sethy & Behera (2020) — COVID-19 detection CNN

---

## Normes de rédaction

### Style
- Langue : **Français académique rigoureux**
- Niveau : Master (argumentation structurée, vocabulaire technique précis)
- Voix : 3ème personne ou "nous" de modestie scientifique
- Paragraphes : idée principale → développement → illustration → transition

### Citations
- Format : **APA 7** ou **IEEE** (à confirmer avec l'encadreur)
- Toute affirmation factuelle doit être sourcée
- Minimum 25-30 références bibliographiques

### Figures & Tableaux
- Numérotés par chapitre : Figure 2.1, Tableau 3.2, etc.
- Légende sous la figure, au-dessus du tableau
- Toujours référencés dans le texte avant apparition

---

## Personas disponibles

| Persona | Commande | Usage |
|---|---|---|
| **Orchestrateur** | `/memoire-orchestrator` | Tâche complexe multi-étapes |
| **Analyste** | `/memoire-analyst` | Diagnostiquer le contenu existant |
| **Planificateur** | `/memoire-planner` | Structurer une section |
| **Chercheur** | `/memoire-researcher` | Sources, articles, stats |
| **Rédacteur** | `/memoire-writer` | Rédiger une section |
| **Humanisateur** | `/memoire-humanizer` | Anti-détection IA |
| **Relecteur** | `/memoire-reviewer` | Qualité académique finale |
| **Figuriste** | `/memoire-figure` | Schémas, tableaux, visuels |

### Workflow recommandé
```
orchestrator → analyst → researcher → planner → writer → figure → humanizer → reviewer
```
