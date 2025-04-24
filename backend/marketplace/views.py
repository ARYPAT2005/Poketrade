from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

from marketplace.serializer import MarketplaceWriteSerializer, MarketplaceSerializer
from marketplace.models import Marketplace

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
