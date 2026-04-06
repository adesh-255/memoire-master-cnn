# Bibliographie — Mémoire CNN / Maladies Pulmonaires
> Auteur : ALAWO Adeshina Néhémiah | Format : APA 7 | Constituée le 2026-04-03

---

## Catégorie 1 — Travaux de référence incontournables

**[1]** Rajpurkar, P., Irvin, J., Zhu, K., Yang, B., Mehta, H., Duan, T., Ding, D., Bagul, A., Langlotz, C., Shpanskaya, K., Lungren, M. P., & Ng, A. Y. (2017). *CheXNet: Radiologist-level pneumonia detection on chest X-rays with deep learning*. arXiv. https://doi.org/10.48550/arXiv.1711.05225
> **Fait clé** : CheXNet (DenseNet-121) dépasse la performance moyenne de 4 radiologues humains sur la métrique F1 pour la détection de pneumonie, entraîné sur >100 000 radiographies.

**[2]** Wang, X., Peng, Y., Lu, L., Lu, Z., Bagheri, M., & Summers, R. M. (2017). ChestX-ray8: Hospital-scale chest X-ray database and benchmarks on weakly-supervised classification and localization of common thorax diseases. *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 2097–2106. https://doi.org/10.1109/CVPR.2017.369
> **Fait clé** : 112 000 radiographies, 14 pathologies, >30 000 patients. Base de référence absolue du domaine.

**[3]** Sethy, P. K., & Behera, S. K. (2020). *Detection of coronavirus disease (COVID-19) based on deep features*. Preprints. https://doi.org/10.20944/preprints202003.0300.v1
> **Fait clé** : ResNet50 + SVM → précision 95,38 %, sensibilité 97,2 %, spécificité 93,4 % pour la détection COVID-19.

**[4]** LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. *Nature*, *521*(7553), 436–444. https://doi.org/10.1038/nature14539
> **Fait clé** : Article de synthèse fondateur sur le deep learning par les trois Pères de la discipline (Prix Turing 2018).

**[5]** He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 770–778. https://doi.org/10.1109/CVPR.2016.90
> **Fait clé** : ResNet — connexions résiduelles, jusqu'à 152 couches, erreur top-5 de 3,57 % (vs 5,1 % humains).

**[6]** LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). Gradient-based learning applied to document recognition. *Proceedings of the IEEE*, *86*(11), 2278–2324. https://doi.org/10.1109/5.726791
> **Fait clé** : LeNet-5, premier CNN moderne entraîné par descente de gradient. Fondement de l'architecture convolutionnelle.

**[7]** Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). ImageNet classification with deep convolutional neural networks. *Advances in Neural Information Processing Systems*, *25*, 1097–1105. https://doi.org/10.1145/3065386
> **Fait clé** : AlexNet — déclenche la révolution du deep learning. Erreur top-5 de 15,3 % vs 26,2 % pour le concurrent suivant.

---

## Catégorie 2 — Épidémiologie des maladies pulmonaires

**[8]** World Health Organization. (2024). *Global tuberculosis report 2024*. WHO. https://www.who.int/teams/global-programme-on-tuberculosis-and-lung-health/tb-reports/global-tuberculosis-report-2024
> **Fait clé** : 10,8 millions de nouveaux cas de TB en 2023, 1,25 million de décès.

**[9]** World Health Organization. (2024). *Pneumonia* [Fact sheet]. WHO. https://www.who.int/news-room/fact-sheets/detail/pneumonia
> **Fait clé** : 610 000 enfants <5 ans morts de pneumonie en 2023, dont >52 % en Afrique subsaharienne.

**[10]** Sarkodie, B., Ohene-Botwe, B., Mensah, Y. B., Tagoe, E., Jimah, B. B., Brakohiapa, E. K., & Dzefi-Tettey, K. (2023). Density and regional distribution of radiologists in a low-income country: The Ghana situation. *Chinese Journal of Academic Radiology*. https://doi.org/10.1007/s42058-023-00130-z
> **Fait clé** : Ghana = 3 radiologues/million en moyenne nationale ; 8 régions sur 16 sous 1/million. Illustration du déficit structurel en Afrique subsaharienne.
> ⚠️ **Note** : Le chiffre régional de 0,9/million pour l'Afrique subsaharienne (cité en Introduction et Ch.1) nécessite une source régionale complémentaire — à confirmer avec l'encadreur.

---

## Catégorie 3 — CNN en imagerie médicale (revues systématiques)

**[11]** Litjens, G., Kooi, T., Bejnordi, B. E., Setio, A. A. A., Ciompi, F., Ghafoorian, M., van der Laak, J. A. W. M., van Ginneken, B., & Sánchez, C. I. (2017). A survey on deep learning in medical image analysis. *Medical Image Analysis*, *42*, 60–88. https://doi.org/10.1016/j.media.2017.07.005
> **Fait clé** : Revue de >300 articles. CNN surpassent systématiquement les méthodes classiques. >16 000 citations en 2024.

**[12]** Meedeniya, D., Kumarasinghe, H., Kolonne, S., Fernando, C., De la Torre Díez, I., & Marques, G. (2022). Chest X-ray analysis empowered with deep learning: A systematic review. *Applied Soft Computing*, *126*, 109319. https://doi.org/10.1016/j.asoc.2022.109319
> **Fait clé** : 68 études analysées — ResNet, VGG et DenseNet sont les architectures dominantes pour l'analyse de radiographies.

**[13]** Ahmad, H. K., Milne, M. R., Buchlak, Q. D., Ektas, N., Sanderson, G., Chamtie, H., Karunasena, S., Chiang, J., Holt, X., Tang, C. H. M., Seah, J. C. Y., Bottrell, G., Esmaili, N., Brotchie, P., & Jones, C. (2023). Machine learning augmented interpretation of chest X-rays: A systematic review. *Diagnostics*, *13*(4), 743. https://doi.org/10.3390/diagnostics13040743
> **Fait clé** : 46 études retenues (2020–2022) — les modèles ML sont aussi précis ou supérieurs aux radiologues.

**[14]** Kim, H. E., Cosa-Linan, A., Santhanam, N., Jannesari, M., Maros, M. E., & Ganslandt, T. (2022). Transfer learning for medical image classification: A literature review. *BMC Medical Imaging*, *22*(1), 69. https://doi.org/10.1186/s12880-022-00793-7
> **Fait clé** : Transfer learning depuis ImageNet est la stratégie dominante, efficace même avec de petits datasets.

---

## Catégorie 4 — Datasets

**[15]** Irvin, J., Rajpurkar, P., Ko, M., Yu, Y., Ciurea-Ilcus, S., Chute, C., Marklund, H., Haghgoo, B., Ball, R., Shpanskaya, K., Seekins, J., Mong, D. A., Halabi, S. S., Sandberg, J. K., Jones, R., Larson, D. B., Langlotz, C. P., Patel, B. N., Lungren, M. P., & Ng, A. Y. (2019). CheXpert: A large chest radiograph dataset with uncertainty labels and expert comparison. *Proceedings of the AAAI Conference on Artificial Intelligence*, *33*(01), 590–597. https://doi.org/10.1609/aaai.v33i01.3301590
> **Fait clé** : 224 316 radiographies, 65 240 patients (Stanford), 14 observations annotées.

**[16]** Jaeger, S., Candemir, S., Antani, S., Wáng, Y.-X. J., Lu, P.-X., & Thoma, G. (2014). Two public chest X-ray datasets for computer-aided screening of pulmonary diseases. *Quantitative Imaging in Medicine and Surgery*, *4*(6), 475–477. https://doi.org/10.3978/j.issn.2223-4292.2014.11.20
> **Fait clé** : Montgomery (138 images) + Shenzhen (662 images) — datasets publics de référence pour la tuberculose.

**[17]** Shih, G., Wu, C. C., Halabi, S. S., Kohli, M. D., Prevedello, L. M., Cook, T. S., Sharma, A., Amorosa, J. K., Arteaga, V., Galperin-Aizenberg, M., Gill, R. R., Godoy, M. C. B., Hobbs, S., Jeudy, J., Laroia, A., Shah, P. N., Vummidi, D., Yaddanapudi, K., & Stein, A. (2019). Augmenting the National Institutes of Health chest radiograph dataset with expert annotations of possible pneumonia. *Radiology: Artificial Intelligence*, *1*(1). https://doi.org/10.1148/ryai.2019180041
> **Fait clé** : 30 000 images annotées avec boîtes englobantes — RSNA Pneumonia Detection Challenge 2018 (Kaggle).

**[18]** Wang, L., Lin, Z. Q., & Wong, A. (2020). COVID-Net: A tailored deep convolutional neural network design for detection of COVID-19 cases from chest X-ray images. *Scientific Reports*, *10*, 19549. https://doi.org/10.1038/s41598-020-76550-z
> **Fait clé** : Dataset COVIDx — 13 975 images CXR. COVID-Net atteint 91 % de sensibilité COVID-19.

**[19]** Kermany, D. S., Goldbaum, M., Cai, W., Valentim, C. C. S., Liang, H., Baxter, S. L., McKeown, A., Yang, G., & Wu, X. (2018). Identifying medical diagnoses and treatable diseases by image-based deep learning. *Cell*, *172*(5), 1122–1131. https://doi.org/10.1016/j.cell.2018.02.010
> **Fait clé** : 5 856 radiographies pédiatriques (normal/pneumonie bactérienne/virale) — dataset le plus utilisé sur Kaggle.

---

## Catégorie 5 — Architectures CNN

**[20]** Huang, G., Liu, Z., van der Maaten, L., & Weinberger, K. Q. (2017). Densely connected convolutional networks. *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 4700–4708. https://doi.org/10.1109/CVPR.2017.243
> **Fait clé** : DenseNet — Best Paper Award CVPR 2017. DenseNet-121 = architecture de CheXNet (Stanford).

**[21]** Tan, M., & Le, Q. V. (2019). EfficientNet: Rethinking model scaling for convolutional neural networks. *Proceedings of the 36th International Conference on Machine Learning (ICML)*, 6105–6114. https://proceedings.mlr.press/v97/tan19a.html
> **Fait clé** : 84,4 % top-1 sur ImageNet, 8,4x moins de paramètres que l'état de l'art.

**[22]** Simonyan, K., & Zisserman, A. (2015). Very deep convolutional networks for large-scale image recognition. *Proceedings of the 3rd International Conference on Learning Representations (ICLR)*. https://doi.org/10.48550/arXiv.1409.1556
> **Fait clé** : VGG-16/19 — filtres 3x3 systématiques. Architecture de référence pour le transfer learning médical.

**[23]** Szegedy, C., Liu, W., Jia, Y., Sermanet, P., Reed, S., Anguelov, D., Erhan, D., Vanhoucke, V., & Rabinovich, A. (2015). Going deeper with convolutions. *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 1–9. https://doi.org/10.1109/CVPR.2015.7298594
> **Fait clé** : GoogLeNet/Inception — vainqueur ILSVRC 2014, 12x moins de paramètres qu'AlexNet.

---

## Catégorie 6 — Explainabilité et références complémentaires

**[24]** Selvaraju, R. R., Cogswell, M., Das, A., Vedantam, R., Parikh, D., & Batra, D. (2017). Grad-CAM: Visual explanations from deep networks via gradient-based localization. *Proceedings of the IEEE International Conference on Computer Vision (ICCV)*, 618–626. https://doi.org/10.1109/ICCV.2017.74
> **Fait clé** : Heatmaps localisant les régions décisives pour le CNN. Indispensable pour l'acceptabilité clinique.

**[25]** Apostolopoulos, I. D., & Mpesiana, T. A. (2020). Covid-19: Automatic detection from X-ray images utilizing transfer learning with convolutional neural networks. *Physical and Engineering Sciences in Medicine*, *43*(2), 635–640. https://doi.org/10.1007/s13246-020-00865-4
> **Fait clé** : VGG19 → 98,75 % sensibilité COVID-19 par transfer learning. Efficacité avec dataset limité.

**[26]** Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep learning*. MIT Press. https://www.deeplearningbook.org/
> **Fait clé** : Manuel de référence académique absolu sur le deep learning (800 pages, cité dans quasi toutes les thèses).

**[27]** Panwar, H., Gupta, P. K., Siddiqui, M. K., Morales-Menendez, R., Bhardwaj, P., & Singh, V. (2020). A deep learning and Grad-CAM based color visualization approach for fast detection of COVID-19 cases using chest X-ray and CT-scan images. *Chaos, Solitons & Fractals*, *140*, 110190. https://doi.org/10.1016/j.chaos.2020.110190
> **Fait clé** : VGG-19 + Grad-CAM — démontre l'intérêt de l'explainabilité visuelle pour l'acceptabilité clinique.

---

## Statistiques clés à exploiter

| Fait | Source | Section |
|---|---|---|
| CheXNet dépasse les radiologues humains (F1) | [1] Rajpurkar et al., 2017 | Intro + Ch.1 + Ch.3 |
| 112 000 radiographies, 14 pathologies | [2] Wang et al., 2017 | Ch.2 — Datasets |
| 10,8 millions nouveaux cas TB en 2023 | [8] OMS, 2024 | Intro + Ch.1 |
| 1,25 million de décès TB en 2023 | [8] OMS, 2024 | Intro + Ch.1 |
| 610 000 enfants <5 ans morts de pneumonie (2023) | [9] OMS, 2024 | Intro + Ch.1 |
| 0,9 radiologue/million hab. en Afrique subsaharienne | [10] 2023 | Intro + Ch.1 |
| ResNet : 3,57 % erreur top-5 (vs 5,1 % humain) | [5] He et al., 2016 | Ch.2 — Architectures |
| DenseNet-121 = base de CheXNet Stanford | [20] Huang et al., 2017 | Ch.2 — Architectures |
| 224 316 radiographies dans CheXpert | [15] Irvin et al., 2019 | Ch.2 — Datasets |
| VGG19 : 98,75 % sensibilité COVID-19 | [25] Apostolopoulos, 2020 | Ch.3 — Résultats |
| Grad-CAM essentiel pour l'acceptabilité clinique | [24] Selvaraju et al., 2017 | Ch.3 — Éthique |

---

*27 références — 1 à vérifier ([10] auteurs complets). Toutes les autres : sources primaires confirmées.*
