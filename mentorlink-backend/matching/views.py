from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from mentorat.models import Utilisateur, PropositionsMentorat, Disponibilites, ProfilCompetences
from .serializers import MatchingResultSerializer


class MatchingAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'detail': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Utilisateur.objects.get(id=user_id)
        except Utilisateur.DoesNotExist:
            return Response({'detail': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

        propositions = PropositionsMentorat.objects.filter(utilisateur=user)
        if not propositions.exists():
            return Response({'detail': 'Aucune proposition de mentorat trouvée pour cet utilisateur'}, status=status.HTTP_404_NOT_FOUND)

        user_availability = self._load_availability(user)
        all_results = []

        for proposition in propositions:
            target_type = 'offre' if proposition.type_proposition == 'demande' else 'demande'
            candidates = PropositionsMentorat.objects.filter(
                type_proposition=target_type,
                matiere=proposition.matiere
            ).exclude(utilisateur=user)

            for candidate in candidates:
                candidate_user = candidate.utilisateur
                score, overlaps = self._score_match(user, proposition, candidate, user_availability)
                if score <= 0 or not overlaps:
                    continue

                match_data = {
                    'proposition_id': candidate.id_proposition,
                    'utilisateur_id': candidate_user.id,
                    'nom': candidate_user.nom,
                    'prenom': candidate_user.prenom,
                    'email': candidate_user.email,
                    'filiere': candidate_user.filiere,
                    'niveau_etudes': candidate_user.niveau_etudes,
                    'matiere': candidate.matiere.nom_matiere,
                    'format_session': candidate.format_session,
                    'type_proposition': candidate.type_proposition,
                    'score_compatibilite': f'{score:.2f}',
                    'disponibilites_communes': overlaps,
                }
                all_results.append(match_data)

        ordered = sorted(all_results, key=lambda item: float(item['score_compatibilite']), reverse=True)
        serializer = MatchingResultSerializer(ordered, many=True)
        return Response(serializer.data)

    def _load_availability(self, user):
        availabilities = {}
        for availability in Disponibilites.objects.filter(utilisateur=user):
            availabilities.setdefault(availability.jour_semaine, []).append(
                (availability.heure_debut, availability.heure_fin)
            )
        return availabilities

    def _compute_overlap(self, availability_a, availability_b):
        overlaps = []
        for day, ranges_a in availability_a.items():
            for start_a, end_a in ranges_a:
                for start_b, end_b in availability_b.get(day, []):
                    if start_a < end_b and start_b < end_a:
                        begin = max(start_a, start_b)
                        end = min(end_a, end_b)
                        overlaps.append(f"{day} {begin.strftime('%H:%M')}–{end.strftime('%H:%M')}")
        return overlaps

    def _compute_competence_score(self, user, candidate_user, proposition, candidate):
        user_weak = set(
            ProfilCompetences.objects.filter(utilisateur=user, type_competence='faible')
            .values_list('matiere__nom_matiere', flat=True)
        )
        candidate_strong = set(
            ProfilCompetences.objects.filter(utilisateur=candidate_user, type_competence='fort')
            .values_list('matiere__nom_matiere', flat=True)
        )
        return 10 if proposition.matiere.nom_matiere in candidate_strong and candidate.matiere.nom_matiere in user_weak else 0

    def _score_match(self, user, proposition, candidate, user_availability):
        candidate_user = candidate.utilisateur
        score = 0

        if proposition.matiere == candidate.matiere:
            score += 40

        if proposition.format_session == candidate.format_session or proposition.format_session == 'les deux' or candidate.format_session == 'les deux':
            score += 20

        if user.filiere == candidate_user.filiere:
            score += 10

        if user.niveau_etudes == candidate_user.niveau_etudes:
            score += 10

        overlaps = self._compute_overlap(user_availability, self._load_availability(candidate_user))
        score += min(len(overlaps) * 5, 20)

        score += self._compute_competence_score(user, candidate_user, proposition, candidate)

        return score, overlaps
