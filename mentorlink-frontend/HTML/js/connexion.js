document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        // Ajout du mot-clé 'async' pour pouvoir utiliser 'await' avec fetch
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Empêche le rechargement de la page pour gérer les données

            // 1. Récupération des valeurs saisies par l'utilisateur
            const identifier = document.getElementById("identifier").value.trim();
            const password = document.getElementById("password").value;

            // Petite sécurité locale : éviter d'envoyer une requête si les champs sont vides
            if (!identifier || !password) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            try {
                // 2. Envoi des identifiants au Backend (Vérification en Base de Données)
                const response = await fetch("http://127.0.0.1:8000/api/auth/connexion/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        identifiant: identifier,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // 3. Connexion réussie — Sauvegarde des jetons de session
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("refresh_token", data.refresh_token);
                    
                    // Sauvegarde du vrai profil utilisateur extrait de la BDD
                    localStorage.setItem("ml_logged_user", JSON.stringify(data.utilisateur));
                    
                    alert("Connexion réussie ! Redirection vers votre tableau de bord...");
                    window.location.href = "dashboard.html";
                } else {
                    // 4. Erreur renvoyée par le backend (Ex: mot de passe ou identifiant incorrect)
                    alert(data.erreur || "Identifiants inconnus. Veuillez réessayer.");
                }

            } catch (error) {
                // 5. Erreur réseau ou backend éteint
                console.error("Erreur de connexion API:", error);
                alert("Erreur de connexion au serveur. Vérifiez que le backend est lancé.");
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