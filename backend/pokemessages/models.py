from django.db import models
from django.contrib.auth import get_user_model
from cards.models import Card

User = get_user_model()

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.subject} - {self.sender} to {self.recipient}"

class Trade(models.Model):
    sender = models.ForeignKey(User, related_name='sent_trades', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_trades', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    accepted = models.BooleanField(null=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Trade {self.id} - {self.sender} to {self.recipient}"

class TradeItem(models.Model):
    trade = models.ForeignKey(Trade, related_name='items', on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.card.name} in Trade {self.trade.id}"