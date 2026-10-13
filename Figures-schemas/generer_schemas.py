"""Dessine les schémas des Chapitres 1 et 2 (Figures 1.1 à 2.5), en PNG 300 dpi.

Usage : python generer_schemas.py
La Figure 1.1 utilise trois radiographies du dataset Kermany, téléchargées une à une par kagglehub.
"""
import os
from pathlib import Path
from statistics import NormalDist

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, FancyArrowPatch
from PIL import Image

ICI = Path(__file__).parent
plt.rcParams.update({'font.family': 'Times New Roman', 'font.size': 11, 'savefig.dpi': 300,
                     'axes.spines.top': False, 'axes.spines.right': False})

# Palette commune aux schémas
BLEU_FONCE, BLEU, BLEU_CLAIR = '#1f3b5c', '#3a6ea5', '#dce8f4'
ORANGE, AMBRE, ROUGE = '#e08a3c', '#f2c14e', '#c0392b'
VERT_FONCE, VERT_CLAIR, GRIS = '#2e7d4f', '#cfe8d5', '#f2f2f2'


def boite(ax, x, y, l, h, texte, fond=BLEU_CLAIR, bord=BLEU, taille=10, gras=False, couleur='black'):
    ax.add_patch(FancyBboxPatch((x - l / 2, y - h / 2), l, h, boxstyle='round,pad=0.02,rounding_size=0.08',
                                fc=fond, ec=bord, lw=1.2))
    ax.text(x, y, texte, ha='center', va='center', fontsize=taille, fontweight='bold' if gras else 'normal',
            color=couleur, wrap=True)


def fleche(ax, x1, y1, x2, y2, couleur='#555555'):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle='-|>', mutation_scale=14, color=couleur, lw=1.3))


def sauver(fig, nom):
    fig.savefig(ICI / nom, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print('écrit :', nom)


# --------------------------------------------------------------------------- Figure 1.1
def figure_1_1():
    import kagglehub
    fichiers = [('chest_xray/train/NORMAL/IM-0115-0001.jpeg', '(a) Radiographie normale'),
                ('chest_xray/train/PNEUMONIA/person1_bacteria_1.jpeg', '(b) Pneumonie bactérienne'),
                ('chest_xray/train/PNEUMONIA/person1000_virus_1681.jpeg', '(c) Pneumonie virale')]
    fig, axes = plt.subplots(1, 3, figsize=(9, 3.6))
    for ax, (f, titre) in zip(axes, fichiers):
        chemin = kagglehub.dataset_download('paultimothymooney/chest-xray-pneumonia', path=f)
        img = Image.open(chemin).convert('L')
        cote = min(img.size)                       # recadrage carré centré, sans déformation
        g, h = (img.width - cote) // 2, (img.height - cote) // 2
        ax.imshow(img.crop((g, h, g + cote, h + cote)).resize((512, 512)), cmap='gray')
        ax.set_title(titre, fontsize=11)
        ax.axis('off')
    plt.tight_layout()
    sauver(fig, 'figure1_1_radiographies.png')


# --------------------------------------------------------------------------- Figure 1.2
def figure_1_2():
    """Jalons espacés régulièrement (et non à l'échelle des années) pour rester lisibles."""
    fig, ax = plt.subplots(figsize=(11, 5))
    L = '\n'.join
    jalons = [(1998, L(['LeNet-5', '(LeCun et al.)'])), (2012, L(['AlexNet : erreur', 'top-5 26,2 % → 15,3 %'])),
              (2015, L(['Synthèse LeCun,', 'Bengio et Hinton'])), (2016, L(['ResNet', '(He et al.)'])),
              (2017, L(['CheXNet, DenseNet,', 'revue de Litjens et al.'])), (2018, L(['Corpus pédiatrique', 'de Kermany et al.'])),
              (2019, L(['EfficientNet', '(Tan et Le)'])), (2020, L(['COVID-Net', '(Wang et al.)'])),
              (2021, L(["Plan d'action", 'de la FDA'])), (2023, L(["Revue d'Ahmad", 'et al.'])),
              (2024, L(['Règlement européen', "sur l'IA"]))]
    xs = [1.0] + [2.4 + 1.05 * k for k in range(len(jalons) - 1)]
    periodes = [(0.1, 1.85, L(['Systèmes CAD', 'classiques', '1990 à 2011']), '#e8eff7'),
                (1.9, 4.95, L(['Apprentissage profond', '2012 à 2016']), '#c9daee'),
                (5.0, 8.1, L(['Performances de niveau expert', '2017 à 2019']), '#9dbbdd'),
                (8.15, 13.0, L(['Consolidation et régulation', '2020 à 2024']), '#6f97c6')]
    for d, f, nom, c in periodes:
        ax.add_patch(Rectangle((d, -0.4), f - d, 0.8, fc=c, ec='white', lw=2))
        ax.text((d + f) / 2, 0, nom, ha='center', va='center', fontsize=9.5, color=BLEU_FONCE, fontweight='bold')
    for k, (x, (an, texte)) in enumerate(zip(xs, jalons)):
        sens = 1 if k % 2 == 0 else -1
        y0 = 0.4 * sens
        ax.plot([x, x], [y0, y0 + sens * 0.5], color=BLEU_FONCE, lw=1)
        ax.plot(x, y0 + sens * 0.5, 'o', color=ORANGE, ms=6, zorder=3)
        ax.text(x, y0 + sens * 0.62, L([str(an), texte]) if sens > 0 else L([texte, str(an)]), ha='center',
                va='bottom' if sens > 0 else 'top', fontsize=8.8, linespacing=1.15)
    ax.set_xlim(0, 13.1)
    ax.set_ylim(-1.9, 1.9)
    ax.axis('off')
    sauver(fig, 'figure1_2_chronologie.png')


# --------------------------------------------------------------------------- Figure 1.3
def figure_1_3():
    fig, ax = plt.subplots(figsize=(10, 4.2))
    couches = [('Image\n224×224×3', 224, 3, GRIS), ('Convolution\n+ ReLU\n224×224×64', 224, 64, BLEU_CLAIR),
               ('Pooling\n112×112×64', 112, 64, '#e6e6e6'), ('Convolution\n+ ReLU\n112×112×128', 112, 128, BLEU_CLAIR),
               ('Pooling\n56×56×128', 56, 128, '#e6e6e6'), ('Convolution\n+ ReLU\n56×56×256', 56, 256, BLEU_CLAIR)]
    x = 0.5
    for i, (nom, taille, canaux, c) in enumerate(couches):
        h = 0.6 + 2.4 * taille / 224
        l = 0.25 + 0.35 * np.log2(canaux) / 8
        for k in range(3):                                         # effet d'épaisseur
            ax.add_patch(Rectangle((x + k * 0.06, 2 - h / 2 + k * 0.06), l, h, fc=c, ec=BLEU, lw=0.8))
        ax.text(x + l / 2, 2 - h / 2 - 0.25, nom, ha='center', va='top', fontsize=8.5)
        if i < len(couches) - 1:
            fleche(ax, x + l + 0.15, 2, x + l + 0.55, 2)
        x += l + 0.7
    for j, (nom, c) in enumerate([('Couches\nentièrement\nconnectées', '#fbe3cf'), ('Softmax :\nprobabilité\npar classe', '#f6c9c4')]):
        boite(ax, x + 0.5, 2, 1.1, 1.1, nom, fond=c, bord=ORANGE if j == 0 else ROUGE, taille=9)
        if j == 0:
            fleche(ax, x + 1.1, 2, x + 1.5, 2)
        x += 1.6
    ax.annotate('', xy=(0.4, 3.75), xytext=(x - 3.4, 3.75), arrowprops=dict(arrowstyle='<->', color=BLEU_FONCE))
    ax.text((x - 3.0) / 2, 3.9, 'Extraction de caractéristiques (bords, textures, puis structures)', ha='center', fontsize=10, color=BLEU_FONCE)
    ax.annotate('', xy=(x - 3.1, 3.75), xytext=(x - 0.1, 3.75), arrowprops=dict(arrowstyle='<->', color=ROUGE))
    ax.text(x - 1.6, 3.9, 'Classification', ha='center', fontsize=10, color=ROUGE)
    ax.set_xlim(0, x)
    ax.set_ylim(-0.2, 4.3)
    ax.axis('off')
    sauver(fig, 'figure1_3_cnn_generique.png')


# --------------------------------------------------------------------------- Figure 2.1
def figure_2_1():
    fig, ax = plt.subplots(figsize=(5.8, 7.0))
    boite(ax, 5, 11.3, 6, 0.9, 'Radiographie brute\n(taille et codage variables)', fond=GRIS, bord='#888888')
    fleche(ax, 5, 10.8, 5, 10.25)
    boite(ax, 5, 9.75, 6, 0.9, 'Niveaux de gris sur 8 bits\nredimensionnement 256 × 256', fond=BLEU_CLAIR)
    fleche(ax, 4, 9.25, 2.6, 8.55)
    fleche(ax, 6, 9.25, 7.4, 8.55)
    boite(ax, 2.6, 7.1, 4.1, 2.7, 'ENTRAÎNEMENT\naugmentation aléatoire :\nrotation ±15°\nzoom 0,9 à 1,1\nrognage 85 à 100 %\n→ 224 × 224\nretournement horizontal\nluminosité, contraste ±20 %',
         fond='#fbe3cf', bord=ORANGE, taille=9.5)
    boite(ax, 7.4, 7.1, 4.1, 2.7, 'VALIDATION ET TEST\naucune augmentation\n\nredimensionnement\n224 × 224',
         fond=BLEU_CLAIR, taille=9.5)
    fleche(ax, 2.6, 5.75, 4.3, 5.05)
    fleche(ax, 7.4, 5.75, 5.7, 5.05)
    boite(ax, 5, 4.6, 6, 0.8, 'Pseudo-RGB : gris recopié sur 3 canaux', fond=BLEU_CLAIR)
    fleche(ax, 5, 4.2, 5, 3.7)
    boite(ax, 5, 3.25, 6, 0.85, 'Normalisation ImageNet\n(moyenne et écart-type par canal)', fond=BLEU_CLAIR)
    fleche(ax, 5, 2.82, 5, 2.3)
    boite(ax, 5, 1.85, 6, 0.85, 'Lots de 32 images → DenseNet-121', fond=BLEU_FONCE, bord=BLEU_FONCE, couleur='white', gras=True)
    ax.set_xlim(0, 10)
    ax.set_ylim(1.2, 11.9)
    ax.axis('off')
    sauver(fig, 'figure2_1_pretraitement.png')


# --------------------------------------------------------------------------- Figure 2.2
def figure_2_2():
    fig, ax = plt.subplots(figsize=(7.6, 10))
    blocs = [('Image d\'entrée', '224 × 224 × 3', GRIS, '#888888'),
             ('Convolution 7×7 + pooling', '56 × 56 × 64', BLEU_FONCE, BLEU_FONCE),
             ('Bloc dense 1 (6 couches)', '56 × 56 × 256', BLEU_FONCE, BLEU_FONCE),
             ('Transition 1', '28 × 28 × 128', BLEU_FONCE, BLEU_FONCE),
             ('Bloc dense 2 (12 couches)', '28 × 28 × 512', BLEU_FONCE, BLEU_FONCE),
             ('Transition 2', '14 × 14 × 256', BLEU_FONCE, BLEU_FONCE),
             ('Bloc dense 3 (24 couches)', '14 × 14 × 1 024', ORANGE, ORANGE),
             ('Transition 3', '7 × 7 × 512', ORANGE, ORANGE),
             ('Bloc dense 4 (16 couches)', '7 × 7 × 1 024', AMBRE, '#c99a1c'),
             ('Normalisation finale + ReLU', '7 × 7 × 1 024 (cartes Grad-CAM)', AMBRE, '#c99a1c'),
             ('Global Average Pooling', '1 024', ROUGE, ROUGE),
             ('Dropout (0,5)', '1 024', ROUGE, ROUGE),
             ('Couche dense à 1 neurone', '1 025 paramètres', ROUGE, ROUGE),
             ('Sigmoïde', 'probabilité de la classe pathologique', ROUGE, ROUGE)]
    y = len(blocs)
    for i, (nom, dim, c, b) in enumerate(blocs):
        clair = c in (GRIS, AMBRE)
        boite(ax, 3, y, 4.2, 0.72, nom, fond=c, bord=b, couleur='black' if clair else 'white', gras=True, taille=10)
        ax.text(5.35, y, dim, va='center', fontsize=9.5, color='#333333')
        if i < len(blocs) - 1:
            fleche(ax, 3, y - 0.37, 3, y - 0.63)
        y -= 1
    legende = [(BLEU_FONCE, 'Pré-entraîné (ImageNet), gelé pendant tout l\'entraînement'),
               (ORANGE, 'Pré-entraîné, dégelé à partir de la 6e époque de la phase 2'),
               (AMBRE, 'Pré-entraîné, dégelé dès la 1re époque de la phase 2'),
               (ROUGE, 'Tête ajoutée, entraînée dès la phase 1')]
    for k, (c, t) in enumerate(legende):
        ax.add_patch(Rectangle((0.4, -0.65 - k * 0.5), 0.35, 0.3, fc=c, ec='none'))
        ax.text(0.9, -0.5 - k * 0.5, t, va='center', fontsize=9.5)
    ax.set_xlim(0.2, 9.3)
    ax.set_ylim(-2.4, len(blocs) + 0.6)
    ax.axis('off')
    sauver(fig, 'figure2_2_densenet.png')


# --------------------------------------------------------------------------- Figure 2.3
def figure_2_3():
    fig, ax = plt.subplots(figsize=(9, 5.4))
    boite(ax, 5, 5.3, 7.2, 1.0, 'Corpus de la tâche pneumonie (Kermany)\n5 856 radiographies, 2 790 patients ; partage stratifié par classe',
          fond=GRIS, bord='#888888', gras=True)
    parts = [(1.8, 'ENTRAÎNEMENT\n70 % des patients', '1 952 patients\n4 085 images', '#cfdff0', BLEU, 'Ajustement des poids\n(rétropropagation)'),
             (5.0, 'VALIDATION\n15 % des patients', '419 patients\n846 images', '#fbe3cf', ORANGE, 'Arrêt anticipé,\ntaux d\'apprentissage,\nseuil de décision'),
             (8.2, 'TEST\n15 % des patients', '419 patients\n925 images', VERT_CLAIR, VERT_FONCE, 'Évaluation finale,\nconsulté une seule fois')]
    for x, titre, n, fond, bord, role in parts:
        fleche(ax, 5 + (x - 5) * 0.35, 4.78, x, 4.05)
        boite(ax, x, 3.35, 2.8, 1.35, f'{titre}\n{n}', fond=fond, bord=bord, gras=False, taille=10)
        fleche(ax, x, 2.65, x, 2.2)
        ax.text(x, 2.1, role, ha='center', va='top', fontsize=9.5)
    ax.add_patch(FancyBboxPatch((0.4, 0.05), 9.2, 0.6, boxstyle='round,pad=0.02', fc='#fdecea', ec=ROUGE, lw=1.2))
    ax.text(5, 0.35, 'Partage au niveau du patient : toutes les radiographies d\'un même patient vont dans le même ensemble',
            ha='center', va='center', fontsize=10, color=ROUGE)
    ax.set_xlim(0.2, 9.8)
    ax.set_ylim(-0.1, 5.95)
    ax.axis('off')
    sauver(fig, 'figure2_3_partition.png')


# --------------------------------------------------------------------------- Figure 2.4
def figure_2_4():
    fig, ax = plt.subplots(figsize=(8.4, 5.2))
    cases = [(0, 1, 'Vrai négatif (VN)', 'cas normal\ncorrectement écarté', VERT_CLAIR, 'black'),
             (1, 1, 'Faux positif (FP)', 'fausse alerte :\nexamen inutile', '#f7c99b', 'black'),
             (0, 0, 'Faux négatif (FN)', 'malade manqué :\nerreur la plus grave', ROUGE, 'white'),
             (1, 0, 'Vrai positif (VP)', 'cas pathologique\ncorrectement détecté', VERT_FONCE, 'white')]
    for c, r, titre, sous, fond, col in cases:
        ax.add_patch(Rectangle((c * 2.5, r * 1.6), 2.5, 1.6, fc=fond, ec='white', lw=3))
        ax.text(c * 2.5 + 1.25, r * 1.6 + 1.05, titre, ha='center', va='center', fontsize=11, fontweight='bold', color=col)
        ax.text(c * 2.5 + 1.25, r * 1.6 + 0.5, sous, ha='center', va='center', fontsize=10, color=col)
    for k, t in enumerate(['Normal', 'Pathologique']):
        ax.text(k * 2.5 + 1.25, 3.35, t, ha='center', fontsize=10.5)
        ax.text(-0.15, (1 - k) * 1.6 + 0.8, t, ha='right', va='center', fontsize=10.5)
    ax.text(2.5, 3.7, 'Classe prédite', ha='center', fontsize=11, fontweight='bold')
    ax.text(-1.55, 1.6, 'Classe réelle', ha='center', va='center', rotation=90, fontsize=11, fontweight='bold')
    formules = ['Précision = VP / (VP + FP)', 'Rappel (sensibilité) = VP / (VP + FN)', 'Spécificité = VN / (VN + FP)',
                'F1 = 2 × précision × rappel / (précision + rappel)']
    for k, f in enumerate(formules):
        ax.text(5.4, 2.6 - k * 0.6, f, fontsize=10.5, va='center')
    ax.set_xlim(-1.8, 9.9)
    ax.set_ylim(-0.1, 4.0)
    ax.axis('off')
    sauver(fig, 'figure2_4_matrice_confusion.png')


# --------------------------------------------------------------------------- Figure 2.5
def figure_2_5():
    """Courbes ROC théoriques (modèle binormal à variances égales) : illustration, pas des résultats."""
    N = NormalDist()
    fpr = np.linspace(1e-4, 1 - 1e-4, 400)
    fig, ax = plt.subplots(figsize=(5.8, 5.6))
    for auc, c, nom in [(0.95, BLEU_FONCE, 'Test très discriminant'), (0.75, ORANGE, 'Test moyennement discriminant')]:
        a = np.sqrt(2) * N.inv_cdf(auc)
        tpr = np.array([N.cdf(a + N.inv_cdf(f)) for f in fpr])
        ax.plot(fpr, tpr, color=c, lw=2.2, label=f'{nom} (AUC = {str(auc).replace(".", ",")})')
        if auc == 0.95:
            ax.fill_between(fpr, 0, tpr, color=c, alpha=0.08)
            i = np.argmax(tpr - fpr)                                 # point de Youden
            ax.plot(fpr[i], tpr[i], 'o', color=c, ms=7)
            ax.annotate('seuil maximisant\nsensibilité + spécificité − 1\n(indice de Youden)', xy=(fpr[i], tpr[i]),
                        xytext=(0.36, 0.9), fontsize=9, arrowprops=dict(arrowstyle='->', color='#555555'),
                        bbox=dict(boxstyle='round,pad=0.25', fc='white', ec='#bbbbbb'))
    ax.plot([0, 1], [0, 1], '--', color='grey', lw=1.2, label='Classement au hasard (AUC = 0,5)')
    ax.plot(0, 1, '*', color=VERT_FONCE, ms=13)
    ax.annotate('test parfait', xy=(0, 1), xytext=(0.06, 0.93), fontsize=9, color=VERT_FONCE)
    ax.text(0.55, 0.3, 'aire sous la courbe\n= AUC', fontsize=9.5, color=BLEU_FONCE, ha='center')
    ax.set_xlabel('Taux de faux positifs (1 − spécificité)')
    ax.set_ylabel('Sensibilité (rappel)')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.02)
    ax.set_aspect('equal')
    ax.grid(alpha=0.25)
    ax.legend(loc='lower right', fontsize=8.5)
    for axe in (ax.xaxis, ax.yaxis):
        axe.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f'{v:.1f}'.replace('.', ',')))
    sauver(fig, 'figure2_5_roc_illustration.png')


if __name__ == '__main__':
    import matplotlib.ticker  # noqa: F401  (formatage des axes de la Figure 2.5)
    for f in (figure_1_1, figure_1_2, figure_1_3, figure_2_1, figure_2_2, figure_2_3, figure_2_4, figure_2_5):
        f()
