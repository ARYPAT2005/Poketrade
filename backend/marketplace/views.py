from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from cards.models import Card  # Import your Card model from the 'cards' app
from .serializers import SellCardSerializer
from rest_framework.permissions import IsAuthenticated  # For user authentication
from rest_framework.decorators import permission_classes

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can sell
def sell_card(request):
    serializer = SellCardSerializer(data=request.data)
    if serializer.is_valid():
        card_id = serializer.validated_data['card_id']
        auction_price = serializer.validated_data['auction_price']
        buy_now_price = serializer.validated_data['buy_now_price']

        try:
            card = Card.objects.get(pk=card_id)
        except Card.DoesNotExist:
            return Response({"error": "Card not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update the Card object
        card.is_for_sale = True
        card.auction_price = auction_price
        card.buy_now_price = buy_now_price
        card.listed_by = request.user  # Assuming you have a 'listed_by' ForeignKey to User in your Card model
        card.save()

        # You might want to serialize the updated Card object here for the response
        from cards.serializers import CardSerializer  # Assuming you have a CardSerializer
        card_serializer = CardSerializer(card)
        return Response(card_serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)