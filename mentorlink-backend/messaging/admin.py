from django.contrib import admin
from mentorat.models import Conversations, Messages


@admin.register(Conversations)
class ConversationsAdmin(admin.ModelAdmin):
	list_display = ('id', 'utilisateur1', 'utilisateur2', 'date_creation')
	search_fields = ('utilisateur1__email', 'utilisateur2__email')
	list_filter = ('date_creation',)


@admin.register(Messages)
class MessagesAdmin(admin.ModelAdmin):
	list_display = ('id', 'conversation', 'expediteur', 'date_envoi')
	search_fields = ('conversation__id', 'expediteur__email', 'contenu_message')