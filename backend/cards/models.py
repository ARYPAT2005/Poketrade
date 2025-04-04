from django.db import models
from accounts.models import User

class Card(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255, db_index=True)
    supertype = models.CharField(max_length=255)
    subtypes = models.JSONField()
    hp = models.CharField(max_length=10, null=True, blank=True)
    types = models.JSONField(null=True, blank=True)
    evolves_from = models.CharField(max_length=255, null=True, blank=True)
    abilities = models.JSONField(null=True, blank=True)
    attacks = models.JSONField(null=True, blank=True)
    weaknesses = models.JSONField(null=True, blank=True)
    resistances = models.JSONField(null=True, blank=True)
    set_data = models.JSONField()
    number = models.CharField(max_length=10)
    rarity = models.CharField(max_length=255, null=True, blank=True)
    legalities = models.JSONField(null=True, blank=True)
    artist = models.CharField(max_length=255, null=True, blank=True)
    image_url = models.URLField(max_length=1024)
    tcgplayer_url = models.URLField(max_length=1024, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Owns(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.card.name} ({self.quantity})"

class Pack(models.Model):
    id = models.SlugField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    color = models.CharField(
        max_length=7,
        default='#4A5568',  # Default gray color
        help_text="Hex color code for UI display"
    )
    cost = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class PackItem(models.Model):
    pack = models.ForeignKey(Pack, related_name='items', on_delete=models.CASCADE)
    tier = models.PositiveSmallIntegerField()
    probability = models.FloatField()
    filters = models.JSONField()

    class Meta:
        ordering = ['tier']

    def __str__(self):
        return f"{self.pack} - Tier {self.tier}"