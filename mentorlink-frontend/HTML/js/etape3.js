// ==========================================
// 1. VARIABLES GLOBALES
// ==========================================
let choixForts = [];   // [{id_matiere: 1, nom_matiere: "..."}, ...]
let choixFaibles = []; // [{id_matiere: 1, nom_matiere: "..."}, ...]
let toutesLesMatieres = []; // Liste complète chargée depuis le backend

// ==========================================
// 2. CHARGEMENT DES MATIÈRES DEPUIS LE BACKEND
// ==========================================
async function chargerMatieres() {
    const filiere = document.getElementById('filiere')?.value;
    const niveau = document.getElementById('study-level')?.value;
    const semestre = document.getElementById('semestre')?.value;

    // On ne lance l'appel que si les 3 critères essentiels sont sélectionnés
    if (!filiere || !niveau || !semestre) return;

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/auth/matieres/?filiere=${filiere}&niveau=${niveau}&semestre=${semestre}`
        );
        const data = await response.json();
        toutesLesMatieres = data;
        majListesDeroulantesMatieres();
    } catch (error) {
        console.error("Erreur chargement matières:", error);
    }
}

// ==========================================
// 3. GESTION DE L'INTERFACE DYNAMIQUE
// ==========================================
function gererChangementNiveau() {
    const niveau = document.getElementById('study-level').value;
    const selectSemestre = document.getElementById('semestre');
    
    // Réinitialisation du sélecteur de semestre
    selectSemestre.innerHTML = '<option value="" disabled selected>Sélectionnez</option>';
    
    if (!niveau) {
        selectSemestre.disabled = true;
        return;
    }

    selectSemestre.disabled = false;

    // Remplissage dynamique des semestres selon le niveau IFRI
    if (niveau === "L1") {
        ajouterOptionSemestre(selectSemestre, "S1", "Semestre 1");
        ajouterOptionSemestre(selectSemestre, "S2", "Semestre 2");
    } else if (niveau === "L2") {
        ajouterOptionSemestre(selectSemestre, "S3", "Semestre 3");
        ajouterOptionSemestre(selectSemestre, "S4", "Semestre 4");
    } else if (niveau === "L3") {
        ajouterOptionSemestre(selectSemestre, "S5", "Semestre 5");
        ajouterOptionSemestre(selectSemestre, "S6", "Semestre 6");
    }

    // Vider les anciens choix si le niveau change
    choixForts = [];
    choixFaibles = [];
    mettreAjourAffichageBadges();
    chargerMatieres();
}

function ajouterOptionSemestre(select, valeur, texte) {
    const opt = document.createElement('option');
    opt.value = valeur;
    opt.textContent = texte;
    select.appendChild(opt);
}

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
    const select = type === 'fort' ? document.getElementById('select-forts') : document.getElementById('select-faibles');
    if (!select) return;

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
            zForts.innerHTML = '<p class="placeholder-zone">Aucune matière sélectionnée.</p>';
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
            zFaibles.innerHTML = '<p class="placeholder-zone">Aucune matière sélectionnée.</p>';
        }
    }
}

// ==========================================
// 4. SOUMISSION FINALE — APPEL AU BACKEND
// ==========================================
async function soumettreInscription(planningBrut) {
    const nom = localStorage.getItem("ml_nom") || "";
    const prenom = localStorage.getItem("ml_prenom") || "";
    const email = localStorage.getItem("ml_email") || "";
    const telephone = localStorage.getItem("ml_telephone") || "";
    
    // 🔐 CORRECTION : Récupération de la bonne clé définie à l'étape 1
    const password = localStorage.getItem("ml_mot_de_passe") || "";

    const filiere = document.getElementById('filiere')?.value || "";
    const niveau_etudes = document.getElementById('study-level')?.value || "";
    const bio = document.getElementById('bio')?.value || "";

    const competences = [
        ...choixForts.map(m => ({ id_matiere: m.id_matiere, type_competence: "fort" })),
        ...choixFaibles.map(m => ({ id_matiere: m.id_matiere, type_competence: "faible" }))
    ];

    // 🕒 CORRECTION : Transformation du planning texte ("08h-10h") au format Django ("08:00:00")
    const disponibilitesClean = [];
    Object.keys(planningBrut).forEach(jour => {
        planningBrut[jour].forEach(creneau => {
            // Nettoyage et découpage du créneau (ex: "08h-10h" devient ["08h", "10h"])
            const parties = creneau.split('-');
            if (parties.length === 2) {
                const debut = parties[0].replace('h', ':00:00').trim();
                const fin = parties[1].replace('h', ':00:00').trim();
                disponibilitesClean.push({
                    jour_semaine: jour,
                    heure_debut: debut,
                    heure_fin: fin
                });
            }
        });
    });

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
        disponibilites: disponibilitesClean
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/inscription/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Nettoyage complet
            localStorage.removeItem("ml_nom");
            localStorage.removeItem("ml_prenom");
            localStorage.removeItem("ml_email");
            localStorage.removeItem("ml_telephone");
            localStorage.removeItem("ml_mot_de_passe");
            localStorage.removeItem("ml_disponibilites");

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
    // Écouteurs pour mettre à jour la vue et lancer les requêtes API
    document.getElementById('study-level')?.addEventListener('change', gererChangementNiveau);
    document.getElementById('filiere')?.addEventListener('change', chargerMatieres);
    document.getElementById('semestre')?.addEventListener('change', chargerMatieres);

    // Écouteurs pour l'ajout immédiat de badges
    document.getElementById('select-forts')?.addEventListener('change', () => ajouterMatiereDepuisSelect('fort'));
    document.getElementById('select-faibles')?.addEventListener('change', () => ajouterMatiereDepuisSelect('faible'));

    const formAcademic = document.getElementById('academicForm');
    if (formAcademic) {
        formAcademic.addEventListener('submit', async function(e) {
            e.preventDefault();

            let planningBrut = {};
            try {
                const localData = localStorage.getItem("ml_disponibilites");
                if (localData) planningBrut = JSON.parse(localData);
            } catch(err) {
                console.error("Erreur disponibilités", err);
            }

            await soumettreInscription(planningBrut);
        });
    }
});