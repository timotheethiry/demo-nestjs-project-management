# ADR 012 – Désaffectation d’un projet de son département

Statut : Acceptée
Date : 2025-06-09

Contexte :
Un projet peut être affecté à un département, ce qui permet notamment de déterminer son responsable (overseer) et ses membres. Cependant, lors de la création initiale d’un projet par un administrateur, toutes les informations ne sont pas forcément connues. Pour permettre une saisie progressive, l’attribut department a été défini comme nullable. Cela permet de créer un projet "brouillon" sans affectation immédiate.

Se pose alors la question de la désaffectation d’un projet déjà assigné à un département : doit-on autoriser qu’un projet perde son département, notamment par une action explicite d’un utilisateur (ex. : "retirer le département") ?

Décision :
La désaffectation explicite d’un projet n’est pas autorisée. Une fois un département affecté, il ne peut être retiré, seulement remplacé. Cette décision repose sur plusieurs considérations :
• La présence d’un département est requise pour passer un projet au statut IN_PROGRESS.
• La désaffectation ne présente pas d’intérêt métier fort une fois le projet démarré ou préparé.
• Le ON_HOLD suffit à signifier qu’un projet est temporairement mis en attente.
• Une modification du département pourra être gérée via une action spécifique (changement de département).
• Un projet sans département est donc possible uniquement au moment de sa création (brouillon).

Conséquences :
• L’attribut department reste nullable dans l’entité Project.
• La méthode isEligibleForInProgress vérifie que le projet a un département affecté.
• L’interface ne proposera pas d’action de type "retirer le département".
• Le code applicatif reste simple : pas besoin de gérer un état transitoire sans département.
• En cas de changement de département, une procédure dédiée sera proposée (et pourra, si besoin, entraîner une mise en pause du projet).
