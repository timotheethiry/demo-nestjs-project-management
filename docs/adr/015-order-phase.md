# ADR 015 – Gestion de l’ordre des phases

Statut : Acceptée
Date : 2025-07-25

Contexte :
Les phases d’un projet doivent souvent être réalisées dans un ordre logique (séquentiel ou partiellement parallèle). Sans ordre défini, la navigation et la cohérence métier peuvent être impactées.

Décision :
Introduire un champ position (ou sortOrder) dans l’entité Phase. La responsabilité de maintenir l’ordre cohérent sera dans le PhaseService via des opérations explicites (ex. reorderPhases(projectId, newOrder)).

Conséquences :
• Permet un affichage ordonné dans l’UI.
• Ajoute une contrainte lors de la création ou réorganisation des phases.
• Nécessite un mécanisme simple pour recalculer l’ordre lors de l’ajout/suppression.
