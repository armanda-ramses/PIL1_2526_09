document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // 1. Récupérer les valeurs selon les vrais id du HTML
            const nom = document.getElementById("lastname")?.value.trim() || "";
            const prenom = document.getElementById("firstname")?.value.trim() || "";
            const contact = document.getElementById("contact")?.value.trim() || "";
            const password = document.getElementById("reg-password")?.value || "";
            const password_confirm = document.getElementById("confirm-password")?.value || "";

            // 2. Déterminer si contact est email ou téléphone
            const email = contact.includes("@") ? contact : "";
            const telephone = !contact.includes("@") ? contact : "";

            // 3. Validations
            if (!nom || !prenom) {
                alert("Veuillez remplir votre nom et prénom.");
                return;
            }

            if (!contact) {
                alert("Veuillez fournir un email ou un numéro de téléphone.");
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