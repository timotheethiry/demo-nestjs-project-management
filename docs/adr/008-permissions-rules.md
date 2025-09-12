# ADR 008 – Règles de permissions et évolutivité

Statut : Acceptée
Date : 2025-05-21

Contexte :
Le système de gestion de projets nécessite un ensemble de règles de permissions pour garantir que chaque rôle dispose d’un niveau d’accès cohérent avec ses responsabilités. L’objectif est de couvrir les besoins immédiats du MVP tout en permettant des évolutions futures (validation de clôture, rôle lecteur, etc.) sans complexifier prématurément l’architecture.

Décision :

1. Affectation des rôles
   ○ Les admins peuvent affecter un overseer ou des membres à un projet.
   ○ Les overseers peuvent uniquement affecter ou retirer des membres.
2. Droits d’édition et suppression
   ○ Les admins et overseers peuvent ajouter, modifier ou supprimer des phases, étapes et tâches.
   ○ Les project members peuvent ajouter ou modifier des étapes et tâches, mais pas les supprimer.
3. Clôture de projet
   ○ L’overseer peut proposer la clôture d’un projet en changeant son statut en propose_cloture (ou équivalent).
   ○ L’admin valide la clôture en passant le statut à cloture.
   ○ Le champ Projet.status supporte donc une logique de transition progressive (ex. : en_cours → propose_cloture → cloture).
4. Visibilité des projets
   ○ Un projet n’est visible que par ses membres, ses overseers et les admins.
   ○ Un rôle lecteur pourra être introduit plus tard si nécessaire.
5. Conventions à appliquer dès maintenant
   ○ Centraliser la logique d’autorisation dans un service dédié (PermissionsService).
   ○ Exemples de méthodes :
   § canViewProject(user, project)
   § canEditPhase(user, project)
   § canDeleteTask(user, task)
   ○ Cette abstraction permettra d’ajouter facilement de nouveaux rôles ou des règles spécifiques sans refactoriser tout le code métier.

Conséquences :
• La gestion des permissions reste simple pour le MVP tout en anticipant les cas d’usage futurs.
• L’ajout d’un rôle lecteur ou d’un système de validation de clôture pourra se faire sans dette technique.
• Les responsabilités sont clairement séparées entre les rôles et respectent une logique métier cohérente.

Note :
Reformulation le 2025-05-22 pour refléter correctement la décision initiale : les project members peuvent ajouter ou modifier des étapes et des tâches, mais pas les supprimer.
