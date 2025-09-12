# ADR 001 – Choix de la stack technique

Statut : Acceptée
Date : 2025-05-21
Contexte :
Le projet a pour objectif de démontrer une architecture modulaire et scalable pour un système de gestion de projets. Il est nécessaire de choisir une stack qui permette :
• Une structuration claire en modules métiers.
• L’intégration de guards et services transverses pour la sécurité.
• Une base de données relationnelle simple à configurer et portable pour la démo.
Décision :
• Framework backend : NestJS, pour sa modularité et ses patterns d’architecture inspirés d’Angular.
• ORM : TypeORM, pour la gestion relationnelle simple et intégrée à NestJS.
• Base de données : SQLite, pour un setup rapide et portable, suffisant pour un MVP.
• API : REST, pour simplicité de démonstration.
Conséquences :
• Stack légère, simple à déployer et à cloner.
• Architecture modulaire facilitée par NestJS.
Base de données facilement remplaçable par PostgreSQL ou MySQL si nécessaire.
