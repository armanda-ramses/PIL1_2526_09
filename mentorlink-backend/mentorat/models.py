from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# =================================================================
# GESTIONNAIRE D'UTILISATEURS (Requis par Django pour la sécurité)
# =================================================================
class UtilisateurManager(BaseUserManager):
    def create_user(self, email, nom, prenom, telephone, filiere, niveau_etudes, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            nom=nom,
            prenom=prenom,
            telephone=telephone,
            filiere=filiere,
            niveau_etudes=niveau_etudes,
            **extra_fields
        )
        user.set_password(password)  # Hache et sécurise le mot de passe
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom, prenom, telephone, filiere, niveau_etudes, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        return self.create_user(email, nom, prenom, telephone, filiere, niveau_etudes, password, **extra_fields)

# =================================================================
# LES ENUMS (CHOICES)
# =================================================================
class FiliereChoices(models.TextChoices):
    IA = 'IA', 'Intelligence Artificielle'
    IM = 'IM', 'Internet et Multimédia'
    GL = 'GL', 'Génie Logiciel'
    SE_IOT = 'SE&IoT', 'Systèmes Embarqués & IoT'
    SI = 'SI', 'Sécurité Informatique'
    SIRI = 'SIRI', 'Systèmes d\'Information et Réseaux Informatiques'

class NiveauEtudesChoices(models.TextChoices):
    L1 = 'Licence 1', 'Licence 1'
    L2 = 'Licence 2', 'Licence 2'
    L3 = 'Licence 3', 'Licence 3'
    M1 = 'Master 1', 'Master 1'
    M2 = 'Master 2', 'Master 2'
    DOC = 'Doctorat', 'Doctorat'

class CompetenceTypeChoices(models.TextChoices):
    FORT = 'fort', 'Point Fort'
    FAIBLE = 'faible', 'Point Faible'

class PropositionTypeChoices(models.TextChoices):
    OFFRE = 'offre', 'Offre de mentorat'
    DEMANDE = 'demande', 'Demande de mentorat'

class FormatSessionChoices(models.TextChoices):
    PRESENTIEL = 'presentiel', 'Présentiel'
    EN_LIGNE = 'en ligne', 'En ligne'
    LES_DEUX = 'les deux', 'Les deux'

class JourSemaineChoices(models.TextChoices):
    LUNDI = 'Lundi', 'Lundi'
    MARDI = 'Mardi', 'Mardi'
    MERCREDI = 'Mercredi', 'Mercredi'
    JEUDI = 'Jeudi', 'Jeudi'
    VENDREDI = 'Vendredi', 'Vendredi'
    SAMEDI = 'Samedi', 'Samedi'
    DIMANCHE = 'Dimanche', 'Dimanche'

# =================================================================
# MODÈLES DJANGO
# =================================================================

# 1. TABLE : utilisateurs
class Utilisateur(AbstractBaseUser):
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    telephone = models.CharField(max_length=20, unique=True)
    filiere = models.CharField(max_length=10, choices=FiliereChoices.choices)
    niveau_etudes = models.CharField(max_length=20, choices=NiveauEtudesChoices.choices)
    photo_profil = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)

    objects = UtilisateurManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom', 'telephone', 'filiere', 'niveau_etudes'] # ✅ CORRECT ! ✅

    class Meta:
        db_table = 'utilisateurs'
        indexes = [
            models.Index(fields=['filiere', 'niveau_etudes'], name='idx_filiere_niveau'),
        ]


# 2. TABLE : matieres
class Matieres(models.Model):
    nom_matiere = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'matieres'

# 3. TABLE : profil_competences
class ProfilCompetences(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur')
    matiere = models.ForeignKey(Matieres, on_delete=models.CASCADE, db_column='id_matiere')
    type_competence = models.CharField(max_length=10, choices=CompetenceTypeChoices.choices)

    class Meta:
        db_table = 'profil_competences'
        unique_together = (('utilisateur', 'matiere', 'type_competence'),)


# 4. TABLE : disponibilites
class Disponibilites(models.Model):
    id_disponibilite = models.AutoField(primary_key=True)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur')
    jour_semaine = models.CharField(max_length=15, choices=JourSemaineChoices.choices)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()

    class Meta:
        db_table = 'disponibilites'


# 5. TABLE : propositions_mentorat
class PropositionsMentorat(models.Model):
    id_proposition = models.AutoField(primary_key=True)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur')
    matiere = models.ForeignKey(Matieres, on_delete=models.CASCADE, db_column='id_matiere')
    type_proposition = models.CharField(max_length=10, choices=PropositionTypeChoices.choices)
    format_session = models.CharField(max_length=15, choices=FormatSessionChoices.choices)
    date_publication = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'propositions_mentorat'
        indexes = [
            models.Index(fields=['matiere'], name='idx_matiere'),
            models.Index(fields=['type_proposition'], name='idx_type_proposition'),
        ]


# 6. TABLE : matchings
class Matchings(models.Model):
    id_matching = models.AutoField(primary_key=True)
    mentor = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_mentor', related_name='match_mentors')
    mentore = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_mentore', related_name='match_mentores')
    score_compatibilite = models.DecimalField(max_digits=5, decimal_places=2)
    date_matching = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'matchings'
        indexes = [
            models.Index(fields=['score_compatibilite'], name='idx_score_matching'),
        ]


# 7. TABLE : conversations
class Conversations(models.Model):
    utilisateur1 = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='conv_user1')
    utilisateur2 = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='conv_user2')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'conversations'
        unique_together = (('utilisateur1', 'utilisateur2'),)


# 8. TABLE : messages
class Messages(models.Model):
    conversation = models.ForeignKey(Conversations, on_delete=models.CASCADE)
    expediteur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    contenu_message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
        indexes = [
            models.Index(fields=['date_envoi'], name='idx_date_message'),
        ]
class MatiereFiliereNiveau(models.Model):
    matiere = models.ForeignKey(Matieres, on_delete=models.CASCADE)
    filiere = models.CharField(max_length=10, choices=FiliereChoices.choices)
    niveau = models.CharField(max_length=20, choices=NiveauEtudesChoices.choices)

    class Meta:
        db_table = 'matiere_filiere_niveau'
        unique_together = (('matiere', 'filiere', 'niveau'),)        

# 9. TABLE : codes_reinitialisation
class CodeReinitialisation(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    date_expiration = models.DateTimeField()
    utilise = models.BooleanField(default=False)

    class Meta:
        db_table = 'codes_reinitialisation'