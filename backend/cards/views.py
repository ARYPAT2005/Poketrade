from rest_framework import viewsets
from cards.models import Card
from cards.serializers import CardSerializer
from .pagination import CustomPageNumberPagination

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    pagination_class = CustomPageNumberPagination
    http_method_names = ['get', 'put', 'patch']
    