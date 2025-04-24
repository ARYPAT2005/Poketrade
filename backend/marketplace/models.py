from django.db import models
from django.contrib.auth import get_user_model

from cards.models import Card

User = get_user_model()

class Marketplace(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    auction_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    buy_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    seller = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return str(self.id)