document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // 1. Récupérer les valeurs saisies
            const identifier = document.getElementById("identifier").value.trim();
            const password = document.getElementById("password").value;

            try {
                // 2. Envoyer au backend
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
                    // 3. Connexion réussie — sauvegarder les infos
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("refresh_token", data.refresh_token);
                    localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));

                    alert("Connexion réussie !");
                    window.location.href = "dashboard.html";
                } else {
                    // 4. Erreur de connexion
                    alert(data.erreur || "Identifiant ou mot de passe incorrect.");
                }

            } catch (error) {
                alert("Erreur de connexion au serveur. Vérifiez que le backend est lancé.");
            }
        });
    }

    // Bouton Google (pas encore implémenté)
    const btnGoogle = document.querySelector(".btn-google");
    if (btnGoogle) {
        btnGoogle.addEventListener("click", () => {
            alert("Connexion avec Google en cours de développement...");
        });
    }
});