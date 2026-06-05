import os
import django

import sys
sys.path.insert(0, '/home/pio/PIL1_2526_09/mentorlink-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'IFRI_MentorLink.settings')
django.setup()

from mentorat.models import Matieres, MatiereFiliereNiveau

# ============================================================
# DONNÉES
# ============================================================

L1_MATIERES = [
    "Algèbre linéaire",
    "Analyse mathématiques",
    "Technique d'expression écrite et orale",
    "Déontologie et Droits liés aux TIC",
    "Anglais technique",
    "Administration sous Windows/Linux",
    "Langage C",
    "Programmation python",
    "Bases de données relationnelles",
    "Architecture et topologie des réseaux informatiques",
]

L2_MATIERES = {
    "GL": [
        "Structures Algébriques",
        "Langage Java et C++",
        "Maintenance des Appareils Électroniques",
        "Conduite de projet informatique",
        "Anglais pour la Communication Scientifique",
        "Programmation graphique",
        "Programmation graphique en QT/C++",
        "Assurance qualité et test de logiciels",
        "Ingénierie logiciel et les PGI/ERP",
        "Systèmes d'information décisionnelle",
    ],
    "SI": [
        "Structures Algébriques",
        "Langage Java et C++",
        "Maintenance des Appareils Électroniques",
        "Conduite de projet informatique",
        "Anglais pour la Communication Scientifique",
        "Sécurité des systèmes informatiques",
        "Filtrage des accès",
        "Étude des protocoles",
        "Cryptographie et applications",
        "Routage WAN et sécurité",
    ],
    "SE&IoT": [
        "Structures Algébriques",
        "Langage Java et C++",
        "Maintenance des Appareils Électroniques",
        "Conduite de projet informatique",
        "Anglais pour la Communication Scientifique",
        "Électricité et Électronique analogique",
        "Électronique numérique",
        "Capteurs et actionneurs",
        "Programmation de FPGA",
        "Automates programmables",
    ],
    "IA": [
        "Structures Algébriques",
        "Langage Java et C++",
        "Maintenance des Appareils Électroniques",
        "Conduite de projet informatique",
        "Anglais pour la Communication Scientifique",
        "Introduction au Blockchain",
        "Introduction à l'IA",
        "Théorie des langages",
        "Fondamentaux des bigs data",
        "Architecture logicielle",
    ],
    "SIRI": [
        "Structures Algébriques",
        "Langage Java et C++",
        "Maintenance des Appareils Électroniques",
        "Conduite de projet informatique",
        "Anglais pour la Communication Scientifique",
        "Sécurité web (OWASP)",
        "Kubernetes, Serverless",
        "Administration des serveurs Windows",
        "Administration des serveurs Linux",
        "Systèmes repartis",
    ],
    "IM": [
        "Structures Algébriques",
        "Langage Java et C++",
        "Maintenance des Appareils Électroniques",
        "Conduite de projet informatique",
        "Anglais pour la Communication Scientifique",
        "Introduction à l'IA",
        "Outils de python et R",
        "Traitement du signal et image",
        "Bases de données multimédia et web sémantiques",
        "Bases de données avancées",
    ],
}

FILIERES = ["IA", "IM", "GL", "SE&IoT", "SI", "SIRI"]

# ============================================================
# PEUPLEMENT
# ============================================================

def get_or_create_matiere(nom):
    matiere, _ = Matieres.objects.get_or_create(nom_matiere=nom)
    return matiere

def peupler():
    print("Démarrage du peuplement...")

    # --- Licence 1 (toutes filières, mêmes matières) ---
    print("\n→ Licence 1...")
    for nom in L1_MATIERES:
        matiere = get_or_create_matiere(nom)
        for filiere in FILIERES:
            MatiereFiliereNiveau.objects.get_or_create(
                matiere=matiere,
                filiere=filiere,
                niveau="Licence 1"
            )
    print("   Licence 1 OK")

    # --- Licence 2 (matières par filière) ---
    print("\n→ Licence 2...")
    for filiere, matieres in L2_MATIERES.items():
        for nom in matieres:
            matiere = get_or_create_matiere(nom)
            MatiereFiliereNiveau.objects.get_or_create(
                matiere=matiere,
                filiere=filiere,
                niveau="Licence 2"
            )
    print("   Licence 2 OK")

    print("\nPeuplement terminé avec succès !")

peupler()