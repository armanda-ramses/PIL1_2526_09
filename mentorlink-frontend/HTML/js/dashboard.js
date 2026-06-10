document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. NAVIGATION DU DASHBOARD (ONGLETS)
    // ==========================================
    const PANE_TITLES = {
        home: "Accueil", 
        messages: "Messagerie",
        directory: "Annuaire Mentors", 
        schedule: "Mes Créneaux", 
        profile: "Mon Profil"
    };

    document.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", () => {
            const target = item.dataset.pane;
            if (!target) return;

            document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
            item.classList.add("active");

            document.querySelectorAll(".pane").forEach((p) => p.classList.remove("active"));
            const targetPane = document.getElementById("pane-" + target);
            if (targetPane) targetPane.classList.add("active");

            const heading = document.getElementById("topbar-heading");
            if (heading) heading.textContent = PANE_TITLES[target] || target;
        });
    });

    // ==========================================
    // 2. RÉCUPÉRATION SÉCURISÉE DE L'UTILISATEUR
    // ==========================================
    const savedUser = localStorage.getItem("ml_logged_user");
    
    if (!savedUser) {
        alert("Aucune session trouvée. Veuillez vous connecter d'abord.");
        window.location.href = "connexion.html"; 
        return;
    }

    const user = JSON.parse(savedUser);
    
    // Extraction des données du format Backend
    const prenom = user.prenom || "Étudiant";
    const nom = user.nom || "";
    const fullname = `${prenom} ${nom}`.trim();
    const email = user.email || "non-renseigne@ifri.uac.bj";
    const telephone = user.telephone || "Non renseigné";
    const role = "Mentoré"; 
    const filiere = user.filiere || "Non spécifiée";
    const niveau = user.niveau_etudes || "Non spécifié";
    const matieres = user.noms_matieres || [];
    const disponibilites = user.mes_dispos || []; 

    const initiales = (prenom[0] + (nom[0] || "")).toUpperCase();

    // ==========================================
    // 3. INJECTION DYNAMIQUE DES DONNÉES DE L'UTILISATEUR
    // ==========================================
    
    // Prénom dans l'en-tête de la maquette nettoyée
    if (document.getElementById("user-firstname")) {
        document.getElementById("user-firstname").textContent = prenom;
    }
    
    // Sidebar & Topbar
    if (document.getElementById("sidebar-username")) document.getElementById("sidebar-username").textContent = fullname;
    if (document.getElementById("sidebar-role")) document.getElementById("sidebar-role").textContent = role;
    if (document.getElementById("sidebar-avatar")) document.getElementById("sidebar-avatar").textContent = initiales;
    if (document.getElementById("topbar-avatar")) document.getElementById("topbar-avatar").textContent = initiales;
    if (document.getElementById("welcome-title")) document.getElementById("welcome-title").textContent = `Ravi de vous revoir, ${prenom} ! 👋`;

    // Fiches infos & KPIs existants
    if (document.getElementById("kpi-filiere")) document.getElementById("kpi-filiere").textContent = filiere;
    if (document.getElementById("kpi-status-role")) document.getElementById("kpi-status-role").textContent = role;
    if (document.getElementById("info-email")) document.getElementById("info-email").textContent = email;
    if (document.getElementById("info-phone")) document.getElementById("info-phone").textContent = telephone;
    if (document.getElementById("info-annee")) document.getElementById("info-annee").textContent = niveau;

    // Onglet Profil
    if (document.getElementById("profile-avatar")) document.getElementById("profile-avatar").textContent = initiales;
    if (document.getElementById("profile-fullname")) document.getElementById("profile-fullname").textContent = fullname;
    if (document.getElementById("profile-display-email")) document.getElementById("profile-display-email").textContent = email;
    if (document.getElementById("edit-profile-firstname")) document.getElementById("edit-profile-firstname").value = prenom;
    if (document.getElementById("edit-profile-lastname")) document.getElementById("edit-profile-lastname").value = nom;
    if (document.getElementById("edit-profile-email")) document.getElementById("edit-profile-email").value = email;
    if (document.getElementById("edit-profile-phone")) document.getElementById("edit-profile-phone").value = telephone;

    // Rendu des badges de Matières Cibles
    const skillsContainer = document.getElementById("user-skills-list");
    if (skillsContainer) {
        skillsContainer.innerHTML = ""; 
        if (matieres.length > 0) {
            matieres.forEach(matiere => {
                const badge = document.createElement("span");
                badge.className = "badge";
                badge.style.cssText = "padding: 6px 12px; border-radius: 20px; background: rgba(79, 70, 229, 0.1); color: #4f46e5; font-weight: 600; font-size: 0.8rem; margin-right: 6px; margin-bottom: 6px; display: inline-block;";
                badge.textContent = matiere;
                skillsContainer.appendChild(badge);
            });
        } else {
            skillsContainer.innerHTML = `<em style="color:#94a3b8; font-size:0.85rem;">Aucune matière sélectionnée.</em>`;
        }
    }

    // ==========================================
    // 4. DATE DYNAMIQUE DANS LE SUBTITLE
    // ==========================================
    const now = new Date();
    const joursSemaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

    const dateStr = `${joursSemaine[now.getDay()]} ${now.getDate()} ${mois[now.getMonth()]} ${now.getFullYear()}`;
    const subtitle = document.querySelector(".page-header p");
    if (subtitle) {
        subtitle.textContent = `Voici ce qui se passe dans votre réseau — ${dateStr}.`;
    }

    // ==========================================
    // 5. RENDU ET COMPTAGE DE LA MATRICE DES HORAIRES
    // ==========================================
    const joursMatrice = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
    const heuresKeys = ["08h-10h", "10h-12h", "14h-16h", "16h-18h"];
    let activeSlotsCount = 0;

    // Injection du style CSS pour les états de slots
    const styleNode = document.createElement("style");
    styleNode.textContent = `
        .slot-active { background-color: #10b981 !important; color: white !important; font-weight: bold; padding: 6px 12px; border-radius: 6px; display: inline-block; }
        .slot-inactive { color: #94a3b8 !important; background-color: #f1f5f9 !important; padding: 6px 12px; border-radius: 6px; display: inline-block; }
    `;
    document.head.appendChild(styleNode);

    // Initialisation globale par défaut à "Inactif"
    joursMatrice.forEach(jour => {
        heuresKeys.forEach(heure => {
            const slotElement = document.getElementById(`slot-${jour}-${heure}`);
            if (slotElement) {
                slotElement.className = "schedule-slot-badge slot-inactive";
                slotElement.textContent = "—";
            }
        });
    });

    // Activation dynamique selon le tableau 'mes_dispos'
    if (Array.isArray(disponibilites)) {
        disponibilites.forEach(dispo => {
            const jour = dispo.jour_semaine.toLowerCase();
            let tranche = null;
            
            if (dispo.heure_debut.startsWith("08")) tranche = "08h-10h";
            else if (dispo.heure_debut.startsWith("10")) tranche = "10h-12h";
            else if (dispo.heure_debut.startsWith("13") || dispo.heure_debut.startsWith("14")) tranche = "14h-16h";
            else if (dispo.heure_debut.startsWith("16") || dispo.heure_debut.startsWith("17") || dispo.heure_debut.startsWith("18")) tranche = "16h-18h";

            if (tranche) {
                const slotElement = document.getElementById(`slot-${jour}-${tranche}`);
                if (slotElement) {
                    slotElement.className = "schedule-slot-badge slot-active";
                    slotElement.textContent = tranche;
                    activeSlotsCount++;
                }
            }
        });
    }

    // Injection du score total calculé dans ton compteur de slots
    // (Tu peux associer cette valeur à ton compteur de "Connexions actives" ou une carte dédiée aux créneaux)
    if (document.getElementById("kpi-slots-count")) {
        document.getElementById("kpi-slots-count").textContent = activeSlotsCount;
    }

    // ==========================================
    // 6. INTERACTIONS ET REDIRECTIONS DE L'INTERFACE
    // ==========================================
    
    // Clic bouton d'en-tête principal
    const btnPrimary = document.querySelector(".btn-primary");
    if (btnPrimary) {
        btnPrimary.addEventListener("click", function () {
            window.location.href = "mentors.html";
        });
    }

    // Clic sur le lien global "Voir tout"
    const lienVoirTout = document.querySelector(".link-voir");
    if (lienVoirTout) {
        lienVoirTout.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "mentors.html";
        });
    }

    // Gestion du clic sur les lignes de suggestions injectées ou statiques
    document.querySelectorAll(".suggestion").forEach(function (el) {
        el.style.cursor = "pointer";
        el.addEventListener("click", function () {
            const nameEl = el.querySelector(".name");
            if (nameEl) {
                const name = nameEl.textContent;
                window.location.href = "profil.html?nom=" + encodeURIComponent(name);
            }
        });
    });

    // Gestion des animations d'hover sur les lignes d'activité
    document.querySelectorAll(".activity-item").forEach(function (el) {
        el.style.transition = "background 0.15s";
        el.style.borderRadius = "8px";
        el.style.padding = "4px 6px";
        el.style.margin = "0 -6px";
        el.addEventListener("mouseenter", function () {
            el.style.background = "#f5f7fa";
        });
        el.addEventListener("mouseleave", function () {
            el.style.background = "transparent";
        });
    });

    // Gestion du clic sur les lignes de séances
    document.querySelectorAll(".session").forEach(function (el) {
        el.style.cursor = "pointer";
        el.addEventListener("click", function () {
            const subjectEl = el.querySelector(".session-subject");
            const dayEl = el.querySelector(".session-day");
            if (subjectEl && dayEl) {
                alert(`Redirection vers la séance : ${subjectEl.textContent} du ${dayEl.textContent}`);
                // window.location.href = "seance.html?subject=" + encodeURIComponent(subjectEl.textContent);
            }
        });
    });

    // ==========================================
    // 7. MOTEUR INTERNE DE MESSAGERIE
    // ==========================================
    window.sendMessage = function() {
        const input = document.getElementById("chat-msg-input");
        const feed = document.querySelector(".chat-feed");
        if (!input || !feed || !input.value.trim()) return;

        const row = document.createElement("div");
        row.style.cssText = "display: flex; justify-content: flex-end; margin: 8px 0;";

        const bubble = document.createElement("div");
        bubble.style.cssText = "background: #4f46e5; color: #fff; padding: 10px 14px; border-radius: 12px; border-top-right-radius: 4px; max-width: 75%; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
        bubble.textContent = input.value.trim();

        row.appendChild(bubble);
        feed.appendChild(row);
        
        feed.scrollTop = feed.scrollHeight;
        input.value = "";
    };

    document.getElementById("chat-msg-input")?.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});