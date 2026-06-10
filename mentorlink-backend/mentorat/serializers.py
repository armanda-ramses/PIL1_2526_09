from rest_framework import serializers
from .models import Utilisateur, ProfilCompetences, Disponibilites, Matieres, MatiereFiliereNiveau, PropositionsMentorat
import re
from datetime import time

# =========================================================================
# SERIALIZER D'INSCRIPTION
# =========================================================================
class DisponibiliteInscriptionSerializer(serializers.Serializer):
   jour_semaine = serializers.CharField()
   heure_debut = serializers.TimeField()
   heure_fin = serializers.TimeField()

class CompetenceInscriptionSerializer(serializers.Serializer):
   id_matiere = serializers.IntegerField()
   type_competence = serializers.ChoiceField(choices=['fort', 'faible'])

class InscriptionSerializer(serializers.Serializer):
   # --- Etape 1 ---
   nom = serializers.CharField(max_length=50)      
   prenom = serializers.CharField(max_length=50)     
   email = serializers.EmailField(required=False, allow_blank=True)      
   telephone = serializers.CharField(max_length=20, required=False, allow_blank=True)      
   password = serializers.CharField(min_length=8, write_only=True)      
   password_confirm = serializers.CharField(write_only=True)   

   # --- Etape 2 ---
   filiere = serializers.ChoiceField(choices=['IA', 'IM', 'GL', 'SE&IoT', 'SI', 'SIRI'])
   niveau_etudes = serializers.ChoiceField(choices=['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat'])
   competences = CompetenceInscriptionSerializer(many=True, required=False)
   bio = serializers.CharField(required=False, allow_blank=True) 

   # --- Etape 3 --- 
   disponibilites = DisponibiliteInscriptionSerializer(many=True, required=False)

   # ======================================================================
   # VALIDATION
   # ======================================================================
   def validate(self, data):
        # Vérifier que les mots de passe correspondent
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                "password_confirm": "Les mots de passe ne correspondent pas."
            })

        # Vérifier qu'au moins email ou téléphone est fourni
        if not data.get('email') and not data.get('telephone'):
            raise serializers.ValidationError({
                "email": "Veuillez fournir un email ou un numéro de téléphone."
            })

        # Vérifier que l'email n'est pas déjà utilisé
        if data.get('email') and Utilisateur.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({
                "email": "Cet email est déjà utilisé."
            })

        # Vérifier que le téléphone n'est pas déjà utilisé
        if data.get('telephone') and Utilisateur.objects.filter(telephone=data['telephone']).exists():
            raise serializers.ValidationError({
                "telephone": "Ce numéro de téléphone est déjà utilisé."
            })

        # Vérifier que le mot de passe contient au moins un chiffre et un symbole
        password = data['password']
        if not re.search(r'\d', password):
            raise serializers.ValidationError({
                "password": "Le mot de passe doit contenir au moins un chiffre."
            })
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError({
                "password": "Le mot de passe doit contenir au moins un symbole."
            })

        return data 
   
   # =============================================================
   # CRÉATION EN BASE DE DONNÉES
   # =============================================================
   def create(self, validated_data):
        # Extraire les données qui ne vont pas dans la table utilisateurs
        competences = validated_data.pop('competences', [])
        disponibilites = validated_data.pop('disponibilites', [])
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # 1. Créer l'utilisateur
        utilisateur = Utilisateur(**validated_data)
        utilisateur.set_password(password)
        utilisateur.save()

        # 2. Sauvegarder les compétences (points forts et faibles)
        for comp in competences:
            ProfilCompetences.objects.create(
                utilisateur=utilisateur,
                matiere_id=comp['id_matiere'],
                type_competence=comp['type_competence']
            )

        # 3. Sauvegarder les disponibilités
        for dispo in disponibilites:
            Disponibilites.objects.create(
                utilisateur=utilisateur,
                jour_semaine=dispo['jour_semaine'],
                heure_debut=dispo['heure_debut'],
                heure_fin=dispo['heure_fin']
            )

        return utilisateur


# =================================================================
# SERIALIZER POUR AFFICHER LES MATIÈRES
# =================================================================
class MatiereFiliereNiveauSerializer(serializers.ModelSerializer):
    nom_matiere = serializers.CharField(source='matiere.nom_matiere')
    id_matiere = serializers.IntegerField(source='matiere.id')

    class Meta:
        model = MatiereFiliereNiveau
        fields = ['id_matiere', 'nom_matiere']


# =================================================================
# SERIALIZER DU PROFIL UTILISATEUR
# =================================================================
class UtilisateurSerializer(serializers.ModelSerializer):
    noms_matieres = serializers.SerializerMethodField()

    class Meta:
        model = Utilisateur
        fields = [
            'id', 'nom', 'prenom', 'email', 'telephone',
            'filiere', 'niveau_etudes', 'photo_profil', 'bio',
            'noms_matieres'
        ]

    def get_noms_matieres(self, obj):
        competences = ProfilCompetences.objects.filter(utilisateur=obj)
        return [comp.matiere.nom_matiere for comp in competences]

# =================================================================
# SERIALIZER DE CONNEXION
# =================================================================       
class ConnexionSerializer(serializers.Serializer):
    identifiant = serializers.CharField()
    password = serializers.CharField(write_only=True)

# =================================================================
# SERIALIZERS RÉINITIALISATION MOT DE PASSE
# =================================================================
class MotDePasseOublieSerializer(serializers.Serializer):
    identifiant = serializers.CharField()  # email ou téléphone

class VerifierCodeSerializer(serializers.Serializer):
    identifiant = serializers.CharField()
    code = serializers.CharField(max_length=6)

class NouveauMotDePasseSerializer(serializers.Serializer):
    identifiant = serializers.CharField()
    code = serializers.CharField(max_length=6)
    nouveau_password = serializers.CharField(min_length=8, write_only=True)
    confirmer_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['nouveau_password'] != data['confirmer_password']:
            raise serializers.ValidationError({
                "confirmer_password": "Les mots de passe ne correspondent pas."
            })
        return data
    
# =================================================================
# SERIALIZER MODIFICATION DU PROFIL
# =================================================================
class ModificationProfilSerializer(serializers.ModelSerializer):
    competences = CompetenceInscriptionSerializer(many=True, required=False)
    disponibilites = DisponibiliteInscriptionSerializer(many=True, required=False)

    class Meta:
        model = Utilisateur
        fields = [
            'nom', 'prenom', 'bio', 'photo_profil',
            'filiere', 'niveau_etudes', 'competences', 'disponibilites'
        ]

    def update(self, instance, validated_data):
        competences = validated_data.pop('competences', None)
        disponibilites = validated_data.pop('disponibilites', None)    

        # Mettre à jour les champs simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()    

        # Mettre à jour les compétences si fournies
        if competences is not None:
            ProfilCompetences.objects.filter(utilisateur_id=instance.id).delete()
            for comp in competences:
                ProfilCompetences.objects.create(
                    utilisateur=instance,
                    matiere_id=comp['id_matiere'],
                    type_competence=comp['type_competence']
                )

        # Mettre à jour les disponibilites
        if disponibilites is not None:
            Disponibilites.objects.filter(utilisateur_id=instance.id).delete()
            from datetime import time

            for dispo in disponibilites:
                heure_debut = dispo['heure_debut']
                heure_fin = dispo['heure_fin']
                Disponibilites.objects.create(
                utilisateur=instance,
                jour_semaine=dispo['jour_semaine'],
                heure_debut=heure_debut if isinstance(heure_debut, time) else time.fromisoformat(str(heure_debut)),
                heure_fin=heure_fin if isinstance(heure_fin, time) else time.fromisoformat(str(heure_fin))
    )

        return instance        

# =================================================================
# SERIALIZER DES PROPOSITIONS DE MENTORAT
# =================================================================
class PropositionMentoratSerializer(serializers.ModelSerializer):
    nom_matiere = serializers.CharField(source='matiere.nom_matiere', read_only=True)
    id_matiere = serializers.IntegerField(write_only=True)
    utilisateur_id = serializers.IntegerField(write_only=True)
    utilisateur_nom = serializers.CharField(source='utilisateur.nom', read_only=True)
    utilisateur_prenom = serializers.CharField(source='utilisateur.prenom', read_only=True)
    auteur_id = serializers.IntegerField(source='utilisateur.id', read_only=True)

    class Meta:
        model = PropositionsMentorat
        fields = [
            'id', 'utilisateur_id', 'id_matiere', 'nom_matiere', 
            'type_proposition', 'format_session', 'date_publication',
            'utilisateur_nom', 'utilisateur_prenom', 'auteur_id'
        ]

    def create(self, validated_data):
        id_matiere = validated_data.pop('id_matiere')
        utilisateur_id = validated_data.pop('utilisateur_id')
        matiere = Matieres.objects.get(id=id_matiere)
        utilisateur = Utilisateur.objects.get(id=utilisateur_id)
        
        proposition = PropositionsMentorat.objects.create(
            utilisateur=utilisateur,
            matiere=matiere,
            **validated_data
        )
        return proposition