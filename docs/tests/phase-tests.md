# Phase tests

🔹 1. create (POST /projects/:id/phases)
• [x] Créer une phase avec name et projectId valides → ✅ 201
• [x] phase avec name déjà existant dans ce projet → ❌ 400
• [x] projectId inexistant → ❌ 404
• [x] Utilisateur sans permission (ni admin ni overseer) → ❌ 403
• [x] Projet avec status CANCELED → ❌ 400
• [x] Projet avec status PROPOSED_CLOSED → ❌ 400
• [x] Projet avec status CLOSED → ❌ 400
• [x] Création réussie → phase avec status: NOT_STARTED et order = nombre de phases + 1

🔹 2. findAllByProject (GET phases/findAllByProject/:id)
• [x] Récupérer toutes les phases d’un projet valide → ✅ 200, triées par order ASC,
• [x] avec steps inclus
• [x] Projet inexistant → ❌ 404
• [x] User sans permission --> ❌ 403

🔹 findOne
Récupérer la phase -->✅ 200
• [x] User sans permission --> ❌ 403
• [x] Phase non existante --> ❌ 404

🔹 3. updateName (PATCH /phases/:id/name)
• [x] Modifier le nom d’une phase valide → ✅ 200
• [x] Phase inexistante → ❌ 404
• [x] phase avec name déjà existant dans ce projet → ❌ 400
• [x] Utilisateur sans permission → ❌ 403
• [x] Phase déjà COMPLETED → ❌ 400
• [x] Projet avec status CANCELED → ❌ 400
• [x] Projet avec status PROPOSED_CLOSED → ❌ 400
• [x] Projet avec status CLOSED → ❌ 400
• [x] dto.name identique à l’existant → ne sauvegarde pas, retourne phase inchangée → ✅

🔹 4. updateStatus (PATCH /phases/:id/status)
• [x] Passer de NOT_STARTED → IN_PROGRESS → ✅
• [x] Passer de IN_PROGRESS → COMPLETED → ✅
• [x] Passer de NOT_STARTED → COMPLETED → ❌ 400 (transition invalide)
• [x] Passer de IN_PROGRESS → NOT_STARTED → ❌ 400 (transition invalide)
• [x] Passer de COMPLETED vers autre chose → ❌ 400 (aucune transition possible)
• [x] Projet avec status NOT_STARTED → ❌ 400
• [x] Projet avec status ON_HOLD → ❌ 400
• [x] Projet avec status CLOSED → ❌ 400
• [x] Projet avec status CANCELED → ❌ 400
• [x] Projet avec status PROPOSED_CLOSED → ❌ 400
• [x] Phase inexistante → ❌ 404
• [x] Utilisateur sans permission → ❌ 403
• [x] finir phase sans steps --> ❌ 403
• [x] finir phase avec steps pas toutes complétées --> ❌ 403

🔹 5. updateOrder (PATCH /phases/:id/order)
• [x] Modifier l’ordre d’une phase valide → ✅ 200 (via projectService.reorderPhases)
• [x] Phase inexistante → ❌ 404
• [x] Utilisateur sans permission → ❌ 403
• [x] Phase déjà COMPLETED → ❌ 400
• [x] Projet avec status CLOSED → ❌ 400
• [x] Projet avec status CANCELED → ❌ 400
• [x] Projet avec status PROPOSED_CLOSED → ❌ 400
• [x] dto.newOrder identique à phase.order → ne sauvegarde pas → ✅

🔹 6. remove (DELETE /phases/:id)
• [x] Supprimer une phase existante avec projet NOT_STARTED → ✅
• [x] Supprimer une phase existante avec projet IN_PROGRESS ou ON_HOLD si phase NOT_STARTED → ✅
[ ] Vérifier que l’ordre des autres Phases est recalculé si nécessaire --> ✅
• [x] Supprimer une phase déjà commencée (status ≠ NOT_STARTED) dans projet actif → ❌ 403
• [x] Supprimer une phase dans projet CANCELED → ❌ 403
• [x] Supprimer une phase dans projet PROPOSED_CLOSED → ❌ 403
• [x] Supprimer une phase dans projet CLOSED → ❌ 403
• [x] Phase inexistante → ❌ 404
• [x] Utilisateur sans permission → ❌ 403

ReorderSteps
[x] ❌ Nouvel ordre invalide (<1 ou >nombre de Steps) → 400 BadRequest
[x] ✅ Déplacer une Step dans la Phase
[x] ✅ Déplacer à la première ou dernière position → vérification des bornes
