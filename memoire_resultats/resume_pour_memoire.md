# Résultats expérimentaux — récapitulatif pour la rédaction

Exécuté le 2026-10-06 · Tesla T4 · PyTorch 2.11.0+cu130 · torchvision 0.26.0+cu130 · Python 3.13.15

## Configuration

```json
{
  "seed": 42,
  "taille_cache": 256,
  "taille_entree": 224,
  "batch_size": 32,
  "num_workers": 2,
  "partition": [
    0.7,
    0.15,
    0.15
  ],
  "dropout": 0.5,
  "weight_decay": 1e-05,
  "plateau": {
    "factor": 0.5,
    "patience": 5
  },
  "phase1": {
    "lr": 0.0001,
    "max_epochs": 10,
    "patience": 10
  },
  "phase2": {
    "lr": 1e-05,
    "max_epochs": 40,
    "patience": 10,
    "degel": [
      [
        0,
        [
          "denseblock4",
          "norm5"
        ]
      ],
      [
        5,
        [
          "transition3",
          "denseblock3"
        ]
      ]
    ]
  },
  "poids_imagenet": true,
  "bootstrap": 1000
}
```

## Répartition des données (partitionnement par patient)

| tâche                           | ensemble   |   images |   patients |   négatifs |   positifs | classes (nég. / pos.)   |
|:--------------------------------|:-----------|---------:|-----------:|-----------:|-----------:|:------------------------|
| Pneumonie                       | train      |     4085 |       1952 |       1107 |       2978 | Normal / Pneumonie      |
| Pneumonie                       | val        |      846 |        419 |        224 |        622 | Normal / Pneumonie      |
| Pneumonie                       | test       |      925 |        419 |        252 |        673 | Normal / Pneumonie      |
| Tuberculose                     | train      |      559 |        559 |        284 |        275 | Normal / Tuberculose    |
| Tuberculose                     | val        |      121 |        121 |         61 |         60 | Normal / Tuberculose    |
| Tuberculose                     | test       |      120 |        120 |         61 |         59 | Normal / Tuberculose    |
| Pneumonie bactérienne vs virale | train      |     3008 |       1171 |       1960 |       1048 | Bactérienne / Virale    |
| Pneumonie bactérienne vs virale | val        |      619 |        251 |        404 |        215 | Bactérienne / Virale    |
| Pneumonie bactérienne vs virale | test       |      646 |        252 |        416 |        230 | Bactérienne / Virale    |

## Pneumonie

- Entraînement : 10 époques en phase 1, 40 en phase 2, modèle retenu à l'époque 46 · 26 min
- Poids des positifs dans la perte : 0,37
- Seuil choisi en validation (Youden) : 0,587
- Test, seuil de validation : précision 0,994 · rappel 0,966 · spécificité 0,984 · F1 0,980 · AUC 0,996 (VP 650, FP 4, FN 23, VN 248)
- Test, seuil 0,5 : précision 0,991 · rappel 0,969 · spécificité 0,976 · F1 0,980 · AUC 0,996 (VP 652, FP 6, FN 21, VN 246)
- IC 95 % (bootstrap, 1000 tirages) : precision 0,988–0,998 · rappel 0,950–0,979 · specificite 0,968–0,996 · f1 0,971–0,987 · auc 0,993–0,998
- Grad-CAM : {"VP": {"image": "/kaggle/input/chest-xray-pneumonia/chest_xray/chest_xray/train/PNEUMONIA/person402_bacteria_1811.jpeg", "patient": "P-person402", "proba": 0.998004138469696}, "FN": {"image": "/kaggle/input/chest-xray-pneumonia/chest_xray/chest_xray/train/PNEUMONIA/person813_virus_1449.jpeg", "patient": "P-person813", "proba": 0.00034605705877766013}}

## Tuberculose

- Entraînement : 10 époques en phase 1, 40 en phase 2, modèle retenu à l'époque 47 · 4 min
- Poids des positifs dans la perte : 1,03
- Seuil choisi en validation (Youden) : 0,274
- Test, seuil de validation : précision 0,821 · rappel 0,780 · spécificité 0,836 · F1 0,800 · AUC 0,886 (VP 46, FP 10, FN 13, VN 51)
- Test, seuil 0,5 : précision 0,929 · rappel 0,661 · spécificité 0,951 · F1 0,772 · AUC 0,886 (VP 39, FP 3, FN 20, VN 58)
- IC 95 % (bootstrap, 1000 tirages) : precision 0,717–0,912 · rappel 0,662–0,879 · specificite 0,738–0,922 · f1 0,710–0,870 · auc 0,816–0,942
- Grad-CAM : {"VP": {"image": "/root/.cache/kagglehub/datasets/kmader/pulmonary-chest-xray-abnormalities/versions/1/ChinaSet_AllFiles/ChinaSet_AllFiles/CXR_png/CHNCXR_0327_1.png", "patient": "CHNCXR_0327", "proba": 0.7822927236557007}, "FN": {"image": "/root/.cache/kagglehub/datasets/kmader/pulmonary-chest-xray-abnormalities/versions/1/ChinaSet_AllFiles/ChinaSet_AllFiles/CXR_png/CHNCXR_0604_1.png", "patient": "CHNCXR_0604", "proba": 0.021973218768835068}}

## Pneumonie bactérienne vs virale

- Entraînement : 10 époques en phase 1, 31 en phase 2, modèle retenu à l'époque 31 · 16 min
- Poids des positifs dans la perte : 1,87
- Seuil choisi en validation (Youden) : 0,483
- Test, seuil de validation : précision 0,668 · rappel 0,770 · spécificité 0,788 · F1 0,715 · AUC 0,843 (VP 177, FP 88, FN 53, VN 328)
- Test, seuil 0,5 : précision 0,686 · rappel 0,761 · spécificité 0,808 · F1 0,722 · AUC 0,843 (VP 175, FP 80, FN 55, VN 336)
- IC 95 % (bootstrap, 1000 tirages) : precision 0,614–0,724 · rappel 0,714–0,823 · specificite 0,747–0,826 · f1 0,667–0,758 · auc 0,809–0,873
- Grad-CAM : {"VP": {"image": "/kaggle/input/chest-xray-pneumonia/chest_xray/chest_xray/test/PNEUMONIA/person67_virus_126.jpeg", "patient": "P-person67", "proba": 0.8193546533584595}, "FN": {"image": "/kaggle/input/chest-xray-pneumonia/chest_xray/chest_xray/train/PNEUMONIA/person724_virus_1343.jpeg", "patient": "P-person724", "proba": 0.015984678640961647}}

## Tableau 3.1

| Tâche                                        | Précision           | Rappel (sensibilité)   | Spécificité         | F1-score            | AUC                 | Images de test   |
|:---------------------------------------------|:--------------------|:-----------------------|:--------------------|:--------------------|:--------------------|:-----------------|
| Pneumonie                                    | 0,994 [0,988–0,998] | 0,966 [0,950–0,979]    | 0,984 [0,968–0,996] | 0,980 [0,971–0,987] | 0,996 [0,993–0,998] | 925              |
| Tuberculose                                  | 0,821 [0,717–0,912] | 0,780 [0,662–0,879]    | 0,836 [0,738–0,922] | 0,800 [0,710–0,870] | 0,886 [0,816–0,942] | 120              |
| Pneumonie bactérienne vs virale              | 0,668 [0,614–0,724] | 0,770 [0,714–0,823]    | 0,788 [0,747–0,826] | 0,715 [0,667–0,758] | 0,843 [0,809–0,873] | 646              |
| Moyenne (pathologies)                        | 0,908               | 0,873                  | 0,910               | 0,890               | 0,941               | 1045             |
| Référence : CheXNet (Rajpurkar et al., 2017) | —                   | —                      | —                   | 0,435               | —                   | —                |
