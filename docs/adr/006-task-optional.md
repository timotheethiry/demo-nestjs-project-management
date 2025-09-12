# ADR 006 – Adoption d’une hiérarchie à 4 niveaux dans la structure des projets

Statut : Acceptée
Date : 2025-05-21

Contexte :
Un projet peut être simple ou complexe selon le contexte métier. Certains nécessitent une organisation détaillée, d’autres non. Il est nécessaire de découper un projet en grandes phases, étapes et actions opérationnelles. L’alternative envisagée était d’utiliser une hiérarchie à 3 niveaux (Projet → Phase → Tâche), mais cela limite la représentation pour les projets complexes et ne permet pas une montée en granularité sans refonte.

Décision :
La hiérarchie suivante est adoptée :
• Projet
○ Phase (grande étape)
§ Étape (étape intermédiaire)
□ Tâche

Le niveau "Tâche" est optionnel au début. Il pourra être utilisé uniquement si nécessaire.

Conséquences :
• L’architecture est stable et flexible : les projets simples peuvent s’arrêter aux étapes, les projets complexes peuvent aller jusqu’aux tâches.
• Le modèle de données est prêt pour une montée en complexité sans rupture fonctionnelle.
• Le front-end pourra masquer les niveaux inutilisés (ex. : tâches absentes) pour garder l’interface légère.
• Cette structure facilite une meilleure organisation du travail, la planification et le suivi selon des pratiques proches du découpage SMART ou WBS.
