from rest_framework import serializers
from cards.models import Card, Pack, PackItem


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'


class PackItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackItem
        fields = ['tier', 'probability', 'filters']


class PackSerializer(serializers.ModelSerializer):
    items = PackItemSerializer(many=True, read_only=True)

    class Meta:
        model = Pack
        fields = ['id', 'name', 'description', 'items']