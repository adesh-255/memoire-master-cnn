// Génère le mémoire Word (canevas ESGIS) à partir des chapitres Markdown.
// Usage : node build_memoire.js   (depuis ce dossier ; module npm « docx » requis)
// Les tables des matières se mettent à jour à l'ouverture dans Word (ou via mettre_a_jour.ps1).

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber,
  NumberFormat, TableOfContents, StyleLevel, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, ImageRun, LevelFormat, PageBreak, VerticalAlign, PageBorderOffsetFrom,
} = require('docx');

const RACINE = path.resolve(__dirname, '..');
// Les fichiers édités sous Windows ont des fins de ligne CRLF : on les normalise
const lire = (p) => fs.readFileSync(path.join(RACINE, p), 'utf-8').split('\r\n').join('\n');
const SORTIE = path.join(RACINE, 'Memoire_ALAWO_Adeshina.docx');

// ---------------------------------------------------------------- Informations de couverture
const COUVERTURE = {
  theme: "Détection des maladies pulmonaires par réseaux de neurones convolutionnels (CNN) à partir d'images radiographiques",
  auteur: 'ALAWO Adeshina Néhémiah',
  directeur: '[À COMPLÉTER : Nom, prénoms, qualité ou titre du directeur]',
  specialite: 'IA-BD',
  annee: '2024-2025',
};

// ---------------------------------------------------------------- Mise en forme (canevas ESGIS)
const POLICE = 'Times New Roman';
const LARGEUR_TEXTE = 9070;            // A4 (11906) − 2 × 2,5 cm (1418)
const PX_MAX = 600;                    // largeur maximale d'une image (≈ 15,9 cm)

// ---------------------------------------------------------------- Texte en ligne
const MOTIF = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[(?:À |SOURCE|RÉSULTATS|AUTEURS)[^\]]*\])/g;

function runs(texte, base = {}) {
  const sortie = [];
  let dernier = 0;
  for (const m of texte.matchAll(MOTIF)) {
    if (m.index > dernier) sortie.push(new TextRun({ text: texte.slice(dernier, m.index), ...base }));
    const t = m[0];
    if (t.startsWith('**')) sortie.push(...runs(t.slice(2, -2), { ...base, bold: true }));
    else if (t.startsWith('`')) sortie.push(new TextRun({ text: t.slice(1, -1), ...base }));
    else if (t.startsWith('[')) sortie.push(new TextRun({ text: t, ...base, highlight: 'yellow' }));
    else sortie.push(new TextRun({ text: t.slice(1, -1), ...base, italics: !base.italics }));
    dernier = m.index + t.length;
  }
  if (dernier < texte.length) sortie.push(new TextRun({ text: texte.slice(dernier), ...base }));
  return sortie;
}

const para = (texte, opts = {}) => new Paragraph({ children: runs(texte, opts.run || {}), ...opts.p });
const aCompleter = (texte) => new Paragraph({ children: [new TextRun({ text: texte, highlight: 'yellow' })] });

// ---------------------------------------------------------------- Tableaux
function lireTableauMd(lignes) {
  return lignes
    .filter((l) => !/^\|[\s:|-]+\|$/.test(l.trim()))
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
}

function largeurs(rangs, imposees) {
  if (imposees) return imposees;
  const n = rangs[0].length;
  const poids = Array.from({ length: n }, (_, j) =>
    Math.min(60, Math.max(8, ...rangs.map((r) => (r[j] || '').replace(/\*/g, '').length))));
  const total = poids.reduce((a, b) => a + b, 0);
  const w = poids.map((p) => Math.floor((p / total) * LARGEUR_TEXTE));
  w[n - 1] += LARGEUR_TEXTE - w.reduce((a, b) => a + b, 0);
  return w;
}

function tableau(rangs, { entete = true, taille, colonnes } = {}) {
  const w = largeurs(rangs, colonnes);
  // 10 pt par défaut, 9 pt au-delà de cinq colonnes pour éviter les retours à la ligne dans les chiffres
  taille = taille ?? (rangs[0].length > 5 ? 18 : 20);
  const bord = { style: BorderStyle.SINGLE, size: 4, color: '808080' };
  return new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA },
    columnWidths: w,
    rows: rangs.map((r, i) => new TableRow({
      tableHeader: entete && i === 0,
      children: w.map((cw, j) => new TableCell({
        width: { size: cw, type: WidthType.DXA },
        borders: { top: bord, bottom: bord, left: bord, right: bord },
        shading: entete && i === 0 ? { type: ShadingType.CLEAR, fill: 'D9D9D9', color: 'auto' } : undefined,
        margins: { top: 40, bottom: 40, left: 80, right: 80 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { line: 240, after: 0 },
          alignment: AlignmentType.LEFT,
          children: runs(r[j] || '', { size: taille, bold: entete && i === 0 ? true : undefined }),
        })],
      })),
    })),
  });
}

// ---------------------------------------------------------------- Figures et tableaux des chapitres
const FICHIERS_FIGURES = {
  1: lire('Chapitre1/figures/figures-chapitre1.md').split('\n'),
  2: lire('Chapitre2/figures/figures-chapitre2.md').split('\n'),
  3: lire('Chapitre3/figures/figures-chapitre3.md').split('\n'),
};
const IMAGES = {
  '1.1': ['Figures-schemas/figure1_1_radiographies.png', 600],
  '1.2': ['Figures-schemas/figure1_2_chronologie.png', 600],
  '1.3': ['Figures-schemas/figure1_3_cnn_generique.png', 600],
  '2.1': ['Figures-schemas/figure2_1_pretraitement.png', 430],
  '2.2': ['Figures-schemas/figure2_2_densenet.png', 470],
  '2.3': ['Figures-schemas/figure2_3_partition.png', 560],
  '2.4': ['Figures-schemas/figure2_4_matrice_confusion.png', 580],
  '2.5': ['Figures-schemas/figure2_5_roc_illustration.png', 400],
  '3.1': ['memoire_resultats/figure3_1_courbes_apprentissage.png', 600],
  '3.2': ['memoire_resultats/figure3_2_matrices_confusion.png', 600],
  '3.3': ['memoire_resultats/figure3_3_courbes_roc.png', 420],
  '3.4': ['memoire_resultats/figure3_4_gradcam.png', 520],
  '3.5': ['memoire_complements/figure_test_raccourci.png', 600],
};

function taillePng(fichier) {
  const b = fs.readFileSync(fichier);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

function image(fichier, largeurPx) {
  const [w, h] = taillePng(fichier);
  const l = Math.min(largeurPx, PX_MAX);
  return new ImageRun({ type: 'png', data: fs.readFileSync(fichier), transformation: { width: l, height: Math.round((h / w) * l) } });
}

function decouperLegende(texte) {
  const t = texte.replace(/\*/g, '').trim();
  const i = t.search(/\.\s/);
  return i > 0 ? [t.slice(0, i + 1), t.slice(i + 2)] : [t, ''];
}

function legende(type, id, titre) {
  return new Paragraph({
    style: type === 'Figure' ? 'LegendeFigure' : 'LegendeTableau',
    children: [new TextRun({ text: `${type} ${id} : `, bold: true }), ...runs(titre)],
  });
}

const noteSous = (texte) => new Paragraph({ style: 'NoteLegende', children: runs(texte.replace(/^\*\*Note de bas de tableau :\*\*\s*/, 'Note : ')) });

function element(type, id) {
  const lignes = FICHIERS_FIGURES[id[0]];
  const motifLegende = new RegExp(`^\\*{1,2}${type} ${id.replace('.', '\\.')} :\\s*(.+)$`);
  const i = lignes.findIndex((l) => motifLegende.test(l));
  if (i < 0) return [aCompleter(`[${type.toUpperCase()} ${id} : légende introuvable]`)];
  const [titre, suite] = decouperLegende(lignes[i].match(motifLegende)[1]);
  const blocs = [];

  if (type === 'Tableau') {
    const debut = lignes.findIndex((l, k) => k > i && l.startsWith('|'));
    let fin = debut;
    while (fin < lignes.length && lignes[fin].startsWith('|')) fin++;
    blocs.push(legende('Tableau', id, titre));
    blocs.push(tableau(lireTableauMd(lignes.slice(debut, fin))));
    const note = lignes.slice(fin, fin + 4).find((l) => l.startsWith('**Note de bas de tableau'));
    if (suite) blocs.push(noteSous(suite));
    if (note) blocs.push(noteSous(note));
    return blocs;
  }

  if (IMAGES[id]) {
    const [f, l] = IMAGES[id];
    blocs.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 60 }, keepNext: true,
      children: [image(path.join(RACINE, f), l)] }));
  } else {
    blocs.push(new Paragraph({
      alignment: AlignmentType.CENTER, keepNext: true,
      border: { top: { style: BorderStyle.DASHED, size: 6, color: '999999', space: 8 }, bottom: { style: BorderStyle.DASHED, size: 6, color: '999999', space: 8 },
        left: { style: BorderStyle.DASHED, size: 6, color: '999999', space: 8 }, right: { style: BorderStyle.DASHED, size: 6, color: '999999', space: 8 } },
      spacing: { before: 600, after: 600 },
      children: [new TextRun({ text: `[Figure ${id} à insérer : schéma décrit dans Chapitre${id[0]}/figures/figures-chapitre${id[0]}.md]`, highlight: 'yellow' })],
    }));
  }
  blocs.push(legende('Figure', id, titre));
  if (suite) blocs.push(noteSous(suite));
  return blocs;
}

// ---------------------------------------------------------------- Chapitres Markdown
const LISTES = new Set();

function chapitre(fichier) {
  let lignes = lire(fichier).split('\n');
  const titre = lignes[0].replace(/^#\s*/, '');
  const debut = lignes.indexOf('---') + 1;
  const fin = lignes.findIndex((l) => l.startsWith('## Notes de relecture'));
  lignes = lignes.slice(debut, fin < 0 ? undefined : fin);

  const blocs = [new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(titre)] })];
  let ref = null;
  for (const brut of lignes) {
    const l = brut.trim();
    if (!l || l === '---') { ref = null; continue; }
    let m;
    if ((m = l.match(/^###\s+(.*)/))) blocs.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: runs(m[1]) }));
    else if ((m = l.match(/^##\s+(.*)/))) blocs.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(m[1]) }));
    else if ((m = l.match(/^\[(FIGURE|TABLEAU) (\d\.\d)/))) blocs.push(...element(m[1] === 'FIGURE' ? 'Figure' : 'Tableau', m[2]));
    else if ((m = l.match(/^\d+\.\s+(.*)/))) {
      // une référence par liste, pour que chaque liste reparte à 1
      if (!ref) { ref = `liste-${LISTES.size + 1}`; LISTES.add(ref); }
      blocs.push(new Paragraph({ numbering: { reference: ref, level: 0 }, children: runs(m[1]) }));
    } else blocs.push(para(l));
  }
  return blocs;
}

// ---------------------------------------------------------------- Bibliographie (APA 7, ordre alphabétique)
function bibliographie() {
  const texte = lire('Bibliographie/bibliographie.md');
  const exclues = new Set(['10bis', '23']);          // références qui ne sont plus citées dans le texte
  const entrees = [...texte.matchAll(/^\*\*\[(\w+)\]\*\* (.+)$/gm)]
    .filter(([, k]) => !exclues.has(k))
    .map(([, , e]) => e
      .replace(/^World Health Organization\. \(2024\)\. \*Global tuberculosis/, 'Organisation mondiale de la santé (OMS). (2024a). *Global tuberculosis')
      .replace(/^World Health Organization\. \(2024\)\. \*Pneumonia/, 'Organisation mondiale de la santé (OMS). (2024b). *Pneumonia'));
  const cle = (e) => e.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  entrees.sort((a, b) => cle(a).localeCompare(cle(b)));
  return [
    new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun('Bibliographie')] }),
    ...entrees.map((e) => new Paragraph({
      alignment: AlignmentType.LEFT, indent: { left: 720, hanging: 720 }, spacing: { line: 276, after: 160 }, children: runs(e),
    })),
  ];
}

// ---------------------------------------------------------------- Sigles et abréviations
const SIGLES = [
  ['AUC', 'Area Under the Curve (aire sous la courbe ROC)'],
  ['CAD', 'Computer-Aided Detection (aide au diagnostic assistée par ordinateur)'],
  ['CNN', 'Convolutional Neural Network (réseau de neurones convolutionnel)'],
  ['COVID-19', 'Coronavirus Disease 2019 (maladie à coronavirus 2019)'],
  ['CT', 'Computed Tomography (tomodensitométrie, scanner)'],
  ['CVPR', 'Conference on Computer Vision and Pattern Recognition'],
  ['CXR', 'Chest X-Ray (radiographie thoracique)'],
  ['ESGIS', "École supérieure de gestion d'informatique et des sciences"],
  ['FDA', 'Food and Drug Administration (agence américaine du médicament)'],
  ['FN', 'Faux négatif'],
  ['FP', 'Faux positif'],
  ['GPU', 'Graphics Processing Unit (processeur graphique)'],
  ['Grad-CAM', 'Gradient-weighted Class Activation Mapping'],
  ['HOG', 'Histogram of Oriented Gradients (histogramme de gradients orientés)'],
  ['IA', 'Intelligence artificielle'],
  ['IC', 'Intervalle de confiance'],
  ['ILSVRC', 'ImageNet Large Scale Visual Recognition Challenge'],
  ['NIH', 'National Institutes of Health (instituts nationaux de la santé, États-Unis)'],
  ['OMS', 'Organisation mondiale de la santé'],
  ['ReLU', 'Rectified Linear Unit (unité linéaire rectifiée)'],
  ['RGB', 'Red, Green, Blue (rouge, vert, bleu)'],
  ['ROC', 'Receiver Operating Characteristic (fonction d\'efficacité du récepteur)'],
  ['RSNA', 'Radiological Society of North America'],
  ['SGD', 'Stochastic Gradient Descent (descente de gradient stochastique)'],
  ['SIFT', 'Scale-Invariant Feature Transform'],
  ['SVM', 'Support Vector Machine (machine à vecteurs de support)'],
  ['TB', 'Tuberculose'],
  ['VIH', "Virus de l'immunodéficience humaine"],
  ['ViT', 'Vision Transformer'],
  ['VN', 'Vrai négatif'],
  ['VP', 'Vrai positif'],
  ['VRS', 'Virus respiratoire syncytial'],
];

// ---------------------------------------------------------------- Annexes
function annexes() {
  // Valeurs lues dans la configuration enregistrée par le notebook (resume_pour_memoire.md)
  const resume = lire('memoire_resultats/resume_pour_memoire.md');
  const cfg = JSON.parse((resume.match(/```json\n([\s\S]*?)```/) || [, '{}'])[1]);
  const fr = (x) => String(x).replace('.', ',');
  const exposant = (n) => String(n).split('').map((c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('');
  const sci = (x) => {
    const e = Math.floor(Math.log10(x));
    return x < 0.001 ? `${fr(Math.round((x / 10 ** e) * 100) / 100)} × 10${exposant(e)}` : fr(x);
  };
  const degel = cfg.phase2.degel.map(([ep, blocs]) => `${blocs.join(' + ')} (époque ${ep + 1} de la phase 2)`).join(' ; ');
  const blocs = [
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Annexes')] }),
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Annexe A : Configuration expérimentale')] }),
    para("Paramètres utilisés pour l'entraînement des trois modèles, tels qu'enregistrés par le notebook d'expérimentation. "
      + 'Matériel : GPU NVIDIA Tesla T4 (16 Go). Logiciels : Python 3.13, PyTorch 2.11, torchvision 0.26, scikit-learn.'),
    legende('Tableau', 'A.1', 'Configuration expérimentale.'),
    tableau([
      ['Paramètre', 'Valeur'],
      ['Graine aléatoire', cfg.seed],
      ['Taille des images (stockage / entrée du réseau)', `${cfg.taille_cache} × ${cfg.taille_cache} px / ${cfg.taille_entree} × ${cfg.taille_entree} px`],
      ['Partition entraînement / validation / test (par patient)', cfg.partition.map((x) => `${Math.round(x * 100)} %`).join(' / ')],
      ['Taille de lot', cfg.batch_size],
      ['Dropout', fr(cfg.dropout)],
      ['Régularisation L2 (weight decay)', sci(cfg.weight_decay)],
      ['ReduceLROnPlateau', `facteur ${fr(cfg.plateau.factor)}, patience ${cfg.plateau.patience} époques`],
      ['Phase 1 : taux d\'apprentissage, époques max., patience', `${sci(cfg.phase1.lr)} ; ${cfg.phase1.max_epochs} ; ${cfg.phase1.patience}`],
      ['Phase 2 : taux d\'apprentissage, époques max., patience', `${sci(cfg.phase2.lr)} ; ${cfg.phase2.max_epochs} ; ${cfg.phase2.patience}`],
      ['Phase 2 : blocs dégelés', degel],
      ['Poids initiaux', cfg.poids_imagenet ? 'ImageNet (torchvision, IMAGENET1K_V1)' : 'aléatoires'],
      ['Intervalles de confiance', `bootstrap, ${cfg.bootstrap} tirages`],
    ].map((r) => r.map(String)), { taille: 22, colonnes: [4300, LARGEUR_TEXTE - 4300] }),
  ];

  const taches = [['pneumonie', 'Pneumonie'], ['tuberculose', 'Tuberculose'], ['bacterien_viral', 'Pneumonie bactérienne ou virale']];
  blocs.push(new Paragraph({ heading: HeadingLevel.HEADING_2, pageBreakBefore: true, children: [new TextRun('Annexe B : Galerie Grad-CAM')] }));
  blocs.push(para("Pour chaque tâche, six vrais positifs (VP) répartis sur l'éventail des scores, puis les six faux négatifs (FN) les plus nets. "
    + 'Sous chaque image : type de cas, probabilité attribuée par le modèle et identifiant du patient.'));
  taches.forEach(([dossier, nom], k) => {
    const rep = path.join(RACINE, 'memoire_resultats', dossier, 'gradcam_galerie');
    const fichiers = fs.readdirSync(rep).filter((f) => f.endsWith('.png'))
      .sort((a, b) => (a[0] === b[0] ? parseFloat(b.split('_')[1]) - parseFloat(a.split('_')[1]) : a < b ? 1 : -1));
    const lignes = [];
    for (let i = 0; i < fichiers.length; i += 4) lignes.push(fichiers.slice(i, i + 4));
    const cw = LARGEUR_TEXTE / 4;
    const sansBord = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    blocs.push(new Table({
      width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: [cw, cw, cw, cw],
      rows: lignes.map((ligne) => new TableRow({ cantSplit: true, children: [0, 1, 2, 3].map((j) => new TableCell({
        width: { size: cw, type: WidthType.DXA },
        borders: { top: sansBord, bottom: sansBord, left: sansBord, right: sansBord },
        children: ligne[j] ? [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 }, children: [image(path.join(rep, ligne[j]), 135)] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 80 }, children: [new TextRun({
            text: (() => { const [t, s, ...p] = ligne[j].replace('.png', '').split('_'); return `${t} · ${s.replace('.', ',')} · ${p.join('_')}`; })(),
            size: 16 })] }),
        ] : [new Paragraph('')],
      })) })),
    }));
    blocs.push(legende('Figure', `B.${k + 1}`, `Galerie Grad-CAM, ${nom.toLowerCase()}.`));
  });
  return blocs;
}

// ---------------------------------------------------------------- Pages liminaires
const titreLiminaire = (t, saut = true) => new Paragraph({ style: 'TitreLiminaire', pageBreakBefore: saut, children: [new TextRun(t)] });

function couverture() {
  const c = (texte, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: o.after ?? 60, before: o.before ?? 0 },
    children: Array.isArray(texte) ? texte : runs(texte, o.run || {}) });
  const sansBord = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const entete = new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: [4535, 4535],
    borders: { top: sansBord, bottom: sansBord, left: sansBord, right: sansBord, insideHorizontal: sansBord, insideVertical: sansBord },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 4535, type: WidthType.DXA }, children: [
        c("MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE", { after: 0, run: { size: 20 } }), c('(MESR)', { run: { size: 20 } }), c('__________', { run: { size: 20 } })] }),
      new TableCell({ width: { size: 4535, type: WidthType.DXA }, children: [
        c('RÉPUBLIQUE TOGOLAISE', { after: 0, run: { size: 20 } }), c('Travail - Liberté - Patrie', { run: { size: 20, italics: true } }), c('__________', { run: { size: 20 } })] }),
    ] })],
  });
  const vert = { style: BorderStyle.SINGLE, size: 18, color: '77933C' };
  const encadre = new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: [LARGEUR_TEXTE],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: LARGEUR_TEXTE, type: WidthType.DXA },
      borders: { top: vert, bottom: vert, left: vert, right: vert },
      shading: { type: ShadingType.CLEAR, fill: 'D8E4BC', color: 'auto' },
      margins: { top: 160, bottom: 200, left: 240, right: 240 },
      children: [c([new TextRun({ text: 'THÈME', bold: true, underline: {}, size: 32 })], { after: 160 }),
        c([new TextRun({ text: COUVERTURE.theme, bold: true, size: 30 })], { after: 0 })],
    })] })],
  });
  return [
    entete,
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480, after: 240, line: 240 },
      children: [image(path.join(__dirname, 'logo_esgis.png'), 300)] }),
    c("ÉCOLE SUPÉRIEURE DE GESTION D'INFORMATIQUE ET DES SCIENCES", { run: { bold: true, size: 24 }, after: 480 }),
    c('MÉMOIRE', { run: { bold: true, size: 48 }, after: 60 }),
    c("EN VUE DE L'OBTENTION DU DIPLÔME DE MASTER PROFESSIONNEL", { run: { bold: true, size: 28 }, after: 480 }),
    ...[['Domaine', 'Sciences et Technologies'], ['Mention', 'Informatique'], ['Spécialité', COUVERTURE.specialite]].map(([k, v]) =>
      new Paragraph({ indent: { left: 2600 }, spacing: { line: 240, after: 60 }, children: [new TextRun({ text: `${k} : `, bold: true }), ...runs(v, { italics: true })] })),
    new Paragraph({ spacing: { after: 400, line: 240 }, children: [] }),
    encadre,
    c([new TextRun({ text: 'Rédigé par :', bold: true, underline: {} })], { before: 720, after: 60 }),
    c(COUVERTURE.auteur, { run: { size: 26 }, after: 480 }),
    c([new TextRun({ text: 'Directeur du mémoire :', bold: true, underline: {} })], { after: 60 }),
    c(COUVERTURE.directeur, { after: 1200 }),
    c([new TextRun({ text: 'ANNÉE ACADÉMIQUE : ', bold: true }), ...runs(COUVERTURE.annee, { italics: true })]),
  ];
}

// Texte d'une section « ## Titre » de Liminaires/resume-abstract.md, paragraphe par paragraphe
function sectionLiminaire(titre) {
  const texte = lire('Liminaires/resume-abstract.md');
  const debut = texte.indexOf(`## ${titre}\n`) + titre.length + 4;
  const fin = texte.indexOf('\n## ', debut);
  return texte.slice(debut, fin < 0 ? undefined : fin).replace(/\n---\s*$/, '').split('\n')
    .map((l) => l.trim()).filter((l) => l && l !== '---').map((l) => para(l));
}

function liminaires() {
  return [
    titreLiminaire('Dédicaces', false),
    aCompleter('[À RÉDIGER : dédicaces]'),
    titreLiminaire('Remerciements'),
    aCompleter('[À RÉDIGER : remerciements (directeur du mémoire, ESGIS, proches)]'),
    titreLiminaire('Résumé'),
    ...sectionLiminaire('Résumé'),
    titreLiminaire('Abstract'),
    ...sectionLiminaire('Abstract'),
    titreLiminaire('Sommaire'),
    new TableOfContents('Sommaire', { hyperlink: true, headingStyleRange: '1-2' }),
    titreLiminaire('Liste des figures'),
    new TableOfContents('Liste des figures', { hyperlink: true, stylesWithLevels: [new StyleLevel('LegendeFigure', 1)] }),
    titreLiminaire('Liste des tableaux'),
    new TableOfContents('Liste des tableaux', { hyperlink: true, stylesWithLevels: [new StyleLevel('LegendeTableau', 1)] }),
    titreLiminaire('Liste des sigles et abréviations'),
    tableau([['Sigle', 'Signification'], ...SIGLES], { taille: 22, colonnes: [1800, LARGEUR_TEXTE - 1800] }),
  ];
}

// ---------------------------------------------------------------- Assemblage
const corps = [
  ...chapitre('Introduction/introduction-generale.md'),
  ...chapitre('Chapitre1/chapitre1-revue-litterature.md'),
  ...chapitre('Chapitre2/chapitre2-materiels-methodes.md'),
  ...chapitre('Chapitre3/chapitre3-resultats-discussion.md'),
  ...chapitre('Chapitre4/chapitre4-discussion-perspectives.md'),
  ...chapitre('Conclusion/conclusion-generale.md'),
  ...bibliographie(),
];

const numerotations = [...LISTES];

const piedDePage = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 },
  children: [new TextRun({ children: [PageNumber.CURRENT], size: 22 })] })] });
const PAGE = { size: { width: 11906, height: 16838 }, margin: { top: 1418, right: 1418, bottom: 1418, left: 1418 } };
const bordVert = { style: BorderStyle.THICK_THIN_LARGE_GAP, size: 24, color: '77933C', space: 24 };

const doc = new Document({
  creator: COUVERTURE.auteur,
  title: COUVERTURE.theme,
  features: { updateFields: true },
  styles: {
    default: {
      document: { run: { font: POLICE, size: 24 }, paragraph: { spacing: { line: 360, after: 160 }, alignment: AlignmentType.JUSTIFIED } },
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: POLICE, size: 32, bold: true, allCaps: true },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 240, after: 480, line: 276 }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: POLICE, size: 28, bold: true },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 360, after: 200, line: 276 }, outlineLevel: 1, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: POLICE, size: 24, bold: true, italics: true },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 240, after: 120, line: 276 }, outlineLevel: 2, keepNext: true } },
      { id: 'TitreLiminaire', name: 'TitreLiminaire', basedOn: 'Normal', next: 'Normal',
        run: { font: POLICE, size: 32, bold: true, allCaps: true },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 480, line: 276 } } },
      { id: 'LegendeFigure', name: 'LegendeFigure', basedOn: 'Normal', next: 'Normal',
        run: { font: POLICE, size: 22 },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 60, after: 120, line: 240 } } },
      { id: 'LegendeTableau', name: 'LegendeTableau', basedOn: 'Normal', next: 'Normal',
        run: { font: POLICE, size: 22 },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 240, after: 120, line: 240 }, keepNext: true } },
      { id: 'NoteLegende', name: 'NoteLegende', basedOn: 'Normal', next: 'Normal',
        run: { font: POLICE, size: 18, italics: true },
        paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { before: 40, after: 240, line: 240 } } },
    ],
  },
  numbering: {
    config: numerotations.map((reference) => ({ reference, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
      alignment: AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] })),
  },
  sections: [
    { properties: { page: { ...PAGE, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
        borders: { pageBorderTop: bordVert, pageBorderBottom: bordVert, pageBorderLeft: bordVert, pageBorderRight: bordVert,
          pageBorders: { offsetFrom: PageBorderOffsetFrom.PAGE } } } },
      children: couverture() },
    { properties: { page: { ...PAGE, pageNumbers: { start: 2, formatType: NumberFormat.LOWER_ROMAN } } },
      footers: { default: piedDePage() }, children: liminaires() },
    { properties: { page: { ...PAGE, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      footers: { default: piedDePage() }, children: corps },
    { properties: { page: { ...PAGE, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } } },
      footers: { default: piedDePage() }, children: [...annexes(),
        titreLiminaire('Table des matières'),
        new TableOfContents('Table des matières', { hyperlink: true, headingStyleRange: '1-3' })] },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(SORTIE, buf);
  console.log(`Écrit : ${SORTIE} (${(buf.length / 1e6).toFixed(1)} Mo)`);
});
