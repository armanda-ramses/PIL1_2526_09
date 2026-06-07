document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            localStorage.setItem("ml_nom", document.getElementById("nom")?.value || "");
            localStorage.setItem("ml_prenom", document.getElementById("prenom")?.value || "");
            localStorage.setItem("ml_email", document.getElementById("email")?.value || "");
            localStorage.setItem("ml_mot_de_passe",document.getElementById("Mot de passe")?.value ||"" );
            
            // On passe à la suite
            window.location.href = "inscription_etape2.html";
        });
    }
});