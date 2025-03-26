from rest_framework import viewsets
from cards.models import Card
from cards.serializers import CardSerializer

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    http_method_names = ['get', 'put', 'patch']  # Only allow GET and UPDATE methods