from django.urls import path
from .views import InscriptionView, MatieresView

urlpatterns = [
   path('inscription/', InscriptionView.as_view()),
   path('matieres/', MatieresView.as_view()),
]