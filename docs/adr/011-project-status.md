# ADR 011 – Transitions autorisées entre statuts de projet

Statut : Acceptée
Date : 2025-06-09

Contexte :
L’application permet de gérer le cycle de vie d’un projet à travers plusieurs statuts métier :
NOT_STARTED, IN_PROGRESS, ON_HOLD, CANCELED, PROPOSED_CLOSED, CLOSED.

Il est nécessaire de définir clairement les transitions autorisées entre ces statuts, notamment pour :
• Interdire des changements irréalistes ou contradictoires (ex. rouvrir un projet fermé).
• Encadrer certains retours en arrière via des validations spécifiques (ex. reprise d’un projet en pause).
• Simplifier l’implémentation en refusant des cas marginaux peu crédibles ou trop complexes pour le MVP.

Décision :
• Le statut initial d’un projet est toujours NOT_STARTED, même si une mise à jour rapide suit la création.
• Un projet peut passer à IN_PROGRESS uniquement s’il est éligible (via la méthode isEligibleForInProgress) et n’est pas CLOSED.
• Un projet CLOSED ne peut jamais être rouvert.
• Un projet CANCELED ou ON_HOLD peut repasser à IN_PROGRESS uniquement si un administrateur valide cette transition.
• Le passage à PROPOSED_CLOSED est réservé au superviseur (overseer).
• Un projet déjà IN_PROGRESS ne peut être repassé à NOT_STARTED.

Conséquences :
• Le cycle de vie du projet reste réaliste et structuré, en cohérence avec les pratiques de gestion de projet.
• Le code reste lisible, car les cas interdits sont rejetés explicitement plutôt que gérés implicitement.
• L’interface ou les appels API peuvent guider l’utilisateur sans ambigüité sur les statuts autorisés.
• La méthode updateStatus centralise les règles de transition et inclut les contrôles métier nécessaires.
