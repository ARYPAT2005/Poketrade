from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from marketplace.serializer import MarketplaceWriteSerializer, MarketplaceSerializer
from marketplace.models import Marketplace

from accounts.utils import transfer_cards_or_coins;

User = get_user_model()

class SellItemView(APIView):
    def post(self, request):
        data = request.data.copy()

        serializer = MarketplaceWriteSerializer(data=data)

        print("Validating Data with Write Serializer:", data)

        if serializer.is_valid():
            print("Write serializer is valid")
            try:
                instance = serializer.save()
                print("Instance saved:", instance)

                read_serializer = MarketplaceSerializer(instance)
                return Response(read_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error saving instance: {e}")
                return Response({"detail": "Error saving marketplace listing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print("Write serializer is not valid.")
            print("Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MarketplaceView(APIView):
    def get(self, request):
        listings = Marketplace.objects.all().select_related('card')
        serializer = MarketplaceSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        listing = get_object_or_404(Marketplace, pk=request.data.get('id'))
        sender_username = listing.seller
        sender = get_object_or_404(User, username=sender_username)
        receiver_username = request.data.get('buyer')
        receiver = get_object_or_404(User, username=receiver_username)
        senders_cards = [{'card': listing.card, 'quantity': 1}]
        receivers_cards = None
        coin_data = {'sender_coin_transfer': 0, 'receiver_coin_transfer': listing.buy_price}
        transfer_cards_or_coins(sender, receiver, senders_cards, receivers_cards, coin_data)
        listing.buyer = receiver_username
        listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
