# Chapitre 3 — Résultats et Discussion

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 — 2026-04-04
> **Statut :** Relu et validé ✓

---

## Introduction du chapitre

C'est ici que les choix méthodologiques du chapitre précédent passent à l'épreuve des données. L'hypothèse qui traverse ce travail — qu'un CNN entraîné sur un corpus suffisamment varié peut rivaliser avec un radiologue humain pour la détection des maladies pulmonaires — est soumise à une vérification en cinq temps. La première section présente les résultats quantitatifs du modèle sur les ensembles de test, organisés par pathologie et par métrique. La deuxième s'y enfonce davantage : matrices de confusion et courbes ROC révèlent la texture des erreurs, là où les moyennes agrégées ne disent rien. La troisième situe ces résultats dans le paysage de la littérature, confrontant notre modèle aux systèmes de référence. La quatrième examine les cartes Grad-CAM, qui permettent d'évaluer si le réseau s'appuie sur les bonnes régions anatomiques pour prendre ses décisions. La cinquième, enfin, recense les limites de l'approche et les questions — cliniques, éthiques, réglementaires — qu'un déploiement réel ne pourrait esquiver. Une précision s'impose d'emblée : les valeurs numériques issues de notre propre expérimentation sont signalées par le marqueur [RÉSULTATS À COMPLÉTER] et seront renseignées une fois l'implémentation achevée. Les chiffres de la littérature mobilisés comme benchmarks sont, eux, issus de sources primaires vérifiées.

---

## 3.1 Résultats quantitatifs

### Performances du modèle sur l'ensemble de test

La crédibilité d'une évaluation tient à une condition simple mais exigeante : les données de test ne doivent avoir joué aucun rôle dans les décisions d'entraînement — ni dans la sélection des hyperparamètres, ni dans les ajustements d'architecture. Notre partitionnement au niveau patient garantit cette séparation. Les métriques présentées ici reflètent donc le comportement réel du modèle face à des radiographies qu'il n'a jamais vues, dans des conditions qui anticipent autant que possible celles d'un usage en production.

Le tableau ci-dessous rassemble les cinq indicateurs retenus — précision, rappel, spécificité, F1-score et AUC — pour les trois pathologies cibles et pour la moyenne globale.

[TABLEAU 3.1]

Pour cadrer ces valeurs, deux repères issus de la littérature : CheXNet (Rajpurkar et al., 2017) a atteint un F1-score de 0,435 sur la détection de pneumonie dans ChestX-ray14, dépassant ainsi la moyenne de quatre radiologues humains dont le F1 s'établissait à 0,387. Ahmad et al. (2023), dans leur revue de 46 études publiées entre 2020 et 2022, situent les valeurs d'AUC des modèles de deep learning entre 0,87 et 0,96 pour la même tâche. Ce sont ces plages qui constituent notre horizon de comparaison.

Les trois pathologies cibles n'offrent pas les mêmes conditions d'entraînement, et leurs résultats respectifs s'en ressentiront probablement. La pneumonie bénéficie du corpus le plus dense : ChestX-ray14 et Kermany combinés fournissent plusieurs dizaines de milliers d'exemples annotés, couvrant aussi bien les formes bactériennes que virales. On peut raisonnablement s'attendre à ce que les estimations de rappel et de spécificité soient les plus stables sur cette classe. La tuberculose est dans une position bien moins favorable : les bases Montgomery et Shenzhen ne totalisent qu'environ 800 images, dont seulement une fraction est disponible pour l'entraînement après partitionnement au niveau patient. Ce volume contraint expose le sous-module tuberculose à un surapprentissage (*overfitting*) que les mécanismes de régularisation — dropout, Early Stopping, pénalité L2 — peuvent atténuer, mais difficilement éliminer. Les métriques correspondantes devront donc être interprétées avec la plus grande prudence. Quant au COVID-19, les résultats obtenus sur COVIDx reflèteront nécessairement la nature composite de ce corpus : constitué par agrégation de plusieurs sources institutionnelles et géographiques, il présente une variabilité inter-sites qui renforce la robustesse du modèle mais introduit en même temps une dispersion dans les performances selon l'origine des images de test.

[FIGURE 3.1]

Les courbes d'apprentissage enregistrées pendant l'entraînement livrent une lecture complémentaire. Un profil sain se traduit par la convergence parallèle des courbes de perte d'entraînement et de validation, sans que l'écart entre elles ne se creuse durablement. Si cet écart — le *gap de généralisation* — venait à s'élargir malgré les régularisations, l'arrêt précoce (*Early Stopping*) serait censé interrompre l'entraînement avant que le modèle ne mémorise plutôt qu'il n'apprenne. La phase de *feature extraction*, avec le backbone gelé, devrait produire une convergence rapide vers un plateau ; la phase de *fine-tuning* qui lui succède, conduite à taux d'apprentissage réduit, devrait générer un gain plus modeste mais mesurable sur l'AUC, en adaptant les représentations profondes du réseau aux spécificités des images radiographiques. Ce comportement en deux temps est l'un des bénéfices les plus documentés du transfer learning sur des corpus médicaux de taille intermédiaire (Kim et al., 2022).

---

## 3.2 Visualisations et analyse qualitative

### Structure des erreurs et comportement diagnostique

Les métriques scalaires disent combien d'erreurs le modèle commet. Elles ne disent pas *lesquelles* — ni si ces erreurs sont cliniquement tolérables. C'est précisément ce que révèlent les visualisations qui suivent.

[FIGURE 3.2]

Une matrice de confusion ne se lit pas de manière symétrique. En contexte de dépistage — et c'est bien de cela qu'il s'agit ici —, les faux négatifs pèsent bien plus lourd que les faux positifs. Un faux négatif, c'est un patient atteint que le modèle a laissé passer comme normal ; il rentrera chez lui sans diagnostic, sans traitement, avec le risque que sa pathologie s'aggrave silencieusement. Un faux positif, à l'inverse, oriente un patient sain vers des examens complémentaires inutiles — charge non négligeable, mais sans conséquence irréversible sur le plan vital. Cette asymétrie des coûts d'erreur justifie de calibrer le seuil de décision en faveur du rappel, au prix d'une légère dégradation de la spécificité. Dans ce cadre, un taux de faux négatifs inférieur à 15 % des cas positifs réels pour la détection de pneumonie constituerait un résultat cliniquement acceptable [RÉSULTATS À COMPLÉTER].

Un point d'attention particulier concerne la discrimination entre pneumonie bactérienne et pneumonie virale — sous-tâche rendue possible par le dataset Kermany (Kermany et al., 2018). La distinction n'est pas anodine : elle conditionne le choix thérapeutique, entre antibiothérapie et traitement antiviral. Mais elle est radiographiquement redoutable, les deux présentations pouvant produire des opacités quasi indiscernables sur un cliché standard. On s'attend à ce que les performances du modèle sur cette sous-tâche restent en deçà de celles obtenues pour la classification binaire simple, et ce résultat, s'il se confirme, ne serait pas un échec : il refléterait fidèlement la difficulté intrinsèque du problème [RÉSULTATS À COMPLÉTER].

[FIGURE 3.3]

La superposition des courbes ROC pour les trois pathologies offre une vision comparative que les tableaux de métriques ne peuvent pas restituer. Elle révèle la hiérarchie des performances — laquelle des trois tâches le modèle maîtrise-t-il le mieux ? — et permet d'identifier le *point de fonctionnement optimal* (*operating point*), c'est-à-dire le seuil de décision qui réalise le meilleur équilibre entre sensibilité et spécificité compte tenu du contexte d'utilisation. Cet équilibre n'est pas universel. En situation de dépistage dans des zones sous-médicalisées, où chaque cas manqué peut devenir fatal faute de recours alternatif, on placera le point de fonctionnement à une sensibilité ≥ 0,90, quitte à tolérer une spécificité modérée. En contexte de confirmation diagnostique dans un hôpital disposant d'examens complémentaires, le curseur se déplacera vers une précision plus élevée. Cette adaptabilité du seuil au contexte d'usage est précisément ce que l'architecture sigmoïde de notre couche de sortie permet de réaliser sans modification architecturale.

---

## 3.3 Comparaison avec l'état de l'art

### Positionnement des performances dans la littérature

Comparer un modèle à la littérature est moins simple qu'il n'y paraît. Les études publiées dans ce domaine ne sont pas directement commensurables : elles s'appuient sur des datasets de tailles et de compositions très diverses, appliquent des seuils de décision rarement explicités de façon uniforme, et adoptent des protocoles d'évaluation dont l'hétérogénéité rend les comparaisons chiffre-à-chiffre périlleuses. Il reste possible — et nécessaire — de s'y prêter, à condition de ne pas oublier ces précautions de lecture.

[TABLEAU 3.2]

L'étalon naturel de ce travail est CheXNet (Rajpurkar et al., 2017). En 2017, ce modèle — fondé sur la même architecture DenseNet-121 que la nôtre — a franchi un seuil symbolique en obtenant un F1-score de 0,435 sur la détection de pneumonie dans ChestX-ray14, contre 0,387 pour la moyenne des radiologues comparés. C'est ce seuil que nous cherchons à atteindre ou à dépasser. Plusieurs éléments de notre protocole nous en distinguent cependant. Le corpus que nous mobilisons est plus diversifié — six sources contre une —, ce qui devrait améliorer la robustesse du modèle à des images hors distribution, au prix d'un signal d'entraînement plus bruité. Le protocole d'annotation NLP de ChestX-ray14 introduit un bruit structurel estimé à plusieurs points de pourcentage (Wang et al., 2017) ; notre stratégie de pondération différentielle des pertes vise à en atténuer l'effet sur les métriques finales. Enfin, l'augmentation de données plus variée que nous appliquons devrait se traduire par une meilleure généralisation — notamment en AUC sur des données hors distribution —, au détriment éventuel d'un F1-score légèrement inférieur sur ChestX-ray14 seul.

Les études portant spécifiquement sur le COVID-19 méritent un traitement à part. Sethy & Behera (2020) annoncent 95,38 % de précision et 97,2 % de sensibilité pour un système ResNet-50 + SVM ; Apostolopoulos & Mpesiana (2020) atteignent 98,75 % de sensibilité avec VGG-19. Des chiffres impressionnants — mais obtenus dans des conditions qui expliquent au moins en partie leur niveau. Ces deux études s'appuient sur des datasets très réduits, collectés en début de pandémie, dans des conditions d'acquisition relativement homogènes et peu représentatives de la variabilité clinique réelle. Ahmad et al. (2023) ont montré, sur un corpus de 46 études, que les performances des modèles de deep learning tendent à décroître à mesure que la taille et l'hétérogénéité du dataset augmentent — phénomène qu'on pourrait appeler *overfitting au dataset*, distinct du surapprentissage classique mais tout aussi problématique pour la généralisabilité. Notre approche reposant sur COVIDx — composite par construction, issu de centres multiples —, les résultats que nous obtiendrons seront vraisemblablement moins spectaculaires. Mais ils seront probablement plus proches de ce qu'un vrai déploiement clinique produirait.

Certes, ces comparaisons restent imparfaites. La taille du corpus, les seuils de décision retenus, le niveau de supervision des annotations, la manière dont le partitionnement train/test a été conduit — autant de variables qui influencent les métriques finales sans apparaître nécessairement dans les articles publiés (Kim et al., 2022). La bonne lecture consiste donc à considérer les écarts comme des ordres de grandeur, non comme des écarts mesurables à la virgule près.

---

## 3.4 Cartes Grad-CAM et explainabilité

### Le modèle regarde-t-il aux bons endroits ?

Une AUC élevée ne dit rien sur ce que le modèle a appris. Il arrive — et ce n'est pas une hypothèse d'école — qu'un réseau de neurones atteigne de très bonnes performances de classification en s'appuyant sur des corrélations parasites : un logo d'hôpital en marge du cliché, un artefact de compression systématiquement présent dans les images positives d'un centre donné, une distribution géographique des étiquettes qui corrèle avec des caractéristiques d'équipement plutôt qu'avec la pathologie. Un tel modèle ne détecterait rien de cliniquement pertinent — et il s'effondrerait dès qu'il serait sorti du contexte d'acquisition dans lequel il a été entraîné. Vérifier *où* le modèle regarde n'est donc pas un supplément d'âme : c'est une condition de validité.

Grad-CAM (*Gradient-weighted Class Activation Mapping*) (Selvaraju et al., 2017) répond à ce besoin. La méthode calcule, pour chaque décision de classification, les gradients de la sortie prédite par rapport aux activations de la dernière couche convolutive, les pondère en conséquence, et projette le résultat sur l'espace spatial de l'image originale. La carte thermique (*heatmap*) ainsi obtenue met en évidence les régions qui ont pesé dans la décision — non comme une vérité absolue sur le fonctionnement du réseau, mais comme une approximation locale lisible par un clinicien.

[FIGURE 3.4]

Les profils d'activation attendus pour chaque pathologie suivent une logique sémiologique cohérente avec la radiologie clinique. Pour la pneumonie, les zones de consolidation alvéolaire — bases pulmonaires et régions péri-hilaires en priorité — devraient concentrer l'essentiel de l'activation dans les cas bien classés [RÉSULTATS À COMPLÉTER]. Pour la tuberculose pulmonaire active, c'est vers les apex qu'on orientera le regard : siège préférentiel des cavernes et des infiltrats primaires, ces régions sont celles dont l'activation cohérente validerait que le modèle a appris quelque chose de diagnostiquement fondé [RÉSULTATS À COMPLÉTER]. Pour le COVID-19, les opacités périphériques bilatérales en verre dépoli constituent la signature attendue ; leur correspondance avec les zones activées par Grad-CAM constituerait l'argument le plus convaincant en faveur de la pertinence clinique du modèle [RÉSULTATS À COMPLÉTER].

Panwar et al. (2020), dans un travail sur la détection du COVID-19 par VGG-19, ont montré que les cartes Grad-CAM produites par leur modèle correspondaient aux zones prioritairement inspectées par des radiologues experts lors de la relecture des mêmes clichés. Ce résultat — qui n'était pas acquis d'avance — a joué un rôle non négligeable dans l'acceptabilité clinique de leur système en période de crise pandémique. C'est un précédent utile pour comprendre ce que nous cherchons à démontrer : non que le modèle soit parfait, mais qu'il regarde aux bons endroits quand il a raison.

L'analyse des cas problématiques n'est pas moins instructive. Un faux négatif dont la heatmap est dispersée ou centrée sur des structures non pathologiques indique que le modèle n'a pas su construire une représentation de cette lésion particulière — parce qu'elle est trop subtile, trop atypique, ou trop peu représentée dans le corpus d'entraînement. Un faux positif dont l'activation se concentre sur un bord de cliché ou sur une annotation technique révèle un biais d'apprentissage plus profond, que ni la régularisation ni l'augmentation ne peuvent corriger sans intervention sur le corpus. Dans les deux cas, Grad-CAM ne résout pas le problème — il le rend visible, ce qui est le préalable à tout correctif (Selvaraju et al., 2017).

---

## 3.5 Limites, implications cliniques et éthiques

### Ce que les chiffres ne disent pas

Un résultat d'AUC ne porte pas en lui-même les conditions de son interprétation. Derrière les métriques se cachent des hypothèses sur la qualité des données, sur la représentativité des populations testées, sur la structure du protocole d'évaluation — autant de facteurs qui conditionnent la portée réelle des conclusions qu'on peut en tirer. Reconnaître ces limites n'affaiblit pas le travail : c'est précisément ce qui le rend utilisable.

La première limite est la plus structurelle : la qualité des annotations de ChestX-ray14. Générées par extraction automatique depuis des comptes rendus cliniques via traitement du langage naturel, ces étiquettes ne sont pas exemptes d'erreurs — Wang et al. (2017) eux-mêmes les estiment à plusieurs points de pourcentage. Ce bruit d'annotation plafonne mécaniquement les performances atteignables sur ce corpus, indépendamment de l'architecture ou de l'optimiseur choisis. La deuxième limite est géographique : l'essentiel du corpus mobilisé — ChestX-ray14, CheXpert, RSNA, COVIDx — provient de systèmes de santé nord-américains. Les équipements d'acquisition, les pratiques de positionnement, les profils épidémiologiques et les comorbidités associées y diffèrent sensiblement de ce qu'on observerait en Afrique subsaharienne ou en Asie du Sud-Est, où l'impact potentiel d'un tel outil serait pourtant le plus grand. Ce phénomène de *domain shift* — déclin de performance lors du passage d'un domaine d'entraînement à un domaine de déploiement différent — est documenté et quantifié dans la littérature (Kim et al., 2022). La troisième limite est volumétrique : environ 800 images au total pour la tuberculose, c'est trop peu pour tirer des conclusions généralisables sur cette pathologie considérée isolément, quelle que soit la sophistication du modèle. La quatrième, enfin, est l'absence de validation prospective — évaluation sur des données collectées en temps réel dans un flux diagnostique réel. L'ensemble de test statique utilisé ici reste une approximation de la réalité clinique, non un substitut.

Ces limites ne condamnent pas l'outil. Elles définissent son périmètre légitime — et c'est dans ce périmètre que les implications cliniques prennent sens. L'usage le plus défendable pour un système de ce type est celui d'un outil d'aide au diagnostic (*Computer-Aided Detection*, CAD), pensé comme un premier filtre et non comme une autorité diagnostique. Dans des zones où un radiologue est absent — ou où les délais d'interprétation se comptent en semaines faute de spécialistes disponibles —, un tel outil peut trier les clichés par ordre de priorité, alerter sur les cas suspects, et réduire le temps entre acquisition de l'image et prise en charge du patient. Certes, ce scénario présuppose une validation prospective sur la population locale, une formation adéquate des utilisateurs, et une interface pensée pour des conditions d'infrastructure souvent difficiles — connectivité limitée, alimentation électrique intermittente, matériel vieillissant. Aucune de ces conditions n'est hors de portée, mais aucune ne se satisfait d'une bonne AUC publiée dans un mémoire.

Les questions éthiques, pour leur part, méritent d'être posées frontalement plutôt que reléguées en note de bas de page. La responsabilité médicale, d'abord : en cas d'erreur diagnostique impliquant un outil automatisé, qui en répond ? La doctrine dominante — le praticien qui utilise le système reste responsable de la décision finale — présuppose que ce praticien dispose d'une formation suffisante pour évaluer critiquement les sorties du modèle. C'est une présupposition qui mérite d'être vérifiée, et non tenue pour acquise. L'opacité algorithmique, ensuite : Grad-CAM constitue un progrès réel, mais il ne transforme pas un réseau de neurones en système transparent. Les cartes thermiques indiquent où le modèle a regardé — elles ne disent pas pourquoi ce regard a conduit à cette conclusion, ni dans quelles conditions il pourrait se tromper. L'équité algorithmique (*algorithmic fairness*), enfin : un modèle entraîné sur des données mal représentatives de certaines populations pourrait produire des performances systématiquement inférieures pour des groupes déjà défavorisés — exactement les patients pour lesquels un outil de triage automatisé aurait le plus d'intérêt. Ce paradoxe n'est pas une fatalité, mais il exige une vigilance active dans la constitution des corpus futurs. Sur le plan réglementaire, l'*EU Artificial Intelligence Act* et les *Guidance Documents* de la FDA imposent des exigences croissantes en matière de transparence, de traçabilité et de validation post-marché pour les systèmes d'IA à usage médical [SOURCE MANQUANTE — citer le texte réglementaire applicable] — exigences dont tout déploiement clinique devra tenir compte.

Plusieurs recommandations pratiques découlent de cette analyse. Aucun déploiement ne devrait intervenir sans validation prospective préalable, conduite sur la population cible dans ses conditions réelles d'acquisition. Le seuil de décision doit rester paramétrable par l'opérateur — il n'existe pas de seuil universel, et prétendre le contraire serait une forme de paresse méthodologique. Chaque prédiction doit être présentée avec son score de confiance et la carte Grad-CAM correspondante, pour que le praticien dispose de tous les éléments permettant un jugement éclairé. Enfin, un mécanisme de retour d'information (*feedback loop*) doit être prévu dès la phase de conception : les modèles entraînés une fois pour toutes s'érodent face à la dérive des pratiques cliniques et des équipements ; les meilleurs systèmes sont ceux qui apprennent en continu depuis le terrain.

Quant aux perspectives de recherche, elles sont suffisamment nombreuses pour que seules les plus prometteuses soient mentionnées ici. Les architectures *Vision Transformer* (ViT) — qui importent dans le domaine de l'image le mécanisme d'attention multi-têtes des transformers NLP — ont montré des capacités de généralisation supérieures aux CNN sur plusieurs benchmarks d'imagerie médicale [SOURCE MANQUANTE] et constituent la piste d'évolution architecturale la plus naturelle. L'apprentissage fédéré (*federated learning*), qui permet à plusieurs institutions de contribuer à l'entraînement d'un modèle commun sans jamais partager leurs données patients, répond simultanément aux enjeux de confidentialité et de représentativité géographique. Les modèles multimodaux — capables d'intégrer simultanément images radiographiques et données cliniques structurées (âge, symptomatologie, résultats biologiques) — constituent une direction à fort potentiel diagnostique que les systèmes purement visuels ne peuvent pas encore exploiter. Et la constitution de corpus africains et asiatiques, annotés par des experts locaux et reflétant la réalité épidémiologique et technique de ces contextes, demeure peut-être la priorité la moins spectaculaire et la plus nécessaire.

---

## Conclusion du chapitre

Ce chapitre a construit le cadre analytique dans lequel les résultats de notre modèle seront interprétés. Les benchmarks de la littérature — F1-score de 0,435 pour CheXNet (Rajpurkar et al., 2017), AUC de 0,87 à 0,96 pour les modèles récents (Ahmad et al., 2023) — tracent l'horizon auquel notre approche sera mesurée. L'analyse qualitative par matrices de confusion, courbes ROC et cartes Grad-CAM permettra de dépasser les agrégats pour comprendre la nature des erreurs et vérifier la cohérence anatomique des décisions du réseau. Les limites documentées — qualité des annotations NLP, biais géographique du corpus, volume insuffisant sur la tuberculose, absence de validation prospective — ne disqualifient pas l'approche. Elles en définissent le périmètre d'utilisation légitime, et c'est dans ce périmètre qu'un CNN bien entraîné peut apporter une contribution réelle : un outil de triage automatisé, robuste, explicable, déployable dans des contextes où aucun radiologue n'est disponible pour interpréter les clichés dans des délais cliniquement acceptables. C'est sur cette conviction — nuancée, mais fondée — que la conclusion générale de ce mémoire prendra appui.

---

## Notes de relecture

| Statut | Item |
|---|---|
| [RÉSULTATS À COMPLÉTER] | Toutes les métriques du modèle (Tableau 3.1, Figure 3.1, Figure 3.2, Figure 3.3, Figure 3.4) |
| [SOURCE MANQUANTE] | Texte réglementaire IA médicale (EU AI Act / FDA Guidance) |
| [SOURCE MANQUANTE] | Référence Vision Transformer (ViT) supérieur aux CNN en imagerie médicale |

---

*~13 pages | APA 7 | Humanisé par /memoire-humanizer*
