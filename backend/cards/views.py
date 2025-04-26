from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from cards.models import Card, Pack, PackItem
from cards.serializers import CardSerializer, PackSerializer
from django.http import JsonResponse
from .pagination import CustomPageNumberPagination
from rest_framework.permissions import AllowAny
import random

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    pagination_class = CustomPageNumberPagination
    http_method_names = ['get', 'put', 'patch']
    permission_classes = [AllowAny]

class PackView(APIView):
    def get(self, request, pack_id):
        try:
            pack = Pack.objects.prefetch_related('items').get(pk=pack_id)
        except Pack.DoesNotExist:
            return Response(
                {"error": "Pack not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        items = pack.items.all()
        if not items.exists():
            return Response(
                {"error": "Pack configuration incomplete"},
                status=status.HTTP_404_NOT_FOUND
            )

        probabilities = [item.probability for item in items]
        filters_list = [item.filters for item in items]

        tier = random.choices(range(len(items)), weights=probabilities, k=1)[0]
        selected_filters = filters_list[tier]

        try:
            card = Card.objects.filter(**selected_filters).order_by('?').first()
            if not card:
                raise Card.DoesNotExist
        except Card.DoesNotExist:
            return Response(
                {"error": "No cards available for this pack configuration"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CardSerializer(card)
        return Response(serializer.data)

class PackListView(APIView):
    def get(self, request):
        packs = Pack.objects.prefetch_related('items').all()
        serializer = PackSerializer(packs, many=True)
        return Response(serializer.data)

def search(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        cards = Card.objects.filter(name__icontains=query)[:20]
        results = cards
    results = CardSerializer(results, many=True).data
    return JsonResponse({'results': results})
