# Chapitre 2 : Matériels et méthodes

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 2.2 (2026-10-06)
> **Statut :** Aligné sur le protocole réellement implémenté (notebook `Experimentation/memoire_cnn_colab.ipynb`), relu pour le style. À relire.

---

## Introduction du chapitre

Une démarche expérimentale ne vaut que si l'on peut la suivre pas à pas. Ce chapitre expose donc les décisions qui ont structuré notre protocole : les données retenues et les raisons de ce choix, la préparation des images avant leur entrée dans le réseau, l'architecture utilisée, les règles d'entraînement et la manière dont les résultats ont été évalués. Ces étapes ne sont pas indépendantes. Changer de corpus oblige à revoir le prétraitement, qui conditionne lui-même l'entraînement, et la validité des résultats présentés au chapitre suivant dépend de leur cohérence d'ensemble. Nous avons aussi voulu qu'un lecteur souhaitant reproduire ou adapter ce travail trouve ici tout ce dont il a besoin. Dans un domaine où des décisions cliniques pourraient un jour s'appuyer sur ce type de système, cette exigence nous paraît faire partie de la rigueur scientifique elle-même.

---

## 2.1 Sources de données

### Critères de sélection du corpus

En imagerie médicale, choisir les données d'entraînement engage presque autant que choisir le modèle. Un corpus trop homogène, issu d'un seul hôpital, d'un seul équipement ou d'une seule population, produit des modèles qui apprennent les particularités de l'acquisition autant que les signes cliniques ; ils réussissent sur les images déjà vues et déçoivent ailleurs. Un corpus mal annoté pose un problème inverse : le bruit des étiquettes dégrade l'apprentissage et, ce qui est plus gênant encore, fausse l'évaluation. Nous avons donc fixé trois critères. Les étiquettes devaient avoir été posées ou vérifiées par des cliniciens, et non déduites automatiquement de comptes rendus. Chaque image devait pouvoir être rattachée à un patient, faute de quoi le partitionnement sans fuite de données décrit en section 2.4 devenait impossible. Enfin, le volume devait rester compatible avec nos moyens de calcul, en l'occurrence un GPU unique accessible par sessions de durée limitée.

Appliqués aux bases publiques présentées au Chapitre 1, ces critères nous ont conduit à retenir deux sources, qui se complètent par la pathologie couverte comme par la population représentée.

### Bases retenues

Le dataset **Kermany** (Kermany et al., 2018) réunit 5 856 radiographies thoraciques pédiatriques acquises au Guangzhou Women and Children's Medical Center, en Chine, chez des enfants de un à cinq ans. On y trouve 1 583 radiographies normales, 2 780 pneumonies bactériennes et 1 493 pneumonies virales. Les images ont été classées par des médecins experts, puis contrôlées par un troisième lecteur pour l'ensemble d'évaluation. Le volume est modeste, mais la qualité des annotations le compense en partie, de même que la population ciblée : chez l'enfant, le rapport cardiothoracique, la clarté des bases pulmonaires et la répartition des opacités diffèrent de ce que l'on observe chez l'adulte. Ce corpus offre en outre une information rare dans les grandes bases publiques, à savoir l'étiologie de la pneumonie. Elle nous permet de définir une sous-tâche qui intéresse directement le clinicien, puisque c'est d'elle que dépend le choix entre une antibiothérapie et un simple traitement de soutien.

Les bases **Montgomery** et **Shenzhen** (Jaeger et al., 2014) apportent la tuberculose pulmonaire, pathologie presque absente des grands datasets nord-américains. La première provient du programme de lutte antituberculeuse du comté de Montgomery, dans le Maryland (États-Unis) ; elle compte 138 radiographies, dont 58 de patients tuberculeux. La seconde a été constituée au Shenzhen No. 3 People's Hospital, en Chine, et compte 662 radiographies, dont 336 pathologiques. Ensemble, elles forment un jeu de 800 radiographies d'adultes à peu près équilibré (406 normales, 394 tuberculoses), annoté par des cliniciens à partir d'un diagnostic confirmé. Leur faible volume est une vraie limite, sur laquelle nous reviendrons au Chapitre 3. Nous les avons pourtant gardées, pour une raison simple : un outil destiné aux régions où la tuberculose reste endémique doit en connaître les signes, même appris sur peu d'exemples.

[TABLEAU 2.1]

### Bases envisagées et écartées

Plusieurs corpus de référence ont été étudiés puis écartés. Ces exclusions demandent à être justifiées. **ChestX-ray14** (Wang et al., 2017) et **CheXpert** (Irvin et al., 2019), avec 112 120 et 224 316 radiographies, auraient apporté un volume sans rapport avec celui des bases retenues. Leurs étiquettes ont toutefois été extraites des comptes rendus radiologiques par traitement automatique du langage, avec des erreurs que leurs auteurs documentent eux-mêmes ; CheXpert ajoute une catégorie « incertain » qui exige une stratégie de traitement propre. Les exploiter aurait en outre demandé plusieurs dizaines d'heures d'entraînement, hors de portée de l'infrastructure décrite en section 2.4. Le jeu du **RSNA Pneumonia Detection Challenge** (Shih et al., 2019), sous-ensemble de ChestX-ray14 enrichi de boîtes englobantes tracées par des radiologues, aurait permis de comparer les cartes Grad-CAM aux zones annotées. Cette validation spatiale fait partie des perspectives de ce travail.

Pour **COVIDx** (Wang et al., 2020), la raison est d'ordre méthodologique. Ce corpus rassemble des images de sources très diverses : les cas de COVID-19 et les cas témoins viennent pour l'essentiel d'établissements différents, et les identifiants patients n'y sont pas fournis de façon homogène. Il devient alors impossible de garantir un partitionnement par patient, sur lequel repose toute notre évaluation. Surtout, DeGrave et al. (2021) ont montré que les modèles entraînés sur ce type de corpus composite apprennent à reconnaître la provenance des images (marqueurs latéraux, cadrage, réglages d'acquisition) bien plus que les signes de la maladie. Leurs performances paraissent excellentes, puis s'effondrent sur des données externes. Nous avons préféré ne pas publier de chiffres dont nous ne pourrions pas défendre la validité, et limiter l'étude aux pathologies pour lesquelles un protocole rigoureux restait applicable. Le COVID-19 demeure traité au Chapitre 1, au titre de l'état de l'art.

### Tâches de classification

Les deux corpus retenus permettent de définir trois tâches de classification binaire. Chacune donne lieu à un modèle distinct, entraîné selon le même protocole :

1. **Pneumonie** : radiographie normale ou pneumonie, toutes étiologies confondues (Kermany, 5 856 images) ;
2. **Tuberculose** : radiographie normale ou tuberculose pulmonaire (Montgomery et Shenzhen, 800 images) ;
3. **Pneumonie bactérienne ou virale** : sous-tâche limitée aux radiographies de pneumonie du dataset Kermany (4 273 images), la classe positive étant la pneumonie virale.

Pourquoi trois modèles spécialisés plutôt qu'un classifieur unique ? Parce que les deux corpus n'ont presque rien en commun hormis l'organe examiné : population (enfants d'un côté, adultes de l'autre), centres, équipements. Les fusionner offrirait au réseau un raccourci évident, qui consisterait à reconnaître la source de l'image, et donc sa pathologie probable, à sa seule texture ou à sa résolution d'origine. C'est précisément le biais décrit par DeGrave et al. (2021).

---

## 2.2 Prétraitement des images

### Standardisation et augmentation

Des images venues de centres et d'appareils différents diffèrent à peu près sur tout. Les dimensions vont de quelques centaines de pixels pour certains clichés pédiatriques à près de 5 000 pixels de côté pour la base Montgomery. La plupart des fichiers sont codés sur 8 bits, ceux de Montgomery sur davantage. Les plages dynamiques varient avec les réglages d'acquisition. Aucun apprentissage cohérent n'est possible sans une standardisation préalable.

La première opération ramène toutes les images en niveaux de gris sur 8 bits. Pour les radiographies codées sur une profondeur supérieure, les intensités sont normalisées par la méthode min-max, ce qui conserve le contraste relatif de l'image sans écrêter les valeurs extrêmes. Chaque image est ensuite redimensionnée en 256 × 256 pixels par interpolation de Lanczos et stockée sous cette forme. Ce calcul n'est fait qu'une fois, ce qui évite de décoder à chaque époque des fichiers de plusieurs mégaoctets.

Le réseau reçoit finalement des images de 224 × 224 pixels, résolution d'entrée native de DenseNet-121 et, plus largement, des architectures pré-entraînées sur ImageNet. Ce format s'est imposé dans la communauté comme un compromis : assez fin pour conserver les structures utiles au diagnostic (opacités, consolidations, infiltrats), assez réduit pour que les calculs restent raisonnables sur un GPU ordinaire. Le canal unique de niveaux de gris est recopié sur trois plans afin d'obtenir une image pseudo-RGB. Courante dans les travaux sur la radiographie thoracique (Rajpurkar et al., 2017 ; Meedeniya et al., 2022), cette opération ne change rien au contenu diagnostique. Elle rend seulement l'image compatible avec des premières couches de convolution conçues pour trois canaux.

Les valeurs de pixels, ramenées dans l'intervalle [0, 1], sont ensuite normalisées selon les statistiques d'ImageNet : μ = [0,485 ; 0,456 ; 0,406] et σ = [0,229 ; 0,224 ; 0,225] par canal. Le transfer learning l'exige. Si la distribution des entrées s'écarte trop de celle sur laquelle les poids ont été appris, les premières couches reçoivent un signal qui ne correspond plus à leurs paramètres, et la convergence en souffre (Kim et al., 2022). C'est une étape discrète, mais l'une de celles dont l'oubli coûte le plus cher.

Le déséquilibre des classes est une difficulté classique en imagerie médicale. Entraîné sans correction sur des données asymétriques, un modèle comprend vite qu'il lui suffit de privilégier la classe majoritaire pour réduire sa perte, ce qui est acceptable sur le papier et dangereux en clinique. Notre corpus présente ici une particularité : dans le dataset Kermany, ce sont les cas pathologiques qui dominent (environ 73 % de pneumonies), et les pneumonies bactériennes y sont presque deux fois plus nombreuses que les virales. Seul l'ensemble Montgomery-Shenzhen est à peu près équilibré. Deux corrections étaient possibles, la pondération de la perte (*class-weighted loss*) ou le suréchantillonnage (*oversampling*) des classes minoritaires. Nous avons retenu la première. Dans la fonction de perte, le poids des exemples positifs est égal au rapport entre le nombre d'exemples négatifs et positifs de l'ensemble d'entraînement, si bien que les deux classes pèsent autant dans le gradient. Le suréchantillonnage, lui, aurait répété à l'identique les images minoritaires ; sur des volumes aussi faibles, le modèle aurait fini par les mémoriser, et chaque époque aurait été plus longue.

L'augmentation de données (*data augmentation*) vient compléter cette correction en jouant le rôle d'une régularisation implicite. Collecter davantage d'images est coûteux, souvent impossible en contexte médical ; on applique donc à chaque image, d'une époque à l'autre, des transformations aléatoires qui élargissent la variété des exemples vus par le modèle. Nous avons choisi des transformations plausibles sur le plan radiologique : rotations de ±15° au plus, qui imitent un patient légèrement mal positionné, zoom d'un facteur compris entre 0,9 et 1,1, rognage aléatoire conservant de 85 à 100 % de la surface avant recadrage à 224 × 224 pixels, retournement horizontal, et variation de la luminosité et du contraste de ±20 %. Les déformations élastiques, les rotations de grande amplitude et les retournements verticaux ont été exclus, car ils produiraient des images anatomiquement impossibles qui tromperaient le modèle au lieu de le renforcer.

[FIGURE 2.1]

Ces transformations ne s'appliquent qu'aux données d'entraînement. Les images de validation et de test sont seulement redimensionnées et normalisées, comme le seraient des images en situation réelle d'utilisation. Cette règle garantit que les performances mesurées décrivent le comportement du modèle, et non l'effet aléatoire d'une transformation.

---

## 2.3 Architecture CNN choisie

### DenseNet-121 : justification et adaptation

Lorsque les résultats doivent être confrontés à l'état de l'art, l'architecture ne peut pas être choisie par habitude ou par commodité. Elle doit avoir fait ses preuves sur le problème traité, et ce choix doit pouvoir être argumenté.

Nous avons retenu DenseNet-121 (*Dense Convolutional Network*, réseau convolutionnel densément connecté), proposé par Huang et al. (2017) et récompensé au CVPR 2017 par le *Best Paper Award*. Sa particularité est sa connectivité dense : à l'intérieur d'un bloc, chaque couche reçoit la concaténation des sorties de toutes les couches qui la précèdent, et non la seule sortie de sa voisine immédiate. ResNet, à titre de comparaison, additionne les sorties au lieu de les concaténer. Plusieurs avantages en découlent. Le gradient remonte plus facilement jusqu'aux premières couches, ce qui atténue le problème bien connu de sa disparition ; les représentations intermédiaires sont réutilisées ; le nombre de paramètres reste faible. Avec environ 8 millions de paramètres, DenseNet-121 est bien plus léger que ResNet-50 (environ 25 millions) ou VGG-16 (environ 138 millions) pour une précision comparable, ce qui compte lorsque les ressources de calcul sont limitées.

L'argument décisif tient pourtant à la littérature : DenseNet-121 est l'architecture de CheXNet (Rajpurkar et al., 2017), le modèle de l'Université Stanford qui a dépassé, pour la première fois, la performance moyenne de quatre radiologues dans la détection de la pneumonie sur radiographie thoracique. Ce précédent montre que cette architecture peut, dans de bonnes conditions d'entraînement, égaler ou dépasser l'expertise humaine sur une tâche voisine de la nôtre. La revue systématique de Meedeniya et al. (2022), qui porte sur 68 études de deep learning appliqué à la radiographie thoracique, range d'ailleurs DenseNet parmi les architectures les plus utilisées et les plus performantes du domaine, aux côtés de ResNet et de VGG.

Pour l'adapter à notre problème, nous avons remplacé sa tête de classification d'origine, entraînée sur les 1 000 classes d'ImageNet. Le dernier bloc dense produit 1 024 cartes de caractéristiques (*feature maps*) de 7 × 7 ; une couche de *Global Average Pooling* réduit chacune d'elles à une seule valeur, ce qui limite fortement le nombre de paramètres de la couche de sortie. Vient ensuite un dropout de taux 0,5, qui désactive au hasard la moitié des activations à chaque passage en entraînement, puis une couche entièrement connectée (*fully connected*) à un seul neurone, dont la sortie passe par une fonction sigmoïde pour donner une probabilité. Comme les trois tâches de la section 2.1 sont binaires, cette tête est la même pour les trois modèles. Elle ne compte que 1 025 paramètres.

[FIGURE 2.2]

L'apprentissage par transfert (*transfer learning*) se fait en deux phases, comme le recommandent Kim et al. (2022). Pendant la première, dite d'extraction de caractéristiques (*feature extraction*), les poids du backbone DenseNet-121, initialisés à partir d'ImageNet, sont gelés (*frozen*) : seule la nouvelle tête est entraînée. On protège ainsi les représentations de bas niveau (contours, textures, gradients locaux) que le réseau a apprises sur plus d'un million d'images naturelles et qui restent utiles, à quelques adaptations près, pour des radiographies. La seconde phase, le *fine-tuning*, dégèle progressivement les couches les plus profondes avec un taux d'apprentissage dix fois plus faible. Le quatrième et dernier bloc dense, ainsi que la normalisation qui le suit, sont dégelés dès la première époque de cette phase. Le troisième bloc dense et la couche de transition qui le précède le sont à partir de la sixième. Les deux premiers blocs, qui portent les représentations les plus génériques, restent gelés jusqu'au bout. Dans les couches gelées, nous figeons aussi les statistiques de normalisation par lots (*batch normalization*) apprises sur ImageNet, pour que la distribution des activations transmises aux couches supérieures ne dérive pas pendant l'entraînement. Le réseau peut ainsi s'adapter aux particularités des images médicales sans que les poids déjà appris soient bouleversés.

---

## 2.4 Stratégie d'entraînement et de validation

### Partitionnement, hyperparamètres et protocole

Une évaluation solide commence avant même la première mise à jour des poids, au moment où les données sont réparties entre entraînement, validation et test. Beaucoup d'études en imagerie médicale partitionnent au niveau de l'image. Plusieurs radiographies d'un même patient se retrouvent alors à la fois dans l'ensemble d'entraînement et dans l'ensemble de test, et cette fuite de données (*data leakage*), invisible, gonfle artificiellement les performances. Nous partitionnons donc strictement au niveau du patient : toutes les images d'une même personne vont dans le même ensemble, et aucun patient ne figure dans deux ensembles à la fois.

Les patients sont identifiés à partir des noms de fichiers fournis par les auteurs des corpus. Dans les bases Montgomery et Shenzhen, chaque radiographie correspond à un dossier distinct. Dans le dataset Kermany, les clichés de pneumonie portent un identifiant patient explicite, tandis que les clichés normaux portent un numéro d'examen, que nous utilisons comme identifiant de regroupement. Ce choix est prudent : si un même numéro couvrait plusieurs patients, la diversité des ensembles en serait un peu réduite, mais aucune fuite ne pourrait en résulter. Le dataset Kermany est par ailleurs livré avec son propre découpage en entraînement, validation et test, dont l'ensemble de validation ne compte que 16 images. C'est bien trop peu pour piloter l'arrêt anticipé ou fixer un seuil de décision. Nous avons donc regroupé toutes les images avant de les répartir selon notre protocole. En contrepartie, nos résultats ne se comparent pas directement à ceux des études qui utilisent l'ensemble de test officiel de Kermany ; nous discutons ce point au Chapitre 3.

Les patients sont répartis à raison de 70 % pour l'entraînement, 15 % pour la validation et 15 % pour le test. Le tirage est stratifié par classe, de sorte que la proportion de cas pathologiques reste la même dans les trois ensembles. Sur un corpus de quelques centaines de patients comme Montgomery-Shenzhen, cette précaution évite qu'un ensemble de test se retrouve presque vide de l'une des deux classes. L'ensemble de validation sert pendant l'entraînement : c'est sur lui qu'est calculée la perte qui déclenche l'arrêt anticipé et la baisse du taux d'apprentissage, et c'est lui qui fixe le seuil de décision. L'ensemble de test, en revanche, n'est consulté qu'une seule fois, à la toute fin, pour produire les métriques finales, quand plus aucune décision de conception ne reste à prendre. Le Tableau 2.2 détaille les effectifs obtenus pour chaque tâche.

[FIGURE 2.3]

[TABLEAU 2.2]

Nous utilisons l'optimiseur Adam (*Adaptive Moment Estimation*), qui ajuste le taux d'apprentissage de chaque paramètre et se montre de ce fait robuste face aux gradients clairsemés et aux problèmes non stationnaires que l'on rencontre avec des données médicales hétérogènes (Goodfellow et al., 2016). Le taux d'apprentissage vaut 1 × 10⁻⁴ pendant la phase d'extraction de caractéristiques, puis 1 × 10⁻⁵ pendant le *fine-tuning*. À l'intérieur de chaque phase, un mécanisme de réduction automatique (*ReduceLROnPlateau*) divise ce taux par deux lorsque la perte de validation ne progresse plus pendant cinq époques, ce qui aide le modèle à sortir d'un plateau sans intervention manuelle.

Les lots comptent 32 images. Des lots plus grands stabilisent le gradient mais atténuent l'effet régularisateur du bruit stochastique ; des lots plus petits ajoutent du bruit, ce qui peut aider à généraliser, au prix d'une convergence moins stable (Goodfellow et al., 2016). La valeur de 32 est un équilibre courant et tient sans difficulté dans la mémoire du GPU utilisé. L'entraînement est limité à 50 époques au total, soit 10 pour la première phase et 40 pour la seconde. Un arrêt anticipé (*Early Stopping*), déclenché après 10 époques sans amélioration de la perte de validation, peut toutefois interrompre chaque phase plus tôt. À la fin de chaque phase, on restaure les poids qui ont donné la plus faible perte de validation. C'est notre principale protection contre le surapprentissage en fin d'entraînement.

La régularisation passe par deux mécanismes. Le dropout de 0,5, décrit plus haut, empêche le réseau de dépendre de quelques activations particulières. La régularisation L2 (*weight decay*), appliquée par Adam avec un coefficient de 1 × 10⁻⁵, pénalise les poids trop grands et décourage les solutions inutilement complexes. La fonction de perte est l'entropie croisée binaire (*Binary Cross-Entropy*), pondérée comme indiqué en section 2.2. Elle revient à maximiser la log-vraisemblance des étiquettes et convient donc naturellement à une sortie sigmoïde.

Pour chaque radiographie, le modèle produit une probabilité entre 0 et 1. Il faut encore fixer un seuil au-delà duquel le cas est déclaré pathologique. Rien ne garantit que le seuil habituel de 0,5 soit le bon, d'autant que la pondération de la perte modifie l'échelle des probabilités. Le seuil de chaque modèle est donc choisi sur l'ensemble de validation, en retenant la valeur qui maximise l'indice de Youden (Youden, 1950), soit la sensibilité plus la spécificité moins un. Il est ensuite appliqué tel quel à l'ensemble de test, qui n'intervient jamais dans ce choix. Les métriques au seuil de 0,5 sont également conservées, par souci de transparence.

Pour la reproductibilité, une graine aléatoire (*random seed*) fixée à 42 contrôle toutes les étapes qui font intervenir le hasard : partitionnement, initialisation de la tête de classification, ordre des lots et transformations d'augmentation. Les algorithmes de convolution du GPU sont aussi contraints en mode déterministe, ce qui ralentit un peu l'entraînement. Une reproductibilité au bit près d'une machine à l'autre reste cependant hors d'atteinte, les bibliothèques de calcul ne la garantissant pas.

### Environnement d'expérimentation

Le code est écrit en Python avec la bibliothèque PyTorch. Son module torchvision fournit l'architecture DenseNet-121 et ses poids pré-entraînés sur ImageNet ; les métriques sont calculées avec scikit-learn. Les expériences ont été exécutées sur la plateforme Kaggle Notebooks, avec un GPU NVIDIA Tesla T4 de 16 Go de mémoire, sous Python 3.13, PyTorch 2.11 et torchvision 0.26. Pour raccourcir les époques, les calculs de propagation sont faits en précision mixte (demi-précision sur 16 bits), alors que la perte et les métriques restent calculées en précision simple. Dans ces conditions, l'entraînement a duré 26 minutes pour le modèle de pneumonie, 4 minutes pour celui de tuberculose et 16 minutes pour la sous-tâche bactérienne ou virale ; la configuration complète figure en annexe. L'ensemble du code, réuni dans un notebook unique qui s'exécute de bout en bout, sera publié dans un dépôt public [À PRÉCISER : adresse du dépôt].

---

## 2.5 Métriques d'évaluation

### Quantifier la performance diagnostique

Juger un classificateur médical à son seul taux de bonnes réponses serait réducteur, et même trompeur. L'exactitude (*accuracy*) ne distingue pas les types d'erreur, alors qu'en clinique ils n'ont pas le même coût : manquer une pneumonie est bien plus grave que déclencher une fausse alerte chez un patient sain. Elle induit aussi en erreur quand les classes sont déséquilibrées. Sur le dataset Kermany, un modèle qui déclarerait toutes les radiographies pathologiques obtiendrait près de 73 % d'exactitude sans avoir rien appris. Nous utilisons donc plusieurs métriques complémentaires, chacune éclairant un aspect du comportement diagnostique du modèle.

Tout part de la **matrice de confusion** (*confusion matrix*). Dans un cadre binaire (normal ou pathologique), elle range les prédictions en quatre catégories. Les vrais positifs (VP) sont les cas pathologiques correctement reconnus, les vrais négatifs (VN) les cas normaux correctement écartés. Les faux positifs (FP), ou erreurs de type I, sont des cas normaux signalés à tort comme pathologiques ; les faux négatifs (FN), ou erreurs de type II, des cas pathologiques que le modèle a laissé passer. Toutes les autres métriques se calculent à partir de ces quatre nombres.

La **précision** (*precision*), égale à VP / (VP + FP), indique ce que valent les alertes du modèle : parmi les cas qu'il signale, quelle part est réellement pathologique. Le **rappel** (*recall*), ou sensibilité, égal à VP / (VP + FN), mesure sa capacité à ne manquer aucun cas réel. C'est la métrique qui compte le plus lorsqu'un faux négatif met en jeu le pronostic vital. La **spécificité**, VN / (VN + FP), mesure au contraire sa capacité à écarter les cas normaux. Ces indicateurs tirent en sens opposés : gagner en sensibilité se paie souvent en spécificité, et inversement. Le **F1-score**, 2 × (précision × rappel) / (précision + rappel), est la moyenne harmonique de la précision et du rappel. Il résume ce compromis en un seul chiffre et pénalise un modèle qui sacrifierait l'un à l'autre. Rajpurkar et al. (2017) ayant comparé CheXNet aux radiologues sur cette métrique, elle constitue pour nous un point de comparaison naturel.

[FIGURE 2.5]

La **courbe ROC** (*Receiver Operating Characteristic*) représente, pour tous les seuils de décision possibles, le taux de vrais positifs (sensibilité) en fonction du taux de faux positifs (1 − spécificité). On y lit comment le compromis entre ces deux grandeurs évolue quand le seuil change. L'**AUC** (*Area Under the Curve*, aire sous la courbe ROC) résume cette courbe en une valeur comprise entre 0,5, qui correspond à un classement au hasard, et 1,0, qui traduirait une séparation parfaite des classes. Indépendante du seuil choisi et peu sensible au déséquilibre des classes, elle sert de référence pour comparer les modèles entre eux et aux performances humaines. Dans la littérature récente sur la détection automatique des pathologies pulmonaires, une AUC supérieure à 0,90 est généralement jugée cliniquement pertinente (Ahmad et al., 2023) [SOURCE MANQUANTE : à confirmer par une référence méthodologique dédiée].

[FIGURE 2.4]

Certains de nos ensembles de test sont petits : 120 patients seulement pour la tuberculose. Une valeur ponctuelle ne suffit donc pas : deux modèles dont l'AUC diffère de quelques centièmes peuvent très bien être statistiquement indiscernables. Chaque métrique est accompagnée d'un intervalle de confiance à 95 %, estimé par bootstrap (Efron & Tibshirani, 1993). L'ensemble de test est rééchantillonné avec remise 1 000 fois, la métrique est recalculée sur chaque échantillon, et les bornes de l'intervalle sont les percentiles 2,5 et 97,5 de la distribution obtenue. La largeur de ces intervalles dit à elle seule quelle confiance accorder aux chiffres présentés.

Aux indicateurs chiffrés s'ajoute la méthode **Grad-CAM** (*Gradient-weighted Class Activation Mapping*) de Selvaraju et al. (2017). Elle utilise les gradients calculés lors de la rétropropagation pour pondérer les cartes d'activation de la dernière couche convolutive, et produit une carte thermique (*heatmap*) superposée à l'image d'entrée. Dans notre implémentation, on calcule le gradient du score de la classe pathologique par rapport aux 1 024 cartes de 7 × 7 issues du dernier bloc dense. La moyenne spatiale de ce gradient donne le poids de chaque carte ; la somme pondérée des cartes, dont on ne garde que les valeurs positives, est ensuite agrandie à la taille de l'image. Les zones les plus chaudes sont celles qui ont le plus pesé dans la décision. Pour chaque pathologie, le Chapitre 3 présente deux cas tirés de l'ensemble de test : un vrai positif représentatif, dont le score se situe à la médiane des vrais positifs, et le faux négatif le plus net, c'est-à-dire le cas pathologique auquel le modèle a attribué la probabilité la plus faible.

Cette visualisation a deux usages. Elle permet d'abord de vérifier la cohérence anatomique des décisions. Si le modèle reconnaît correctement une pneumonie, les zones mises en évidence devraient correspondre aux régions de consolidation attendues, et non aux bords de l'image, à un marqueur latéral ou à une annotation technique. Ce genre de corrélation parasite est documenté (DeGrave et al., 2021) et passe souvent inaperçu dans les évaluations fondées sur les seuls chiffres. Elle répond ensuite à une question d'acceptabilité clinique : un praticien ne peut s'approprier une prédiction automatique, ou du moins la discuter, que s'il voit un peu sur quoi elle repose. C'est une condition nécessaire, pas suffisante, et c'est là que les questions éthiques du déploiement rejoignent les questions techniques. Les corpus retenus ne contenant pas d'annotations de localisation, cette analyse reste qualitative.

---

## Conclusion du chapitre

Les choix présentés dans ce chapitre s'enchaînent : chacun découle du précédent et prépare le suivant. Nous avons limité le corpus à des bases annotées par des cliniciens et traçables au niveau du patient. Ce choix nous a fait renoncer au volume des grands corpus annotés automatiquement, ainsi qu'à la détection du COVID-19, pour laquelle aucun protocole sans fuite ne pouvait être garanti. DenseNet-121 a été retenu parce que la littérature a déjà établi son efficacité pour la détection des pathologies pulmonaires sur radiographie. Le partitionnement au niveau du patient, le choix du seuil sur la seule validation et les mécanismes de régularisation visent tous à éviter que les performances soient surestimées, ce qui arrive vite avec une évaluation naïve. Les métriques retenues, F1-score et AUC assortis de leurs intervalles de confiance, complétées par Grad-CAM, répondent à des questions cliniques plutôt qu'à des habitudes statistiques. Enfin, la graine aléatoire fixée et le code publié permettront à d'autres de comparer, de contester ou de prolonger ces résultats, que le chapitre suivant présente et discute.

---

## Notes de relecture

| Statut | Item |
|---|---|
| ✅ Tranché | Framework : PyTorch / torchvision |
| ✅ Tranché | Infrastructure : Kaggle Notebooks, GPU Tesla T4 16 Go, Python 3.13, PyTorch 2.11, torchvision 0.26 (d'après `resume_pour_memoire.md`). **Plateforme à confirmer par l'auteur** (chemins `/kaggle/input`) |
| ✅ Tranché | Déséquilibre des classes : perte pondérée (poids des positifs = négatifs / positifs du train). **À faire valider par l'encadreur** |
| ✅ Tranché | Corpus restreint à Kermany + Montgomery/Shenzhen ; ChestX-ray14, CheXpert, RSNA et COVIDx écartés avec justification. **À faire valider par l'encadreur** |
| ✅ Style | v2.1 : tirets cadratins supprimés, phrases reformulées |
| ✅ Vérifié | Effectifs par classe (§ 2.1) identiques à ceux comptés par le notebook (5 856 / 800 / 4 273) |
| ✅ Rempli | Tableau 2.2 (effectifs par ensemble) |
| ⚠️ Annexe | Insérer la configuration complète (bloc JSON de `resume_pour_memoire.md`) |
| ⚠️ À PRÉCISER | Adresse du dépôt public du code |
| [SOURCE MANQUANTE] | Référence méthodologique pour le seuil AUC > 0,90 comme critère de pertinence clinique |
| ⚠️ Répercussions | L'introduction, le Ch.1 et le Ch.3 mentionnent encore COVIDx, « six bases » et ~388 000 images : à harmoniser |

---

*Version 2.1, alignée sur le notebook d'expérimentation | APA 7*
