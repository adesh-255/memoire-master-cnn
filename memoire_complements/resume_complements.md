# Expériences complémentaires : récapitulatif

Exécuté le 2026-10-13 · Tesla T4 · PyTorch 2.11.0+cu128 · torchvision 0.26.0+cu128 · Python 3.13.15

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
    "patience": 10
  },
  "poids_imagenet": true,
  "bootstrap": 1000,
  "bande_masque": 0.15
}
```

## Répartition

| tâche                                 | ensemble   |   images |   patients |   négatifs |   positifs |
|:--------------------------------------|:-----------|---------:|-----------:|-----------:|-----------:|
| Pneumonie                             | train      |     4085 |       1952 |       1107 |       2978 |
| Pneumonie                             | val        |      846 |        419 |        224 |        622 |
| Pneumonie                             | test       |      925 |        419 |        252 |        673 |
| Tuberculose                           | train      |      559 |        559 |        284 |        275 |
| Tuberculose                           | val        |      121 |        121 |         61 |         60 |
| Tuberculose                           | test       |      120 |        120 |         61 |         59 |
| Pneumonie bactérienne vs virale       | train      |     3008 |       1171 |       1960 |       1048 |
| Pneumonie bactérienne vs virale       | val        |      619 |        251 |        404 |        215 |
| Pneumonie bactérienne vs virale       | test       |      646 |        252 |        416 |        230 |
| Tuberculose, Shenzhen vers Montgomery | train      |      562 |        562 |        277 |        285 |
| Tuberculose, Shenzhen vers Montgomery | val        |      100 |        100 |         49 |         51 |
| Tuberculose, Shenzhen vers Montgomery | test       |      138 |        138 |         80 |         58 |
| Tuberculose, Montgomery vers Shenzhen | train      |      117 |        117 |         68 |         49 |
| Tuberculose, Montgomery vers Shenzhen | val        |       21 |         21 |         12 |          9 |
| Tuberculose, Montgomery vers Shenzhen | test       |      662 |        662 |        326 |        336 |

## Synthèse

| Tâche                                 | Architecture    | Masque        | AUC [IC 95 %]         | Rappel   | Spécificité   | F1    | Activation sur les bords   | Paramètres (M)   |   Durée (min) | Écart d'AUC vs DenseNet complet [IC 95 %]   |
|:--------------------------------------|:----------------|:--------------|:----------------------|:---------|:--------------|:------|:---------------------------|:-----------------|--------------:|:--------------------------------------------|
| Pneumonie                             | densenet121     | aucun         | 0,996 [0,993 ; 0,998] | 0,970    | 0,968         | 0,979 | 41% (surface 51%)          | 7,0              |            12 |                                             |
| Pneumonie                             | densenet121     | bords_masques | 0,997 [0,995 ; 0,999] | 0,973    | 0,972         | 0,981 | 36% (surface 51%)          | 7,0              |            11 | +0,001 [-0,001 ; +0,004]                    |
| Pneumonie                             | densenet121     | centre_masque | 0,991 [0,987 ; 0,995] | 0,930    | 0,956         | 0,956 | 62% (surface 51%)          | 7,0              |            11 | -0,004 [-0,007 ; -0,001]                    |
| Tuberculose, Shenzhen vers Montgomery | densenet121     | aucun         | 0,852 [0,788 ; 0,912] | 0,707    | 0,838         | 0,732 | 47% (surface 51%)          | 7,0              |             2 |                                             |
| Tuberculose, Montgomery vers Shenzhen | densenet121     | aucun         | 0,725 [0,686 ; 0,760] | 0,845    | 0,433         | 0,706 | 55% (surface 51%)          | 7,0              |             1 |                                             |
| Tuberculose                           | densenet121     | aucun         | 0,887 [0,815 ; 0,943] | 0,763    | 0,885         | 0,811 | 34% (surface 51%)          | 7,0              |             2 |                                             |
| Pneumonie bactérienne vs virale       | densenet121     | aucun         | 0,842 [0,808 ; 0,873] | 0,761    | 0,800         | 0,717 | 51% (surface 51%)          | 7,0              |             7 |                                             |
| Pneumonie                             | resnet50        | aucun         | 0,998 [0,996 ; 0,999] | 0,976    | 0,988         | 0,986 | 47% (surface 51%)          | 23,5             |             9 | +0,002 [-0,000 ; +0,004]                    |
| Tuberculose                           | resnet50        | aucun         | 0,925 [0,867 ; 0,968] | 0,814    | 0,885         | 0,842 | 36% (surface 51%)          | 23,5             |             2 | +0,038 [-0,000 ; +0,078]                    |
| Pneumonie bactérienne vs virale       | resnet50        | aucun         | 0,835 [0,803 ; 0,868] | 0,739    | 0,784         | 0,694 | 47% (surface 51%)          | 23,5             |             5 | -0,007 [-0,028 ; +0,014]                    |
| Pneumonie                             | efficientnet_b0 | aucun         | 0,997 [0,995 ; 0,999] | 0,975    | 0,984         | 0,984 | 55% (surface 51%)          | 4,0              |            12 | +0,002 [-0,001 ; +0,005]                    |
| Tuberculose                           | efficientnet_b0 | aucun         | 0,810 [0,719 ; 0,887] | 0,780    | 0,820         | 0,793 | 26% (surface 51%)          | 4,0              |             2 | -0,077 [-0,128 ; -0,033]                    |
| Pneumonie bactérienne vs virale       | efficientnet_b0 | aucun         | 0,831 [0,797 ; 0,863] | 0,748    | 0,764         | 0,688 | 22% (surface 51%)          | 4,0              |             9 | -0,011 [-0,032 ; +0,007]                    |
