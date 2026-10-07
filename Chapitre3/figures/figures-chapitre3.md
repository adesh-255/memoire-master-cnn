# Figures et tableaux du Chapitre 3

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN)
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 2.0 (2026-10-06)
> **Source des données :** `memoire_resultats/` (exécution du 2026-10-06). Les figures sont produites par le notebook `Experimentation/memoire_cnn_colab.ipynb` en 300 dpi.

---

## TABLEAU 3.1 : Métriques de performance par tâche

**Position :** section 3.1, après le premier paragraphe.

### Légende (au-dessus du tableau)

*Tableau 3.1 : Performances des trois modèles DenseNet-121 sur leur ensemble de test (partitionnement par patient, 15 % du corpus de chaque tâche). Seuil de décision fixé sur l'ensemble de validation (indice de Youden). Entre crochets : intervalle de confiance à 95 % (bootstrap, 1 000 tirages).*

### Contenu

| Tâche | Précision | Rappel (sensibilité) | Spécificité | F1-score | AUC | Images de test |
|---|---|---|---|---|---|---|
| Pneumonie | 0,994 [0,988 ; 0,998] | 0,966 [0,950 ; 0,979] | 0,984 [0,968 ; 0,996] | 0,980 [0,971 ; 0,987] | 0,996 [0,993 ; 0,998] | 925 |
| Tuberculose | 0,821 [0,717 ; 0,912] | 0,780 [0,662 ; 0,879] | 0,836 [0,738 ; 0,922] | 0,800 [0,710 ; 0,870] | 0,886 [0,816 ; 0,942] | 120 |
| Pneumonie bactérienne ou virale | 0,668 [0,614 ; 0,724] | 0,770 [0,714 ; 0,823] | 0,788 [0,747 ; 0,826] | 0,715 [0,667 ; 0,758] | 0,843 [0,809 ; 0,873] | 646 |
| Moyenne (pneumonie et tuberculose) | 0,908 | 0,873 | 0,910 | 0,890 | 0,941 | 1 045 |
| *Référence : CheXNet (Rajpurkar et al., 2017), ChestX-ray14* | | | | *0,435* | *0,768* | |

**Note de bas de tableau :** pour la sous-tâche étiologique, la classe positive est la pneumonie virale. La ligne CheXNet porte sur une tâche différente (pneumonie parmi 14 pathologies, adultes, étiquettes extraites automatiquement) ; elle est donnée comme repère historique, pas comme comparaison directe. Source : conception personnelle, 2026.

Fichier : `memoire_resultats/tableau3_1.csv`

### Texte de renvoi
> « Le Tableau 3.1 rassemble les cinq indicateurs retenus, chacun accompagné de son intervalle de confiance à 95 % obtenu par bootstrap. »

---

## FIGURE 3.1 : Courbes d'apprentissage

**Fichier :** `memoire_resultats/figure3_1_courbes_apprentissage.png` · **Position :** section 3.1, après le paragraphe sur la moyenne · **Format :** pleine largeur, portrait

### Légende (sous la figure)

*Figure 3.1 : Courbes d'apprentissage des trois modèles. À gauche, perte (entropie croisée binaire pondérée) ; à droite, exactitude, sur les ensembles d'entraînement (trait plein) et de validation (tirets). Le pointillé vert marque le début du fine-tuning (phase 2), le pointillé rouge l'époque dont les poids ont été retenus. Source : conception personnelle, 2026.*

### Texte de renvoi
> « Les courbes d'apprentissage (Figure 3.1) éclairent ces écarts. »

---

## FIGURE 3.2 : Matrices de confusion

**Fichier :** `memoire_resultats/figure3_2_matrices_confusion.png` · **Position :** section 3.2, après le premier paragraphe · **Format :** pleine largeur, paysage dans la page

### Légende (sous la figure)

*Figure 3.2 : Matrices de confusion des trois modèles sur leur ensemble de test, au seuil fixé en validation. Chaque case indique l'effectif et, entre parenthèses, la proportion de la classe réelle. Source : conception personnelle, 2026.*

| Tâche | VP | FP | FN | VN |
|---|---|---|---|---|
| Pneumonie | 650 | 4 | 23 | 248 |
| Tuberculose | 46 | 10 | 13 | 51 |
| Bactérienne ou virale | 177 | 88 | 53 | 328 |

### Texte de renvoi
> « Les matrices de confusion (Figure 3.2) montrent que le modèle de pneumonie commet surtout des faux négatifs. »

---

## FIGURE 3.3 : Courbes ROC

**Fichier :** `memoire_resultats/figure3_3_courbes_roc.png` · **Position :** section 3.2, avant le dernier paragraphe · **Format :** carré, 12 cm

### Légende (sous la figure)

*Figure 3.3 : Courbes ROC des trois modèles sur leur ensemble de test, avec l'AUC et son intervalle de confiance à 95 %. Le point indique le seuil de décision retenu sur la validation ; la diagonale correspond à un classement aléatoire. Source : conception personnelle, 2026.*

### Texte de renvoi
> « Les courbes ROC (Figure 3.3) résument cette hiérarchie. »

---

## TABLEAU 3.2 : Comparaison avec l'état de l'art

**Position :** section 3.3, après le premier paragraphe.

### Légende (au-dessus du tableau)

*Tableau 3.2 : Comparaison avec les travaux de référence. Les études n'utilisent ni les mêmes données ni les mêmes partitions : les écarts sont des ordres de grandeur, pas un classement.*

### Contenu

| Étude | Architecture | Données | Tâche | Résultats rapportés |
|---|---|---|---|---|
| **Ce travail (2026)** | **DenseNet-121** | **Kermany, 5 856 images, partition par patient 70/15/15** | **Pneumonie** | **Exactitude 97,1 % ; sensibilité 96,6 % ; spécificité 98,4 % ; AUC 0,996** |
| Kermany et al. (2018) | Inception V3 (transfert) | Kermany, test officiel de 624 images | Pneumonie | Exactitude 92,8 % ; sensibilité 93,2 % ; spécificité 90,1 % ; AUC 0,968 |
| **Ce travail (2026)** | **DenseNet-121** | **Kermany, images de pneumonie** | **Bactérienne ou virale** | **Exactitude 78,2 % ; AUC 0,843** |
| Kermany et al. (2018) | Inception V3 (transfert) | Kermany | Bactérienne ou virale | Exactitude 90,7 % |
| Rajpurkar et al. (2017), CheXNet | DenseNet-121 | ChestX-ray14, 112 120 images | Pneumonie parmi 14 pathologies | F1 0,435 (radiologues : 0,387) ; AUC 0,768 |
| **Ce travail (2026)** | **DenseNet-121** | **Montgomery + Shenzhen, 800 images** | **Tuberculose** | **Exactitude 80,8 % ; sensibilité 78,0 % ; spécificité 83,6 % ; AUC 0,886** |
| Lakhani & Sundaram (2017) | Ensemble AlexNet + GoogLeNet | 4 jeux, 1 007 images (dont Montgomery et Shenzhen) | Tuberculose | AUC 0,99 |
| Ahmad et al. (2023), revue de 46 études | Diverses | Diverses | Radiographie thoracique | AUC de 0,87 à 0,96 |

**Note de bas de tableau :** l'architecture Inception V3 de Kermany et al. (2018) et le détail de leurs métriques sont à vérifier dans l'article original avant dépôt. Source : conception personnelle, 2026, d'après les publications citées.

### Texte de renvoi
> « Le Tableau 3.2 rassemble les références les plus proches de notre travail ; il faut le lire comme un ordre de grandeur, pas comme un classement. »

---

## FIGURE 3.4 : Cartes Grad-CAM

**Fichier :** `memoire_resultats/figure3_4_gradcam.png` · **Position :** section 3.4, après le deuxième paragraphe · **Format :** pleine largeur, grille 2 × 2

### Légende (sous la figure)

*Figure 3.4 : Cartes Grad-CAM du modèle DenseNet-121 pour la pneumonie (en haut) et la tuberculose (en bas). À gauche, un vrai positif représentatif (score médian des vrais positifs) ; à droite, le faux négatif le plus net (score le plus faible parmi les cas pathologiques). Du bleu au rouge : contribution croissante de la région à la décision. Cas choisis selon une règle fixée avant l'examen des cartes. Source : conception personnelle, 2026, d'après la méthode de Selvaraju et al. (2017).*

| Cas | Patient | Score | Lecture |
|---|---|---|---|
| Pneumonie, VP | person402 | 1,00 | Activation dans l'angle supérieur droit, hors des champs pulmonaires |
| Pneumonie, FN | person813 | 0,00 | Activation limitée à l'angle inférieur droit ; morphologie évoquant un adolescent ou un adulte |
| Tuberculose, VP | CHNCXR_0327 | 0,78 | Activation bilatérale, champs moyens et hiles |
| Tuberculose, FN | CHNCXR_0604 | 0,02 | Pas d'activation significative |

### Texte de renvoi
> « La Figure 3.4 présente, pour la pneumonie et la tuberculose, un vrai positif représentatif et le faux négatif le plus net. »

---

## ANNEXE : Galerie Grad-CAM

**Fichiers :** `memoire_resultats/{pneumonie,tuberculose,bacterien_viral}/gradcam_galerie/` (6 VP et 6 FN par tâche ; nom de fichier = type, score, patient).

À insérer en annexe sous forme de planche, avec la légende : *Galerie de cartes Grad-CAM : six vrais positifs répartis sur l'éventail des scores et les six faux négatifs les plus nets, par tâche.*

---

## Récapitulatif

| Élément | Section | Fichier | Statut |
|---|---|---|---|
| Tableau 3.1 | 3.1 | `tableau3_1.csv` | ✅ Valeurs définitives |
| Figure 3.1 | 3.1 | `figure3_1_courbes_apprentissage.png` | ✅ |
| Figure 3.2 | 3.2 | `figure3_2_matrices_confusion.png` | ✅ |
| Figure 3.3 | 3.2 | `figure3_3_courbes_roc.png` | ✅ |
| Tableau 3.2 | 3.3 | (tableau Word) | ✅ À recopier ; une vérification à faire (note) |
| Figure 3.4 | 3.4 | `figure3_4_gradcam.png` | ✅ |
| Galerie | Annexe | `*/gradcam_galerie/` | ⏳ Planche à composer |
