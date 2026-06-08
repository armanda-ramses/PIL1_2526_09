document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération des données du JSON d'inscription
    const userData = JSON.parse(localStorage.getItem('profil_utilisateur'));

    // Sécurité : Si l'utilisateur n'est pas connecté, retour à l'index
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Initialisation des composants dynamiques
    initHeader(userData);
    renderMentors(userData.academique?.matieres || []);
    renderSessions(userData.academique?.matieres || []);
});

/**
 * Affiche le nom et l'avatar dynamique
 */
function initHeader(user) {
    const prenom = user.identite?.prenom || "Étudiant";
    document.getElementById('user-greeting').innerText = `Bonjour, ${prenom}`;
    document.getElementById('user-avatar').innerText = prenom.charAt(0).toUpperCase();
}

/**
 * Filtre les mentors en fonction des matières (matieresCollectees)
 */
function renderMentors(matieresChoisies) {
    const container = document.getElementById('mentors-container');
    
    // Ta "Base de données" réelle (ou fetch vers ton API)
    const mentorsDB = [
        { nom: "Dr. Anika", matiere: "IoT", expertise: "Expert IoT" },
        { nom: "Amadou Diallo", matiere: "IA", expertise: "Expert IA" },
        { nom: "Jean", matiere: "Réseaux", expertise: "Expert Réseaux" }
    ];

    // Filtrage dynamique : on ne garde que ceux qui matchent le JSON
    const recommandations = mentorsDB.filter(m => matieresChoisies.includes(m.matiere));

    if (recommandations.length === 0) {
        container.innerHTML = `<p class="text-gray-500">Aucun mentor trouvé pour vos matières : ${matieresChoisies.join(', ')}</p>`;
        return;
    }

    container.innerHTML = recommandations.map(m => `
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-lg">${m.nom}</h3>
            <p class="text-gray-500 text-sm">${m.expertise}</p>
            <span class="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">${m.matiere}</span>
        </div>
    `).join('');
}

/**
 * Logic pour les sessions (si tu en as dans ton JSON)
 */
function renderSessions(matieres) {
    // Si tu as un tableau de sessions dans ton JSON, utilise-le ici
    console.log("Chargement des sessions pour :", matieres);
}

// 3. Logout
document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
});