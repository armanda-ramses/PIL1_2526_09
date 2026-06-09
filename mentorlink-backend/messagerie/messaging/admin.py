from django.contrib import admin
from mentorat.models import Conversations, Messages


@admin.register(Conversations)
class ConversationsAdmin(admin.ModelAdmin):
	list_display = ('id_conversation', 'utilisateur1', 'utilisateur2', 'date_creation')
	search_fields = ('utilisateur1__email', 'utilisateur2__email')


@admin.register(Messages)
class MessagesAdmin(admin.ModelAdmin):
	list_display = ('id_message', 'conversation', 'expediteur', 'date_envoi')
	search_fields = ('expediteur__email', 'contenu_message')