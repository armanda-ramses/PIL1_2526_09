document.addEventListener("DOMContentLoaded", function () {

    // Correspondance data-moment → heures
    const heuresMoments = {
        "matin": { heure_debut: "08:00:00", heure_fin: "12:00:00" },
        "apres-midi": { heure_debut: "13:00:00", heure_fin: "17:00:00" },
        "soiree": { heure_debut: "18:00:00", heure_fin: "21:00:00" },
        "nuit": { heure_debut: "21:00:00", heure_fin: "06:00:00" }
    };

    // 1. Sélection des jours
    const dayPills = document.querySelectorAll(".day-pill");
    dayPills.forEach(pill => {
        pill.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });

    // 2. Sélection des moments
    const momentCards = document.querySelectorAll(".moment-card");
    momentCards.forEach(card => {
        card.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });

    // 3. Soumission
    const btnFinalize = document.getElementById("btnFinalize");
    if (btnFinalize) {
        btnFinalize.addEventListener("click", function (e) {
            e.preventDefault();

            // Récupérer les jours sélectionnés
            const selectedDays = [];
            document.querySelectorAll(".day-pill.selected").forEach(pill => {
                selectedDays.push(pill.getAttribute("data-day"));
            });

            // Récupérer les moments sélectionnés
            const selectedMoments = [];
            document.querySelectorAll(".moment-card.selected").forEach(card => {
                selectedMoments.push(card.getAttribute("data-moment"));
            });

            // Validation
            if (selectedDays.length === 0 || selectedMoments.length === 0) {
                alert("Veuillez sélectionner au moins un jour et un moment.");
                return;
            }

            // Convertir en format backend
            const disponibilites = [];
            selectedDays.forEach(jour => {
                selectedMoments.forEach(moment => {
                    const heures = heuresMoments[moment];
                    if (heures) {
                        disponibilites.push({
                            jour_semaine: jour,
                            heure_debut: heures.heure_debut,
                            heure_fin: heures.heure_fin
                        });
                    }
                });
            });

            // Sauvegarder
            localStorage.setItem("ml_disponibilites", JSON.stringify(disponibilites));

            // Passer à l'étape 3
            window.location.href = "inscription_etape3.html";
        });
    }
});