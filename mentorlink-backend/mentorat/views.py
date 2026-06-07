from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InscriptionSerializer, MatiereFiliereNiveauSerializer, UtilisateurSerializer
from .models import MatiereFiliereNiveau

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
    