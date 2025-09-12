# ADR 014 – Règles de suppression des phases

Statut : Acceptée
Date : 2025-07-25

Contexte :
La suppression d’une phase doit respecter l’état du projet et de la phase pour éviter des incohérences métier. Un projet peut avoir un des statuts suivants : NOT_STARTED, IN_PROGRESS, ON_HOLD, CANCELED, PROPOSED_CLOSED, CLOSED.

Décision :
Autoriser la suppression d’une phase uniquement si :
• Le projet est dans l’un de ces statuts : ProjectStatus = NOT_STARTED
• Ou si : ProjectStatus = IN_PROGRESS ou ON_HOLD ET PhaseStatus ∈ {NOT_STARTED}

Conséquences :
• Oblige à charger le projet et la phase avant suppression.
• Garantit la cohérence métier et prévient la suppression de phases en cours d’exécution.
• Introduit un contrôle conditionnel dans PhaseService.remove().

Remarque :
Modification de l'ADR le 2025-07-25, juste après sa validation pour vérifier l'état d'une phase dans un projet en 'ON_HOLD'.
