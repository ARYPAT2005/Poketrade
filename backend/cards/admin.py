from django.contrib import admin
from .models import Card, Pack, PackItem

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('name', 'supertype', 'rarity', 'artist', 'updated_at')
    search_fields = ('name', 'supertype', 'rarity', 'artist')
    list_filter = ('supertype', 'rarity', 'types')

@admin.register(Pack)
class PackAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'color')
    search_fields = ('name',)
    list_filter = ('cost',)

@admin.register(PackItem)
class PackItemAdmin(admin.ModelAdmin):
    list_display = ('pack', 'tier', 'probability')
    search_fields = ('pack__name',)
    list_filter = ('tier',)