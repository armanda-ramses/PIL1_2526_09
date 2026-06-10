# 🎓 IFRI_MentorLink — Groupe 09

> Plateforme de mentorat académique et professionnel pour les étudiants de l'IFRI (UAC)

---

## 👥 Informations du groupe

**Nom du groupe :** Groupe 09  
**Dépôt :** [PIL1_2526_09]( https://github.com/armanda-ramses/PIL1_2526_09.git)  
**Établissement :** Institut de Formation et de Recherche en Informatique (IFRI) — Université d'Abomey-Calavi  
**Année académique :** 2025-2026

### Membres de l'équipe
## 📌 Description du projet

**IFRI_MentorLink** est une application web qui met en relation les étudiants de l'IFRI souhaitant bénéficier ou offrir du mentorat académique et professionnel.

Chaque utilisateur crée un profil (compétences, disponibilités, filière, etc.) et peut publier ou rechercher des offres/demandes de mentorat. Un algorithme de matching basé sur la compatibilité des compétences, la proximité des filières et la compatibilité horaire propose automatiquement les combinaisons mentor-mentoré les plus pertinentes, tandis qu'une messagerie intégrée permet d'organiser et de suivre les sessions de mentorat.

### Modules principaux

- **Module 1 :** Gestion des comptes et profils utilisateur
- **Module 2 :** Mise en correspondance des mentors et mentorés (algorithme de matching)
- **Module 3 :** Messagerie instantanée

---

## 🗂️ Structure du projet

```
PIL1_2526_09/
│
├── mentorlink-frontend/     # Interface utilisateur (HTML, CSS, JS)
│   ├── index.html           # Page d'accueil
│   ├── login.html           # Page de connexion
│   ├── inscription_étape_(1 2 et 3).html        # Les pages d'inscription
│   ├── dashboard.html       # Tableau de bord
│   ├── css/           #
│   ├── js/
│   └── assets/
│
├── mentorlink-backend/      # Serveur et logique métier (Python/Flask ou Django)
│   ├── app.py               # Point d'entrée de l'application
│   ├── models.py/              # Modèles de la base de données
│   ├── urls.py/              # Routes API
│   ├── matching/            # Algorithme de matching
│   └── requirements.txt     # Dépendances Python
│
├── maquettes/               # Captures des maquettes Figma
│
├── database.sql             # Structure de la base de données
├── rapport.html             # Rapport technique du projet
├── .gitignore
└── README.md
```

---

## 🛠️ Technologies utilisées

| Couche | Technologie |
|---|---|
| Frontend | HTML5, CSS3, JavaScript|
| Backend | Python (Flask / Django) |
| Base de données | MySQL |
| Versioning | Git & GitHub |
| Maquettage | Figma |

---

## 🗄️ Conception de la base de données

La base de données relationnelle contient les entités principales suivantes :

- **Utilisateur** : id, nom, prénom, email, téléphone, mot de passe (hashé), filière, niveau, photo, bio, disponibilités
- **Compétence** : id, nom, catégorie
- **Utilisateur_Compétence** : lien entre utilisateur et compétences (maîtrisées ou lacunes)
- **Offre_Mentorat** : id, utilisateur, matières, disponibilités, format, type (offre/demande)
- **Matching** : id, mentor, mentoré, score de compatibilité
- **Conversation** : id, participants
- **Message** : id, conversation, expéditeur, contenu, horodatage

Le fichier complet de la base de données est disponible ici : [`projet.sql`](./projet.sql)

---

## 🚀 Instructions de déploiement

### Prérequis

- Python 3.10+
- MySQL
- pip
- Un navigateur web moderne

## 🛠️ Prérequis & Installation

Suivez ces étapes dans votre terminal pour initialiser le projet localement :

### 1. Cloner la branche principale du dépôt
```bash
git clone --single-branch --branch main <https://github.com/armanda-ramses/PIL1_2526_09.git>
cd mentorlink-backend

### 2. Créer et activer l'environnement virtuel
Sur Linux / macOS :
python3 -m venv venv
source venv/bin/activate
Sur Windows :
python -m venv venv
venv\Scripts\activate

### 3. Installer les packages requis
pip install -r requirements.txt


🗄️ Configuration de la Base de Données
### 1. Appliquer les migrations
Créez la structure des tables SQL de l'application :
python manage.py makemigrations
python manage.py migrate

### 2. Peupler automatiquement les matières (Script de population)
Pour vous éviter de remplir manuellement les filières et les matières, nous avons intégré un script de peuplement. Il va générer automatiquement les 10 matières spécifiques par filière pour la Licence 1 et la Licence 2 (avec les matières communes en première année).
Exécutez simplement la commande suivante :
python matiere.py


🚀 Lancement de l'application
Une fois la base de données initialisée et peuplée, vous pouvez lancer le serveur de développement :
python manage.py runserver
L'API sera accessible sur : http://127.0.0.1:8000/



## 📖 Manuel d'utilisation

### Inscription
1. Accède à la page d'accueil
2. Clique sur **"S'inscrire"**
3. Remplis le formulaire (nom, prénom, email, téléphone, mot de passe, filière, niveau)
4. Choisis tes compétences (points forts) et tes lacunes (points faibles)
5. Indique tes disponibilités horaires
6. Valide l'inscription

### Connexion
1. Clique sur **"Se connecter"**
2. Saisis ton email ou numéro de téléphone et ton mot de passe
3. Accède à ton tableau de bord

### Trouver un mentor / mentoré
1. Va dans l'onglet **"Matching"**
2. Consulte les suggestions proposées automatiquement
3. Filtre par matière ou disponibilité si nécessaire
5. Clique sur **"Contacter"** pour démarrer une conversation

### Messagerie
1. Va dans l'onglet **"Messages"**
2. Sélectionne une conversation
3. Envoie et reçois des messages en temps réel

---

## 🎨 Maquettes

Les maquettes de l'application ont été réalisées sur Figma.

🔗 [Voir la maquette sur Figma](https://figma.com/ton-lien-ici) ← *(à remplacer par le vrai lien)*

Les captures des écrans principaux sont disponibles dans le dossier [`maquettes/`](./maquettes/).

---

## 👨‍🏫 Équipe pédagogique

- **Supervision :** M. Ratheil HOUNDJI
- **Encadrants :**
  - M. Armand ACCROMBESSI
  - Mme. Maryse GAHOU

---

## 📅 Calendrier du projet

| Date | Activité |
|---|---|
| 01 juin 2026 | Lancement du projet, prise en main de Git |
| 03 juin 2026 | Bonnes pratiques de collaboration |
| 04 juin 2026 | Échanges par groupe (en ligne) |
| 08-09 juin 2026 | Échanges par groupe (en présentiel) |
| **10 juin 2026** | **Dépôt des livrables finaux (23h59)** |
| 12-13 juin 2026 | Présentation finale et évaluation |

---

*Projet intégrateur — Licence 1 IFRI/UAC — 2025-2026*
