from rest_framework import serializers
from cards.serializers import CardSerializer  # Assuming this exists and works
from .models import Marketplace
from django.contrib.auth import get_user_model

User = get_user_model()


class MarketplaceSerializer(serializers.ModelSerializer):
    card = CardSerializer(read_only=True)
    seller = serializers.CharField(read_only=True)  # Remove write_only=True

    class Meta:
        model = Marketplace
        fields = ['id', 'card', 'buy_price', 'auction_price', 'seller']
        read_only_fields = ['id']




class MarketplaceWriteSerializer(serializers.ModelSerializer):
    seller = serializers.CharField(write_only=True)

    class Meta:
        model = Marketplace
        fields = ['card', 'buy_price', 'seller']

    def validate(self, data):
        if data.get('buy_price') is None:
            raise serializers.ValidationError("A Buy Now price must be provided.")
        return data
