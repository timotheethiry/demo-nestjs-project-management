# Step tests

1️⃣ Créer une Step
Endpoint : POST /phases/:phaseId/steps
Body DTO : CreateStepDto
Tests à réaliser :
• [x] ✅ Créer une Step avec nom et order valide → status 201
• ⚠️ Vérifier que order est assigné correctement si non fourni ou identique à une existante
• [x] ❌ Créer dans une Phase COMPLETED → doit renvoyer 400 BadRequest
• ❌ Créer dans un Project clos, en pause, en attente de cloture ou annulé → doit renvoyer 400 BadRequest
• [x] ❌ User sans permission → 403 Forbidden
• [x] ❌ Créer avec user non autorisé (not admin, not overseer, not member) → 403 Forbidden
• [x] ❌ Créer avec champs invalides (nom vide, nom pas unique, phase inexistante) → 400

2️⃣ Lister les Steps
Endpoint : GET /phases/:phaseId/steps
Tests à réaliser :
• [x] ✅ Retourne toutes les Steps de la Phase, triées par order ascendant
• [x] ❌ Vérifier que la Phase inexistante → 404 NotFound
• [x] ✅ Vérifier que Steps créées dans d’autres Phases ne sont pas retournées
• [x] ❌ User sans permission → 403 Forbidden

3️⃣ Récupérer une Step
Endpoint : GET /steps/:id
Tests à réaliser :
• [x] ✅ Step existante → retour 200 avec toutes les propriétés correctes
• [x] ❌ Step inexistante → 404 NotFound
• [x] ✅ Vérifier que les relations Phase / Project ? sont correctement incluses si tu les as chargées
• [x] ❌ User sans permission → 403 Forbidden

4️⃣ Mettre à jour le nom
Endpoint : PUT /steps/:id/name
Body DTO : UpdateStepNameDto
Tests à réaliser :
• [x] ✅ Update avec nom valide → status 200 et nom changé
• [x] ❌ Step dans Phase COMPLETED → 400 BadRequest
• [x] ❌ User sans permission → 403 Forbidden
• [x] ❌ Nom vide → 400

5️⃣ Mettre à jour le statut
Endpoint : PUT /steps/:id/status
Body DTO : UpdateStepStatusDto
Tests à réaliser :
• [x] ✅ Changement de statut valide (NOT_STARTED → IN_PROGRESS --> COMPLETED) → 200
• [x] ❌ Step dans Phase COMPLETED ou NOT_STARTED → 400 BadRequest
• [x] ❌ Step dans Projet COMPLETED ou NOT_STARTED → 400 BadRequest
• [x] ❌ Statut invalide → 400
• [x] ❌ User sans permission → 403 Forbidden
• [x] ❌ Step inexistante → 404 NotFound

6️⃣ Mettre à jour l’ordre / reorder
Endpoint : PUT /phases/:phaseId/steps/:id/order
Body DTO : UpdateStepOrderDto
Tests à réaliser :
• [x] ❌ Step inexistante → 404 NotFound
• [x] ❌ Step dans Phase COMPLETED → 400 BadRequest
• ❌ Step dans Project COMPLETED → 400 BadRequest
• [x] ❌ Step COMPLETED --> 400 BadRequest
• [x] ❌ User sans permission → 403 Forbidden
• [x] dto.newOrder identique à step.order → ne sauvegarde pas → ✅
• [x] Modifier l’ordre d’une step valide → ✅ 200 (via stepService.reorderSteps)

7️⃣ Supprimer une Step
Endpoint : DELETE /steps/:id
Tests à réaliser :
• [x] ✅ Step supprimée avec succès → status 200 ou 204 selon ton choix
• ✅ Vérifier que l’ordre des autres Steps est recalculé si nécessaire
• [x] ❌ Step dans Phase COMPLETED → 400 BadRequest
• [x] ❌ Step already started → 400 BadRequest
• [x] ❌ User sans permission → 403 Forbidden
[x] ❌ Step inexistante → 404 NotFound
