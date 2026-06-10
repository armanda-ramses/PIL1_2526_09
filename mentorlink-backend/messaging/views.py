from rest_framework import viewsets, filters
from django.db import models
from rest_framework.permissions import AllowAny

from mentorat.models import Conversations, Messages
from .serializers import ConversationSerializer, MessageSerializer


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversations.objects.all().order_by('-date_creation')
    serializer_class = ConversationSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date_creation']

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            qs = qs.filter(models.Q(utilisateur1__id=user_id) | models.Q(utilisateur2__id=user_id))
        return qs


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Messages.objects.all().order_by('date_envoi')
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        conv_id = self.request.query_params.get('conversation_id')
        if conv_id:
            qs = qs.filter(conversation__id=conv_id)
        return qs
