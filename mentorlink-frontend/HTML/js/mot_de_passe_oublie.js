document.addEventListener("DOMContentLoaded", () => {
    const step1Form = document.getElementById("step1-form");
    const step2Form = document.getElementById("step2-form");
    const step3Form = document.getElementById("step3-form");
    const subtitle = document.getElementById("form-subtitle");

    let savedIdentifiant = "";
    let savedCode = "";

    // ----------------------------------------------------
    // ETAPE 1 : DEMANDE DE REINITIALISATION
    // ----------------------------------------------------
    if (step1Form) {
        step1Form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const identifiant = document.getElementById("identifiant").value.trim();
            const btn = document.getElementById("btn-step1");

            btn.disabled = true;
            btn.textContent = "Envoi en cours...";

            try {
                const response = await fetch("http://127.0.0.1:8000/api/auth/mot-de-passe-oublie/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifiant: identifiant })
                });

                const data = await response.json();

                if (response.ok) {
                    savedIdentifiant = identifiant;
                    alert("Un code de vérification a été envoyé !");
                    
                    // Passer à l'étape 2
                    step1Form.style.display = "none";
                    step2Form.style.display = "block";
                    subtitle.textContent = "Veuillez entrer le code reçu.";
                } else {
                    alert(data.erreur || "Erreur lors de la demande.");
                }
            } catch (error) {
                alert("Erreur de connexion au serveur. Vérifiez que le backend est lancé.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Envoyer le code";
            }
        });
    }

    // ----------------------------------------------------
    // ETAPE 2 : VERIFICATION DU CODE
    // ----------------------------------------------------
    if (step2Form) {
        step2Form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = document.getElementById("code").value.trim();
            const btn = document.getElementById("btn-step2");

            btn.disabled = true;
            btn.textContent = "Vérification...";

            try {
                const response = await fetch("http://127.0.0.1:8000/api/auth/verifier-code/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        identifiant: savedIdentifiant,
                        code: code
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    savedCode = code;
                    alert("Code valide !");
                    
                    // Passer à l'étape 3
                    step2Form.style.display = "none";
                    step3Form.style.display = "block";
                    subtitle.textContent = "Saisissez votre nouveau mot de passe.";
                } else {
                    alert(data.erreur || "Code invalide ou expiré.");
                }
            } catch (error) {
                alert("Erreur de connexion au serveur.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Vérifier le code";
            }
        });
    }

    // ----------------------------------------------------
    // ETAPE 3 : NOUVEAU MOT DE PASSE
    // ----------------------------------------------------
    if (step3Form) {
        step3Form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nouveauPassword = document.getElementById("nouveau_password").value;
            const confirmerPassword = document.getElementById("confirmer_password").value;
            const btn = document.getElementById("btn-step3");

            if (nouveauPassword !== confirmerPassword) {
                alert("Les mots de passe ne correspondent pas !");
                return;
            }

            btn.disabled = true;
            btn.textContent = "Modification en cours...";

            try {
                const response = await fetch("http://127.0.0.1:8000/api/auth/nouveau-mot-de-passe/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        identifiant: savedIdentifiant,
                        code: savedCode,
                        nouveau_password: nouveauPassword,
                        confirmer_password: confirmerPassword
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Votre mot de passe a été modifié avec succès ! Vous allez être redirigé vers la page de connexion.");
                    window.location.href = "connexion.html";
                } else {
                    const erreurs = typeof data === 'object' ? JSON.stringify(data) : data;
                    alert("Erreur : " + erreurs);
                }
            } catch (error) {
                alert("Erreur de connexion au serveur.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Réinitialiser le mot de passe";
            }
        });
    }
});
