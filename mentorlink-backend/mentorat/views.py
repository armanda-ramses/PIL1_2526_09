from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.utils import timezone
import random 
from .serializers import (
    InscriptionSerializer, 
    MatiereFiliereNiveauSerializer, 
    UtilisateurSerializer, 
    ConnexionSerializer,
    MotDePasseOublieSerializer,
    VerifierCodeSerializer,
    NouveauMotDePasseSerializer,
    ModificationProfilSerializer,
    PropositionMentoratSerializer
)
from .models import MatiereFiliereNiveau, Utilisateur, CodeReinitialisation

# =======================================================================
# RECUPERATION DES MATIERES SELON LA FILIRERE ET LE NIVEAU
# =======================================================================
class MatieresView(APIView):
    
    def get(self, request):
        filiere = request.query_params.get('filiere')
        niveau = request.query_params.get('niveau')

        # Vérifier que filière et niveau sont fournis
        if not filiere or not niveau:
            return Response(
                {"erreur": "Veuillez fournir une filière et un niveau."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Récupérer les matières correspondantes
        matieres = MatiereFiliereNiveau.objects.filter(
            filiere=filiere,
            niveau=niveau
        )

        serializer = MatiereFiliereNiveauSerializer(matieres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# =======================================================================
# INSCRIPTION
# =======================================================================
class InscriptionView(APIView):

    def post(self, request):
        serializer = InscriptionSerializer(data=request.data)

        if serializer.is_valid():
            utilisateur = serializer.save()
            return Response(
                {
                    "message": "Inscription réussie !",
                    "utilisateur": UtilisateurSerializer(utilisateur).data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
# =======================================================================
# CONNEXION
# =======================================================================
class ConnexionView(APIView):
    def post(self, request):
        serializer = ConnexionSerializer(data=request.data)

        if serializer.is_valid():
            identifiant = serializer.validated_data['identifiant']
            password = serializer.validated_data['password']

            # Chercher l'utilisateur par email ou téléphone
            utilisateur = None
            if '@' in identifiant:
                try:
                    utilisateur = Utilisateur.objects.get(email=identifiant)
                except Utilisateur.DoesNotExist:
                    pass
            else:
                try:
                    utilisateur = Utilisateur.objects.get(telephone=identifiant)
                except Utilisateur.DoesNotExist:
                    pass

            # Véreifier le mot de passe
            if utilisateur and utilisateur.check_password(password):
                refresh = RefreshToken.for_user(utilisateur)
                return Response(
                    {
                        "message": "Connexion réussie !",
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh),
                        "utilisateur": UtilisateurSerializer(utilisateur).data
                    },
                    status=status.HTTP_200_OK
                )

            return Response(
                {"erreur": "Identifiant ou mot de passe incorrect."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

# =================================================================
# VUE : MOT DE PASSE OUBLIÉ
# =================================================================
class MotDePasseOublieView(APIView):

    def post(self, request):
        serializer = MotDePasseOublieSerializer(data=request.data)

        if serializer.is_valid():
            identifiant = serializer.validated_data['identifiant']

            # Chercher l'utilisateur
            utilisateur = None
            if '@' in identifiant:
                try:
                    utilisateur = Utilisateur.objects.get(email=identifiant)
                except Utilisateur.DoesNotExist:
                    pass
            else:
                try:
                    utilisateur = Utilisateur.objects.get(telephone=identifiant)
                except Utilisateur.DoesNotExist:
                    pass

            if not utilisateur:
                return Response(
                    {"erreur": "Aucun compte trouvé avec cet identifiant."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Générer un code à 6 chiffres
            code = str(random.randint(100000, 999999))

            # Sauvegarder le code (expire dans 15 minutes)
            CodeReinitialisation.objects.create(
                utilisateur=utilisateur,
                code=code,
                date_expiration=timezone.now() + timezone.timedelta(minutes=15)
            )

            # Envoyer l'email
            send_mail(
                subject='Réinitialisation de votre mot de passe MentorLink',
                message=f'Votre code de réinitialisation est : {code}\nCe code expire dans 15 minutes.',
                from_email='noreply@mentorlink.com',
                recipient_list=[utilisateur.email],
            )

            return Response(
                {"message": "Un code de réinitialisation a été envoyé à votre email."},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =================================================================
# VUE : VÉRIFIER LE CODE
# =================================================================
class VerifierCodeView(APIView):

    def post(self, request):
        serializer = VerifierCodeSerializer(data=request.data)

        if serializer.is_valid():
            identifiant = serializer.validated_data['identifiant']
            code = serializer.validated_data['code']

            # Chercher l'utilisateur
            utilisateur = None
            if '@' in identifiant:
                try:
                    utilisateur = Utilisateur.objects.get(email=identifiant)
                except Utilisateur.DoesNotExist:
                    pass
            else:
                try:
                    utilisateur = Utilisateur.objects.get(telephone=identifiant)
                except Utilisateur.DoesNotExist:
                    pass

            if not utilisateur:
                return Response(
                    {"erreur": "Aucun compte trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Vérifier le code
            try:
                code_obj = CodeReinitialisation.objects.filter(
                    utilisateur=utilisateur,
                    code=code,
                    utilise=False,
                    date_expiration__gt=timezone.now()
                ).latest('date_expiration')

                return Response(
                    {"message": "Code valide."},
                    status=status.HTTP_200_OK
                )

            except CodeReinitialisation.DoesNotExist:
                return Response(
                    {"erreur": "Code invalide ou expiré."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =================================================================
# VUE : NOUVEAU MOT DE PASSE
# =================================================================
class NouveauMotDePasseView(APIView):

    def post(self, request):
        serializer = NouveauMotDePasseSerializer(data=request.data)

        if serializer.is_valid():
            identifiant = serializer.validated_data['identifiant']
            code = serializer.validated_data['code']
            nouveau_password = serializer.validated_data['nouveau_password']

            # Chercher l'utilisateur
            utilisateur = None
            if '@' in identifiant:
                try:
                    utilisateur = Utilisateur.objects.get(email=identifiant)
                except Utilisateur.DoesNotExist:
                    pass
            else:
                try:
                    utilisateur = Utilisateur.objects.get(telephone=identifiant)
                except Utilisateur.DoesNotExist:
                    pass

            if not utilisateur:
                return Response(
                    {"erreur": "Aucun compte trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Vérifier le code
            try:
                code_obj = CodeReinitialisation.objects.filter(
                    utilisateur=utilisateur,
                    code=code,
                    utilise=False,
                    date_expiration__gt=timezone.now()
                ).latest('date_expiration')

                # Changer le mot de passe
                utilisateur.set_password(nouveau_password)
                utilisateur.save()

                # Marquer le code comme utilisé
                code_obj.utilise = True
                code_obj.save()

                return Response(
                    {"message": "Mot de passe modifié avec succès !"},
                    status=status.HTTP_200_OK
                )

            except CodeReinitialisation.DoesNotExist:
                return Response(
                    {"erreur": "Code invalide ou expiré."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# =================================================================
# VUE : MODIFICATION DU PROFIL
# =================================================================
from rest_framework.permissions import IsAuthenticated

class ModificationProfilView(APIView):
    pass

    def put(self, request, id):
        try:
            utilisateur = Utilisateur.objects.get(id=id)
        except Utilisateur.DoesNotExist:
            return Response(
                {"erreur": "Utilisateur introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ModificationProfilSerializer(
            utilisateur, 
            data=request.data, 
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Profil modifié avec succès !",
                    "utilisateur": UtilisateurSerializer(utilisateur).data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# =================================================================
# VUE : GESTION DES PROPOSITIONS DE MENTORAT
# =================================================================
from .models import PropositionsMentorat

class PropositionMentoratView(APIView):
    def post(self, request):
        serializer = PropositionMentoratSerializer(data=request.data)
        if serializer.is_valid():
            proposition = serializer.save()
            return Response(
                {
                    "message": "Annonce publiée avec succès !",
                    "proposition": PropositionMentoratSerializer(proposition).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        propositions = PropositionsMentorat.objects.all().order_by('-date_publication')
        serializer = PropositionMentoratSerializer(propositions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)