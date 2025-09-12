# User Stories

## 🔐 Authentification

🔹 US01 – Connexion
En tant que utilisateur
Je veux me connecter avec mon email et mot de passe
Afin de pouvoir accéder à mes projets
Critères d’acceptation :
• L’utilisateur peut se connecter avec un email et un mot de passe valides.
• Un token JWT est généré à la connexion.
• Les endpoints sont protégés par authentification.
• Un message d’erreur est affiché si les identifiants sont invalides.

## 👥 Gestion des utilisateurs et des rôles

🔹 US02 – Attribution des rôles
En tant que admin
Je veux attribuer un rôle (admin, overseer, member) à un utilisateur sur un projet
Afin de définir les droits de chacun sur ce projet
Critères d’acceptation :
• L’admin peut ajouter un utilisateur à un projet avec un rôle.
• Seuls les admins peuvent désigner les overseers.
• Les overseers peuvent ajouter/retirer des membres (mais pas des overseers).
• Les rôles déterminent les permissions d'accès et d'action.

## 📁 Projet

🔹 US03 – Création d’un projet
En tant que admin
Je veux créer un projet avec un titre, un contexte, des résultats attendus et un responsable
Afin de structurer un nouveau projet
Critères d’acceptation :
• Le projet contient les champs : titre, objectif, contexte, résultats attendus, dates, statut, service concerné.
• Le champ createdBy est renseigné automatiquement.
• Le responsable du projet peut être affecté ou modifié par un admin.

🔹 US04 – Consultation des projets
En tant que membre d’un projet
Je veux consulter la fiche du projet auquel je participe
Afin de en connaître le contenu et son état d’avancement
Critères d’acceptation :
• L’utilisateur ne voit que les projets auxquels il est affecté (membre, overseer ou admin).
• Le projet affiche toutes les informations saisies.
• Les permissions de modification dépendent du rôle.

## 🧩 Phases, étapes et tâches

🔹 US05 – Ajout de phases
En tant que project overseer
Je veux ajouter des phases à un projet
Afin de structurer le déroulement du projet
Critères d’acceptation :
• Une phase a un titre.
• Une phase est liée à un projet.
• Une phase possède des étapes.
• Seuls les overseers et admins peuvent créer, modifier, supprimer une phase.

🔹 US06 – Ajout d’étapes
En tant que membre d’un projet
Je veux ajouter des étapes dans une phase
Afin de découper la phase en sous-activités
Critères d’acceptation :
• Une étape appartient à une phase.
• Une étape a un titre
• Une étapes peut potentiellement posséder des tâches
• Les membres peuvent créer ou modifier des étapes.

🔹 US07 – Ajout de tâches
En tant que membre d’un projet
Je veux ajouter des tâches à une étape
Afin de détailler les actions à mener
Critères d’acceptation :
• Une tâche appartient à une étape.
• Les membres peuvent créer, modifier ou supprimer des tâches.

## 🔒 Permissions

🔹 US08 – Sécurité des actions
En tant que développeur
Je veux que les routes soient protégées par des guards selon les rôles
Afin de garantir la sécurité et les droits d’accès
Critères d’acceptation :
• Les guards vérifient les rôles pour chaque action :
○ admin : tous droits.
○ overseer : gestion du projet (hors rôles).
○ member : gestion des étapes et tâches.
• Une erreur 403 est retournée si l’utilisateur n’a pas les droits requis.

## 🛑 Clôture du projet (option légère dans MVP)

🔹 US09 – Proposition de clôture
En tant que overseer
Je veux proposer la clôture d’un projet
Afin de signaler qu’il est terminé
Critères d’acceptation :
• Le projet passe en statut “proposé à la clôture”.
• L’admin est notifié (ex. via champ à filtrer dans l’interface).
• L’admin peut valider la clôture (statut : “clos”).

## 📄 Résumé

n° - User Story - Rôles impliqués
US01 - Connexion - Tous
US02 - Attribution des rôles - Admin, overseer
US03 - Création d’un projet - Admin
US04 - Consultation de projet - Membre, overseer, admin
US05 - Gestion des phases - Overseer, admin
US06 - Gestion des étapes - Membre, overseer
US07 - Gestion des tâches - Membre, overseer
US08 - Contrôle des permissions - Tous (via guards)
US09 - Proposition et validation clôture - Overseer, admin
