// Plan du mémoire mis à jour pour le directeur (octobre 2026). Usage : node plan_mis_a_jour.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, LevelFormat, ExternalHyperlink,
} = require(path.join(__dirname, '..', 'Mise-en-page', 'node_modules', 'docx'));

const POLICE = 'Calibri';
const L = 9638; // A4, marges de 2 cm
const p = (t, o = {}) => new Paragraph({ spacing: { after: 120 }, ...o, children: Array.isArray(t) ? t : [new TextRun(t)] });
const b = (t) => new TextRun({ text: t, bold: true });
const n = (t) => new TextRun(t);
const puce = (enfants, niveau = 0) => new Paragraph({ numbering: { reference: 'puces', level: niveau }, spacing: { after: 60 },
  children: Array.isArray(enfants) ? enfants : [n(enfants)] });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const lien = (texte, url) => new ExternalHyperlink({ link: url, children: [new TextRun({ text: texte, style: 'Hyperlink' })] });

function tableau(lignes, largeurs) {
  const bord = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
  return new Table({
    width: { size: L, type: WidthType.DXA }, columnWidths: largeurs,
    rows: lignes.map((r, i) => new TableRow({ tableHeader: i === 0, children: r.map((c, j) => new TableCell({
      width: { size: largeurs[j], type: WidthType.DXA },
      borders: { top: bord, bottom: bord, left: bord, right: bord },
      shading: i === 0 ? { type: ShadingType.CLEAR, fill: 'EDEDED', color: 'auto' } : undefined,
      margins: { top: 50, bottom: 50, left: 90, right: 90 },
      children: [new Paragraph({ spacing: { after: 0 }, children: Array.isArray(c) ? c : [new TextRun({ text: c, bold: i === 0, size: 19 })] })],
    })) })),
  });
}

const contenu = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('Plan du mémoire (mise à jour)')] }),
  p([b('Auteur : '), n('ALAWO Adeshina Néhémiah · Master professionnel IA-BD, ESGIS · année académique 2024-2025')]),
  p([b('Version : '), n('octobre 2026. Remplace le plan d\'avril 2026.')]),

  h1('Sujet'),
  p([b('Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d\'images radiographiques')]),

  h1('État d\'avancement'),
  p('Le mémoire est entièrement rédigé (environ 75 pages, mis en page selon le canevas ESGIS). Les expérimentations sont terminées : deux séries d\'entraînements ont été menées sur GPU (Kaggle, NVIDIA T4). Il ne reste à écrire que les dédicaces et les remerciements. Je souhaite recueillir vos remarques avant le dépôt.'),

  h1('Résumé'),
  p('Le mémoire évalue la capacité d\'un CNN à détecter la pneumonie et la tuberculose sur radiographie thoracique, et examine ce que ses performances mesurent réellement. Un modèle DenseNet-121 pré-entraîné sur ImageNet a été adapté par apprentissage par transfert en deux phases, sur deux corpus publics annotés par des cliniciens : 5 856 radiographies pédiatriques (Kermany) et 800 radiographies d\'adultes (Montgomery et Shenzhen). L\'évaluation repose sur un partitionnement par patient, un seuil fixé sur la validation, des intervalles de confiance par bootstrap et une analyse Grad-CAM. Le modèle atteint une AUC de 0,996 pour la pneumonie et de 0,886 pour la tuberculose. Un test de masquage montre toutefois qu\'un modèle ne voyant que les bords du cliché détecte encore la pneumonie (AUC 0,991), notamment grâce à du matériel de surveillance médicale : sur ce corpus, une AUC élevée ne prouve pas une compétence radiologique. Une validation croisée entre hôpitaux et une comparaison avec ResNet-50 et EfficientNet-B0 complètent l\'analyse.'),

  h1('Changements par rapport au plan d\'avril'),
  puce([b('Corpus réduit à deux sources. '), n('Kermany (pneumonie) et Montgomery + Shenzhen (tuberculose), soit 6 656 images au lieu de ~388 000. Critères : annotation par des cliniciens, identifiant patient disponible, volume compatible avec un GPU unique.')]),
  puce([b('ChestX-ray14, CheXpert et RSNA écartés : '), n('étiquettes extraites automatiquement des comptes rendus, et temps de calcul hors de portée.')]),
  puce([b('COVID-19 retiré de la partie expérimentale. '), n('COVIDx agrège des sources sans identifiant patient fiable, et DeGrave et al. (2021) ont montré que les modèles y apprennent la provenance des images plutôt que la maladie. Le COVID-19 reste traité dans l\'état de l\'art.')]),
  puce([b('Trois expériences complémentaires ajoutées : '), n('test de raccourci par masquage, validation croisée entre hôpitaux, comparaison d\'architectures.')]),
  puce([b('Objectifs reformulés : '), n('la comparaison directe avec des radiologues n\'est plus promise (aucun radiologue n\'a lu les mêmes images) ; l\'hypothèse est discutée et jugée partiellement vérifiée.')]),

  h1('Données utilisées'),
  tableau([
    ['Base', 'Contenu', 'Rôle', 'Lien'],
    ['Kermany et al. (2018)', '5 856 radiographies pédiatriques : normales, pneumonies bactériennes et virales', 'Pneumonie ; bactérienne ou virale',
      [lien('Kaggle', 'https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia')]],
    ['Montgomery + Shenzhen (Jaeger et al., 2014)', '800 radiographies d\'adultes : 406 normales, 394 tuberculoses', 'Tuberculose ; validation croisée entre hôpitaux',
      [lien('Kaggle', 'https://www.kaggle.com/datasets/kmader/pulmonary-chest-xray-abnormalities')]],
  ], [2300, 3500, 2300, 1538]),
  p(''),

  h1('Plan détaillé'),
  h2('Introduction générale'),
  puce('Contexte : poids épidémiologique des maladies pulmonaires et manque de radiologues en Afrique subsaharienne'),
  puce('Problématique : fiabilité, transférabilité et acceptabilité clinique des CNN'),
  puce('Hypothèse : un CNN entraîné sur des données variées peut rivaliser avec les radiologues'),
  puce('Cinq objectifs, démarche et plan'),
  h2('Chapitre 1 : Revue de littérature'),
  puce('1.1 Les maladies pulmonaires : pneumonie, tuberculose, COVID-19'),
  puce('1.2 La radiographie thoracique et ses limites'),
  puce('1.3 L\'intelligence artificielle en imagerie médicale'),
  puce('1.4 Réseaux de neurones convolutionnels : principes et architectures'),
  puce('1.5 Travaux antérieurs sur la détection automatique'),
  h2('Chapitre 2 : Matériels et méthodes'),
  puce('2.1 Sources de données : bases retenues, bases écartées, trois tâches de classification'),
  puce('2.2 Prétraitement et augmentation des images'),
  puce('2.3 DenseNet-121 : justification et adaptation (apprentissage par transfert en deux phases)'),
  puce('2.4 Entraînement et validation : partition par patient, hyperparamètres, seuil de Youden, environnement'),
  puce('2.5 Métriques : matrice de confusion, précision, rappel, spécificité, F1, AUC, intervalles de confiance, Grad-CAM'),
  puce([b('2.6 Expériences complémentaires (nouveau) : '), n('masquage, validation croisée, comparaison d\'architectures')]),
  h2('Chapitre 3 : Résultats et discussion'),
  puce('3.1 Résultats quantitatifs ; 3.2 Analyse des erreurs ; 3.3 Comparaison avec l\'état de l\'art ; 3.4 Grad-CAM'),
  puce([b('3.5 Test de raccourci (nouveau, contribution principale) ; 3.6 Validation croisée entre hôpitaux ; 3.7 Comparaison d\'architectures')]),
  puce('3.8 Limites, implications cliniques et éthiques'),
  h2('Conclusion générale'),
  puce('Bilan et contributions, portée, limites et perspectives, recommandations pour un déploiement responsable'),

  h1('Principaux résultats'),
  tableau([
    ['Expérience', 'Résultat (AUC sur l\'ensemble de test, IC 95 %)'],
    ['Pneumonie (DenseNet-121)', '0,996 [0,993 ; 0,998]'],
    ['Tuberculose (DenseNet-121)', '0,886 [0,816 ; 0,942]'],
    ['Pneumonie bactérienne ou virale', '0,843 [0,809 ; 0,873]'],
    ['Pneumonie, bords seuls (centre masqué)', '0,991 [0,987 ; 0,995] : la tâche est soluble sans voir le centre des poumons'],
    ['Pneumonie, bords masqués', '0,997 [0,995 ; 0,999] : masquer les bords ne coûte rien'],
    ['Tuberculose, Shenzhen vers Montgomery / inverse', '0,852 / 0,725 : perte de performance en changeant d\'hôpital'],
    ['ResNet-50 et EfficientNet-B0', 'Jamais significativement meilleurs que DenseNet-121'],
  ], [4000, 5638]),
  p(''),

  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun('Points sur lesquels j\'aimerais votre avis')] }),
  puce([b('1. Réduction du corpus et retrait du COVID-19 : '), n('ce recentrage vous convient-il ?')]),
  puce([b('2. Structure en trois chapitres : '), n('le canevas en décrit quatre ; la section 3.8 (limites et perspectives) peut devenir un Chapitre 4 si vous le préférez.')]),
  puce([b('3. Lecture des cartes Grad-CAM : '), n('j\'interprète une activation sur une électrode de surveillance (Figure 3.5) ; votre regard, ou celui d\'un radiologue, serait précieux.')]),
  puce([b('4. Choix méthodologiques : '), n('perte pondérée plutôt que suréchantillonnage, PyTorch, seuil de décision fixé par l\'indice de Youden.')]),
  puce([b('5. Calendrier : '), n('date limite de dépôt et modalités de la soutenance.')]),
];

const doc = new Document({
  creator: 'ALAWO Adeshina Néhémiah',
  title: 'Plan du mémoire (mise à jour)',
  styles: {
    default: { document: { run: { font: POLICE, size: 21 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { font: POLICE, size: 40, bold: true, color: '1F3B5C' }, paragraph: { spacing: { after: 200 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { font: POLICE, size: 28, bold: true, color: '1F3B5C' },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: POLICE, size: 23, bold: true },
        paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 1, keepNext: true } },
    ],
  },
  numbering: { config: [{ reference: 'puces', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: contenu }],
});

Packer.toBuffer(doc).then((buf) => {
  const sortie = path.join(__dirname, 'Plan_memoire_ALAWO_mise_a_jour.docx');
  fs.writeFileSync(sortie, buf);
  console.log('Écrit :', sortie);
});
