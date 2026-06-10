/**
 * IFRI MentorLink - Module de gestion du Tableau de bord (Frontend)
 * Prêt pour l'intégration de l'API Backend.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- APPELS INITIALISATIONS ---
    initNavigation();
    chargerDonneesUtilisateur();
    chargerStatistiques();
    chargerSuggestionsEtProfils();
    chargerMessagerie();
    chargerOffresEtDemandes();
    initFormulaires();
});

/**
 * 1. SYSTÈME DE NAVIGATION (Routing Client - SPA)
 * Gère l'affichage des panneaux sans recharger la page.
 */
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-links .nav-item");
    const panes = document.querySelectorAll(".pane");

    function switchPane(paneId) {
        panes.forEach(p => p.classList.remove("active"));
        navItems.forEach(n => n.classList.remove("active"));

        const targetPane = document.getElementById(`pane-${paneId}`);
        if (targetPane) targetPane.classList.add("active");

        const targetNav = document.querySelector(`.nav-item[data-pane="${paneId}"]`);
        if (targetNav) targetNav.classList.add("active");

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => {
        item.addEventListener("click", () => switchPane(item.getAttribute("data-pane")));
    });

    // Écouteur global pour intercepter les redirections contextuelles (ex: boutons "Écrire", "Retour")
    document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-pane-trigger]");
        if (trigger) {
            e.preventDefault();
            switchPane(trigger.getAttribute("data-pane-trigger"));
        }
    });
}

/**
 * 2. GESTION DU PROFIL DE L'UTILISATEUR CONNECTÉ
 * À connecter avec une route de session ou `/api/user/me`
 */
function chargerDonneesUtilisateur() {
    // TODO @Backend: Faire un fetch('URL_API/user') ici
    // Exemple de structure attendue pour remplir la maquette :
    // const user = await response.json();
    
    // En attendant le fetch, on récupère temporairement les données pour ne pas bloquer l'UI
    const nomDonnees = document.getElementById("prof-fullname");
    
    // Exemple d'injection dynamique sur la maquette :
    // document.querySelectorAll(".user-firstname-display").forEach(el => el.textContent = user.firstname);
    // document.getElementById("prof-email").textContent = user.email;
    // document.getElementById("prof-phone").textContent = user.phone;
    // document.getElementById("prof-bio").textContent = user.bio;
}

/**
 * 3. STATISTIQUES DU TABLEAU DE BORD
 * À connecter avec un endpoint de comptage (ex: `/api/analytics/counters`)
 */
function chargerStatistiques() {
    // TODO @Backend: Effectuer le fetch pour récupérer les compteurs réels de la BDD
    // document.getElementById("dash-stat-connections").textContent = data.connectionsCount;
    // document.getElementById("dash-stat-sessions").textContent = data.sessionsCount;
}

/**
 * 4. ENTRAIDE : RECHERCHE, SUGGESTIONS ET PROFILS (ANNUAIRE)
 * À connecter avec la table des utilisateurs/étudiants (ex: `/api/profiles?role=mentor`)
 */
function chargerSuggestionsEtProfils() {
    const suggestionsContainer = document.getElementById("dash-suggestions-container");
    const directoryContainer = document.getElementById("directory-profiles-container");

    // Nettoyage initial des conteneurs de la maquette
    if (suggestionsContainer) suggestionsContainer.innerHTML = "";
    if (directoryContainer) directoryContainer.innerHTML = "";

    // TODO @Backend: Boucler sur la liste renvoyée par le serveur pour injecter le HTML
    // Exemple de structure de boucle propre pour ton dev :
    /*
    profiles.forEach(profile => {
        const item = document.createElement('div');
        item.className = 'profile-card card';
        item.innerHTML = `
            <div class="card-profile-header">
                <div class="avatar purple">${profile.initiales}</div>
                <div class="profile-main-meta">
                    <h3>${profile.nom}</h3>
                    <p class="sub">${profile.niveau} · ${profile.filiere}</p>
                </div>
                <div class="compatibility-score-tag">${profile.score}%</div>
            </div>
            <p class="bio-text">${profile.bio}</p>
            <div class="card-footer-action">
                <button class="btn-action-message" data-pane-trigger="messages" data-user-id="${profile.id}">💬 Écrire</button>
            </div>
        `;
        directoryContainer.appendChild(item);
    });
    */
}

/**
 * 5. SYSTÈME DE MESSAGERIE EN TEMPS RÉEL
 * À coupler idéalement avec WebSockets (Socket.io) ou des requêtes HTTP à intervalles réguliers (`/api/messages`)
 */
function chargerMessagerie() {
    const threadsContainer = document.getElementById("chat-threads-container");
    const messagesContainer = document.getElementById("chat-messages-container");

    if (threadsContainer) threadsContainer.innerHTML = "";
    if (messagesContainer) messagesContainer.innerHTML = "";

    // TODO @Backend: Requête pour charger la liste des conversations ouvertes à gauche
    // TODO @Backend: Ajouter un gestionnaire d'événement au clic sur une ligne `.conv-item` pour charger l'historique dans le chat actif
}

/**
 * 6. FLUX DES OFFRES ET DEMANDES D'ACCOMPAGNEMENT
 * À connecter avec la table des annonces (ex: `/api/announcements`)
 */
function chargerOffresEtDemandes() {
    const feedContainer = document.getElementById("offers-feed-container");
    if (feedContainer) feedContainer.innerHTML = "";

    // TODO @Backend: Récupérer les posts de la BDD et exécuter un appendChild()
}

/**
 * 7. INTERACTION AVEC LES FORMULAIRES (ENVOI VERS LA BDD)
 * Capture les soumissions et les prépare pour les requêtes POST/PUT vers l'API.
 */
function initFormulaires() {
    // Formulaire d'édition du profil utilisateur
    const editProfileForm = document.getElementById("profile-edit-form");
    if (editProfileForm) {
        editProfileForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Capture des données du formulaire
            const payload = {
                firstname: document.getElementById("input-firstname").value,
                lastname: document.getElementById("input-lastname").value,
                email: document.getElementById("input-email").value,
                bio: document.getElementById("input-bio").value
            };

            // Structure type pour ton dev backend :
            /*
            try {
                const response = await fetch('/api/user/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    alert("Profil synchronisé avec la base de données.");
                    chargerDonneesUtilisateur(); // Rafraîchit les affichages
                }
            } catch (error) {
                console.error("Erreur d'envoi", error);
            }
            */
            
            console.log("Données prêtes pour le backend :", payload);
        });
    }

    // Formulaire de création d'une annonce (Offre/Demande)
    const offerCreationForm = document.getElementById("offer-creation-form");
    if (offerCreationForm) {
        offerCreationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const payload = {
                title: document.getElementById("offer-title").value,
                description: document.getElementById("offer-desc").value
            };

            // TODO @Backend: Faire le fetch POST('/api/announcements', payload)
            console.log("Nouvelle annonce prête pour la BDD :", payload);
            offerCreationForm.reset();
        });
    }

    // Bouton Déconnexion
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            // TODO @Backend: Détruire le token/session (ex: localStorage.removeItem('token'))
            // window.location.href = "login.html";
            console.log("Action : Déconnexion de l'utilisateur");
        });
    }
}