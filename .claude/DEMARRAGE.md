# Guide de démarrage — Agents Mémoire

## Comment utiliser les agents

Ouvre Claude Code depuis le dossier `workspace/Memoire/` pour que le CLAUDE.md soit chargé automatiquement.

---

## Commandes disponibles

```
/memoire-orchestrator   ← Point d'entrée pour toute tâche complexe
/memoire-analyst        ← Diagnostiquer l'état du mémoire
/memoire-planner        ← Planifier une section
/memoire-researcher     ← Chercher des sources académiques
/memoire-writer         ← Rédiger une section
/memoire-figure         ← Créer schémas et tableaux
/memoire-humanizer      ← Humaniser le texte (anti-détection IA)
/memoire-reviewer       ← Relecture qualité finale
```

---

## Exemples d'utilisation

### Démarrer une section de zéro
```
/memoire-orchestrator Rédige la section "Revue de littérature sur les CNN en imagerie médicale"
```

### Améliorer un texte existant
```
/memoire-humanizer [coller le texte ici]
```

### Trouver des sources manquantes
```
/memoire-researcher performances CheXNet vs radiologue humain sur ChestX-ray14
```

### Planifier avant de rédiger
```
/memoire-planner Chapitre 2 — Matériels et Méthodes, section "Prétraitement des données"
```

### Relire un chapitre
```
/memoire-reviewer Chapitre 1 complet
```

---

## Workflow complet pour un chapitre

1. `/memoire-analyst` → identifier les lacunes
2. `/memoire-researcher` → trouver les sources manquantes
3. `/memoire-planner` → construire le plan détaillé
4. `/memoire-writer` → rédiger avec le plan
5. `/memoire-figure` → ajouter les figures/tableaux
6. `/memoire-humanizer` → passer en mode anti-détection
7. `/memoire-reviewer` → validation finale
