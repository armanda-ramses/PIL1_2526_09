from django.urls import path
from .views import MatchingAPIView

urlpatterns = [
    path('', MatchingAPIView.as_view(), name='matching-list'),
]
