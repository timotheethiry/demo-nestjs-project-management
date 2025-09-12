# ADR 007 – Ordre de construction centré sur l’apprentissage d’une architecture scalable

Statut : Acceptée
Date : 2025-05-21

🔁 Remplacée
Cette ADR a été remplacée par l’ADR 007 – Ordre de construction de l’application, datée du 22 mai 2025.
Les décisions prises ici ne sont plus à jour et ne doivent plus être suivies.

Contexte :
Le projet a pour objectif principal de renforcer les compétences en conception logicielle et en architecture scalable avec NestJS. Il s’agit d’un projet solo, utilisé à des fins d’apprentissage et de démonstration dans un portfolio.
Plutôt que de viser une démonstration rapide, la priorité est donnée à la structuration progressive, modulaire et cohérente de l’architecture, avec un découpage clair des responsabilités (module, service, controller, repository).
Décision :
L’ordre d’implémentation suivant est retenu pour favoriser un apprentissage progressif et structuré :

1. Structuration initiale : création des modules de base (Auth, User, Projet, Service) et configuration de TypeORM.
2. Gestion des utilisateurs et des services : mise en place des entités, relations, et rôles.
3. Authentification : sécurisation de l’application avec JWT et extraction du contexte utilisateur.
4. ProjetModule : implémentation du projet avec ses relations principales, règles métier simples et champ createdBy.
5. Découpage des projets : ajout des entités Phase et Étape, rattachées aux projets.
6. (Facultatif) : ajout ultérieur des Tâches, pour tester l’évolutivité du modèle.

Des pratiques transversales comme la validation, les tests unitaires, et la séparation claire des responsabilités seront intégrées dès que possible.

Conséquences :
• Permet de structurer le projet de façon modulaire et évolutive dès le départ.
• Encourage des itérations maîtrisées, avec un bon équilibre entre complexité et clarté.
• Rend plus facile la refactorisation future (ex. : extraction de modules Phase, Task, etc.) si la complexité du projet le justifie.
• Permet une documentation cohérente des choix d’architecture au fil du développement.

Note :
Ce projet pourra également servir de support pour tester ou refactorer progressivement selon des principes d’architecture plus avancés (ex. : Domain-Driven Design, CQRS, Clean Architecture), dans un objectif pédagogique. Ces expérimentations feront l’objet de nouvelles ADR le cas échéant.
