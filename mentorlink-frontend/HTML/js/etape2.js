document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Gestion de la sélection multiple des jours de la semaine
    const dayPills = document.querySelectorAll(".day-pill");
    dayPills.forEach(pill => {
        pill.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });

    // 2. Gestion de la sélection des moments de la journée
    const momentCards = document.querySelectorAll(".moment-card");
    momentCards.forEach(card => {
        card.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });

    // 3. Soumission et transition vers l'étape suivante (CORRIGÉ POUR LE DASHBOARD)
    const btnFinalize = document.getElementById("btnFinalize"); // Ton bouton "Suivant"
    if (btnFinalize) {
        btnFinalize.addEventListener("click", function (e) {
            e.preventDefault(); 

            // Récupération des jours sélectionnés (en minuscules pour correspondre au Dashboard)
            const selectedDays = [];
            document.querySelectorAll(".day-pill.selected").forEach(pill => {
                const dayText = pill.getAttribute("data-day") || pill.textContent.trim();
                selectedDays.push(dayText.toLowerCase()); // Sécurité : tout en minuscules (ex: "lundi")
            });

            // Récupération des moments sélectionnés
            const selectedMoments = [];
            document.querySelectorAll(".moment-card.selected").forEach(card => {
                const momentText = card.getAttribute("data-moment") || card.textContent.trim();
                // Nettoyage des espaces pour correspondre aux clés du Dashboard (ex: "08h-10h")
                const momentClean = momentText.replace(/\s+/g, '');
                selectedMoments.push(momentClean);
            });

            // Validation de sécurité
            if (selectedDays.length === 0 || selectedMoments.length === 0) {
                alert("Veuillez sélectionner au moins un jour et un moment de la journée.");
                return;
            }

            // ==========================================
            // CONVERSION FORMAT MATRICE POUR LE DASHBOARD
            // ==========================================
            // On crée l'objet structurel attendu : { lundi: [...], mardi: [...] }
            const planningPourDashboard = {};
            
            // On initialise les 5 jours de la semaine à vide
            const joursSemaine = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
            joursSemaine.forEach(j => {
                planningPourDashboard[j] = [];
            });

            // Pour chaque jour sélectionné par l'étudiant, on lui associe les moments cochés
            selectedDays.forEach(jour => {
                if (planningPourDashboard.hasOwnProperty(jour)) {
                    planningPourDashboard[jour] = [...selectedMoments];
                }
            });

            // On sauvegarde la matrice complète sous la clé lue par l'étape 3
            localStorage.setItem("ml_disponibilites", JSON.stringify(planningPourDashboard));

            // Direction l'étape 3 !
            window.location.href = "inscription_etape3.html";
        });
    }
});