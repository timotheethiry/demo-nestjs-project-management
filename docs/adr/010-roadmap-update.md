# ADR 010 – Ordre de construction de l’application (remplace ADR 004)

Statut : Acceptée
Date : 2025-05-22

Contexte :
L’ADR 004 proposait un ordre de construction initial visant à structurer le projet par étapes cohérentes (modules, entités, hiérarchie, etc.).

Depuis, la conception a évolué : l’introduction d’un PermissionsService central pour gérer les autorisations par rôle et appartenance à un projet a un impact sur l’ordre optimal de développement.

Décision :
L’ADR 004 est remplacée par une nouvelle version plus adaptée à la logique actuelle du MVP.

L’ordre retenu est le suivant :

1. 🧱 Structuration initiale
   ○ Créer les modules : AuthModule, UserModule, ProjetModule, ServiceModule, PermissionsModule
   ○ Configurer TypeORM
   ○ Créer les entités de base : User, Service, Projet
2. 👥 Gestion des utilisateurs et services
   ○ CRUD pour User et Service
   ○ Relation User <-> Service
   ○ Enum de rôle (ADMIN, USER)
3. 🔐 Authentification
   ○ JWT, guards, décorateurs
   ○ Injection du createdBy automatiquement à la création de projet
4. 📦 ProjetModule
   ○ Implémentation de Projet avec relations, logique métier de base
5. 🔐 PermissionsModule
   ○ Création d’un PermissionsService
   ○ Guards réutilisables pour vérifier isAdmin, isOverseer, isMember
   ○ Appels aux permissions depuis les contrôleurs du domaine
6. 🧩 Hiérarchie du projet
   ○ Implémentation de Phase et Étape
   ○ Relations correctes et règles de permissions
7. ✅ Tâches (facultatif)
   ○ Implémentation des Tâches si souhaité, à intégrer proprement à la hiérarchie
8. 📐 Étapes transverses
   ○ Validation des DTO (class-validator)
   ○ Tests unitaires (au moins sur services critiques)
   ○ Écriture des ADR à chaque décision structurante

Conséquences :
• Cette séquence reflète mieux la séparation des responsabilités entre logique métier et autorisation.
• Elle garantit que les contrôles de permission sont pensés et disponibles avant l’implémentation fine des entités dépendantes (phases, étapes, tâches).
• Elle encourage une architecture modulaire, facilement testable, et orientée vers l’évolutivité.
