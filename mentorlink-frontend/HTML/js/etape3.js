// ==========================================
// 1. VARIABLES GLOBALES
// ==========================================
let choixForts = [];
let choixFaibles = [];
let toutesLesMatieres = [];

// Correspondance niveau HTML → niveau backend
const niveauxBackend = {
    "L1": "Licence 1",
    "L2": "Licence 2",
    "L3": "Licence 3"
};

// Correspondance filière HTML → filière backend
const filieresBackend = {
    "GL": "GL",
    "SI": "SI",
    "IM": "IM",
    "SIRI": "SIRI",
    "IA": "IA",
    "IoT": "SE&IoT"
};

// ==========================================
// 2. CHARGEMENT DES MATIÈRES DEPUIS LE BACKEND
// ==========================================
async function chargerMatieres() {
    const niveauHTML = document.getElementById('study-level')?.value;
    const filiereHTML = document.getElementById('filiere')?.value;

    if (!niveauHTML || !filiereHTML) return;

    const niveau = niveauxBackend[niveauHTML];
    const filiere = filieresBackend[filiereHTML];

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/auth/matieres/?filiere=${filiere}&niveau=${niveau}`
        );
        const data = await response.json();
        toutesLesMatieres = data;
        majListesDeroulantesMatieres();
    } catch (error) {
        console.error("Erreur chargement matières:", error);
        alert("Erreur de connexion au serveur.");
    }
}

// ==========================================
// 3. GESTION DE L'INTERFACE
// ==========================================
function majListesDeroulantesMatieres() {
    const sForts = document.getElementById('select-forts');
    const sFaibles = document.getElementById('select-faibles');

    if (!sForts || !sFaibles) return;

    sForts.innerHTML = '<option value="" disabled selected>Choisissez une matière...</option>';
    sFaibles.innerHTML = '<option value="" disabled selected>Choisissez une matière...</option>';

    const idsForts = choixForts.map(m => m.id_matiere);
    const idsFaibles = choixFaibles.map(m => m.id_matiere);

    toutesLesMatieres.forEach(matiere => {
        if (!idsForts.includes(matiere.id_matiere) && !idsFaibles.includes(matiere.id_matiere)) {
            const optF = document.createElement('option');
            optF.value = matiere.id_matiere;
            optF.textContent = matiere.nom_matiere;
            sForts.appendChild(optF);

            const optFa = document.createElement('option');
            optFa.value = matiere.id_matiere;
            optFa.textContent = matiere.nom_matiere;
            sFaibles.appendChild(optFa);
        }
    });

    sForts.disabled = toutesLesMatieres.length === 0;
    sFaibles.disabled = toutesLesMatieres.length === 0;
}

function ajouterMatiereDepuisSelect(type) {
    const select = type === 'fort'
        ? document.getElementById('select-forts')
        : document.getElementById('select-faibles');

    const id = parseInt(select.value);
    if (!id) return;

    const matiere = toutesLesMatieres.find(m => m.id_matiere === id);
    if (!matiere) return;

    if (type === 'fort') {
        choixForts.push(matiere);
    } else {
        choixFaibles.push(matiere);
    }

    mettreAjourAffichageBadges();
    majListesDeroulantesMatieres();
}

function supprimerMatiere(id_matiere, type) {
    if (type === 'fort') {
        choixForts = choixForts.filter(m => m.id_matiere !== id_matiere);
    } else {
        choixFaibles = choixFaibles.filter(m => m.id_matiere !== id_matiere);
    }
    mettreAjourAffichageBadges();
    majListesDeroulantesMatieres();
}

function mettreAjourAffichageBadges() {
    const zForts = document.getElementById('zone-forts');
    const zFaibles = document.getElementById('zone-faibles');

    if (zForts) {
        zForts.innerHTML = "";
        if (choixForts.length > 0) {
            choixForts.forEach(m => {
                const b = document.createElement('span');
                b.className = "badge-stored badge-fort";
                b.innerHTML = `${m.nom_matiere} ✕`;
                b.onclick = () => supprimerMatiere(m.id_matiere, 'fort');
                zForts.appendChild(b);
            });
        } else {
            zForts.innerHTML = '<p class="placeholder-zone">Aucune matière sélectionnée comme point fort.</p>';
        }
    }

    if (zFaibles) {
        zFaibles.innerHTML = "";
        if (choixFaibles.length > 0) {
            choixFaibles.forEach(m => {
                const b = document.createElement('span');
                b.className = "badge-stored badge-faible";
                b.innerHTML = `${m.nom_matiere} ✕`;
                b.onclick = () => supprimerMatiere(m.id_matiere, 'faible');
                zFaibles.appendChild(b);
            });
        } else {
            zFaibles.innerHTML = '<p class="placeholder-zone">Aucune matière sélectionnée comme point faible.</p>';
        }
    }
}

// ==========================================
// 4. SOUMISSION FINALE
// ==========================================
async function soumettreInscription(disponibilites) {
    const nom = localStorage.getItem("ml_nom") || "";
    const prenom = localStorage.getItem("ml_prenom") || "";
    const email = localStorage.getItem("ml_email") || "";
    const telephone = localStorage.getItem("ml_telephone") || "";
    const password = localStorage.getItem("ml_password") || "";

    const niveauHTML = document.getElementById('study-level')?.value || "";
    const filiereHTML = document.getElementById('filiere')?.value || "";
    const niveau_etudes = niveauxBackend[niveauHTML] || niveauHTML;
    const filiere = filieresBackend[filiereHTML] || filiereHTML;
    const bio = document.getElementById('bio')?.value || "";

    const competences = [
        ...choixForts.map(m => ({ id_matiere: m.id_matiere, type_competence: "fort" })),
        ...choixFaibles.map(m => ({ id_matiere: m.id_matiere, type_competence: "faible" }))
    ];

    const payload = {
        nom,
        prenom,
        email,
        telephone,
        password,
        password_confirm: password,
        filiere,
        niveau_etudes,
        bio,
        competences,
        disponibilites
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/inscription/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.removeItem("ml_nom");
            localStorage.removeItem("ml_prenom");
            localStorage.removeItem("ml_email");
            localStorage.removeItem("ml_telephone");
            localStorage.removeItem("ml_password");
            localStorage.removeItem("ml_disponibilites");

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));

            alert("Inscription réussie ! Bienvenue sur MentorLink !");
            window.location.href = "dashboard.html";
        } else {
            const erreurs = Object.values(data).flat().join("\n");
            alert("Erreur : " + erreurs);
        }
    } catch (error) {
        alert("Erreur de connexion au serveur.");
        console.error(error);
    }
}

// ==========================================
// 5. ÉCOUTEURS D'ÉVÉNEMENTS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('study-level')?.addEventListener('change', chargerMatieres);
    document.getElementById('filiere')?.addEventListener('change', chargerMatieres);
    document.getElementById('select-forts')?.addEventListener('change', () => ajouterMatiereDepuisSelect('fort'));
    document.getElementById('select-faibles')?.addEventListener('change', () => ajouterMatiereDepuisSelect('faible'));

    const formAcademic = document.getElementById('academicForm');
    if (formAcademic) {
        formAcademic.addEventListener('submit', async function(e) {
            e.preventDefault();

            let disponibilites = [];
            try {
                const localData = localStorage.getItem("ml_disponibilites");
                if (localData) disponibilites = JSON.parse(localData);
            } catch(err) {
                console.error("Erreur disponibilités", err);
            }

            await soumettreInscription(disponibilites);
        });
    }
});