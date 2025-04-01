from django.http import JsonResponse
from rest_framework import viewsets
from cards.models import Card
from cards.serializers import CardSerializer
from .pagination import CustomPageNumberPagination

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    pagination_class = CustomPageNumberPagination
    http_method_names = ['get', 'put', 'patch']

def search(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        cards = Card.objects.filter(name__icontains=query)[:20]
        results = [{'id': card.id, 'name': card.name, 'image': card.image_url} for card in cards]
    return JsonResponse({'results': results})
