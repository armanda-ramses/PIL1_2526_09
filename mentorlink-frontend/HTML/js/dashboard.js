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
    const savedUser = localStorage.getItem("profil_utilisateur");
    
    if (!savedUser) {
        alert("Aucune session trouvée. Veuillez vous inscrire d'abord.");
        window.location.href = "inscription.html"; 
        return;
    }

    const user = JSON.parse(savedUser);
    
    // Extraction des données du payload
    const prenom = user.identite?.prenom || "Étudiant";
    const nom = user.identite?.nom || "";
    const fullname = `${prenom} ${nom}`.trim();
    const email = user.identite?.email || "non-renseigne@ifri.uac.bj";
    const telephone = user.identite?.contact || "Non renseigné";
    const role = user.identite?.role || "Mentoré";
    const filiere = user.academique?.filiere || "Non spécifiée";
    const niveau = user.academique?.niveau || "Non spécifié";
    const matieres = user.competences?.matieres || [];
    const disponibilites = user.disponibilites || {};

    const initiales = (prenom[0] + (nom[0] || "")).toUpperCase();

    // Injection Textes de base & Avatars
    if (document.getElementById("sidebar-username")) document.getElementById("sidebar-username").textContent = fullname;
    if (document.getElementById("sidebar-role")) document.getElementById("sidebar-role").textContent = role;
    if (document.getElementById("sidebar-avatar")) document.getElementById("sidebar-avatar").textContent = initiales;
    if (document.getElementById("topbar-avatar")) document.getElementById("topbar-avatar").textContent = initiales;
    if (document.getElementById("welcome-title")) document.getElementById("welcome-title").textContent = `Ravi de vous revoir, ${prenom} ! 👋`;

    // KPIs et Fiche infos (Accueil)
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

    // Rendu des Matières Cibles
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
    // 3. RENDU DE LA MATRICE DES HORAIRES
    // ==========================================
    const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
    const heuresKeys = ["08h-10h", "10h-12h", "14h-16h", "16h-18h"];
    let activeSlotsCount = 0;

    // Injection d'un micro-style CSS de secours pour les badges actifs/inactifs
    const styleNode = document.createElement("style");
    styleNode.textContent = `
        .slot-active { background-color: #10b981 !important; color: white !important; font-weight: bold; padding: 6px 12px; border-radius: 6px; display: inline-block; }
        .slot-inactive { color: #94a3b8 !important; background-color: #f1f5f9 !important; padding: 6px 12px; border-radius: 6px; display: inline-block; }
    `;
    document.head.appendChild(styleNode);

    jours.forEach(jour => {
        const slotsDuJour = disponibilites[jour] || [];
        const slotsNettoyes = Array.isArray(slotsDuJour) 
            ? slotsDuJour.map(s => String(s).replace(/[:h\s-]/g, '')) 
            : [];

        heuresKeys.forEach(heure => {
            const heureNettoyee = heure.replace(/[:h\s-]/g, '');
            const coché = slotsNettoyes.includes(heureNettoyee);
            const slotElement = document.getElementById(`slot-${jour}-${heure}`);

            if (slotElement) {
                if (coché) {
                    slotElement.className = "schedule-slot-badge slot-active";
                    slotElement.textContent = heure;
                    activeSlotsCount++;
                } else {
                    slotElement.className = "schedule-slot-badge slot-inactive";
                    slotElement.textContent = "—";
                }
            }
        });
    });

    if (document.getElementById("kpi-slots-count")) {
        document.getElementById("kpi-slots-count").textContent = activeSlotsCount;
    }

    // ==========================================
    // 4. MOTEUR INTERNE DE MESSAGERIE
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
        
        // Auto-scroll vers le bas
        feed.scrollTop = feed.scrollHeight;
        input.value = "";
    };

    // Permettre l'envoi en pressant "Entrée"
    document.getElementById("chat-msg-input")?.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});