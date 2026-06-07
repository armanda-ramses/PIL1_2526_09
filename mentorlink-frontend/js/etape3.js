// ==========================================
// 1. DÉCLARATION DES VARIABLES GLOBALES
// ==========================================
let choixForts = [];
let choixFaibles = [];

const troncCommunL1 = {
    "S1": [
        "Logique, arithmétique et ses applications (MTH1121)",
        "Algèbre linéaire et applications (1MTH1122)",
        "Analyse et applications (2MTH1122)",
        "Analyse combinatoire, calcul des probabilités et applications (1MTH1123)",
        "Statistiques inférentielles et applications (2MTH1123)",
        "Architecture et topologie des réseaux informatiques (1INF1124)",
        "Utilisation et administration sous Windows/Linux (1INF1125)",
        "Outils de base en informatique (2INF1125)",
        "Algorithmique (1INF1126)",
        "Langage C (2INF1126)",
        "Déontologie et droit liés aux TIC (1DRP1127)",
        "Techniques d’expression écrite et orale (1TCC1128)"
    ],
    "S2": [
        "Administration des réseaux sous Windows/Linux (1INF1221)",
        "Suites et séries numériques (1MTH1222)",
        "Équations différentielles et calcul intégral (2MTH1222)",
        "Projet intégrateur (1INF1223)",
        "Théorie des graphes et applications (1INF1224)",
        "Recherche opérationnelle et applications (2INF1224)",
        "Développement web (1INF1225)",
        "Infographie (2INF1225)",
        "Théorie des bases de données et algèbre relationnelle (1INF1226)",
        "SGBD et langage SQL (2INF1226)",
        "Programmation python (1INF1227)",
        "Anglais technique (1ANG1228)"
    ]
};

const specialitesL2L3 = {
    "GL": {
        "S3": [
            "Structures algébriques et leurs applications en informatique (1MTH1321)",
            "Analyse et conception orientée objet (1INF1322)",
            "Application avec les langages Java et C++ (2INF1322)",
            "Structure de données et applications avec C/Python (1INF1323)",
            "Programmation graphique, évènementielle et Java entreprise (1INF1324)",
            "Projet de validation des acquis en Java (2INF1324)",
            "Programmation graphique en QT/C++ (1INF1325)",
            "Aspects avancés des technologies web (1INF1326)",
            "Assurance qualité et test de logiciel (1INF1327)",
            "Méthode Agile Scrum (2INF1327)",
            "Maintenance des appareils électroniques (1INF1328)"
        ],
        "S4": [
            "Programmation avancée en Python et R (1INF1421)",
            "Structure de données avancées (1INF1422)",
            "Aspects avancés des bases de données (2INF1422)",
            "Système d'information décisionnelle (1INF1423)",
            "Sécurité des systèmes d'informations (1INF1423)",
            "Ingénierie Logicielle et les PGI/ERP (1INF1424)",
            "Atelier-Séminaire de développement et de présentation de logiciel (2INF1424)",
            "Cycle de vie d'un logiciel et assurance qualité (1INF1425)",
            "Conduite de projets informatiques (1GES1426)",
            "Stage d'immersion et discipline (2GES1426)",
            "Communication managériale (1MGT1427)",
            "Anglais pour la communication scientifique (1ANG1428)"
        ],
        "S5": ["Cycle de développement de logiciel", "Assurance qualité & Test de logiciel", "Étude de Android & Technologie mobile", "Intégration des systèmes hétérogènes", "Aspects avancés de Oracle", "Business plan & Leadership"],
        "S6": ["Stage professionnel", "Rédaction de mémoire", "Soutenance"]
    },
    "SI": {
        "S3": [
            "Structures algébriques et leurs applications en informatique (1MTH1321)",
            "Analyse et conception orientée objet (1INF1322)",
            "Application avec les langages Java et C++ (2INF1322)",
            "Structure de données et applications avec C/Python (1INF1323)",
            "Administration systèmes et réseaux sous Linux (1INF1324)",
            "Administration système et réseaux sous Windows (2INF1324)",
            "Management de la sécurité du système d'information (1INF1325)",
            "Sécurité des systèmes informatiques (1INF1326)",
            "Filtrage des accès (1INF1327)",
            "Etude des protocoles (2INF1327)",
            "Maintenance des appareils électroniques (1INF1328)"
        ],
        "S4": [
            "Politique de sécurité des systèmes d'information (1INF1421)",
            "Protocoles de routage et sécurité (1INF1422)",
            "Audit et normes de sécurité (2INF1422)",
            "Routage WAN et sécurité (2INF1422)",
            "Gestion des risques et incidents (1INF1423)",
            "Normes et architectures des réseaux sans fil (1INF1423)",
            "Protocoles WEP, WPA, WPS et serveur BAS (1INF1424)",
            "Cryptographie et applications (1INF1425)",
            "Conduite de projets informatiques (1GES1426)",
            "Stage d'immersion et discipline (2GES1426)",
            "Communication managériale (1MGT1427)",
            "Anglais pour la communication scientifique (1ANG1428)"
        ],
        "S5": ["Systèmes de détection d'intrusion (IDS)", "Sécurisation des codes et bases de données", "Virus informatiques et attaques", "Aspects avancés de l'audit", "Préparation CCNA / Mikrotik"],
        "S6": ["Stage professionnel", "Soutenance"]
    },
    "IA": {
        "S3": ["Structures algébriques (1MTH1321)", "Analyse et conception OO (1INF1322)", "Java et C++ (2INF1322)", "Structure de données (1INF1323)", "Concepts théoriques IA (1INF1325)", "Méthode Agile Scrum (2INF1327)"],
        "S4": ["Programmation Python et R (1INF1421)", "Bases et concepts du Big data (1INF1422)", "Algorithmes d’apprentissage supervisés (1INF1424)", "Algorithmes non supervisés (2INF1424)", "Conduite de projets (1GES1426)"],
        "S5": ["Certification science de la donnée (1INF1521)", "Vision par ordinateur (1INF1522)", "Traitement automatique du langage naturel (2INF1522)", "Hackathon Big Data (1INF1524)"],
        "S6": ["Stage (1TCC1621)", "Rédaction de mémoire (1TCC1623)", "Soutenance"]
    },
    "IoT": {
        "S3": ["Structures algébriques (1MTH1321)", "Analyse et conception OO (1INF1322)", "Électricité et Électronique (1INF1324)", "Capteurs et actionneurs (1INF1326)"],
        "S4": ["Traitement du signal (1INF1421)", "VHDL & FPGA (1INF1422)", "Réseaux sans fils & IoT (1INF1424)", "Programmation temps réel (2INF1425)"],
        "S5": ["Certification IoT (1INF1521)", "Réseaux de capteurs et IoT (2INF1522)", "Réseaux industriels ICS/SCADA (1INF1525)", "Hackathon IoT (1INF1526)"],
        "S6": ["Stage (1STG1621)", "Soutenance (3INF1623)"]
    },
    "IM": {
        "S3": ["Fondements du multimédia", "Maya / Studio 3D Max", "Techniques d'animation 2D & 3D"],
        "S4": ["Photoshop & Photographie", "InDesign & Flash", "Ergonomie des interfaces", "Technologie Java Web"],
        "S5": ["Utilisation de la caméra", "Réalité virtuelle", "Développement e-commerce", "Technologie mobile"],
        "S6": ["Stage", "Soutenance"]
    },
    "SIRI": {
        "S3": ["Administration Réseaux Avancée", "Conception de Systèmes d'Information"],
        "S4": ["Sécurité des Réseaux", "Services Web & API", "Gestion des Bases de Données"],
        "S5": ["Audit des SI", "Gouvernance des SI", "Architecture Cloud", "Sécurisation des infrastructures"],
        "S6": ["Stage", "Soutenance"]
    }
};

// ==========================================
// 2. GESTION DE L'INTERFACE DYNAMIQUE
// ==========================================

function gérerChangementNiveau() {
    const niveau = document.getElementById('study-level').value;
    const selectSemestre = document.getElementById('semestre');
    const filiere = document.getElementById('filiere').value;
    
    selectSemestre.innerHTML = '<option value="" disabled selected>Sélectionnez</option>';
    
    if (niveau === "L1") {
        selectSemestre.disabled = false;
        ajouterOptionSemestre(selectSemestre, "S1", "Semestre 1");
        ajouterOptionSemestre(selectSemestre, "S2", "Semestre 2");
        remettreListesMatieresAZero();
    } else {
        if (filiere) {
            selectSemestre.disabled = false;
            remplirSemestresL2L3(niveau, selectSemestre);
        } else {
            selectSemestre.disabled = true;
            remettreListesMatieresAZero();
        }
    }
}

function gérerChangementFiliere() {
    const niveau = document.getElementById('study-level').value;
    const selectSemestre = document.getElementById('semestre');

    if (niveau && niveau !== "L1") {
        selectSemestre.disabled = false;
        const svgValeur = selectSemestre.value;
        
        selectSemestre.innerHTML = '<option value="" disabled selected>Sélectionnez</option>';
        remplirSemestresL2L3(niveau, selectSemestre);
        
        if(svgValeur) selectSemestre.value = svgValeur;
        majListesDeroulantesMatieres();
    } else if (niveau === "L1") {
        majListesDeroulantesMatieres();
    }
}

function remplirSemestresL2L3(niveau, select) {
    if (niveau === "L2") {
        ajouterOptionSemestre(select, "S3", "Semestre 3");
        ajouterOptionSemestre(select, "S4", "Semestre 4");
    } else if (niveau === "L3") {
        ajouterOptionSemestre(select, "S5", "Semestre 5");
        ajouterOptionSemestre(select, "S6", "Semestre 6");
    }
}

function ajouterOptionSemestre(select, valeur, texte) {
    const opt = document.createElement('option');
    opt.value = valeur;
    opt.textContent = texte;
    select.appendChild(opt);
}

function remettreListesMatieresAZero() {
    choixForts = [];
    choixFaibles = [];
    
    const sForts = document.getElementById('select-forts');
    const sFaibles = document.getElementById('select-faibles');
    
    sForts.innerHTML = '<option value="" disabled selected>Choisissez une matière à ajouter...</option>';
    sFaibles.innerHTML = '<option value="" disabled selected>Choisissez une matière à ajouter...</option>';
    
    sForts.disabled = true;
    sFaibles.disabled = true;
    
    mettreAjourAffichageBadges();
}

// Remplit les sélecteurs de matières selon le niveau / semestre / filière choisi
function majListesDeroulantesMatieres() {
    const niveau = document.getElementById('study-level').value;
    const semestre = document.getElementById('semestre').value;
    const filiere = document.getElementById('filiere').value;
    
    const sForts = document.getElementById('select-forts');
    const sFaibles = document.getElementById('select-faibles');

    if (!niveau || !semestre) {
        remettreListesMatieresAZero();
        return;
    }

    let matieres = [];
    if (niveau === "L1") {
        matieres = troncCommunL1[semestre] || [];
    } else {
        if (!filiere) {
            remettreListesMatieresAZero();
            return;
        }
        matieres = (specialitesL2L3[filiere] && specialitesL2L3[filiere][semestre]) ? specialitesL2L3[filiere][semestre] : [];
    }

    if (matieres.length === 0) {
        remettreListesMatieresAZero();
        return;
    }

    // Activer les listes déroulantes
    sForts.disabled = false;
    sFaibles.disabled = false;

    // Remplissage filtré (on retire ce qui est déjà sélectionné)
    remplirSelecteur(sForts, matieres, choixForts, choixFaibles);
    remplirSelecteur(sFaibles, matieres, choixFaibles, choixForts);
}

function remplirSelecteur(selectElement, toutesLesMatieres, listeActuelle, listeOpposee) {
    selectElement.innerHTML = '<option value="" disabled selected>Choisissez une matière à ajouter...</option>';
    
    toutesLesMatieres.forEach(matiere => {
        // On n'affiche pas la matière si elle est déjà sélectionnée d'un côté ou de l'autre
        if (!listeActuelle.includes(matiere) && !listeOpposee.includes(matiere)) {
            const opt = document.createElement('option');
            opt.value = matiere;
            opt.textContent = matiere;
            selectElement.appendChild(opt);
        }
    });
}

// Ajoute une matière dans le tableau correspondant
function ajouterMatiereDepuisSelect(type) {
    const select = type === 'fort' ? document.getElementById('select-forts') : document.getElementById('select-faibles');
    const valeur = select.value;

    if (!valeur) return;

    if (type === 'fort') {
        choixForts.push(valeur);
    } else {
        choixFaibles.push(valeur);
    }

    mettreAjourAffichageBadges();
    majListesDeroulantesMatieres(); // Recalcule les options restantes
}

// Supprime et remet la matière disponible
function supprimerMatiere(nom, type) {
    if (type === 'faible') {
        choixFaibles = choixFaibles.filter(m => m !== nom);
    } else {
        choixForts = choixForts.filter(m => m !== nom);
    }
    mettreAjourAffichageBadges();
    majListesDeroulantesMatieres();
}

// Gère le rendu visuel sous forme de "Tags photos" rétractables au clic
function mettreAjourAffichageBadges() {
    const zForts = document.getElementById('zone-forts');
    const zFaibles = document.getElementById('zone-faibles');

    // Section Forts
    zForts.innerHTML = "";
    if (choixForts.length > 0) {
        choixForts.forEach(m => {
            const b = document.createElement('span');
            b.className = "badge-stored badge-fort";
            b.innerHTML = `${m} ✕`;
            b.onclick = () => supprimerMatiere(m, 'fort');
            zForts.appendChild(b);
        });
    } else {
        zForts.innerHTML = '<p class="placeholder-zone">Aucune matière sélectionnée comme point fort.</p>';
    }

    // Section Faibles
    zFaibles.innerHTML = "";
    if (choixFaibles.length > 0) {
        choixFaibles.forEach(m => {
            const b = document.createElement('span');
            b.className = "badge-stored badge-faible";
            b.innerHTML = `${m} ✕`;
            b.onclick = () => supprimerMatiere(m, 'faible');
            zFaibles.appendChild(b);
        });
    } else {
        zFaibles.innerHTML = '<p class="placeholder-zone">Aucune matière sélectionnée comme point faible.</p>';
    }
}

// ==========================================================
// 3. ÉCOUTEURS D'ÉVÉNEMENTS & SOUMISSION CONSOLIDÉE
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('study-level')?.addEventListener('change', gérerChangementNiveau);
    document.getElementById('filiere')?.addEventListener('change', gérerChangementFiliere);
    document.getElementById('semestre')?.addEventListener('change', majListesDeroulantesMatieres);

    // Écouteurs sur les sélections directes de matières
    document.getElementById('select-forts')?.addEventListener('change', () => ajouterMatiereDepuisSelect('fort'));
    document.getElementById('select-faibles')?.addEventListener('change', () => ajouterMatiereDepuisSelect('faible'));

    const formAcademic = document.getElementById('academicForm');

    if (formAcademic) {
        formAcademic.addEventListener('submit', function(e) {
            e.preventDefault();

            let planningStocke = { jours: [], moments: [] };
            try {
                const localData = localStorage.getItem("ml_disponibilites");
                if (localData) planningStocke = JSON.parse(localData);
            } catch(err) {
                console.error("Erreur d'extraction du planning", err);
            }

            // COMPILATION DU RENDU FINAL DANS L'OBJET UNIQUE
            const payloadConsolide = {
                identite: {
                    nom: localStorage.getItem("ml_nom") || "",
                    prenom: localStorage.getItem("ml_prenom") || "",
                    email: localStorage.getItem("ml_email") || ""
                },
                horaires: planningStocke,
                academique: {
                    niveau: document.getElementById('study-level')?.value || "",
                    semestre: document.getElementById('semestre')?.value || "",
                    filiere: document.getElementById('filiere')?.value || "",
                    biographie: document.getElementById('bio')?.value || "",
                    matieres_fortes: choixForts,
                    matieres_faibles: choixFaibles
                }
            };

            const jsonFinalPourBackend = JSON.stringify(payloadConsolide, null, 2);

            console.log("=== JSON CONSOLIDÉ SÉCURISÉ ===");
            console.log(jsonFinalPourBackend);

            alert("Succès ! Inscription validée. Votre JSON final consolidé a été généré dans la console.");
            
            // Redirection vers le Dashboard de la soirée !
            window.location.href = "dashboard.html";
        });
    }
});
// Remplace 'btn-terminer' par l'ID exact de ton bouton final
document.getElementById('btn-terminer').addEventListener('click', () => {
    
    // 1. Ton objet de données que tu as construit (ex: payloadConsolide)
    // Assure-toi qu'il contient bien le nom, les matières, etc.
    const finalData = {
        identite: { prenom: document.getElementById('prenom').value }, // ou autre source
        academique: {
            matieres: [...document.querySelectorAll('#liste-matières-choisies .badge')].map(b => b.innerText.trim())
        }
    };

    // 2. Sauvegarde dans le localStorage
    // C'est cette clé 'profil_utilisateur' qui permet au Dashboard de te reconnaître
    localStorage.setItem('profil_utilisateur', JSON.stringify(finalData));

    // 3. Redirection vers le Dashboard
    window.location.href = 'dashboard.html';
});
