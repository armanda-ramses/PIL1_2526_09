document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Gestion de la sélection multiple des jours de la semaine (On garde !)
    const dayPills = document.querySelectorAll(".day-pill");
    dayPills.forEach(pill => {
        pill.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });

    // 2. Gestion de la sélection des moments de la journée (On garde !)
    const momentCards = document.querySelectorAll(".moment-card");
    momentCards.forEach(card => {
        card.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });

    // 3. Soumission et transition vers l'étape suivante (CORRIGÉ)
    const btnFinalize = document.getElementById("btnFinalize"); // Ton bouton "Suivant"
    if (btnFinalize) {
        btnFinalize.addEventListener("click", function (e) {
            e.preventDefault(); // Sécurité pour éviter les comportements bizarres

            // Récupération des jours sélectionnés
            const selectedDays = [];
            document.querySelectorAll(".day-pill.selected").forEach(pill => {
                selectedDays.push(pill.getAttribute("data-day") || pill.textContent.trim());
            });

            // Récupération des moments sélectionnés
            const selectedMoments = [];
            document.querySelectorAll(".moment-card.selected").forEach(card => {
                // Récupère l'attribut data ou le texte de la carte si l'attribut est vide
                selectedMoments.push(card.getAttribute("data-moment") || card.textContent.trim());
            });

            // Petite validation pour forcer l'étudiant à choisir ses dispos
            if (selectedDays.length === 0 || selectedMoments.length === 0) {
                alert("Veuillez sélectionner au moins un jour et un moment de la journée.");
                return;
            }

            // CRUCIAL : On assemble et on sauvegarde dans le localStorage pour le backend
            const planning = {
                jours: selectedDays,
                moments: selectedMoments
            };
            localStorage.setItem("ml_disponibilites", JSON.stringify(planning));

            // On passe à la page suivante (Filières et Matières de l'IFRI)
            window.location.href = "inscription_etape3.html";
        });
    }
});