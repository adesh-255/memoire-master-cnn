# Chapitre 4 : Discussion et perspectives

> **Mémoire :** Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques
> **Auteur :** ALAWO Adeshina Néhémiah
> **Version :** 1.0 (2026-10-15)
> **Statut :** Créé à la demande du directeur de mémoire (retour du 2026-10-15) : l'ancienne section 3.8 devient un chapitre, enrichi d'une discussion sur l'apprentissage par raccourci. À relire

---

## Introduction du chapitre

Le Chapitre 3 a présenté les résultats de nos modèles et les trois expériences qui les mettent à l'épreuve. Ce chapitre prend du recul. Il rappelle d'abord ce que ces résultats disent de l'hypothèse de départ, puis replace le principal d'entre eux, le test de masquage, dans le cadre plus large de l'apprentissage par raccourci. Il examine ensuite de manière critique les limites de ce travail, ses implications cliniques et éthiques, et termine par des recommandations et des perspectives de recherche.

---

## 4.1 Synthèse des résultats

### Ce que l'expérimentation a établi

Sur le corpus pédiatrique de Kermany, le modèle DenseNet-121 détecte la pneumonie avec une AUC de 0,996. Sur les bases Montgomery et Shenzhen, il détecte la tuberculose avec une AUC de 0,886, et distingue la pneumonie bactérienne de la virale avec une AUC de 0,843. Ces chiffres placent nos modèles au niveau de ceux que la littérature présente comme comparables aux radiologues, voire au-dessus pour la pneumonie.

Les expériences complémentaires nuancent fortement cette lecture. Un modèle qui ne voit que les bords du cliché détecte encore la pneumonie avec une AUC de 0,991. Entraîné dans un hôpital et testé dans l'autre, le modèle de tuberculose voit son AUC descendre jusqu'à 0,725. Le choix de l'architecture, enfin, ne change pas ces conclusions : ni ResNet-50 ni EfficientNet-B0 ne font significativement mieux que DenseNet-121.

L'hypothèse de départ n'est donc que partiellement vérifiée. Les performances sont élevées, mais rien ne permet d'affirmer qu'elles traduisent une compétence comparable à celle d'un radiologue : aucun spécialiste n'a lu les mêmes images, et le test de masquage montre qu'une partie de la performance peut reposer sur des indices étrangers à la maladie. C'est ce second point qu'il faut maintenant discuter.

---

## 4.2 L'apprentissage par raccourci : ce que révèle le test de masquage

### Un phénomène connu des réseaux de neurones

Geirhos et al. (2020) appellent apprentissage par raccourci (*shortcut learning*) le fait, pour un réseau de neurones, d'adopter une règle de décision qui réussit sur les tests habituels mais ne se transfère pas à des conditions plus exigeantes, comme celles du monde réel. Le réseau n'apprend pas forcément ce que l'on voulait lui apprendre : il apprend la règle la plus simple qui sépare les classes dans les données qu'on lui montre. Selon ces auteurs, de nombreux échecs de l'apprentissage profond relèvent en réalité de ce même mécanisme.

En imagerie médicale, le raccourci peut tenir à tout ce qui distingue les images des malades de celles des sujets sains sans relever de la maladie : le service où l'examen a été réalisé, l'appareil, la position du patient, un marqueur posé par le manipulateur, un dispositif médical visible sur le cliché. Deux travaux en ont donné des exemples marquants sur la radiographie thoracique. Zech et al. (2018) ont entraîné des CNN à détecter la pneumonie sur les données de trois systèmes hospitaliers américains. La proportion de pneumonies variait tant d'un établissement à l'autre (34,2 % dans l'un, environ 1 % dans les deux autres) que le seul fait de reconnaître l'hôpital d'origine d'une image suffisait à atteindre une AUC de 0,861 sur les données réunies de deux d'entre eux. Leur meilleur modèle passait d'une AUC de 0,931 sur ses propres hôpitaux à 0,815 sur un hôpital extérieur. DeGrave et al. (2021) ont ensuite montré que des modèles de détection du COVID-19 s'appuyaient sur des marqueurs latéraux, le cadrage ou les réglages d'acquisition, et s'effondraient sur les données d'un autre établissement.

### Ce que notre expérience ajoute

Notre test de masquage montre que le phénomène existe aussi sur le corpus de Kermany, alors qu'il provient d'un seul hôpital. Le raccourci ne peut donc pas y tenir à l'établissement d'origine, comme chez Zech et al. (2018). Il tient à ce qui se trouve sur le cliché en dehors des poumons : sur l'exemple de la Figure 3.5, une électrode de surveillance et son câble. Ce matériel n'est pas un signe de pneumonie ; il signale un enfant hospitalisé et placé sous monitorage, ce qui, sur ce corpus, est associé à l'étiquette « pneumonie ». Nous n'avons pas mesuré la fréquence de ces dispositifs dans les deux classes, et cette explication reste à confirmer à grande échelle. Mais le résultat principal, lui, est établi : un modèle privé du centre de l'image atteint une AUC de 0,991. Provenir d'un seul hôpital ne met donc pas un corpus à l'abri des raccourcis.

L'expérience a aussi un intérêt de méthode. Elle ne demande ni données externes, ni annotations de localisation, ni radiologue : il suffit d'entraîner une seconde fois le modèle en masquant une partie de l'image et de comparer les performances. C'est un contrôle simple, peu coûteux et reproductible, que l'on pourrait appliquer à n'importe quel corpus avant d'accorder sa confiance à un score élevé.

### Pourquoi les évaluations habituelles ne le détectent pas

Notre partitionnement par patient empêche la fuite de données au sens strict : aucun patient du test n'a été vu pendant l'entraînement. Il ne protège pas pour autant contre un raccourci. Les ensembles d'entraînement et de test sont tirés du même corpus ; si un indice parasite y accompagne la maladie, il l'accompagne dans les deux ensembles, et le modèle qui l'a appris réussit le test aussi bien que l'entraînement. Un score élevé sur un ensemble de test issu des mêmes données ne peut donc pas, par construction, révéler un raccourci. Geirhos et al. (2020) en tirent une recommandation : faire des tests de généralisation hors distribution (*out-of-distribution*), sur des données systématiquement différentes de celles de l'entraînement, une pratique standard. Ils résument l'enjeu d'une formule : il ne faut pas confondre la performance obtenue sur un jeu de données avec l'acquisition de la capacité qu'il est censé mesurer.

Les deux outils d'explicabilité utilisés dans ce mémoire jouent ici des rôles complémentaires. Les cartes Grad-CAM ont fait naître le soupçon, en montrant sur certains cas une activation hors des poumons ; elles restent toutefois qualitatives et peuvent tromper, puisque le cas de la Figure 3.4 s'est révélé peu représentatif. Le test de masquage a transformé ce soupçon en mesure. La validation croisée entre hôpitaux, enfin, est précisément le type d'évaluation hors distribution que recommandent Geirhos et al. (2020) : elle montre, pour la tuberculose, une perte de performance qui va dans le même sens que celle observée par Zech et al. (2018) pour la pneumonie.

### Ce qu'il faut en retenir

Trois conséquences en découlent. D'abord, les scores très élevés publiés sur le corpus de Kermany, y compris le nôtre, ne peuvent pas être lus comme la preuve d'une compétence radiologique. Ensuite, le modèle de référence ne « triche » pas systématiquement : en moyenne, il ne privilégie pas les bords (41 % de l'activation pour 51 % de la surface), et le modèle entraîné sur les images aux bords masqués atteint 0,997 en regardant le parenchyme. Le corpus offre donc deux chemins vers la bonne réponse, et rien ne garantit qu'un modèle entraîné sans précaution emprunte le bon. Enfin, le remède est accessible : masquer les bords n'a rien coûté en performance sur notre corpus, et une segmentation des champs pulmonaires irait plus loin dans le même sens.

---

## 4.3 Analyse critique : les limites de ce travail

### Ce que les chiffres ne disent pas

Une AUC ne porte pas en elle les conditions de sa propre interprétation. Derrière nos métriques se trouvent des hypothèses sur la qualité des données, la représentativité des patients et la structure de l'évaluation, qui déterminent la portée réelle des conclusions. Les reconnaître n'affaiblit pas ce travail ; c'est au contraire ce qui permet d'en faire un usage correct.

La première limite tient à la **validation externe**, que nous n'avons pu mener que partiellement. Pour la tuberculose, la validation croisée entre hôpitaux (section 3.6) montre une baisse de performance modérée dans un sens et forte dans l'autre. Pour la pneumonie, aucune base externe n'a été testée. Le partitionnement par patient empêche la fuite de données au sens strict, mais il ne protège pas contre les indices propres à un corpus, dont la section 3.5 a montré qu'ils suffisent à classer les images de Kermany. La baisse mesurée par Zech et al. (2018) sur un hôpital extérieur, de 0,931 à 0,815, donne un ordre de grandeur de ce qu'il faudrait craindre.

La deuxième limite est **démographique et géographique**. Le modèle de pneumonie n'a vu que des enfants de un à cinq ans, pris en charge dans un seul hôpital chinois ; celui de tuberculose, des adultes de deux centres, l'un américain, l'autre chinois. Aucune radiographie ne provient d'Afrique subsaharienne, où l'outil serait pourtant le plus utile. Les équipements, les pratiques de positionnement, les comorbidités (VIH notamment) et la présentation des maladies y diffèrent, et la perte de performance qui accompagne un tel changement de domaine (*domain shift*) est bien documentée (Kim et al., 2022).

La troisième limite est **volumétrique**. Avec 800 radiographies, dont 559 pour l'entraînement et 120 pour le test, le modèle de tuberculose a été entraîné sur trop peu d'exemples, et évalué sur trop peu de cas pour que ses performances soient estimées avec précision. L'intervalle de confiance de son AUC, compris entre 0,816 et 0,942, le montre bien.

La quatrième limite tient au **protocole d'entraînement** lui-même. Pour la pneumonie et la tuberculose, le meilleur modèle a été atteint dans les toutes dernières époques, et l'arrêt anticipé ne s'est pas déclenché : nous ne savons pas si un entraînement plus long aurait encore amélioré les résultats. Les hyperparamètres ont été fixés a priori, d'après la littérature, et n'ont fait l'objet d'aucune recherche systématique, faute de temps de calcul. Chaque modèle n'a en outre été entraîné qu'avec une seule graine aléatoire. Le second entraînement des modèles de référence a reproduit les mêmes AUC, ce qui atteste la reproductibilité du protocole, mais pas sa robustesse : la variabilité liée à l'initialisation et à l'ordre des lots n'est pas mesurée.

Enfin, cette étude ne comporte ni **comparaison directe avec des radiologues** sur les mêmes images, ni **validation prospective** dans un véritable circuit de soins, ni **relecture des cartes Grad-CAM par des spécialistes**. L'ensemble de test reste une approximation de la réalité clinique, pas un substitut.

---

## 4.4 Implications cliniques et éthiques

### Un outil de tri, pas une autorité diagnostique

Ces limites ne condamnent pas l'approche, mais elles en fixent le périmètre. L'usage le plus défendable d'un tel système est celui d'un outil d'aide au diagnostic (*Computer-Aided Detection*, CAD), conçu comme un premier filtre et non comme une autorité diagnostique. Là où aucun radiologue n'est disponible, ou là où les délais de lecture se comptent en semaines, il pourrait trier les clichés par ordre de priorité, signaler les cas suspects et réduire le délai entre l'acquisition de l'image et la prise en charge. Ce scénario suppose toutefois une validation sur la population locale, une formation des utilisateurs et une interface adaptée à des conditions souvent difficiles : connexion limitée, électricité intermittente, matériel ancien. Aucune de ces conditions n'est hors d'atteinte, mais aucune ne peut se satisfaire d'une bonne AUC obtenue dans un mémoire.

L'apprentissage par raccourci donne à cette prudence un fondement concret. Un modèle qui s'appuie sur des électrodes ou sur les habitudes d'un service fonctionnera tant que ces habitudes resteront les mêmes, et se trompera dès qu'elles changeront, sans que rien ne le signale à l'utilisateur. Dans un hôpital togolais, où les appareils, les protocoles de positionnement et le matériel de surveillance diffèrent de ceux du corpus d'entraînement, ce risque serait maximal.

### Les questions éthiques

Les questions éthiques méritent d'être posées directement. La première est celle de la **responsabilité médicale** : en cas d'erreur impliquant un outil automatique, qui en répond ? La position dominante, selon laquelle le praticien reste responsable de la décision finale, suppose qu'il soit formé à évaluer de manière critique les sorties du modèle, ce qu'il faut vérifier plutôt que présumer. Vient ensuite l'**opacité algorithmique**. Grad-CAM est un progrès réel, comme cette étude le montre, mais il ne rend pas un réseau de neurones transparent : il indique où le modèle a regardé, pas pourquoi ce regard a produit cette décision. Se pose enfin la question de l'**équité algorithmique** (*algorithmic fairness*). Un modèle entraîné sur des données qui représentent mal certaines populations peut se montrer systématiquement moins performant pour elles, c'est-à-dire, paradoxalement, pour les patients auxquels un outil de triage serait le plus utile.

### Le cadre réglementaire

Sur le plan réglementaire, le règlement européen sur l'intelligence artificielle (Règlement (UE) 2024/1689, 2024) range parmi les systèmes à haut risque les systèmes d'IA intégrés à des dispositifs médicaux soumis à une évaluation de conformité par un tiers. Ils doivent alors satisfaire des exigences de gestion des risques, de qualité des données d'entraînement, de transparence et de contrôle humain. Aux États-Unis, l'agence américaine des produits de santé a publié un plan d'action pour les logiciels médicaux fondés sur l'apprentissage automatique, qui prévoit notamment de bonnes pratiques d'apprentissage automatique et un suivi des performances en conditions réelles (U.S. Food and Drug Administration [FDA], 2021). Ces textes vont dans le sens de nos recommandations : un modèle comme le nôtre ne pourrait être mis sur le marché sans documentation de ses données, de ses limites et de ses performances en usage réel.

---

## 4.5 Recommandations et perspectives

### Recommandations pour un déploiement responsable

Plusieurs recommandations découlent de cette analyse. Aucun déploiement ne devrait intervenir sans validation externe, puis prospective, sur la population visée et dans ses conditions réelles d'acquisition. Les images devraient être nettoyées avant l'entraînement, en masquant les marqueurs, annotations et bords de cliché, ou en restreignant l'analyse aux champs pulmonaires par segmentation, afin de priver le modèle des raccourcis mis au jour en section 3.5. Sur notre corpus, le masquage des bords n'a d'ailleurs eu aucun coût en performance. Un test de masquage comme le nôtre devrait faire partie de toute évaluation, au même titre que les métriques habituelles. Le seuil de décision doit rester réglable par l'utilisateur, car il n'existe pas de seuil universel. Chaque prédiction devrait être présentée avec son score et la carte Grad-CAM correspondante, pour que le praticien dispose des éléments d'un jugement éclairé. Enfin, un mécanisme de retour d'information (*feedback loop*) doit être prévu dès la conception : un modèle entraîné une fois pour toutes se dégrade à mesure que les pratiques et les équipements évoluent.

### Perspectives de recherche

Les perspectives de recherche découlent directement de ces limites. La plus urgente est la constitution de corpus africains, annotés par des radiologues locaux et représentatifs de la réalité épidémiologique et technique du terrain, sans lesquels aucune validation pertinente n'est possible. Sur le plan de la méthode, trois prolongements du test de masquage seraient utiles : mesurer la fréquence des dispositifs médicaux visibles dans chaque classe, pour confirmer l'origine du raccourci ; remplacer le masque rectangulaire par une segmentation des champs pulmonaires ; et appliquer le même test à d'autres corpus publics. La validation spatiale des cartes Grad-CAM, à l'aide des boîtes englobantes du corpus RSNA ou d'annotations produites par des radiologues, permettrait de mesurer objectivement ce que nous n'avons pu évaluer que qualitativement. L'apprentissage fédéré (*federated learning*), qui permet à plusieurs établissements d'entraîner un modèle commun sans partager leurs données, répondrait à la fois aux enjeux de confidentialité et de diversité géographique. Les architectures de type *Vision Transformer* (ViT), dont Shamshad et al. (2023) recensent les nombreuses applications en imagerie médicale, constituent une autre piste d'évolution. Enfin, les modèles multimodaux, capables de combiner l'image avec des données cliniques comme l'âge, les symptômes ou les résultats biologiques, pourraient lever une partie de l'ambiguïté qui limite aujourd'hui la distinction entre pneumonie bactérienne et virale.

---

## Conclusion du chapitre

Ce chapitre a replacé nos résultats dans le cadre de l'apprentissage par raccourci, un phénomène bien décrit dans la littérature (Geirhos et al., 2020) et déjà observé sur la radiographie thoracique (Zech et al., 2018 ; DeGrave et al., 2021). Notre contribution est d'en montrer l'existence sur un corpus pédiatrique très utilisé, issu d'un seul hôpital, et de proposer un moyen simple de le détecter. Les limites de ce travail sont réelles, et la principale tient à l'absence de données africaines et de validation par des radiologues. Elles tracent toutefois un programme clair : nettoyer les images, tester hors de la distribution d'entraînement, et constituer des corpus locaux avant tout déploiement. La conclusion générale reprend ces enseignements.

---

## Notes de relecture

| Statut | Item |
|---|---|
| ✅ Créé (2026-10-15) | Ancienne section 3.8 déplacée ici sans perte (sections 4.3 à 4.5), à la demande du directeur de mémoire |
| ✅ Ajouté | Section 4.2 sur l'apprentissage par raccourci, comme demandé par le directeur : Geirhos et al. (2020), Zech et al. (2018), DeGrave et al. (2021) |
| ✅ Vérifié | Geirhos et al. (2020) : *Nature Machine Intelligence*, 2(11), 665-673. Zech et al. (2018) : *PLOS Medicine*, 15(11), e1002683 ; chiffres (34,2 %, ~1 %, AUC 0,861, 0,931 à 0,815) relevés dans le résumé (Europe PMC, PMID 30399157) |
| ✅ Vérifié | Recommandation de Geirhos et al. (2020) confirmée dans le texte intégral (arXiv:2004.07780, section 6.2 « Making o.o.d. generalisation tests a standard practice ») ; formule reprise de la même section : « we must not confuse performance on a dataset with the acquisition of an underlying ability » |
