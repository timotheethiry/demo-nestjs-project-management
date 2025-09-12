# Project Management System – NestJS Demo

![License: Custom - Educational Use Only](https://img.shields.io/badge/license-educational--only-blue)

Ce projet est soumis à une licence Educational Use Only.
Voir le fichier LICENSE.md pour les détails complets en français et en anglais.

## Description

Ce projet est une **application de démonstration** développée avec [NestJS](https://nestjs.com/) et [TypeORM](https://typeorm.io/) sur une base de données **SQLite**.  
Il s’agit d’un **MVP (Minimum Viable Product)** conçu pour illustrer de bonnes pratiques d’architecture backend dans un contexte de gestion de projets (projets, phases, étapes, tâches).

L’objectif principal est pédagogique et destiné à enrichir un **portfolio développeur**.

## 🚀 Fonctionnalités principales

- 🔑 Authentification JWT avec throttling basé sur l’IP
- 👤 Gestion des utilisateurs
- 📁 Gestion des projets, phases, étapes et tâches
- 🏢 Gestion des départements internes
- 🔒 Permissions centralisées via un module dédié
- 🛠️ Architecture modulaire orientée domaine métier

## 🏗️ Architecture

Organisation des modules :

- AppModule
  - AuthModule
  - UserModule
  - ProjectModule
    - /project
    - /phase
    - /step
    - /task
  - DepartmentModule
  - PermissionsModule
  - SharedModule

## ⚙️ Installation & Lancement

### Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- npm ou yarn
- SQLite (embarqué par défaut, aucune config serveur nécessaire)

### Installation

```bash
git clone https://github.com/timotheethiry/demo-nestjs-project-management.git
cd demo-nestjs-project-management
npm install
```

### Lancement en développement

```bash
npm run start:dev
```

L’API sera disponible sur localhost:3000

## ✅ Tests

Pour l’instant, les tests sont effectués manuellement via des appels API.
Des tests unitaires et d’intégration seront ajoutés dans une étape ultérieure.

## 📌 Roadmap (MVP)

- ✅ Implémentation des entités Projet / Phase / Step
- ✅ Implémentation du module Permissions
- 🚧 Implémentation des entités Task
- 🔒 Vérifications de sécurité supplémentaires
- 🧹 Refactoring & cleanup du code
- 🧪 Ajout progressif de tests automatisés

## 📚 Documentation complémentaire

### Décisions d'architecture

Pour comprendre le raisonnement derrière l’architecture et les choix métier.

- [ADR](./docs/adr)

### User Stories

Pour consulter les cas d'usage principaux.

- [User Stories](./docs/user-stories/)

### Plans de tests

Pour consulter les plans de tests.

- [Plans de tests](./docs/tests/)

## Auteur

Développé par **Tim**, développeur web indépendant.  
Ce code est publié à des fins **pédagogiques** et **exemplaires uniquement**.
