# Résumé et abstract

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 (2026-10-13)
> **Contrainte du canevas ESGIS :** 250 à 300 mots, 5 à 7 mots-clés, abstract et mots-clés traduits

---

## Résumé

En Afrique subsaharienne, on compte moins d'un radiologue par million d'habitants, alors que la pneumonie et la tuberculose y restent parmi les premières causes de décès évitables. Ce mémoire évalue la capacité d'un réseau de neurones convolutionnel (CNN) à détecter ces maladies sur radiographie thoracique, et examine ce que ses performances mesurent réellement. Un modèle DenseNet-121 pré-entraîné sur ImageNet a été adapté par apprentissage par transfert en deux phases, sur deux corpus publics annotés par des cliniciens : 5 856 radiographies pédiatriques (Kermany) et 800 radiographies d'adultes (Montgomery et Shenzhen). Le protocole repose sur un partitionnement par patient, un seuil de décision fixé sur la validation, des intervalles de confiance par bootstrap et une analyse Grad-CAM. Le modèle atteint une AUC de 0,996 pour la pneumonie, de 0,886 pour la tuberculose et de 0,843 pour la distinction entre pneumonie bactérienne et virale. Trois expériences complémentaires mettent ces chiffres à l'épreuve. Un modèle qui ne voit que les bords du cliché, centre masqué, détecte encore la pneumonie avec une AUC de 0,991, en s'appuyant notamment sur du matériel de surveillance médicale : sur ce corpus, une performance excellente ne prouve donc pas une compétence radiologique. Masquer les bords ne réduit en revanche pas la performance et ramène l'attention du modèle sur les poumons. Pour la tuberculose, entraîner sur un hôpital et tester sur l'autre fait chuter l'AUC jusqu'à 0,725. Enfin, ResNet-50 et EfficientNet-B0 ne dépassent jamais significativement DenseNet-121. Ce travail montre qu'une AUC élevée sur un corpus public ne suffit pas à juger un outil d'aide au diagnostic, et plaide pour une validation externe, un nettoyage des images et la constitution de corpus africains avant tout déploiement.

**Mots-clés :** réseaux de neurones convolutionnels ; radiographie thoracique ; pneumonie ; tuberculose ; apprentissage par transfert ; apprentissage par raccourci ; Grad-CAM

## Abstract

In sub-Saharan Africa, there is less than one radiologist per million inhabitants, while pneumonia and tuberculosis remain among the leading causes of preventable death. This thesis assesses the ability of a convolutional neural network (CNN) to detect these diseases on chest radiographs, and examines what its performance actually measures. A DenseNet-121 model pre-trained on ImageNet was adapted through two-phase transfer learning on two public datasets annotated by clinicians: 5,856 paediatric radiographs (Kermany) and 800 adult radiographs (Montgomery and Shenzhen). The protocol relies on patient-level splitting, a decision threshold set on the validation set, bootstrap confidence intervals and Grad-CAM analysis. The model reaches an AUC of 0.996 for pneumonia, 0.886 for tuberculosis and 0.843 for distinguishing bacterial from viral pneumonia. Three additional experiments put these figures to the test. A model that only sees the borders of the image, with the centre masked, still detects pneumonia with an AUC of 0.991, relying in particular on medical monitoring equipment: on this dataset, excellent performance therefore does not prove radiological competence. Masking the borders, on the other hand, does not reduce performance and brings the model's attention back to the lungs. For tuberculosis, training on one hospital and testing on the other lowers the AUC to as little as 0.725. Finally, ResNet-50 and EfficientNet-B0 never significantly outperform DenseNet-121. This work shows that a high AUC on a public dataset is not enough to judge a diagnostic support tool, and argues for external validation, image cleaning and the creation of African datasets before any deployment.

**Keywords:** convolutional neural networks; chest radiography; pneumonia; tuberculosis; transfer learning; shortcut learning; Grad-CAM

---

## Notes de relecture

| Statut | Item |
|---|---|
| ✅ Rédigé | Chiffres repris des Tableaux 3.1, 3.3, 3.4 et 3.5 |
| ✅ Vérifié | 276 mots (résumé), 251 mots (abstract) : dans la fourchette 250-300 du canevas |
