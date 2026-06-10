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
 */
function chargerDonneesUtilisateur() {
    const savedUser = localStorage.getItem("ml_logged_user");
    
    if (!savedUser) {
        alert("Aucune session trouvée. Veuillez vous connecter d'abord.");
        window.location.href = "connexion.html"; 
        return;
    }

    const user = JSON.parse(savedUser);
    
    // Extraction
    const prenom = user.prenom || "Étudiant";
    const nom = user.nom || "";
    const fullname = `${prenom} ${nom}`.trim();
    const email = user.email || "non-renseigne@ifri.uac.bj";
    const telephone = user.telephone || "Non renseigné";
    const bio = user.bio || "Aucune biographie rédigée.";
    const filiere = user.filiere || "";
    const niveau = user.niveau_etudes || "";
    const matieres = user.noms_matieres || [];
    const initiales = (prenom[0] + (nom[0] || "")).toUpperCase();

    // 1. Injection des textes et des infos de base
    document.querySelectorAll(".user-firstname-display").forEach(el => el.textContent = prenom);
    
    if (document.getElementById("prof-fullname")) document.getElementById("prof-fullname").textContent = fullname;
    if (document.getElementById("prof-email")) document.getElementById("prof-email").textContent = email;
    if (document.getElementById("prof-phone")) document.getElementById("prof-phone").textContent = telephone;
    if (document.getElementById("prof-bio")) document.getElementById("prof-bio").textContent = bio;
    if (document.getElementById("prof-badge")) document.getElementById("prof-badge").textContent = `${niveau} - ${filiere}`;
    
    // 2. Injection des initiales dans les avatars circulaires
    if (document.getElementById("topbar-avatar")) document.getElementById("topbar-avatar").textContent = initiales;
    if (document.getElementById("prof-avatar")) document.getElementById("prof-avatar").textContent = initiales;

    // 3. Pré-remplissage du formulaire d'édition
    if (document.getElementById("input-firstname")) document.getElementById("input-firstname").value = prenom;
    if (document.getElementById("input-lastname")) document.getElementById("input-lastname").value = nom;
    if (document.getElementById("input-email")) document.getElementById("input-email").value = email;
    if (document.getElementById("input-bio")) document.getElementById("input-bio").value = bio;

    // 4. Injection des matières sous forme de jolis badges
    const strengthsContainer = document.getElementById("prof-skills-strengths");
    if (strengthsContainer) {
        strengthsContainer.innerHTML = "";
        if (matieres.length > 0) {
            matieres.forEach(mat => {
                const badge = document.createElement("span");
                badge.style.cssText = "padding: 6px 12px; border-radius: 12px; background: rgba(79, 70, 229, 0.1); color: #4f46e5; margin: 4px; display: inline-block; font-size: 13px; font-weight: 600;";
                badge.textContent = mat;
                strengthsContainer.appendChild(badge);
            });
        } else {
            strengthsContainer.innerHTML = "<em>Aucune matière sélectionnée.</em>";
        }
    }
}

/**
 * 3. STATISTIQUES DU TABLEAU DE BORD
 */
function chargerStatistiques() {
    // TODO @Backend: Effectuer le fetch pour récupérer les compteurs réels de la BDD
}

/**
 * 4. ENTRAIDE : RECHERCHE, SUGGESTIONS ET PROFILS (ANNUAIRE)
 */
function chargerSuggestionsEtProfils() {
    const suggestionsContainer = document.getElementById("dash-suggestions-container");
    const directoryContainer = document.getElementById("directory-profiles-container");

    if (suggestionsContainer) suggestionsContainer.innerHTML = "";
    if (directoryContainer) directoryContainer.innerHTML = "";

    // TODO @Backend: Boucler sur la liste renvoyée par le serveur pour injecter le HTML
}

/**
 * 5. SYSTÈME DE MESSAGERIE EN TEMPS RÉEL
 */
function chargerMessagerie() {
    const threadsContainer = document.getElementById("chat-threads-container");
    const messagesContainer = document.getElementById("chat-messages-container");

    if (threadsContainer) threadsContainer.innerHTML = "";
    if (messagesContainer) messagesContainer.innerHTML = "";

    // TODO @Backend: Requête pour charger la liste des conversations ouvertes à gauche
}

/**
 * 6. FLUX DES OFFRES ET DEMANDES D'ACCOMPAGNEMENT
 */
function chargerOffresEtDemandes() {
    const feedContainer = document.getElementById("offers-feed-container");
    if (feedContainer) feedContainer.innerHTML = "";

    // TODO @Backend: Récupérer les posts de la BDD et exécuter un appendChild()
}

/**
 * 7. INTERACTION AVEC LES FORMULAIRES (ENVOI VERS LA BDD)
 */
function initFormulaires() {
    const editProfileForm = document.getElementById("profile-edit-form");
    if (editProfileForm) {
        editProfileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                firstname: document.getElementById("input-firstname").value,
                lastname: document.getElementById("input-lastname").value,
                email: document.getElementById("input-email").value,
                bio: document.getElementById("input-bio").value
            };
            console.log("Données prêtes pour le backend :", payload);
            alert("Profil mis à jour !");
        });
    }

    const offerCreationForm = document.getElementById("offer-creation-form");
    if (offerCreationForm) {
        offerCreationForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById("offer-title").value,
                description: document.getElementById("offer-desc").value
            };
            console.log("Nouvelle annonce prête pour la BDD :", payload);
            offerCreationForm.reset();
            alert("Annonce publiée !");
        });
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("ml_logged_user");
            window.location.href = "connexion.html";
        });
    }
}