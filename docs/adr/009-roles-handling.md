# ADR 009 – Rôles globaux vs affectations par projet

Statut : Acceptée
Date : 2025-05-22

Contexte :
L’application gère des projets avec des permissions différenciées selon le rôle des utilisateurs : administrateur, superviseur de projet (“overseer”), et membre du projet.
Une question s’est posée : faut-il créer des rôles globaux ADMIN, OVERSEER, MEMBER, ou bien conserver uniquement les rôles globaux ADMIN et USER, et gérer les permissions via des relations d’affectation à un projet ?

Décision :
Seuls deux rôles globaux sont conservés :
• ADMIN : a tous les droits sur tous les projets.
• USER : a des permissions spécifiques uniquement s’il est affecté à un projet donné.
Les droits liés à OVERSEER ou MEMBER sont déterminés dynamiquement à partir de la relation de l’utilisateur au projet, et non par son rôle global.

Conséquences :
• Simplifie la gestion des rôles globaux : une seule distinction système (ADMIN vs USER).
• Permet une flexibilité maximale : un USER peut être overseer d’un projet et simple membre d’un autre.
• La logique d’autorisation s’appuie sur des guards personnalisés, qui vérifient dynamiquement si l’utilisateur est overseer ou membre d’un projet donné.
• Cette approche est compatible avec l’introduction ultérieure de nouveaux rôles liés à des projets (ex. : lecteur).
