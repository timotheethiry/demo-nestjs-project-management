# Project tests

🔹 1. Création d’un projet (POST /projects)
• [x] Avec name, description (obligatoires) → ✅ 201
• [x] En omettant name → ❌ 400
• [x] En omettant description → ❌ 400
• [x] Avec startDate postérieure à endDate -> ❌ 400
• [x] Avec name déjà existant -> ❌ 500
• [x] Avec departmentId, overseerId et/ou membersID: null (membersId vide) → ✅ autorisé en brouillon
• [x] Avec status: NOT_STARTED par défaut → ✅
• [x] project inexistant --> 404
[x] user is not admin --> 403

🔹 2. assignDepartment
• [x]Assigner un departmentId valide → ✅ 200
• [x]departmentId non trouvé → ❌ 404
• [x]departmentId null → ❌ 403 (impossible de retirer)
• [x]Reassigner un autre département sans mettre en pause → ❌ 403
• [x]Reassigner un autre département en statut ON_HOLD → ✅
• [x] project inexistant --> 404
[x] Is not admin or overseer --> 403

🔹 3. assignOverseer
• [x]Assigner un overseerId valide → ✅ 200
• [x]overseerId non trouvé → ❌ 404
• [x]overseerId null → ❌ 403
• [x]Reassigner un autre overseer sans pause → ❌ 403
• [x]Reassigner un autre overseer en ON_HOLD, ou NOT_STARTED → ✅
• [x] project inexistant --> 404
[x] user is not admin --> 403

🔹 4. assignMembers
• [x]Assigner une liste valide d’utilisateurs existants → ✅
• [x]Ajouter + retirer + remplacer des membres d’un projet → ✅
• [x]Avec un ou plusieurs memberIds invalides → ❌ 404 (liste des IDs invalides)
• [x]Liste vide → ❌ 400
• [x]Liste avec doublons → ✅ filtrés avant traitement (bloqué par DTO)
• [x] project inexistant --> 404
[x] Is not admin or overseer --> 403

🔹 5. updateDates
• [x] Modifier startDate et endDate pour un projet NOT_STARTED → ✅
• [x] Mettre startDate > endDate → ❌ 400
• [x] Passer des dates dans le passé → ❌ sauf si projet CLOSED
• [x] Modifier endDate pour un projet IN_PROGRESS ou ON_HOLD → ✅
• [x] Pas de changement → ne sauvegarde pas → ✅
• [x] project not found --> 404
[x] Is not admin or orverseer --> 403

🔹 6. updateProjectContent
• [x] project not found --> 404
[x] Is not admin or orverseer --> 403
• [x] Statut NOT_STARTED :
○ [x] Modify name as User --> 400
○ [x] Modify name as Admin --> 200
○ [x] Modifier description, context, objectives, expectedResults→ ✅
○ [x] Supprimer un champ obligatoire (ex. name) → ❌ 400
• [x] Statut IN_PROGRESS :
○ [x] Modifier description et context → ✅
○ [x] Supprimer context → ❌
○ [x] Modifier objectives ou expectedResults → ❌
• [x] Statut ON_HOLD :
○ [x] Modifier description, context, objectives, expectedResults → ✅
○ [x] Supprimer un champ obligatoire → ❌
• [x]Statut CANCELED, PROPOSED_CLOSED, CLOSED :
○ [x] Tenter toute modification → ❌ 403

🔹 7. updateStatus
• [x] project not found --> 404
[x] Is not admin or overseer --> 403
• [x]Passer de NOT_STARTED à IN_PROGRESS avec projet valide → ✅
• [x]Essayer sans tous les champs requis → ❌ 400
• []Aller vers CLOSED sans date de fin → ❌ 400
• [x]Aller vers ON_HOLD, CANCELED, CLOSED en admin → ✅
• [x] Aller vers PROPOSED_CLOSED en overseer --> 200
• [] transitions valides/invalides
• [x] Aller vers statut invalide → ❌ 400 (devrait être filtré par DTO)
• [] PROPOSED_CLOSED ou CLOSED avec toutes les phases pas COMPLETED ?

🔹 8. remove
• [x]Supprimer un projet existant → ✅
• [x]Supprimer un projet inexistant → ❌ 404
[x] user is not admin --> 403

🔹 9. reorderPhases
• [x] Déplacer une phase au sein d'un projet valide → ✅ 200
• [x] Tenter de déplacer une phase vers une position en dehors des limites (ex: 0, ou > nombre total de phases) → ❌ 400
• [] Tenter de déplacer une phase dans un projet qui n'a pas de phases → ❌ 404
○ ce serait une phase orpheline, sinon pas possible en test manuel
• [] Tenter de déplacer une phase qui n'appartient pas au projet → ❌ 404
○ Pas possible en test manuel
• [x] Tenter de déplacer une phase non terminée avant une phase terminée → ✅ Le système doit repositionner la phase non terminée après les phases terminées, et non renvoyer une erreur.

🔹 10. findAll
• [x] admin vue synthétique tous projets --> 200
[x] non admin vue synthétique projets du département --> 200

🔹 11. findOne
• [x] Utilisateur sans permission → infos minimes ou ❌ 403 ?
[x] projet non existant --> 404
[x] Récupérer le projet -->✅ 200
