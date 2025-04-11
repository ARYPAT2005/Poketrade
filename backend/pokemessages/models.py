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
    cards = models.ManyToManyField(Card, through='TradeCardDetail', related_name='trades_involved_in')
    message = models.CharField(blank=True, max_length=150)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.sender.username} to {self.recipient.username} ({self.status})"

class TradeCardDetail(models.Model):
    DIRECTION_CHOICES = [
        ('offer', 'Sender Offers'),
        ('request', 'Sender Requests'),
    ]

    trade = models.ForeignKey(Trade, on_delete=models.CASCADE, related_name='card_details')
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='trade_details')
    quantity = models.PositiveIntegerField(default=1)
    direction = models.CharField(max_length=10, choices=DIRECTION_CHOICES)

    def __str__(self):
        return f"{self.get_direction_display()} {self.quantity}x {self.card.name}"