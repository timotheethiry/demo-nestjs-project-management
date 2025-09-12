# ADR 004 – Ajout d’un champ createdBy dans l’entité Projet

Statut : Acceptée
Date : 2025-05-21

Contexte :
Dans le modèle de projet, un utilisateur doit pouvoir créer un projet sans nécessairement en être le responsable opérationnel. Il peut s’agir d’un membre d’une équipe centrale (ex. : PMO, DSI, coordinateur administratif) qui initie le projet pour le compte d’un service.

Décision :
Un champ createdBy de type User (relation ManyToOne) est ajouté à l’entité Projet. Il représente l’utilisateur qui a créé le projet dans le système, indépendamment du responsable du projet.

Conséquences :
• Ce champ permet une meilleure traçabilité et distinction des rôles.
• Il simplifie l’implémentation de règles métier et de restrictions futures (droits, notifications, etc.).
• Il sera renseigné automatiquement à la création du projet via l’ID de l’utilisateur authentifié.
• Ce champ sera affiché dans l’interface utilisateur sous forme "Projet créé par X le JJ/MM/AAAA".
