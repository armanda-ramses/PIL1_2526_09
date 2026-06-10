

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


  //1. SYSTÈME DE NAVIGATION (Routing Client - SPA)
  //Gère l'affichage des panneaux sans recharger la page.

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


 // 2. GESTION DU PROFIL DE L'UTILISATEUR CONNECTÉ

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


 //3. STATISTIQUES DU TABLEAU DE BORD
 
function chargerStatistiques() {
    // TODO @Backend: Effectuer le fetch pour récupérer les compteurs réels de la BDD
}


 //4. ENTRAIDE : RECHERCHE, SUGGESTIONS ET PROFILS (ANNUAIRE)
 
async function chargerSuggestionsEtProfils() {
    const suggestionsContainer = document.getElementById("dash-suggestions-container");
    const directoryContainer = document.getElementById("directory-profiles-container");

    if (suggestionsContainer) suggestionsContainer.innerHTML = "Chargement des suggestions...";
    if (directoryContainer) directoryContainer.innerHTML = "Chargement des profils...";

    const savedUser = localStorage.getItem("ml_logged_user");
    if (!savedUser) return;
    const user = JSON.parse(savedUser);

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/matching/?user_id=${user.id}`);
        const matches = await response.json();

        if (response.ok && matches.length > 0) {
            let html = "";
            matches.forEach(match => {
                html += `
                <div class="profile-card" style="margin-bottom: 15px; border: 1px solid #eee; padding: 10px; border-radius: 8px;">
                    <h4>${match.prenom} ${match.nom} (${match.score_compatibilite}% de compatibilité)</h4>
                    <p><strong>Niveau:</strong> ${match.niveau_etudes} - ${match.filiere}</p>
                    <p><strong>Matière:</strong> ${match.matiere}</p>
                    <p><strong>Format:</strong> ${match.format_session}</p>
                    <p><strong>Dispos communes:</strong> ${match.disponibilites_communes.join(", ")}</p>
                    <button class="btn-primary" style="padding: 5px 10px; font-size: 12px; margin-top: 10px;">Proposer mentorat</button>
                </div>
                `;
            });
            if (suggestionsContainer) suggestionsContainer.innerHTML = html;
            if (directoryContainer) directoryContainer.innerHTML = html; // Pour l'instant on met les mêmes dans l'annuaire
        } else {
            const msg = "<p>Aucune suggestion trouvée pour le moment. Modifiez vos matières ou disponibilités pour trouver plus de correspondances.</p>";
            if (suggestionsContainer) suggestionsContainer.innerHTML = msg;
            if (directoryContainer) directoryContainer.innerHTML = msg;
        }
    } catch (error) {
        console.error("Erreur lors du chargement des suggestions:", error);
        if (suggestionsContainer) suggestionsContainer.innerHTML = "<p>Erreur de connexion au serveur.</p>";
        if (directoryContainer) directoryContainer.innerHTML = "<p>Erreur de connexion au serveur.</p>";
    }
}


 //5. SYSTÈME DE MESSAGERIE EN TEMPS RÉEL

async function chargerMessagerie() {
    const threadsContainer = document.getElementById("chat-threads-container");
    const messagesContainer = document.getElementById("chat-messages-container");

    if (threadsContainer) threadsContainer.innerHTML = "Chargement...";
    if (messagesContainer) messagesContainer.innerHTML = "Sélectionnez une conversation";

    const savedUser = localStorage.getItem("ml_logged_user");
    if (!savedUser) return;
    const user = JSON.parse(savedUser);

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/messaging/conversations/?user_id=${user.id}`);
        const conversations = await response.json();

        if (response.ok && conversations.length > 0) {
            let html = "";
            conversations.forEach(conv => {
                // Trouver l'autre participant (celui qui n'est pas moi)
                let otherParticipant = "Utilisateur inconnu";
                if (conv.utilisateur1_details && conv.utilisateur1_details.id !== user.id) {
                    otherParticipant = `${conv.utilisateur1_details.prenom} ${conv.utilisateur1_details.nom}`;
                } else if (conv.utilisateur2_details && conv.utilisateur2_details.id !== user.id) {
                    otherParticipant = `${conv.utilisateur2_details.prenom} ${conv.utilisateur2_details.nom}`;
                }

                const date = new Date(conv.date_creation).toLocaleDateString();
                html += `
                <div class="chat-thread" style="padding: 10px; border-bottom: 1px solid #eee; cursor: pointer;">
                    <strong>${otherParticipant}</strong><br>
                    <small>Créée le ${date}</small>
                </div>
                `;
            });
            if (threadsContainer) threadsContainer.innerHTML = html;
        } else {
            if (threadsContainer) threadsContainer.innerHTML = "<p>Aucune conversation en cours.</p>";
        }
    } catch (error) {
        console.error("Erreur de messagerie:", error);
        if (threadsContainer) threadsContainer.innerHTML = "<p>Erreur serveur.</p>";
    }
}


 //6. FLUX DES OFFRES ET DEMANDES D'ACCOMPAGNEMENT
 
async function chargerOffresEtDemandes() {
    const feedContainer = document.getElementById("offers-feed-container");
    if (!feedContainer) return;
    feedContainer.innerHTML = "Chargement des annonces...";

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/propositions/");
        const propositions = await response.json();

        if (response.ok && propositions.length > 0) {
            let html = "";
            propositions.forEach(prop => {
                const date = new Date(prop.date_publication).toLocaleDateString();
                const typeText = prop.type_proposition === 'mentorat' ? 'Offre de mentorat' : "Demande d'accompagnement";
                const matiere = prop.nom_matiere || "Matière inconnue";
                const format = prop.format_session || "Non spécifié";
                
                const userText = (prop.utilisateur_prenom && prop.utilisateur_nom) ? `${prop.utilisateur_prenom} ${prop.utilisateur_nom}` : `Un utilisateur`;
                
                html += `
                <div class="offer-card" style="margin-bottom: 15px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong>${typeText}</strong>
                        <span style="font-size: 0.85em; color: #64748b;">${date}</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="display: inline-block; padding: 4px 8px; background: #eff6ff; color: #3b82f6; border-radius: 4px; font-size: 0.9em; font-weight: bold;">${matiere}</span>
                        <span style="display: inline-block; padding: 4px 8px; background: #f3f4f6; color: #4b5563; border-radius: 4px; font-size: 0.9em; margin-left: 5px;">${format}</span>
                    </div>
                    <p style="margin: 0 0 10px 0; color: #1e293b; font-size: 0.95em;">Par ${userText}</p>
                    <button class="btn-primary" style="margin-top: 10px; padding: 6px 12px; font-size: 0.9em;">Contacter</button>
                </div>
                `;
            });
            feedContainer.innerHTML = html;
        } else {
            feedContainer.innerHTML = "<p>Aucune annonce pour le moment.</p>";
        }
    } catch (error) {
        console.error("Erreur lors du chargement des annonces:", error);
        feedContainer.innerHTML = "<p>Erreur de connexion au serveur.</p>";
    }
}

// 7. INTERACTION AVEC LES FORMULAIRES (ENVOI VERS LA BDD)

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
        // 1. Charger les matières dans le select
        const matiereSelect = document.getElementById("offer-matiere");
        const savedUser = localStorage.getItem("ml_logged_user");
        let user = null;
        if (savedUser) {
            user = JSON.parse(savedUser);
            fetch(`http://127.0.0.1:8000/api/auth/matieres/?filiere=${user.filiere}&niveau=${user.niveau_etudes}`)
            .then(res => res.json())
            .then(matieres => {
                matiereSelect.innerHTML = "";
                if (matieres.length === 0) {
                    matiereSelect.innerHTML = "<option value=''>Aucune matière disponible</option>";
                } else {
                    matieres.forEach(m => {
                        matiereSelect.innerHTML += `<option value="${m.id_matiere}">${m.nom_matiere}</option>`;
                    });
                }
            })
            .catch(err => console.error("Erreur chargement matières:", err));
        }

        // 2. Gérer la soumission du formulaire
        offerCreationForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!user) return;
            
            const btn = offerCreationForm.querySelector("button[type='submit']");
            btn.textContent = "Publication...";
            btn.disabled = true;

            const payload = {
                type_proposition: document.getElementById("offer-type").value,
                id_matiere: document.getElementById("offer-matiere").value,
                format_session: document.getElementById("offer-format").value,
                utilisateur_id: user.id
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/api/auth/propositions/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    offerCreationForm.reset();
                    alert("Annonce publiée !");
                    // Rafraîchir les suggestions et le fil d'annonces
                    chargerSuggestionsEtProfils();
                    chargerOffresEtDemandes();
                } else {
                    alert("Erreur: " + JSON.stringify(data));
                }
            } catch (error) {
                console.error("Erreur réseau:", error);
                alert("Erreur de connexion au serveur.");
            } finally {
                btn.textContent = "🚀 Publier l'annonce";
                btn.disabled = false;
            }
        });
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("ml_logged_user");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token");
            window.location.href = "connexion.html";
        });
    } 
}