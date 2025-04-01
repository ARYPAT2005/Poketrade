from rest_framework import viewsets
from cards.models import Card
from cards.serializers import CardSerializer
from .pagination import CustomPageNumberPagination
from rest_framework.permissions import AllowAny

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    pagination_class = CustomPageNumberPagination
    http_method_names = ['get', 'put', 'patch']
    permission_classes = [AllowAny]