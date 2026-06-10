document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

                        // 1. Récupérer les valeurs
            const nom = document.getElementById("lastname")?.value.trim() || "";
            const prenom = document.getElementById("firstname")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const telephone = document.getElementById("telephone")?.value.trim() || "";
            const password = document.getElementById("reg-password")?.value || "";
            const password_confirm = document.getElementById("confirm-password")?.value || "";

            // 2. Validations
            if (!nom || !prenom) {
                alert("Veuillez remplir votre nom et prénom.");
                return;
            }

            if (!email || !telephone) {
                alert("Veuillez fournir votre email ET votre numéro de téléphone.");
                return;
            }

            if (password.length < 8) {
                alert("Le mot de passe doit contenir au moins 8 caractères.");
                return;
            }

            if (password !== password_confirm) {
                alert("Les mots de passe ne correspondent pas.");
                return;
            }

            // 4. Stocker dans localStorage
            localStorage.setItem("ml_nom", nom);
            localStorage.setItem("ml_prenom", prenom);
            localStorage.setItem("ml_email", email);
            localStorage.setItem("ml_telephone", telephone);
            localStorage.setItem("ml_password", password);

            // 5. Passer à l'étape 2
            window.location.href = "inscription_etape2.html";
        });
    }
});