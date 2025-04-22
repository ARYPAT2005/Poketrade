from django.db import models
from django.contrib.auth.models import User

class Card(models.Model):
    name = models.CharField(max_length=255)
    image_url = models.URLField()
    is_for_sale = models.BooleanField(default=False)
    auction_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    buy_now_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    listed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='listed_cards')
    # ... other fields ...

    def __str__(self):
        return self.name