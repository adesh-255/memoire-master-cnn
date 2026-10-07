# Chapitre 3 : Résultats et discussion

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 2.0 (2026-10-06)
> **Statut :** Rédigé à partir des résultats de l'expérimentation du 2026-10-06 (`memoire_resultats/`). À relire

---

## Introduction du chapitre

Ce chapitre confronte le protocole décrit au Chapitre 2 aux données. L'hypothèse de départ, selon laquelle un CNN entraîné sur un corpus suffisamment varié peut rivaliser avec un radiologue pour la détection des maladies pulmonaires, y est examinée en cinq temps. Nous présentons d'abord les performances des trois modèles sur leurs ensembles de test, puis la structure de leurs erreurs à travers les matrices de confusion et les courbes ROC. Nous situons ensuite ces résultats par rapport à la littérature, avant d'examiner les cartes Grad-CAM pour savoir sur quelles régions de l'image les modèles fondent leurs décisions. La dernière section recense les limites de l'étude et les questions cliniques, éthiques et réglementaires qu'un déploiement réel soulèverait. Disons-le dès maintenant : les chiffres sont très bons pour la pneumonie, plus modestes pour la tuberculose, et l'analyse Grad-CAM tempère sérieusement l'interprétation des premiers.

---

## 3.1 Résultats quantitatifs

### Performances des modèles sur l'ensemble de test

Toutes les valeurs qui suivent ont été mesurées sur des ensembles de test qui n'ont joué aucun rôle dans l'entraînement : ni dans l'ajustement des poids, ni dans l'arrêt anticipé, ni dans le choix du seuil de décision, fixé sur la validation. Le partitionnement par patient garantit en outre qu'aucune radiographie d'un patient de test n'a été vue pendant l'apprentissage. Les métriques décrivent donc le comportement des modèles face à des patients nouveaux, issus toutefois des mêmes centres que les données d'entraînement, point sur lequel nous reviendrons. Le Tableau 3.1 rassemble les cinq indicateurs retenus, chacun accompagné de son intervalle de confiance à 95 % obtenu par bootstrap.

[TABLEAU 3.1]

Le modèle de détection de la **pneumonie** obtient les meilleurs résultats, et de loin. Sur 925 radiographies de test (419 patients), il atteint une AUC de 0,996 [0,993 ; 0,998], un rappel de 0,966 et une spécificité de 0,984. En valeur absolue, il ne commet que 27 erreurs : 23 pneumonies manquées sur 673 et 4 fausses alertes sur 252 radiographies normales. Les intervalles de confiance sont étroits, ce qui tient au volume de l'ensemble de test, et le seuil choisi en validation (0,587) donne des résultats presque identiques au seuil conventionnel de 0,5. Les erreurs ne se répartissent pas au hasard : 5,5 % des pneumonies virales du test sont manquées (12 sur 217), contre 2,4 % des pneumonies bactériennes (11 sur 456). C'est cohérent avec la sémiologie, les pneumonies virales produisant plus souvent des infiltrats interstitiels discrets que des condensations franches.

Les résultats sur la **tuberculose** sont nettement plus modestes : AUC de 0,886 [0,816 ; 0,942], rappel de 0,780 et spécificité de 0,836 sur 120 radiographies de test. Le modèle manque 13 tuberculoses sur 59 et signale à tort 10 radiographies normales sur 61. L'étendue des intervalles de confiance, près de 0,13 pour l'AUC et plus de 0,20 pour le rappel, rappelle qu'avec un ensemble de test de cette taille, chaque erreur déplace sensiblement les métriques. Ventilés par base d'origine, les résultats sont contrastés. Sur les 21 radiographies de test issues de Montgomery, le modèle ne commet qu'une seule erreur ; sur les 99 issues de Shenzhen, il en commet 22. Nous discutons plus loin ce que cet écart peut signifier.

La sous-tâche de distinction entre **pneumonie bactérienne et virale** donne une AUC de 0,843 [0,809 ; 0,873], un rappel de 0,770 pour la classe virale et une spécificité de 0,788. La précision, 0,668, est la plus faible des trois modèles : un tiers des radiographies que le modèle déclare virales sont en réalité bactériennes. Nous y revenons en section 3.2.

En moyenne sur les deux tâches de détection (pneumonie et tuberculose), le modèle atteint une AUC de 0,941 et un F1-score de 0,890. Cette moyenne est donnée pour mémoire ; elle agrège deux problèmes de nature très différente et masque l'écart qui les sépare.

[FIGURE 3.1]

Les courbes d'apprentissage (Figure 3.1) éclairent ces écarts. Pour la pneumonie, la perte de validation suit la perte d'entraînement jusqu'à l'époque 25 environ, puis se stabilise vers 0,05 tandis que la perte d'entraînement continue de baisser lentement. L'écart reste faible et le modèle retenu est celui de l'époque 46, sur 50. Le dégel des derniers blocs au début de la phase 2 produit un saut net de l'exactitude de validation, qui passe de 0,877 à 0,923 en une époque : le bénéfice du *fine-tuning* décrit par Kim et al. (2022) est ici directement visible.

Le cas de la tuberculose est différent. Pendant la phase 1, où seule la tête de classification apprend, l'exactitude de validation reste proche de 0,50, ce qui signifie que les caractéristiques ImageNet gelées ne suffisent pas à séparer les deux classes sur ce corpus. Le modèle ne commence à apprendre qu'après le dégel des blocs profonds. Il progresse ensuite jusqu'à la fin de l'entraînement, le meilleur état étant atteint à l'époque 47, et l'écart entre les pertes d'entraînement (0,27) et de validation (0,43) se creuse. Deux lectures sont possibles, et elles ne s'excluent pas : le modèle aurait encore pu progresser avec davantage d'époques, mais il commençait aussi à mémoriser un ensemble d'entraînement de 559 images.

Pour la sous-tâche bactérienne ou virale, enfin, la perte de validation cesse de diminuer vers l'époque 31 alors que la perte d'entraînement continue de chuter. L'arrêt anticipé a interrompu l'entraînement dix époques plus tard et restauré les poids de l'époque 31. C'est le profil typique d'un modèle qui a extrait des images ce qu'elles permettaient d'apprendre et qui, au-delà, ne ferait plus que mémoriser.

---

## 3.2 Visualisations et analyse des erreurs

### Structure des erreurs et comportement diagnostique

Les métriques disent combien d'erreurs un modèle commet, pas lesquelles. Or, en situation de dépistage, toutes les erreurs ne se valent pas. Un faux négatif renvoie chez lui un patient malade, sans diagnostic ni traitement ; un faux positif impose à un patient sain un examen complémentaire inutile, ce qui a un coût mais pas de conséquence irréversible.

[FIGURE 3.2]

Les matrices de confusion (Figure 3.2) montrent que le modèle de pneumonie commet surtout des faux négatifs (23 contre 4 faux positifs). Le seuil retenu en validation favorise donc légèrement la spécificité, ce qui n'est pas le réglage idéal pour un outil de dépistage. Le déplacement du seuil ne changerait cependant pas grand-chose : au seuil de 0,5, le modèle manque encore 21 pneumonies. Une partie de ces cas est très probablement hors de portée du modèle, quel que soit le seuil ; l'analyse Grad-CAM de la section 3.4 en donne un exemple.

Pour la tuberculose, le choix du seuil a beaucoup plus de conséquences. Le seuil retenu en validation est bas (0,274), signe que le modèle attribue aux cas positifs des probabilités souvent modérées. Avec ce seuil, il détecte 78 % des tuberculoses ; avec le seuil conventionnel de 0,5, il n'en détecterait plus que 66 %, en échange d'une spécificité de 0,951. Sur un ensemble de test aussi petit, cet écart illustre combien un seuil fixé une fois pour toutes, sans référence au contexte d'usage, peut modifier le comportement d'un outil de dépistage.

La distinction entre pneumonie **bactérienne et virale** conditionne le choix entre antibiothérapie et traitement de soutien, mais elle est radiologiquement difficile : les deux présentations peuvent produire des opacités presque impossibles à distinguer sur un cliché standard. Avec une exactitude de 78,2 %, le modèle fait nettement mieux que le hasard, mais il confond encore une pneumonie sur cinq. Ses erreurs sont réparties dans les deux sens (88 bactériennes prises pour des virales, 53 virales prises pour des bactériennes), ce qui suggère une frontière floue entre les deux classes plutôt qu'un biais systématique vers l'une d'elles. Ce résultat n'est pas un échec du modèle. Il reflète une difficulté que les cliniciens connaissent bien, et rappelle que la radiographie seule ne suffit pas à trancher la question étiologique.

[FIGURE 3.3]

Les courbes ROC (Figure 3.3) résument cette hiérarchie. La courbe de la pneumonie longe presque le bord supérieur gauche du graphique. Celles de la tuberculose et de la sous-tâche étiologique se croisent à plusieurs reprises et occupent une zone voisine, ce qui confirme que ces deux problèmes ont un niveau de difficulté comparable pour nos modèles, l'un faute de données, l'autre faute de signal radiologique net. Le point de fonctionnement retenu sur chaque courbe montre aussi la marge disponible. Pour la tuberculose, un usage de dépistage en zone sous-médicalisée, où chaque cas manqué peut être fatal, justifierait de déplacer ce point vers une sensibilité plus élevée, au prix d'un plus grand nombre de fausses alertes. Le choix de ce réglage doit revenir aux cliniciens qui utiliseront l'outil et être fixé sur des données de validation propres à leur contexte, pas sur l'ensemble de test d'un mémoire.

---

## 3.3 Comparaison avec l'état de l'art

### Positionnement des performances dans la littérature

Comparer nos chiffres à ceux de la littérature demande de la prudence. Les études publiées n'utilisent ni les mêmes données, ni les mêmes partitions, ni les mêmes seuils, et ces différences pèsent souvent plus que l'écart entre deux architectures. Le Tableau 3.2 rassemble les références les plus proches de notre travail ; il faut le lire comme un ordre de grandeur, pas comme un classement.

[TABLEAU 3.2]

La comparaison la plus directe concerne les travaux de Kermany et al. (2018), qui ont constitué le corpus pédiatrique que nous utilisons. Sur leur propre ensemble de test de 624 images, leur modèle atteignait une exactitude de 92,8 %, une sensibilité de 93,2 %, une spécificité de 90,1 % et une AUC de 0,968 pour la détection de la pneumonie. Nos résultats sont supérieurs sur chacun de ces indicateurs (exactitude de 97,1 %, AUC de 0,996), mais la comparaison ne peut pas être faite terme à terme. Notre ensemble de test n'est pas celui de Kermany et al., puisque nous avons regroupé puis repartagé l'ensemble du corpus (section 2.4) : les patients évalués ne sont pas les mêmes, et rien ne garantit que nos 925 images de test soient aussi difficiles que leurs 624. Il faut aussi rappeler que les architectures et les moyens de calcul ont beaucoup progressé depuis 2018. Pour la sous-tâche bactérienne ou virale, ces auteurs rapportent une exactitude de 90,7 %, nettement supérieure à nos 78,2 %. Nous n'avons pas d'explication définitive à cet écart ; la différence de partition et le fait que notre modèle n'ait été entraîné que sur les seules images de pneumonie sont des pistes plausibles.

CheXNet (Rajpurkar et al., 2017) reste l'étalon historique, mais il ne se compare pas directement à notre modèle. Sur ChestX-ray14, il atteignait un F1-score de 0,435 [0,387 ; 0,481] pour la pneumonie, contre 0,387 pour la moyenne de quatre radiologues, et une AUC de 0,768. Notre F1-score de 0,980 n'en est pas « plus de deux fois meilleur » pour autant. CheXNet travaillait sur des radiographies d'adultes, avec des étiquettes extraites automatiquement des comptes rendus, et devait repérer la pneumonie parmi quatorze pathologies souvent associées sur un même cliché ; la tâche était beaucoup plus difficile. Ce qui rapproche les deux travaux, c'est l'architecture, DenseNet-121, et la stratégie de transfert depuis ImageNet. Le fait que le même réseau atteigne 0,768 d'AUC dans un cas et 0,996 dans l'autre illustre surtout l'influence considérable du corpus sur les performances mesurées.

Pour la tuberculose, Lakhani et Sundaram (2017) ont obtenu une AUC de 0,99 en combinant deux CNN (AlexNet et GoogLeNet) sur 1 007 radiographies issues de quatre jeux de données, dont Montgomery et Shenzhen. Notre AUC de 0,886 est nettement inférieure. Plusieurs différences peuvent l'expliquer : un corpus plus petit (800 images), un modèle unique plutôt qu'un ensemble de deux réseaux, et un entraînement qui, d'après les courbes de la Figure 3.1, n'avait sans doute pas atteint son plein potentiel. L'écart entre nos résultats sur Montgomery (une erreur sur 21 images) et sur Shenzhen (22 erreurs sur 99) invite aussi à la prudence sur les performances très élevées rapportées pour ces bases. Nous ne pouvons pas exclure que le modèle tire parti, sur Montgomery, de caractéristiques d'acquisition propres à ce centre, d'autant que les radiographies Montgomery se distinguent nettement des autres par leur résolution et leur profondeur de codage.

Plus généralement, ces comparaisons confirment le constat d'Ahmad et al. (2023) : les performances rapportées dans la littérature dépendent au moins autant des données et du protocole d'évaluation que du modèle lui-même. Nos résultats sur la pneumonie se situent au-dessus de la plage d'AUC de 0,87 à 0,96 relevée par ces auteurs, ceux sur la tuberculose au bas de cette plage. Ni l'un ni l'autre constat ne dit grand-chose de la valeur clinique des modèles, que seule une validation externe permettrait d'établir.

---

## 3.4 Cartes Grad-CAM et explicabilité

### Le modèle regarde-t-il aux bons endroits ?

Une AUC élevée ne dit rien de ce qu'un modèle a appris. Un réseau peut obtenir d'excellentes performances en s'appuyant sur des corrélations parasites : un marqueur latéral, une annotation incrustée dans l'image, un cadrage propre à un centre ou à une population. DeGrave et al. (2021) ont montré que des modèles de détection du COVID-19 réputés performants reposaient en grande partie sur ce type d'indices et s'effondraient dès qu'on les testait sur des données d'un autre hôpital. Vérifier où regarde le modèle n'a donc rien d'accessoire : c'est une condition de validité des chiffres présentés plus haut.

La Figure 3.4 présente, pour la pneumonie et la tuberculose, un vrai positif représentatif et le faux négatif le plus net, choisis selon la règle définie au Chapitre 2 avant l'examen des cartes. Une galerie de six vrais positifs et six faux négatifs par tâche, produite par le même programme, figure en annexe et complète cette lecture.

[FIGURE 3.4]

Pour la **pneumonie**, le résultat est préoccupant et doit être dit clairement. Sur le vrai positif retenu, l'activation se concentre dans l'angle supérieur droit de l'image, en dehors des champs pulmonaires, sur une zone qui correspond au bord du cliché et à l'épaule. Le modèle classe correctement l'image, avec une probabilité proche de 1, mais pas pour des raisons que l'on pourrait qualifier de sémiologiques. La galerie nuance ce constat sans le démentir. Sur certains vrais positifs, l'activation se situe bien dans le parenchyme, au niveau du champ pulmonaire moyen gauche pour l'un, de la région péri-hilaire droite pour un autre, là où l'on attend des opacités de pneumonie. Sur d'autres, elle porte sur la partie haute du cliché, près des épaules ou des bords. Les radiographies du corpus Kermany comportent par ailleurs des marqueurs latéraux, des horodatages et des réglages d'exposition incrustés dans l'image, autant d'indices que le modèle peut associer à une classe sans lien avec la maladie. Nous ne pouvons pas affirmer que le modèle s'appuie principalement sur ces indices, mais nous ne pouvons pas non plus l'exclure, et cela suffit à relativiser l'AUC de 0,996.

Le faux négatif présenté pour la pneumonie est instructif à un autre titre. Le modèle lui attribue une probabilité quasi nulle de pneumonie, et la carte Grad-CAM ne montre qu'une petite activation dans l'angle inférieur droit, sans rapport avec les poumons. Or la morphologie de ce thorax évoque davantage un adolescent ou un adulte qu'un enfant de un à cinq ans, la population décrite par Kermany et al. (2018). S'il s'agit bien d'une image atypique pour ce corpus, ou d'une erreur d'étiquetage, l'échec du modèle est compréhensible : il n'a pratiquement jamais vu de thorax de cette forme. Ce cas rappelle que la qualité de l'annotation d'un corpus public ne peut jamais être tenue pour acquise.

Pour la **tuberculose**, le vrai positif présente une activation bilatérale, centrée sur les champs pulmonaires moyens et les hiles, sans débordement notable hors du thorax. Elle reste à l'intérieur des poumons, ce qui est rassurant, mais elle ne cible pas spécifiquement les sommets, siège classique des lésions tuberculeuses de l'adulte. Le faux négatif, auquel le modèle attribue une probabilité de 0,02, ne présente aucune zone d'activation significative : le réseau n'a trouvé sur ce cliché aucun élément en faveur d'une tuberculose. C'est le profil d'une lésion trop discrète ou trop atypique pour la représentation apprise à partir de 559 images d'entraînement.

Ces observations rejoignent la mise en garde de Selvaraju et al. (2017) : Grad-CAM ne corrige pas les biais d'un modèle, il les rend visibles. À ce titre, l'analyse a pleinement rempli son rôle. Sans elle, l'AUC de la pneumonie aurait pu être lue comme la preuve d'une compétence diagnostique ; avec elle, elle apparaît comme une performance réelle sur ce corpus, mais dont une partie au moins pourrait reposer sur des indices étrangers à la maladie. Le travail de Panwar et al. (2020), qui avaient fait vérifier par des radiologues la concordance entre leurs cartes Grad-CAM et les zones qu'ils inspectaient, montre la démarche qu'il faudrait suivre pour trancher : une relecture des cartes par des radiologues, que ce mémoire n'a pas pu mettre en œuvre.

---

## 3.5 Limites, implications cliniques et éthiques

### Ce que les chiffres ne disent pas

Une AUC ne porte pas en elle les conditions de sa propre interprétation. Derrière nos métriques se trouvent des hypothèses sur la qualité des données, la représentativité des patients et la structure de l'évaluation, qui déterminent la portée réelle des conclusions. Les reconnaître n'affaiblit pas ce travail ; c'est au contraire ce qui permet d'en faire un usage correct.

La première limite tient à l'absence de **validation externe**. Pour chaque tâche, les ensembles d'entraînement et de test proviennent des mêmes centres, des mêmes appareils et des mêmes populations. Le partitionnement par patient empêche la fuite de données au sens strict, mais il ne protège pas contre les indices propres à un centre, que l'analyse Grad-CAM laisse soupçonner pour la pneumonie. Seule une évaluation sur des radiographies d'un autre hôpital permettrait de mesurer la performance que l'on obtiendrait en pratique ; d'après DeGrave et al. (2021), elle pourrait être sensiblement inférieure.

La deuxième limite est **démographique et géographique**. Le modèle de pneumonie n'a vu que des enfants de un à cinq ans, pris en charge dans un seul hôpital chinois ; celui de tuberculose, des adultes de deux centres, l'un américain, l'autre chinois. Aucune radiographie ne provient d'Afrique subsaharienne, où l'outil serait pourtant le plus utile. Les équipements, les pratiques de positionnement, les comorbidités (VIH notamment) et la présentation des maladies y diffèrent, et la perte de performance qui accompagne un tel changement de domaine (*domain shift*) est bien documentée (Kim et al., 2022).

La troisième limite est **volumétrique**. Avec 800 radiographies, dont 559 pour l'entraînement et 120 pour le test, le modèle de tuberculose a été entraîné sur trop peu d'exemples, et évalué sur trop peu de cas pour que ses performances soient estimées avec précision. L'intervalle de confiance de son AUC, compris entre 0,816 et 0,942, le montre bien.

La quatrième limite tient au **protocole d'entraînement** lui-même. Pour la pneumonie et la tuberculose, le meilleur modèle a été atteint dans les toutes dernières époques, et l'arrêt anticipé ne s'est pas déclenché : nous ne savons pas si un entraînement plus long aurait encore amélioré les résultats. Les hyperparamètres ont été fixés a priori, d'après la littérature, et n'ont fait l'objet d'aucune recherche systématique, faute de temps de calcul. Chaque modèle n'a en outre été entraîné qu'une seule fois, avec une seule graine aléatoire ; la variabilité liée à l'initialisation et à l'ordre des lots n'est donc pas mesurée.

Enfin, cette étude ne comporte ni **comparaison directe avec des radiologues** sur les mêmes images, ni **validation prospective** dans un véritable circuit de soins. L'ensemble de test reste une approximation de la réalité clinique, pas un substitut.

Ces limites ne condamnent pas l'approche, mais elles en fixent le périmètre. L'usage le plus défendable d'un tel système est celui d'un outil d'aide au diagnostic (*Computer-Aided Detection*, CAD), conçu comme un premier filtre et non comme une autorité diagnostique. Là où aucun radiologue n'est disponible, ou là où les délais de lecture se comptent en semaines, il pourrait trier les clichés par ordre de priorité, signaler les cas suspects et réduire le délai entre l'acquisition de l'image et la prise en charge. Ce scénario suppose toutefois une validation sur la population locale, une formation des utilisateurs et une interface adaptée à des conditions souvent difficiles : connexion limitée, électricité intermittente, matériel ancien. Aucune de ces conditions n'est hors d'atteinte, mais aucune ne peut se satisfaire d'une bonne AUC obtenue dans un mémoire.

Les questions éthiques méritent d'être posées directement. La première est celle de la **responsabilité médicale** : en cas d'erreur impliquant un outil automatique, qui en répond ? La position dominante, selon laquelle le praticien reste responsable de la décision finale, suppose qu'il soit formé à évaluer de manière critique les sorties du modèle, ce qu'il faut vérifier plutôt que présumer. Vient ensuite l'**opacité algorithmique**. Grad-CAM est un progrès réel, comme cette étude le montre, mais il ne rend pas un réseau de neurones transparent : il indique où le modèle a regardé, pas pourquoi ce regard a produit cette décision. Se pose enfin la question de l'**équité algorithmique** (*algorithmic fairness*). Un modèle entraîné sur des données qui représentent mal certaines populations peut se montrer systématiquement moins performant pour elles, c'est-à-dire, paradoxalement, pour les patients auxquels un outil de triage serait le plus utile. Sur le plan réglementaire, le règlement européen sur l'intelligence artificielle (*AI Act*) et les recommandations de la FDA imposent des exigences croissantes de transparence, de traçabilité et de surveillance après mise sur le marché pour les systèmes d'IA à usage médical [SOURCE MANQUANTE : citer le texte réglementaire applicable].

Plusieurs recommandations découlent de cette analyse. Aucun déploiement ne devrait intervenir sans validation externe, puis prospective, sur la population visée et dans ses conditions réelles d'acquisition. Les images devraient être nettoyées avant l'entraînement, en masquant les marqueurs, annotations et bords de cliché, ou en restreignant l'analyse aux champs pulmonaires par segmentation, afin de priver le modèle des raccourcis que l'analyse Grad-CAM a mis au jour. Le seuil de décision doit rester réglable par l'utilisateur, car il n'existe pas de seuil universel. Chaque prédiction devrait être présentée avec son score et la carte Grad-CAM correspondante, pour que le praticien dispose des éléments d'un jugement éclairé. Enfin, un mécanisme de retour d'information (*feedback loop*) doit être prévu dès la conception : un modèle entraîné une fois pour toutes se dégrade à mesure que les pratiques et les équipements évoluent.

Les perspectives de recherche découlent directement de ces limites. La plus urgente est la constitution de corpus africains, annotés par des radiologues locaux et représentatifs de la réalité épidémiologique et technique du terrain, sans lesquels aucune validation pertinente n'est possible. La validation spatiale des cartes Grad-CAM, à l'aide des boîtes englobantes du corpus RSNA ou d'annotations produites par des radiologues, permettrait de mesurer objectivement ce que nous n'avons pu évaluer que qualitativement. L'apprentissage fédéré (*federated learning*), qui permet à plusieurs établissements d'entraîner un modèle commun sans partager leurs données, répondrait à la fois aux enjeux de confidentialité et de diversité géographique. Les architectures de type *Vision Transformer* (ViT) constituent une autre piste d'évolution [SOURCE MANQUANTE]. Enfin, les modèles multimodaux, capables de combiner l'image avec des données cliniques comme l'âge, les symptômes ou les résultats biologiques, pourraient lever une partie de l'ambiguïté qui limite aujourd'hui la distinction entre pneumonie bactérienne et virale.

---

## Conclusion du chapitre

Les résultats obtenus valident en partie l'hypothèse de départ. Sur le corpus pédiatrique de Kermany, le modèle DenseNet-121 détecte la pneumonie avec une AUC de 0,996 et ne manque que 3,4 % des cas, des performances supérieures à celles publiées par les auteurs du corpus. Sur la tuberculose, avec une AUC de 0,886 et 22 % de cas manqués, il reste en deçà de la littérature et d'un niveau compatible avec un usage clinique. La distinction entre pneumonie bactérienne et virale, enfin, atteint une AUC de 0,843 et bute sur une difficulté que la radiographie seule ne permet pas de lever.

L'analyse Grad-CAM oblige à nuancer le premier de ces résultats. Une partie des décisions du modèle de pneumonie semble reposer sur des régions situées hors des poumons, ce qui laisse penser que sa performance tient pour une part à des particularités du corpus plutôt qu'à la seule reconnaissance des signes de la maladie. Ce constat n'invalide pas le travail ; il en est l'un des apports, car il montre concrètement pourquoi une AUC élevée ne suffit pas à juger un outil d'aide au diagnostic. Quant à la comparaison avec les radiologues, au cœur de notre hypothèse, ce mémoire ne permet pas de la trancher directement, faute de lecture des mêmes images par des spécialistes. Ces constats, et les conditions qu'ils imposent à tout déploiement, nourrissent la conclusion générale.

---

## Notes de relecture

| Statut | Item |
|---|---|
| ✅ Rédigé | Toutes les valeurs proviennent de `memoire_resultats/` (exécution du 2026-10-06) |
| ✅ Vérifié | CheXNet : F1 0,435 [0,387 ; 0,481], radiologues 0,387, AUC pneumonie 0,768 (arXiv:1711.05225, tableaux 1 et 2). L'ancienne valeur 0,841 était une erreur (AUC de Yao et al. pour le pneumothorax) |
| ✅ Vérifié | Kermany et al. (2018) : exactitude 92,8 %, sensibilité 93,2 %, spécificité 90,1 %, AUC 0,968 ; bactérienne/virale 90,7 % (sources secondaires, à confirmer dans l'article) |
| ✅ Vérifié | Lakhani & Sundaram (2017) : AUC 0,99, ensemble AlexNet + GoogLeNet, 1 007 radiographies. Ajouté à la bibliographie [31] |
| ✅ Supprimé | Tout le contenu COVID-19/COVIDx, cohérent avec le Ch.2 v2 |
| ✅ Supprimé | Critère « taux de faux négatifs < 15 % » de la v1, qui n'était pas sourcé |
| ⚠️ À valider | Lecture de la Figure 3.4 (activation hors des poumons, morphologie adulte du faux négatif) : à faire confirmer si possible par un radiologue ou par l'encadreur |
| ⚠️ Annexe | Galerie Grad-CAM (`*/gradcam_galerie/`) à insérer en annexe |
| [SOURCE MANQUANTE] | Texte réglementaire IA médicale (EU AI Act / FDA) |
| [SOURCE MANQUANTE] | Référence Vision Transformer (ViT) en imagerie médicale |

---

*Version 2.0 | APA 7*
