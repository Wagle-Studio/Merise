# Merise

Ce projet permet de créer et modifier des modèles entité-relation de manière intuitive.

## Fonctionnalités principales

- **Création d'entités et associations** - Interface drag-and-drop pour modéliser des diagrammes Merise
- **Gestion des relations** - Définition de cardinalités et contraintes entre entités
- **Édition en temps réel** - Modification des propriétés via des dialogues contextuels
- **Validation automatique** - Contrôle de cohérence entre les couches Flow et Merise

## Stack technique

- **Frontend**: React 19 + TypeScript + Vite
- **Diagrammes**: React Flow (XYFlow) pour l'interface graphique
- **Styling**: SCSS avec architecture BEM
- **State Management**: Context API avec gestionnaires dédiés
- **Tooling**: ESLint, Prettier, TypeScript strict mode

## Points d'intérêt technique

- **Architecture hexagonale** - Séparation claire entre domaine métier (Merise) et interface utilisateur (Flow)
- **Pattern Manager/DTO** - Gestion d'état immutable avec validation en temps réel
- **System de providers** - Injection de dépendances via factories pour découplage maximal
- **Error boundaries** - Gestion d'erreurs granulaire par couche applicative
- **Validation cross-layer** - Hook de debug vérifiant la cohérence entre Flow et Merise en développement

## Installation

```bash
# Cloner le repository
git clone https://github.com/username/wagle-studio-merise.git

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

## Architecture

```
src/
├── core/                  # Noyau applicatif et orchestration
│   ├── kernel/            # Context principal et providers
│   └── libs/              # Services transversaux (dialog, toast, error)
├── libs/                  # Couches métier
│   ├── flow/              # Gestion React Flow (présentation)
│   └── merise/            # Logique Merise (domaine)
└── ui/                    # Composants d'interface
    ├── libs/              # Composants métier spécialisés
    └── system/            # Design system (atoms, molecules)
```
