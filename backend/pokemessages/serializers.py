from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message, Trade, TradeCardDetail
from cards.models import Card
from cards.serializers import CardSerializer

User = get_user_model()

class TradeCardDetailSerializer(serializers.ModelSerializer):
    card_info = CardSerializer(source='card', read_only=True) # make false if we make it so users can create cards?
    card = serializers.PrimaryKeyRelatedField(queryset=Card.objects.all(), write_only=True)

    class Meta:
        model = TradeCardDetail
        fields = ['id', 'card', 'card_info', 'quantity', 'direction']

class TradeSerializer(serializers.ModelSerializer):
    card_details = TradeCardDetailSerializer(many=True)
    sender_username = serializers.CharField(source='sender.username')
    recipient_username = serializers.CharField(source='recipient.username')

    class Meta:
        model = Trade
        fields = ['id', 'sender_username', 'recipient_username', 'message', 'timestamp', 'status', 'card_details']
        read_only_fields = ['id', 'timestamp']

    def create(self, validated_data):
        card_details_data = validated_data.pop('card_details')
        trade = Trade.objects.create(**validated_data)
        for card_detail_data in card_details_data:
            TradeCardDetail.objects.create(trade=trade, **card_detail_data)
        return trade

    def validate_card_details(self, value):
        if not value:
            raise serializers.ValidationError("At least one card must be involved in the trade.")
        return value

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    recipient = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = '__all__'