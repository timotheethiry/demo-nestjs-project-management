# ADR 005 – Intégration des étapes et tâches dans le ProjetModule

Statut : Acceptée
Date : 2025-05-21

Contexte :
Les entités Étape et Tâche sont hiérarchiquement liées au Projet. Leur gestion pourrait justifier un module dédié à terme, mais dans un premier temps, le projet vise un MVP simple et lisible.

Décision :
Les entités Étape et Tâche seront incluses dans le ProjetModule. Elles n'auront pas de module propre initialement. Ce découpage sera réévalué si la complexité ou la volumétrie augmente.

Conséquences :
• Réduction de la complexité initiale (moins de modules à configurer et maintenir).
• Le code reste lisible et cohérent dans une logique métier centrée sur le projet.
• L’architecture reste évolutive : un StepModule ou TaskModule pourra être introduit plus tard sans rupture.
• La logique métier et les routes liées aux étapes et tâches seront gérées dans les services et contrôleurs du ProjetModule.
