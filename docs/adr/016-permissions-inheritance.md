# ADR 016 – Gestion des permissions pour les phases et étapes

Statut : Acceptée
Date : 2025-09-15

Contexte :
Le projet comporte des entités hiérarchiques : Project → Phase → Step.
Il est nécessaire de définir clairement la manière dont les permissions sont appliquées pour garantir la cohérence et éviter des vérifications redondantes dans les services métier.

Décision :
• Les permissions d’accès au projet sont vérifiées soit via ProjectService.findOne, soit, lorsque les phases et steps sont récupérées directement par leur repository ou leur service respectif, via PermissionsService.canViewProject.
• Les phases et les steps héritent des permissions de lecture définies sur le projet parent.
• Pour l'édition, les phases ou steps peuvent demander des permissions supplémentaires selon les besoins spécifiques (par exemple : conditions d’édition selon le statut de la ressource ou limitation de certains champs éditables).

Conséquences :
• Centralisation de la logique de permissions au niveau de l’aggregate root (Project), tout en permettant une vérification flexible via le service de permissions lorsque les entités internes sont récupérées directement.
• Les services des entités internes (Phase, Step) peuvent se concentrer sur la récupération et la manipulation des données sans dupliquer la logique de permission.
• Si à l’avenir des règles fines par entité sont nécessaires, elles pourront être ajoutées localement sans impacter le modèle existant.
