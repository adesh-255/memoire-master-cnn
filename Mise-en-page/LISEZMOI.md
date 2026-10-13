# Mise en page Word du mémoire

Le fichier `../Memoire_ALAWO_Adeshina.docx` est **généré** à partir des chapitres Markdown.
Ne corrigez pas le texte dans Word : corrigez le `.md`, puis régénérez.

## Régénérer

```
cd Mise-en-page
node build_memoire.js
powershell -ExecutionPolicy Bypass -File mettre_a_jour.ps1
```

La première commande reconstruit le `.docx`. La seconde l'ouvre dans Word en arrière-plan,
met à jour sommaire, listes et table des matières, puis exporte `../Memoire_ALAWO_Adeshina.pdf`.
Fermez le document dans Word avant de lancer ces commandes.

## Où modifier quoi

| Élément | Fichier |
|---|---|
| Texte des chapitres | `Introduction/`, `Chapitre1/`, `Chapitre2/`, `Chapitre3/` (`.md`) |
| Légendes et contenu des tableaux | `Chapitre*/figures/figures-chapitre*.md` |
| Bibliographie | `Bibliographie/bibliographie.md` |
| Couverture (directeur, spécialité, année) | bloc `COUVERTURE` en tête de `build_memoire.js` |
| Sigles | liste `SIGLES` dans `build_memoire.js` |
| Figures 3.1 à 3.4 | `memoire_resultats/*.png` |

Les zones **surlignées en jaune** dans le Word restent à compléter.
