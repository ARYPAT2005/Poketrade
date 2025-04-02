from rest_framework import serializers
from .models import Message, Trade, TradeItem
from cards.serializers import CardSerializer


class TradeItemSerializer(serializers.ModelSerializer):
    card = CardSerializer()

    class Meta:
        model = TradeItem
        fields = ['card', 'quantity']


class TradeSerializer(serializers.ModelSerializer):
    items = TradeItemSerializer(many=True)
    sender = serializers.StringRelatedField()
    recipient = serializers.StringRelatedField()

    class Meta:
        model = Trade
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    recipient = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = '__all__'