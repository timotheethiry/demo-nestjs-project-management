# ADR 003 – Authentification et sécurité

Statut : Acceptée
Date : 2025-05-21

Contexte :
Le système nécessite une sécurisation basique avec gestion des rôles et permissions.

Décision :
• Authentification : JWT.
• Guards personnalisés pour vérifier : isAdmin, isOverseer, isMember.
• Throttling basé sur l’IP pour limiter les tentatives de connexion.
• Décorateurs pour récupérer le contexte utilisateur dans les services.

Conséquences :
• Sécurité simple mais suffisante pour le MVP.
• Règles métier et permissions centralisées dans PermissionsService.
Facilite l’ajout de nouveaux rôles ou règles sans refactor massif.
