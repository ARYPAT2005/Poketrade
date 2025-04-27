from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message, Trade, TradeCardDetail
from cards.models import Card
from cards.serializers import CardSerializer

User = get_user_model()

class TradeCardDetailSerializer(serializers.ModelSerializer):
    card = serializers.PrimaryKeyRelatedField(queryset=Card.objects.all())
    card_info = CardSerializer(source='card', read_only=True)

    class Meta:
        model = TradeCardDetail
        fields = ['id', 'card', 'card_info', 'quantity', 'direction']
        read_only_fields = ['id', 'card_info']

    def to_internal_value(self, data):
        card_info = data.get('card_info')
        card_id = card_info.get('id')

        if card_id:
            data['card'] = card_id
        elif 'card' not in data:
             pass
        if 'card_info' in data:
            data.pop('card_info')
        try:
            internal_value = super().to_internal_value(data)
        except serializers.ValidationError as e:
             if 'card' in e.detail and not card_id and 'card' not in data:
                 raise serializers.ValidationError({
                     "card_info": f"Could not extract 'id' from 'card_info', and 'card' key was not provided directly. Original error: {e.detail['card']}"
                 }) from e
             raise e

        return internal_value

class TradeSerializer(serializers.ModelSerializer):
    card_details = TradeCardDetailSerializer(many=True)
    sender_username = serializers.CharField(source='sender.username')
    recipient_username = serializers.CharField(source='recipient.username')

    class Meta:
        model = Trade
        fields = ['id', 'sender_username', 'recipient_username', 'timestamp', 'status', 'card_details', 'sender_coins', 'recipient_coins']
        read_only_fields = ['id', 'timestamp']

    def create(self, validated_data):
        card_details_data = validated_data.pop('card_details')
        recipient_username = validated_data.pop('recipient')
        try:
            recipient = User.objects.get(username=recipient_username.get('username'))
        except User.DoesNotExist:
            raise serializers.ValidationError("Recipient does not exist.")
        validated_data['recipient'] = recipient
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