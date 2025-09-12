# ADR 013 – Gestion de l’état d’une phase

Statut : Acceptée
Date : 2025-07-25

Contexte :
Une phase représente une partie de la feuille de route d’un projet et peut être commencée ou terminée indépendamment des autres. Pour appliquer correctement les règles métier (notamment suppression ou progression), il est nécessaire de connaître son état.

Décision :
Introduire un PhaseStatus avec les valeurs :
• NOT_STARTED
• IN_PROGRESS
• COMPLETED

L’état d’une phase sera mis à jour lors des actions métier (ex. début de travail sur les steps, clôture via markAsCompleted).

Conséquences :
• Simplifie la validation métier (ex. : suppression conditionnelle).
• Nécessite une colonne supplémentaire dans l’entité Phase.
• Introduit une logique pour déterminer l’état initial (NOT_STARTED) et gérer les transitions.
