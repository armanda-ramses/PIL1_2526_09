from rest_framework import serializers
from .models import Utilisateur, ProfilCompetences, Disponibilites, Matieres, MatiereFiliereNiveau

# --- Inscription ---
class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Utilisateur
        fields = [
            'nom', 'prenom', 'email', 'telephone',
            'filiere', 'niveau_etudes', 'password',
            'photo_profil', 'bio'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Utilisateur(**validated_data)
        user.set_password(password)
        user.save()
        return user


# --- Connexion ---
class ConnexionSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# --- Profil utilisateur ---
class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = [
            'id', 'nom', 'prenom', 'email', 'telephone',
            'filiere', 'niveau_etudes', 'photo_profil', 'bio'
        ]


# --- Matières par filière et niveau ---
class MatiereFiliereNiveauSerializer(serializers.ModelSerializer):
    nom_matiere = serializers.CharField(source='matiere.nom_matiere')
    id_matiere = serializers.IntegerField(source='matiere.id')

    class Meta:
        model = MatiereFiliereNiveau
        fields = ['id_matiere', 'nom_matiere']


# --- Compétences du profil ---
class ProfilCompetencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilCompetences
        fields = ['matiere', 'type_competence']


# --- Disponibilités ---
class DisponibilitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disponibilites
        fields = ['jour_semaine', 'heure_debut', 'heure_fin']