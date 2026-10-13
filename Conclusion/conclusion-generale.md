# Conclusion générale

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 (2026-10-13)
> **Structure (canevas ESGIS) :** résumé du travail et contributions, impact, mot de fin ; limites et perspectives intégrées

---

Ce mémoire est parti d'un constat simple : là où les maladies pulmonaires tuent le plus, les radiologues capables de lire une radiographie thoracique sont les plus rares. Nous nous sommes demandé comment développer et évaluer un réseau de neurones convolutionnel capable de détecter ces maladies de manière efficace et fiable, en tenant compte des contraintes cliniques et éthiques du domaine médical. Notre hypothèse était qu'un CNN bien conçu, entraîné sur des données suffisamment variées, pouvait atteindre, voire dépasser, les performances diagnostiques des radiologues.

Pour y répondre, nous avons construit un protocole volontairement exigeant. Le corpus a été limité à deux ensembles de données publics annotés par des cliniciens et traçables au niveau du patient : 5 856 radiographies pédiatriques pour la pneumonie et 800 radiographies d'adultes pour la tuberculose. Un modèle DenseNet-121 pré-entraîné sur ImageNet a été adapté par apprentissage par transfert en deux phases. Les données ont été partagées par patient, le seuil de décision a été fixé sur la seule validation, chaque métrique a reçu un intervalle de confiance et chaque modèle a été examiné par Grad-CAM. Les résultats bruts sont élevés : une AUC de 0,996 pour la pneumonie, de 0,886 pour la tuberculose et de 0,843 pour la distinction entre pneumonie bactérienne et virale.

Le principal apport de ce travail tient pourtant moins à ces chiffres qu'à l'examen critique qui les a suivis. Les cartes Grad-CAM laissant soupçonner que le modèle de pneumonie regardait parfois hors des poumons, nous avons conçu un test de masquage. Un modèle privé de la partie centrale de l'image, et donc de l'essentiel des champs pulmonaires, détecte encore la pneumonie avec une AUC de 0,991, en s'appuyant notamment sur une électrode de surveillance. Sur ce corpus, une performance excellente peut donc être atteinte sans regarder la maladie. À l'inverse, masquer les bords ne coûte rien et ramène l'attention du modèle sur le parenchyme. Pour la tuberculose, la validation croisée entre hôpitaux montre que le modèle perd en performance dès qu'il change d'établissement, jusqu'à une AUC de 0,725 lorsqu'il a été entraîné sur une centaine d'images seulement. La comparaison avec ResNet-50 et EfficientNet-B0, enfin, confirme que ces constats ne tiennent pas au choix de l'architecture.

L'hypothèse de départ n'est donc que partiellement vérifiée. Les performances mesurées sont du niveau de celles que la littérature présente comme comparables à celles des radiologues, mais ce mémoire ne permet pas de conclure à une telle équivalence. D'une part, aucun radiologue n'a lu les mêmes images ; d'autre part, le test de masquage montre qu'une partie de la performance peut reposer sur des indices étrangers à la maladie. Ce résultat, qui pourrait passer pour un échec, nous paraît être la contribution la plus utile de ce travail. Il montre, sur un corpus très utilisé et par une expérience simple et reproductible, pourquoi une AUC élevée ne suffit pas à juger un outil d'aide au diagnostic.

La portée de ce constat dépasse le cadre de ce mémoire. Le corpus de Kermany sert depuis des années de référence à de nombreux travaux, qui y rapportent des performances très élevées (section 1.5). Nos résultats invitent à les lire avec prudence et proposent un moyen simple de les vérifier : masquer les bords et comparer. Pour les pays d'Afrique subsaharienne, l'enjeu est concret. Un outil importé sur la foi de chiffres obtenus ailleurs pourrait se révéler bien moins fiable sur des patients, des appareils et des pratiques différents, comme la validation croisée l'a montré à petite échelle.

Ce travail a aussi ses limites. Aucune radiographie ne provient du contexte où l'outil serait déployé. Le corpus de tuberculose reste trop petit pour une estimation précise des performances. La pneumonie n'a fait l'objet d'aucune validation externe. Enfin, l'analyse des cartes Grad-CAM n'a pas été confirmée par des radiologues. Ces limites tracent les perspectives les plus utiles : constituer des corpus africains annotés par des radiologues locaux, restreindre l'analyse aux champs pulmonaires par segmentation, valider les cartes d'activation à l'aide d'annotations de localisation, et mener une évaluation prospective dans un véritable circuit de soins. À plus long terme, l'apprentissage fédéré et les modèles combinant image et données cliniques permettraient d'élargir les données disponibles et de lever une partie des ambiguïtés que la radiographie seule ne résout pas.

De ces résultats découlent quelques recommandations pour tout projet de déploiement. Un modèle ne devrait jamais être mis en service sans avoir été évalué sur des données de l'établissement qui l'utilisera. Les images d'entraînement devraient être débarrassées des marqueurs, annotations et dispositifs visibles sur les bords, puisque cette précaution ne coûte rien en performance. Chaque prédiction devrait être accompagnée de son score et de sa carte d'activation, et le seuil de décision rester réglable par les cliniciens. Un tel outil peut aider à trier les clichés et à signaler les cas suspects, mais il ne remplace pas le jugement d'un médecin.

En commençant ce travail, nous pensions surtout chercher le modèle le plus performant. Nous avons surtout appris à nous méfier d'un résultat trop beau, et à chercher ce qu'il cache avant de le croire. Si l'intelligence artificielle doit un jour contribuer à combler le manque de radiologues en Afrique, ce sera moins grâce à des chiffres record que grâce à cette exigence de vérification, appliquée sur des données qui ressemblent aux patients qu'elle prétend servir.

---

## Notes de relecture

| Statut | Item |
|---|---|
| ✅ Rédigé | Chiffres repris des Tableaux 3.1, 3.3, 3.4 et 3.5 ; aucune référence nouvelle |
| ⚠️ À personnaliser | Dernier paragraphe (« mot de fin ») : réflexion personnelle à reformuler avec tes propres mots |
