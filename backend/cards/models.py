from django.db import models

class Card(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255)
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
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.card.name} ({self.quantity})"