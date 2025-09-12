# ADR 002 – Structure des modules

Statut : Acceptée
Date : 2025-05-21
Contexte :
Il est nécessaire de définir la séparation des responsabilités pour assurer lisibilité et évolutivité du code.
Décision :
• Chaque domaine métier a son module : Auth, User, Project, Department, Permissions.
• Un SharedModule centralise utils, decorators et pipes réutilisables.
Conséquences :
Facilite la lecture et la navigation dans le code.
