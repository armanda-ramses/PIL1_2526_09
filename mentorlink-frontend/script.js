// Fonction d'origine pour changer de vue
function showView(viewId) {
    document.querySelectorAll('.view-container').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

// 1. Gestion de la connexion
document.getElementById('form-login').addEventListener('submit', function(event) {
    event.preventDefault();
    const loginData = {
        email: document.getElementById('login-email').value,
        motDePasse: document.getElementById('login-password').value
    };
    console.log("Tentative de connexion :", loginData);
    alert('Connexion réussie!');
});

// 2. Gestion de l'inscription (passage à la vue profil)
document.getElementById('form-register').addEventListener('submit', function(event) {
    event.preventDefault();
    // On peut déjà stocker les infos de la première étape
    console.log("Étape 1 validée, passage au profil");
    showView('view-profile');
});

// 3. Gestion de la création du profil (récupération finale)
document.getElementById('form-profile').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Récupération de TOUTES les données de l'étudiant
    const userData = {
        nom: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        telephone: document.getElementById('reg-phone').value,
        filiere: document.querySelector('input[name="filiere"]:checked').value,
        matiereForte: document.getElementById('matiere-forte').value,
        matiereFaible: document.getElementById('matiere-faible').value
    };

    console.log("Données complètes prêtes pour le backend :", JSON.stringify(userData));
    alert('Profil créé avec succès ! Bienvenue sur MentorLink.');
});