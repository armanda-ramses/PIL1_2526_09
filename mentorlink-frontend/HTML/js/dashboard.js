document.addEventListener("DOMContentLoaded", function () {
    
    // 1. RECUPERATION DU JSON BRUT D'INSCRIPTION
    const savedUser = localStorage.getItem("profil_utilisateur");
    
    if (savedUser) {
        const user = JSON.parse(savedUser);
        
        // --- Extraction des données du payload d'inscription ---
        const prenom = user.identite?.prenom || "Étudiant";
        const nom = user.identite?.nom || "";
        const email = user.identite?.email || "non-renseigne@ifri.uac.bj";
        const telephone = user.identite?.contact || "Non renseigné";
        const role = user.identite?.role || "Mentoré";
        
        const filiere = user.academique?.filiere || "Non spécifiée";
        const niveau = user.academique?.niveau || "";
        
        // Récupération du tableau de matières et de créneaux
        const matieres = user.competences?.matieres || [];
        const disponibilites = user.disponibilites || {}; // Objet contenant { lundi: ["08h-10h"], mardi: []... }

        // Génération automatique de l'avatar initials
        const initiales = (prenom[0] + (nom[0] || "")).toUpperCase();

        // ==========================================
        // MAIN TEXT INJECTIONS
        // ==========================================
        document.getElementById("sidebar-username").textContent = `${prenom} ${nom}`;
        document.getElementById("sidebar-role").textContent = role;
        document.getElementById("sidebar-avatar").textContent = initiales;
        document.getElementById("welcome-title").textContent = `Ravi de vous revoir, ${prenom} !`;

        // KPI Cards
        document.getElementById("kpi-filiere").textContent = filiere;
        document.getElementById("kpi-status-role").textContent = role;

        // Fiche info Accueil
        document.getElementById("info-email").textContent = email;
        document.getElementById("info-phone").textContent = telephone;
        document.getElementById("info-annee").textContent = niveau ? niveau : "Non spécifié";

        // Onglet Profil complet
        document.getElementById("profile-avatar").textContent = initiales;
        document.getElementById("profile-fullname").textContent = `${prenom} ${nom}`;
        document.getElementById("profile-display-email").textContent = email;
        document.getElementById("edit-profile-firstname").value = prenom;
        document.getElementById("edit-profile-lastname").value = nom;
        document.getElementById("edit-profile-email").value = email;
        document.getElementById("edit-profile-phone").value = telephone;

        if (filiere.toUpperCase().includes("GL")) document.getElementById("radio-gl").checked = true;
        if (filiere.toUpperCase().includes("SRI")) document.getElementById("radio-sri").checked = true;
        if (filiere.toUpperCase().includes("DATA")) document.getElementById("radio-data").checked = true;

        // ==========================================
        // DYNAMIC RENDERING: MATIÈRES / COMPÉTENCES
        // ==========================================
        const skillsContainer = document.getElementById("user-skills-list");
        const skillsTitle = document.getElementById("skills-box-title");
        
        // Ajustement du titre selon le rôle
        skillsTitle.innerHTML = role === "Mentor" ? 
            `<i class="fa-solid fa-star" style="color: var(--accent);"></i> Vos Matières à Enseigner` : 
            `<i class="fa-solid fa-star" style="color: var(--accent);"></i> Vos Matières Cibles`;

        if (matieres.length > 0) {
            skillsContainer.innerHTML = ""; // Clear loader
            matieres.forEach(matiere => {
                const badge = document.createElement("span");
                badge.className = "skill-micro-tag";
                badge.style.padding = "6px 12px";
                badge.style.borderRadius = "20px";
                badge.style.background = "rgba(0, 102, 204, 0.1)";
                badge.style.color = "#0066cc";
                badge.style.fontWeight = "600";
                badge.style.fontSize = "0.8rem";
                badge.textContent = matiere;
                skillsContainer.appendChild(badge);
            });
        } else {
            skillsContainer.innerHTML = `<em style="color:#999; font-size:0.85rem;">Aucune matière sélectionnée.</em>`;
        }

        // ==========================================
        // DYNAMIC RENDERING: CRÉNEAUX (MATRICE DISPO)
        // ==========================================
        // Mapping des identifiants HTML par rapport aux valeurs attendues du JSON
        // Exemple attendu dans disponibilites : { lundi: ["08h - 10h", "14h - 16h"], mardi: [] }
        const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
        const heuresPrefixes = [
            { key: "08h-10h", idSuffix: "08" },
            { key: "10h-12h", idSuffix: "10" },
            { key: "14h-16h", idSuffix: "14" },
            { key: "16h-18h", idSuffix: "16" }
        ];

        let activeSlotsCount = 0;

        jours.forEach(jour => {
            const slotsDuJour = disponibilites[jour] || [];
            slotsDuJour.forEach(slotBrut => {
                // Nettoyage des espaces pour la comparaison (ex: "08h - 10h" devient "08h-10h")
                const slotClean = slotBrut.replace(/\s+/g, '');
                
                heuresPrefixes.forEach(heure => {
                    if (slotClean.includes(heure.key)) {
                        const checkboxId = `check-${jour}-${heure.idSuffix}`;
                        const checkboxElement = document.getElementById(checkboxId);
                        if (checkboxElement) {
                            checkboxElement.checked = true;
                            activeSlotsCount++;
                        }
                    }
                });
            });
        });

        // Affichage du total de créneaux actifs sur le KPI de l'accueil
        document.getElementById("kpi-slots-count").textContent = activeSlotsCount;

    } else {
        alert("Session introuvable. Redirection vers l'authentification.");
        window.location.href = "connexion.html";
    }

    // ==========================================
    // NAVIGATION DES ONGLETS SIDEBAR
    // ==========================================
    const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
    const tabPanes = document.querySelectorAll(".tab-pane-content");

    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            menuItems.forEach(menu => menu.classList.remove("active"));
            this.classList.add("active");

            tabPanes.forEach(pane => pane.classList.add("hidden"));
            const targetId = this.getAttribute("data-target");
            const targetPane = document.getElementById(targetId);

            if (targetPane) {
                targetPane.classList.remove("hidden");
            }
        });
    });
});