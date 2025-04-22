from rest_framework import serializers

class SellCardSerializer(serializers.Serializer):
    card_id = serializers.IntegerField(required=True)
    auction_price = serializers.FloatField(required=True, min_value=0)
    buy_now_price = serializers.FloatField(required=True, min_value=0)

    # You can add more validation here if needed

    def validate(self, data):
        if data['auction_price'] < 0 or data['buy_now_price'] < 0:
            raise serializers.ValidationError("Prices cannot be negative.")
        return data