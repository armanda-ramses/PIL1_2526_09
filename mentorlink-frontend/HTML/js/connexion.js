document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Empêche le rechargement de la page pour gérer les données

            // 1. Récupération des valeurs saisies par l'utilisateur
            const identifier = document.getElementById("identifier").value.trim();
            const password = document.getElementById("password").value;

            // 2. Récupération du profil d'inscription stocké pour simuler la connexion
            const savedUser = localStorage.getItem("profil_utilisateur");

            if (savedUser) {
                const user = JSON.parse(savedUser);

                // Simulation de vérification (Vérifie si l'e-mail ou le contact match)
                if (identifier === user.identite?.contact || identifier === localStorage.getItem("ml_email")) {
                    
                    // Optionnel : On crée une clé de session pour dire que l'utilisateur est connecté
                    localStorage.setItem("ml_logged_user", JSON.stringify(user));
                    
                    alert("Connexion réussie ! Redirection vers votre tableau de bord...");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Identifiants inconnus. Veuillez utiliser les informations saisies à l'inscription.");
                }
            } else {
                // Si aucun compte n'est trouvé en local
                alert("Aucun compte trouvé sur cet appareil. Veuillez d'abord vous inscrire.");
                window.location.href = "inscription_etape1.html";
            }
        });
    }

    // Gestion facultative du bouton Google Login
    const btnGoogle = document.querySelector(".btn-google");
    if (btnGoogle) {
        btnGoogle.addEventListener("click", () => {
            alert("Connexion avec Google en cours de développement...");
        });
    }
});