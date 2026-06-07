document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let listeDispos = [];
            document.querySelectorAll(".checkbox-dispo:checked").forEach(box => {
                listeDispos.push(box.value);
            });

            localStorage.setItem("ml_disponibilites", JSON.stringify(listeDispos));
            
            // On passe à la suite
            window.location.href = "inscription_etape3.html";
        });
    }
});