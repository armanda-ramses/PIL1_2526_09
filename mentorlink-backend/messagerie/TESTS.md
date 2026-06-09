Démarrage du serveur

1. Depuis le dossier `messagerie`, activez l'environnement et lancez le serveur :

```powershell
.\env\Scripts\python.exe manage.py runserver
```

Endpoints publics (test avec curl)

- Lister conversations :

```bash
curl http://127.0.0.1:8000/api/conversations/
```

- Créer une conversation (remplacez les ids par des `Utilisateur` existants) :

```bash
curl -X POST http://127.0.0.1:8000/api/conversations/ -H "Content-Type: application/json" -d '{"utilisateur1_id":1,"utilisateur2_id":2}'
```

- Lister messages d'une conversation (filter) :

```bash
curl "http://127.0.0.1:8000/api/messages/?conversation_id=1"
```

- Envoyer un message :

```bash
curl -X POST http://127.0.0.1:8000/api/messages/ -H "Content-Type: application/json" -d '{"conversation_id":1,"expediteur_id":1,"contenu_message":"Salut"}'
```

Postman

Importez `POSTMAN_collection.json` à la racine du projet dans Postman.

1. Créez un environnement Postman et ajoutez ces variables :
   - `baseUrl` = `http://127.0.0.1:8000`
   - `user1_id` = `1`
   - `user2_id` = `2`
   - `conversation_id` = `1`
   - `message_text` = `Salut, c'est un test`

2. Exécutez les requêtes dans cet ordre :
   - `List Conversations`
   - `Create Conversation`
   - `Send Message`
   - `List Messages (by conversation)`

Notes

- Ces endpoints sont publics. Ajoute l'authentification token plus tard si tu finishes le projet à temps.
- Assurez-vous que la base de données contient `Utilisateur` avec les ids utilisés dans les tests.
