from rest_framework import serializers


class MatchingResultSerializer(serializers.Serializer):
    proposition_id = serializers.IntegerField()
    utilisateur_id = serializers.IntegerField()
    nom = serializers.CharField()
    prenom = serializers.CharField()
    email = serializers.CharField()
    filiere = serializers.CharField()
    niveau_etudes = serializers.CharField()
    matiere = serializers.CharField()
    format_session = serializers.CharField()
    type_proposition = serializers.CharField()
    score_compatibilite = serializers.DecimalField(max_digits=5, decimal_places=2)
    disponibilites_communes = serializers.ListField(child=serializers.CharField(), required=False)
