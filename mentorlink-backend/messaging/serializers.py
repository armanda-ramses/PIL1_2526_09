from rest_framework import serializers
from mentorat.models import Conversations, Messages, Utilisateur


class UtilisateurSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'nom', 'prenom', 'email']


class ConversationSerializer(serializers.ModelSerializer):
    utilisateur1 = UtilisateurSimpleSerializer(read_only=True)
    utilisateur2 = UtilisateurSimpleSerializer(read_only=True)

    utilisateur1_id = serializers.IntegerField(write_only=True, required=True)
    utilisateur2_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Conversations
        fields = ['id', 'utilisateur1', 'utilisateur2', 'utilisateur1_id', 'utilisateur2_id', 'date_creation']
        read_only_fields = ['id', 'date_creation']

    def create(self, validated_data):
        u1_id = validated_data.pop('utilisateur1_id')
        u2_id = validated_data.pop('utilisateur2_id')
        u1 = Utilisateur.objects.get(id=u1_id)
        u2 = Utilisateur.objects.get(id=u2_id)
        conv = Conversations.objects.create(utilisateur1=u1, utilisateur2=u2)
        return conv


class MessageSerializer(serializers.ModelSerializer):
    expediteur = UtilisateurSimpleSerializer(read_only=True)
    expediteur_id = serializers.IntegerField(write_only=True, required=True)
    conversation_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Messages
        fields = ['id', 'conversation', 'conversation_id', 'expediteur', 'expediteur_id', 'contenu_message', 'date_envoi']
        read_only_fields = ['id', 'conversation', 'expediteur', 'date_envoi']

    def create(self, validated_data):
        conv_id = validated_data.pop('conversation_id')
        expediteur_id = validated_data.pop('expediteur_id')
        contenu = validated_data.get('contenu_message')
        from mentorat.models import Conversations, Utilisateur
        conv = Conversations.objects.get(id=conv_id)
        expediteur = Utilisateur.objects.get(id=expediteur_id)
        msg = Messages.objects.create(conversation=conv, expediteur=expediteur, contenu_message=contenu)
        return msg
