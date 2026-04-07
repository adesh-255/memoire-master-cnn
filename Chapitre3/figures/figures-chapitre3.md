# Figures et Tableaux — Chapitre 3 : Résultats et Discussion

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN)
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 — 2026-04-06

---

## TABLEAU 3.1 — Métriques de performance par pathologie

**Type** : Tableau de résultats quantitatifs
**Chapitre cible** : Chap. 3 — Section 3.1 Résultats quantitatifs
**Position recommandée** : Après le premier paragraphe de la section 3.1

### Contenu du tableau

| Pathologie | Précision | Rappel (Sensibilité) | Spécificité | F1-score | AUC |
|---|---|---|---|---|---|
| Pneumonie | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] |
| Tuberculose | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] |
| COVID-19 | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] |
| **Moyenne globale** | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] | [À COMPLÉTER] |
| *Référence : CheXNet (Rajpurkar et al., 2017)* | *—* | *—* | *—* | *0,435* | *0,841* |

**Note de bas de tableau :** Les valeurs de la colonne « Référence » correspondent aux performances de CheXNet sur la tâche de détection de pneumonie (ChestX-ray14). La revue systématique d'Ahmad et al. (2023) établit une plage de référence AUC de 0,87 à 0,96 pour les modèles de deep learning sur des datasets de radiographies thoraciques. Valeurs propres au modèle à renseigner à l'issue de la phase d'expérimentation.

### Légende

**Tableau 3.1 :** Performances du modèle DenseNet-121 par pathologie sur l'ensemble de test (partitionnement au niveau patient, 15 % du corpus total). Métriques rapportées : précision (*precision*), rappel (*recall* / sensibilité), spécificité, F1-score et aire sous la courbe ROC (AUC). La ligne de référence (CheXNet, Rajpurkar et al., 2017) est fournie à titre de benchmark ; les valeurs correspondent à la tâche de détection de pneumonie sur ChestX-ray14.
Source : Conception personnelle, 2026 — valeurs expérimentales [À COMPLÉTER]

### Texte de renvoi suggéré

"Les résultats quantitatifs obtenus sur l'ensemble de test sont synthétisés dans le Tableau 3.1, qui récapitule les cinq métriques d'évaluation retenues pour chacune des trois pathologies cibles, ainsi que la moyenne globale du modèle."

### Notes de mise en page

- Format : tableau pleine largeur, portrait
- Logiciel : Word (tableau natif) ou LaTeX (package `booktabs`)
- La ligne de référence CheXNet doit être visuellement distinguée (italique ou gris clair)
- Aligner les valeurs numériques sur le point décimal

---

## FIGURE 3.1 — Courbes d'apprentissage

**Type** : Graphique (2 sous-graphes côte à côte)
**Chapitre cible** : Chap. 3 — Section 3.1 Résultats quantitatifs
**Position recommandée** : Après l'analyse des résultats du Tableau 3.1, avant la section 3.2

### Contenu de la figure

Deux sous-graphes côte à côte sur la même figure :
- **Gauche** : Courbe de perte (*loss*) — entraînement (bleu) et validation (orange) sur 50 époques max
- **Droite** : Courbe de précision (*accuracy*) — entraînement (bleu) et validation (orange) sur 50 époques max
- Axe X : Époques (0 à N, N = époque d'arrêt effectif)
- Axe Y gauche : Valeur de perte (Binary Cross-Entropy)
- Axe Y droit : Précision (0,0 à 1,0)
- Marqueur vertical pointillé rouge : point d'Early Stopping
- Marqueur vertical pointillé vert : transition phase 1 → phase 2 (début du fine-tuning)

### Code Python (Matplotlib)

```python
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

def plot_learning_curves(history_phase1, history_phase2, early_stop_epoch, save_path=None):
    """
    Trace les courbes d'apprentissage (loss + accuracy) sur les deux phases de transfer learning.
    
    Paramètres :
        history_phase1 : dict avec clés 'loss', 'val_loss', 'accuracy', 'val_accuracy' (phase 1)
        history_phase2 : dict avec clés 'loss', 'val_loss', 'accuracy', 'val_accuracy' (phase 2)
        early_stop_epoch : int — époque effective d'arrêt (Early Stopping)
        save_path : str ou None — chemin pour sauvegarder la figure
    """
    # Concaténation des deux phases
    n1 = len(history_phase1['loss'])
    epochs_p1 = np.arange(1, n1 + 1)
    epochs_p2 = np.arange(n1 + 1, n1 + len(history_phase2['loss']) + 1)
    epochs_all = np.concatenate([epochs_p1, epochs_p2])

    loss_train = np.concatenate([history_phase1['loss'], history_phase2['loss']])
    loss_val   = np.concatenate([history_phase1['val_loss'], history_phase2['val_loss']])
    acc_train  = np.concatenate([history_phase1['accuracy'], history_phase2['accuracy']])
    acc_val    = np.concatenate([history_phase1['val_accuracy'], history_phase2['val_accuracy']])

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.suptitle("Courbes d'apprentissage — DenseNet-121 (Transfer Learning)", fontsize=13, fontweight='bold')

    # --- Sous-graphe 1 : Loss ---
    ax1 = axes[0]
    ax1.plot(epochs_all, loss_train, label='Perte entraînement', color='#2196F3', linewidth=2)
    ax1.plot(epochs_all, loss_val,   label='Perte validation',   color='#FF9800', linewidth=2, linestyle='--')
    ax1.axvline(x=n1, color='#4CAF50', linestyle=':', linewidth=1.8, label='Début fine-tuning (phase 2)')
    ax1.axvline(x=early_stop_epoch, color='#F44336', linestyle=':', linewidth=1.8, label='Early Stopping')
    ax1.set_xlabel('Époques', fontsize=11)
    ax1.set_ylabel('Perte (Binary Cross-Entropy)', fontsize=11)
    ax1.set_title('Perte (Loss)', fontsize=12)
    ax1.legend(fontsize=9)
    ax1.grid(True, alpha=0.3)

    # Zone phase 1 / phase 2
    ax1.axvspan(1, n1, alpha=0.05, color='#4CAF50', label='_nolegend_')
    ax1.axvspan(n1, epochs_all[-1], alpha=0.05, color='#9C27B0', label='_nolegend_')
    ax1.text(n1 / 2, ax1.get_ylim()[1] * 0.95, 'Phase 1\n(Feature extraction)',
             ha='center', va='top', fontsize=8, color='#2E7D32')
    ax1.text(n1 + (epochs_all[-1] - n1) / 2, ax1.get_ylim()[1] * 0.95, 'Phase 2\n(Fine-tuning)',
             ha='center', va='top', fontsize=8, color='#6A1B9A')

    # --- Sous-graphe 2 : Accuracy ---
    ax2 = axes[1]
    ax2.plot(epochs_all, acc_train, label='Précision entraînement', color='#2196F3', linewidth=2)
    ax2.plot(epochs_all, acc_val,   label='Précision validation',   color='#FF9800', linewidth=2, linestyle='--')
    ax2.axvline(x=n1, color='#4CAF50', linestyle=':', linewidth=1.8, label='Début fine-tuning (phase 2)')
    ax2.axvline(x=early_stop_epoch, color='#F44336', linestyle=':', linewidth=1.8, label='Early Stopping')
    ax2.set_xlabel('Époques', fontsize=11)
    ax2.set_ylabel('Précision', fontsize=11)
    ax2.set_title('Précision (Accuracy)', fontsize=12)
    ax2.set_ylim([0.5, 1.0])
    ax2.legend(fontsize=9)
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Figure sauvegardée : {save_path}")

    plt.show()


# --- Données placeholder (à remplacer par les résultats réels) ---
# Simuler 20 époques pour phase 1 et 15 pour phase 2
np.random.seed(42)
n_p1, n_p2 = 20, 15

history_p1 = {
    'loss':         np.linspace(0.65, 0.32, n_p1) + np.random.normal(0, 0.02, n_p1),
    'val_loss':     np.linspace(0.67, 0.35, n_p1) + np.random.normal(0, 0.025, n_p1),
    'accuracy':     np.linspace(0.60, 0.86, n_p1) + np.random.normal(0, 0.015, n_p1),
    'val_accuracy': np.linspace(0.58, 0.84, n_p1) + np.random.normal(0, 0.02, n_p1),
}
history_p2 = {
    'loss':         np.linspace(0.32, 0.22, n_p2) + np.random.normal(0, 0.015, n_p2),
    'val_loss':     np.linspace(0.35, 0.25, n_p2) + np.random.normal(0, 0.018, n_p2),
    'accuracy':     np.linspace(0.86, 0.91, n_p2) + np.random.normal(0, 0.01, n_p2),
    'val_accuracy': np.linspace(0.84, 0.89, n_p2) + np.random.normal(0, 0.012, n_p2),
}

plot_learning_curves(
    history_phase1=history_p1,
    history_phase2=history_p2,
    early_stop_epoch=n_p1 + n_p2 - 2,  # Early Stopping 2 époques avant la fin
    save_path='figure3_1_courbes_apprentissage.png'
)
```

### Légende

**Figure 3.1 :** Courbes d'apprentissage du modèle DenseNet-121 au cours des deux phases d'entraînement. Le graphe de gauche représente l'évolution de la perte (Binary Cross-Entropy) sur les ensembles d'entraînement (bleu) et de validation (orange) ; le graphe de droite représente la précision correspondante. Le trait pointillé vert indique la transition entre la phase de *feature extraction* (backbone gelé) et la phase de *fine-tuning* (dégel progressif) ; le trait pointillé rouge matérialise le point d'arrêt anticipé (*Early Stopping*).
Source : Conception personnelle, 2026 — données expérimentales [À COMPLÉTER]

### Texte de renvoi suggéré

"Le comportement dynamique du modèle au cours de l'entraînement est illustré à la Figure 3.1, qui retrace l'évolution parallèle des courbes de perte et de précision sur les ensembles d'entraînement et de validation, en distinguant les deux phases de transfer learning."

### Notes de mise en page

- Format : paysage, pleine largeur de page
- Résolution minimale : 300 dpi pour impression
- Remplacer les données placeholder par les `history` réels issus de Keras/TensorFlow ou PyTorch après expérimentation

---

## FIGURE 3.2 — Matrices de confusion

**Type** : Graphique composite (3 matrices 2×2 côte à côte)
**Chapitre cible** : Chap. 3 — Section 3.2 Visualisations et analyse qualitative
**Position recommandée** : En ouverture de la section 3.2, avant l'analyse des courbes ROC

### Contenu de la figure

Trois matrices de confusion 2×2, une par pathologie (Pneumonie | Tuberculose | COVID-19) :
- **Axe Y** : Étiquette réelle (Positif / Négatif)
- **Axe X** : Prédiction du modèle (Positif / Négatif)
- Couleurs : TP = vert foncé | TN = vert clair | FP = orange | FN = rouge

### Code Python (Matplotlib + Seaborn)

```python
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def plot_confusion_matrices(cms, class_names, pathologies, save_path=None):
    """
    Affiche 3 matrices de confusion côte à côte.
    
    Paramètres :
        cms : list de 3 arrays numpy (2×2) — [[TN, FP], [FN, TP]]
        class_names : list de 2 str — ['Négatif', 'Positif']
        pathologies : list de 3 str — noms des pathologies
        save_path : str ou None
    """
    fig, axes = plt.subplots(1, 3, figsize=(15, 4.5))
    fig.suptitle('Matrices de confusion — Ensemble de test', fontsize=13, fontweight='bold', y=1.02)

    # Palette personnalisée : TN (vert clair), FP (orange), FN (rouge), TP (vert foncé)
    custom_colors = {
        (0, 0): '#A5D6A7',  # TN — vert clair
        (0, 1): '#FFCC80',  # FP — orange
        (1, 0): '#EF9A9A',  # FN — rouge
        (1, 1): '#388E3C',  # TP — vert foncé
    }

    for idx, (ax, cm, pathology) in enumerate(zip(axes, cms, pathologies)):
        # Matrice de couleurs personnalisées
        color_matrix = np.array([
            [custom_colors[(0,0)], custom_colors[(0,1)]],
            [custom_colors[(1,0)], custom_colors[(1,1)]]
        ])

        # Heatmap de base (valeurs numériques)
        sns.heatmap(
            cm,
            annot=True,
            fmt='d',
            cmap='Greens',
            xticklabels=class_names,
            yticklabels=class_names,
            ax=ax,
            cbar=False,
            linewidths=0.5,
            linecolor='white',
            annot_kws={"size": 14, "weight": "bold"}
        )

        # Personnalisation des couleurs case par case
        for i in range(2):
            for j in range(2):
                ax.add_patch(plt.Rectangle(
                    (j, i), 1, 1,
                    fill=True, color=custom_colors[(i, j)],
                    alpha=0.35, zorder=0
                ))

        ax.set_title(f'{pathology}', fontsize=12, fontweight='bold', pad=10)
        ax.set_xlabel('Prédiction', fontsize=10)
        ax.set_ylabel('Étiquette réelle', fontsize=10)

        # Annotations des cases
        labels = [['VN', 'FP'], ['FN', 'VP']]
        for i in range(2):
            for j in range(2):
                ax.text(j + 0.5, i + 0.85, labels[i][j],
                        ha='center', va='center', fontsize=9,
                        color='#333333', style='italic')

    # Légende
    legend_patches = [
        mpatches.Patch(color='#388E3C', label='VP — Vrai Positif'),
        mpatches.Patch(color='#A5D6A7', label='VN — Vrai Négatif'),
        mpatches.Patch(color='#FFCC80', label='FP — Faux Positif'),
        mpatches.Patch(color='#EF9A9A', label='FN — Faux Négatif'),
    ]
    fig.legend(handles=legend_patches, loc='lower center', ncol=4,
               bbox_to_anchor=(0.5, -0.08), fontsize=10, frameon=True)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Figure sauvegardée : {save_path}")

    plt.show()


import matplotlib.patches as mpatches

# --- Données placeholder (à remplacer par les résultats réels) ---
# Format : [[TN, FP], [FN, TP]]
cm_pneumonie  = np.array([[0, 0], [0, 0]])  # [À COMPLÉTER]
cm_tuberculose = np.array([[0, 0], [0, 0]]) # [À COMPLÉTER]
cm_covid      = np.array([[0, 0], [0, 0]])  # [À COMPLÉTER]

plot_confusion_matrices(
    cms=[cm_pneumonie, cm_tuberculose, cm_covid],
    class_names=['Négatif', 'Positif'],
    pathologies=['Pneumonie', 'Tuberculose', 'COVID-19'],
    save_path='figure3_2_matrices_confusion.png'
)
```

### Légende

**Figure 3.2 :** Matrices de confusion du modèle DenseNet-121 pour chacune des trois pathologies cibles, évaluées sur l'ensemble de test. Chaque matrice distingue les vrais positifs (VP, vert foncé), vrais négatifs (VN, vert clair), faux positifs (FP, orange) et faux négatifs (FN, rouge). Dans un contexte de dépistage, les faux négatifs — patients malades classés comme normaux — constituent la catégorie d'erreur cliniquement la plus critique.
Source : Conception personnelle, 2026 — valeurs expérimentales [À COMPLÉTER]

### Texte de renvoi suggéré

"La structure des erreurs du modèle est détaillée à la Figure 3.2, qui présente les matrices de confusion pour les trois pathologies étudiées et permet d'identifier la nature et la répartition des classifications incorrectes."

### Notes de mise en page

- Format : paysage, pleine largeur de page
- Ajouter `import matplotlib.patches as mpatches` en tête du script si non présent
- Remplacer les matrices placeholder par les arrays numpy issus de `sklearn.metrics.confusion_matrix`

---

## FIGURE 3.3 — Courbes ROC multi-pathologies

**Type** : Graphique (courbes ROC superposées)
**Chapitre cible** : Chap. 3 — Section 3.2 Visualisations et analyse qualitative
**Position recommandée** : Après la Figure 3.2 et l'analyse des matrices de confusion

### Contenu de la figure

Un graphe unique avec :
- 3 courbes ROC superposées : Pneumonie (bleu), Tuberculose (orange), COVID-19 (vert)
- Diagonale pointillée noire (AUC = 0,5, classificateur aléatoire)
- Annotation AUC pour chaque courbe [À COMPLÉTER]
- Point de fonctionnement optimal (*operating point*) marqué sur chaque courbe (étoile)
- Axe X : Taux de faux positifs (1 − Spécificité)
- Axe Y : Taux de vrais positifs (Sensibilité)

### Code Python (Matplotlib + scikit-learn)

```python
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import roc_curve, auc

def plot_roc_multiclass(y_true_dict, y_scores_dict, operating_points=None, save_path=None):
    """
    Trace les courbes ROC pour plusieurs pathologies sur un même graphe.
    
    Paramètres :
        y_true_dict  : dict {pathologie: array de labels binaires réels}
        y_scores_dict: dict {pathologie: array de scores de probabilité du modèle}
        operating_points : dict {pathologie: (fpr, tpr)} — seuils cliniques retenus (optionnel)
        save_path : str ou None
    """
    colors = {
        'Pneumonie':   '#1565C0',  # Bleu foncé
        'Tuberculose': '#E65100',  # Orange foncé
        'COVID-19':    '#2E7D32',  # Vert foncé
    }
    linestyles = {
        'Pneumonie':   '-',
        'Tuberculose': '--',
        'COVID-19':    '-.',
    }

    fig, ax = plt.subplots(figsize=(8, 7))

    for pathologie in y_true_dict:
        fpr, tpr, _ = roc_curve(y_true_dict[pathologie], y_scores_dict[pathologie])
        roc_auc = auc(fpr, tpr)

        ax.plot(
            fpr, tpr,
            color=colors[pathologie],
            linestyle=linestyles[pathologie],
            linewidth=2.5,
            label=f'{pathologie} (AUC = {roc_auc:.3f})'
        )

        # Point de fonctionnement optimal
        if operating_points and pathologie in operating_points:
            op_fpr, op_tpr = operating_points[pathologie]
            ax.plot(op_fpr, op_tpr, marker='*', markersize=14,
                    color=colors[pathologie], zorder=5)

    # Diagonale (classificateur aléatoire)
    ax.plot([0, 1], [0, 1], 'k--', linewidth=1.2, alpha=0.6, label='Aléatoire (AUC = 0.500)')

    # Zone de référence AUC > 0.90 (Ahmad et al., 2023)
    ax.axhspan(0, 1, xmin=0, xmax=1, alpha=0.0)  # placeholder for shading if desired

    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.02])
    ax.set_xlabel('Taux de faux positifs (1 − Spécificité)', fontsize=12)
    ax.set_ylabel('Taux de vrais positifs (Sensibilité)', fontsize=12)
    ax.set_title('Courbes ROC — Comparaison multi-pathologies\n(DenseNet-121, ensemble de test)', fontsize=12, fontweight='bold')
    ax.legend(loc='lower right', fontsize=11, framealpha=0.9)
    ax.grid(True, alpha=0.25)

    # Annotation du seuil clinique
    ax.annotate(
        'Seuil de dépistage\n(sensibilité ≥ 0,90)',
        xy=(0.1, 0.90), xytext=(0.35, 0.78),
        arrowprops=dict(arrowstyle='->', color='gray'),
        fontsize=9, color='gray'
    )

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Figure sauvegardée : {save_path}")

    plt.show()


# --- Données placeholder (à remplacer par les scores réels du modèle) ---
# Générer des courbes simulées pour illustration
np.random.seed(42)

def simulate_roc(n=500, auc_target=0.90):
    """Simule des scores pour obtenir une courbe ROC approximative."""
    y_true = np.random.randint(0, 2, n)
    shift = np.log(auc_target / (1 - auc_target))
    y_score = np.where(y_true == 1,
                       np.random.normal(0.5 + shift * 0.1, 0.2, n),
                       np.random.normal(0.5 - shift * 0.1, 0.2, n))
    return y_true, np.clip(y_score, 0, 1)

y_true_dict, y_scores_dict = {}, {}
y_true_dict['Pneumonie'],   y_scores_dict['Pneumonie']   = simulate_roc(auc_target=0.92)
y_true_dict['Tuberculose'], y_scores_dict['Tuberculose'] = simulate_roc(auc_target=0.89)
y_true_dict['COVID-19'],    y_scores_dict['COVID-19']    = simulate_roc(auc_target=0.94)

plot_roc_multiclass(
    y_true_dict=y_true_dict,
    y_scores_dict=y_scores_dict,
    operating_points={
        'Pneumonie':   (0.12, 0.90),
        'Tuberculose': (0.15, 0.88),
        'COVID-19':    (0.10, 0.93),
    },
    save_path='figure3_3_courbes_roc.png'
)
```

### Légende

**Figure 3.3 :** Courbes ROC (*Receiver Operating Characteristic*) du modèle DenseNet-121 pour les trois pathologies cibles, tracées sur l'ensemble de test. Chaque courbe représente le compromis entre la sensibilité (taux de vrais positifs) et le taux de faux positifs pour l'ensemble des seuils de décision possibles. L'aire sous la courbe (AUC) quantifie la capacité discriminante globale du modèle. La diagonale en pointillé correspond à un classificateur aléatoire (AUC = 0,5). Les marqueurs en étoile indiquent le seuil de décision retenu pour un usage en dépistage (sensibilité ≥ 0,90).
Source : Conception personnelle, 2026 — valeurs expérimentales [À COMPLÉTER]

### Texte de renvoi suggéré

"La capacité discriminante du modèle pour chacune des trois pathologies est illustrée à la Figure 3.3, qui superpose les courbes ROC correspondantes et permet d'identifier le point de fonctionnement optimal selon le contexte clinique d'utilisation."

### Notes de mise en page

- Format : portrait, demi-page ou pleine page
- Utiliser `sklearn.metrics.roc_curve` et `sklearn.metrics.auc` avec les scores réels du modèle
- Les données placeholder (courbes simulées) doivent être remplacées après expérimentation

---

## TABLEAU 3.2 — Comparaison avec l'état de l'art

**Type** : Tableau comparatif
**Chapitre cible** : Chap. 3 — Section 3.3 Comparaison avec l'état de l'art
**Position recommandée** : En ouverture de la section 3.3, avant l'analyse des écarts

### Contenu du tableau

| Étude | Architecture | Dataset | Tâche | F1-score | AUC | Notes |
|---|---|---|---|---|---|---|
| **Ce travail (2026)** | DenseNet-121 | Multi-sources (~388 K img) | Multi-pathologies | [À COMPLÉTER] | [À COMPLÉTER] | Transfer learning 2 phases, partitionnement patient |
| Rajpurkar et al. (2017) — CheXNet | DenseNet-121 | ChestX-ray14 (112 K) | Pneumonie | **0,435** | **0,841** | Dépasse les radiologues humains (F1 = 0,387) |
| Sethy & Behera (2020) | ResNet-50 + SVM | Dataset COVID-19 limité | COVID-19 | — | — | Précision = 95,38 % ; Sensibilité = 97,2 % ; dataset réduit |
| Apostolopoulos & Mpesiana (2020) | VGG-19 | Dataset COVID-19 limité | COVID-19 | — | — | Sensibilité = 98,75 % ; transfer learning, très petit dataset |
| Ahmad et al. (2023) — revue systématique | Multiple | Multiple | Multi-pathologies | — | **> 0,90** | 46 études analysées (2020–2022) |
| Meedeniya et al. (2022) — revue | DenseNet / ResNet / VGG | Multiple | Radiographies thoraciques | — | — | DenseNet = architecture dominante (68 études) |

**Note de bas de tableau :** Les tirets (—) indiquent que la métrique n'est pas rapportée dans la publication source ou n'est pas directement comparable (protocole d'évaluation différent). Les résultats de Sethy & Behera (2020) et d'Apostolopoulos & Mpesiana (2020) ont été obtenus sur des datasets de taille réduite en conditions contrôlées ; leur interprétation doit tenir compte de ce contexte.

### Légende

**Tableau 3.2 :** Comparaison des performances du modèle développé dans ce travail avec les principales études publiées dans la littérature. Les métriques reportées correspondent à celles disponibles dans chaque publication. Les valeurs [À COMPLÉTER] seront renseignées à l'issue de la phase d'expérimentation.
Source : Conception personnelle, 2026 — d'après Rajpurkar et al. (2017), Sethy & Behera (2020), Apostolopoulos & Mpesiana (2020), Ahmad et al. (2023), Meedeniya et al. (2022)

### Texte de renvoi suggéré

"Le positionnement de notre modèle au sein de la littérature est synthétisé dans le Tableau 3.2, qui confronte nos résultats aux principales études de référence sur la détection automatique des maladies pulmonaires par deep learning."

### Notes de mise en page

- Format : tableau pleine largeur, portrait, orientation paysage si nécessaire
- Mettre en gras la ligne « Ce travail » pour la distinguer des lignes de référence
- Logiciel : Word (tableau natif) ou LaTeX (`booktabs`, `longtable` si nécessaire)

---

## FIGURE 3.4 — Exemples Grad-CAM

**Type** : Grille d'images annotées (3 × 2)
**Chapitre cible** : Chap. 3 — Section 3.4 Cartes Grad-CAM et explainabilité
**Position recommandée** : Après la description de la méthode Grad-CAM, avant l'analyse des cas problématiques

### Contenu de la figure

Grille 3 × 2 organisée comme suit :

|  | Vrai Positif (VP) | Faux Négatif (FN) |
|---|---|---|
| **Pneumonie** | Activation concentrée sur les bases pulmonaires et zones de consolidation alvéolaire | Activation dispersée ou centrée sur des zones non pathologiques |
| **Tuberculose** | Activation concentrée sur les apex pulmonaires (siège préférentiel des lésions TB) | Activation sur zones neutres (médiastin, bases) |
| **COVID-19** | Activation périphérique bilatérale (opacités en verre dépoli caractéristiques) | Activation centrale ou unilatérale incohérente |

### Code Python (Keras/TensorFlow — Grad-CAM)

```python
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import cv2

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Génère une heatmap Grad-CAM pour une image donnée.
    
    Paramètres :
        img_array          : numpy array (1, 224, 224, 3) — image prétraitée
        model              : modèle Keras chargé
        last_conv_layer_name : str — nom de la dernière couche convolutive (ex: 'conv5_block16_concat' pour DenseNet-121)
        pred_index         : int ou None — index de la classe cible (None = classe prédite)
    
    Retourne :
        heatmap : numpy array (H, W) — valeurs entre 0 et 1
    """
    # Modèle auxiliaire : entrée image → (activations conv, prédictions)
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    # Gradient de la classe cible par rapport aux activations de la dernière couche conv
    grads = tape.gradient(class_channel, last_conv_output)

    # Pondération : importance moyenne de chaque filtre
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # Combinaison linéaire pondérée
    last_conv_output = last_conv_output[0]
    heatmap = last_conv_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # Normalisation [0, 1]
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
    return heatmap.numpy()


def overlay_gradcam(img_path, heatmap, alpha=0.4, colormap=cv2.COLORMAP_JET):
    """
    Superpose la heatmap Grad-CAM sur l'image originale.
    
    Paramètres :
        img_path : str — chemin vers l'image originale
        heatmap  : numpy array — sortie de make_gradcam_heatmap
        alpha    : float — opacité de la heatmap
        colormap : cv2 colormap
    
    Retourne :
        superimposed_img : numpy array (H, W, 3) — image avec heatmap superposée
    """
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))

    # Redimensionner la heatmap à la taille de l'image
    heatmap_resized = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), colormap)

    # Superposition
    superimposed_img = cv2.addWeighted(img, 1 - alpha, heatmap_colored, alpha, 0)
    superimposed_img = cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB)
    return superimposed_img


def plot_gradcam_grid(cases, save_path=None):
    """
    Trace la grille 3×2 des exemples Grad-CAM.
    
    Paramètres :
        cases : list de 6 dicts, chacun avec :
            - 'pathology'  : str — nom de la pathologie
            - 'case_type'  : str — 'VP' ou 'FN'
            - 'image'      : numpy array (224, 224, 3) — image originale (RGB)
            - 'heatmap_overlay' : numpy array (224, 224, 3) — image avec heatmap
            - 'label'      : str — légende courte
        save_path : str ou None
    """
    pathologies = ['Pneumonie', 'Tuberculose', 'COVID-19']
    case_types   = ['Vrai Positif (VP)', 'Faux Négatif (FN)']

    fig, axes = plt.subplots(3, 2, figsize=(10, 14))
    fig.suptitle('Cartes d\'activation Grad-CAM — DenseNet-121\n(exemples représentatifs par pathologie)',
                 fontsize=13, fontweight='bold')

    for row, pathology in enumerate(pathologies):
        for col, case_type in enumerate(case_types):
            ax = axes[row][col]
            case = cases[row * 2 + col]

            ax.imshow(case['heatmap_overlay'])
            ax.set_title(f'{pathology}\n{case_type}', fontsize=10, fontweight='bold', pad=5)
            ax.axis('off')

            # Sous-titre avec description anatomique
            ax.text(0.5, -0.05, case['label'],
                    transform=ax.transAxes,
                    ha='center', va='top', fontsize=8, style='italic', color='#444444')

    # Barre de couleur commune (Grad-CAM)
    cbar_ax = fig.add_axes([0.92, 0.15, 0.02, 0.7])
    sm = plt.cm.ScalarMappable(cmap='jet', norm=plt.Normalize(vmin=0, vmax=1))
    sm.set_array([])
    fig.colorbar(sm, cax=cbar_ax, label='Importance relative (Grad-CAM)')

    plt.tight_layout(rect=[0, 0, 0.91, 1])

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Figure sauvegardée : {save_path}")

    plt.show()


# --- Données placeholder ---
# À remplacer par les cas réels du modèle après expérimentation
# Format attendu pour chaque cas :
# {'pathology': 'Pneumonie', 'case_type': 'VP', 'heatmap_overlay': <array>, 'label': 'Activation : bases pulmonaires'}

print("Grad-CAM — Images réelles à substituer après expérimentation.")
print("Utiliser make_gradcam_heatmap() avec last_conv_layer_name='conv5_block16_concat' pour DenseNet-121.")
print("Appel overlay_gradcam() pour chaque image, puis plot_gradcam_grid() avec la liste de 6 cas.")
```

### Description qualitative attendue par cas

| Rang | Pathologie | Type | Région d'activation attendue | Interprétation |
|---|---|---|---|---|
| VP | Pneumonie | Vrai Positif | Bases pulmonaires, zones péri-hilaires | Cohérent avec les consolidations alvéolaires typiques |
| FN | Pneumonie | Faux Négatif | Dispersée ou périphérique non pathologique | Anomalie trop subtile ou non représentée à l'entraînement |
| VP | Tuberculose | Vrai Positif | Apex pulmonaires (1/3 supérieur des champs) | Cohérent avec la localisation préférentielle des lésions TB |
| FN | Tuberculose | Faux Négatif | Zones neutres (médiastin, bases) | Biais d'apprentissage ou lésion atypique |
| VP | COVID-19 | Vrai Positif | Périphérie bilatérale (opacités en verre dépoli) | Signature radiologique caractéristique du COVID-19 |
| FN | COVID-19 | Faux Négatif | Centrale ou unilatérale | Présentation atypique ou signal faible |

### Légende

**Figure 3.4 :** Cartes d'activation Grad-CAM (*Gradient-weighted Class Activation Mapping*) du modèle DenseNet-121 pour six cas représentatifs, organisés en grille 3 × 2 (trois pathologies × deux types de classification). La heatmap superposée à chaque radiographie localise les régions ayant le plus contribué à la décision du modèle, du bleu (faible contribution) au rouge (forte contribution). Les vrais positifs (colonne gauche) illustrent la cohérence anatomique des activations ; les faux négatifs (colonne droite) révèlent les limites de la représentation apprise. Images réelles [À COMPLÉTER] après expérimentation.
Source : Conception personnelle, 2026 — d'après Selvaraju et al. (2017)

### Texte de renvoi suggéré

"La Figure 3.4 présente six exemples représentatifs de cartes Grad-CAM, organisés par pathologie et par type de classification (vrai positif et faux négatif), afin d'illustrer à la fois la cohérence anatomique des décisions correctes du modèle et la nature des erreurs commises."

### Notes de mise en page

- Format : portrait, pleine page (grille 3 × 2)
- Conserver le même colormap (`jet` ou `RdYlGn`) pour toutes les heatmaps
- Pour DenseNet-121 (Keras), la dernière couche convolutive est typiquement `conv5_block16_concat`
- Pour PyTorch, utiliser `torchcam` ou implémenter Grad-CAM manuellement sur le dernier `DenseBlock`
- Vérifier la résolution des images sources (minimum 224 × 224 pour l'overlay)

---

## Récapitulatif des éléments visuels du Chapitre 3

| Élément | Type | Section | Statut |
|---|---|---|---|
| Tableau 3.1 | Tableau de métriques | 3.1 Résultats quantitatifs | ⏳ Valeurs [À COMPLÉTER] |
| Figure 3.1 | Courbes d'apprentissage | 3.1 Résultats quantitatifs | ⏳ Code prêt — données [À COMPLÉTER] |
| Figure 3.2 | Matrices de confusion | 3.2 Visualisations | ⏳ Code prêt — données [À COMPLÉTER] |
| Figure 3.3 | Courbes ROC | 3.2 Visualisations | ⏳ Code prêt — données [À COMPLÉTER] |
| Tableau 3.2 | Comparaison état de l'art | 3.3 Comparaison | ✅ Valeurs littérature intégrées |
| Figure 3.4 | Grille Grad-CAM | 3.4 Grad-CAM | ⏳ Code prêt — images [À COMPLÉTER] |

---

*6 éléments visuels | Figures 3.1–3.4 + Tableaux 3.1–3.2 | Codes Python prêts à exécuter après expérimentation*
*Conçu par /memoire-figure | 2026-04-06*
