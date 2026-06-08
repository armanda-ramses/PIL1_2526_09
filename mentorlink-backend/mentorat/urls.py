from django.urls import path
from .views import (
   InscriptionView, 
   MatieresView, 
   ConnexionView,
   MotDePasseOublieView,
   VerifierCodeView,
   NouveauMotDePasseView,
   ModificationProfilView
)

urlpatterns = [
   path('inscription/', InscriptionView.as_view()),
   path('matieres/', MatieresView.as_view()),
   path('connexion/', ConnexionView.as_view()),
   path('mot-de-passe-oublie/', MotDePasseOublieView.as_view()),
   path('verifier-code/', VerifierCodeView.as_view()),
   path('nouveau-mot-de-passe/', NouveauMotDePasseView.as_view()),
   path('profil/<int:id>/', ModificationProfilView.as_view()),
]