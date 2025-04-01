from django.contrib import admin
from .models import Card, Pack, PackItem


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('name', 'supertype', 'hp', 'number', 'rarity', 'artist')
    search_fields = ('name', 'id', 'set_data__name')
    list_filter = ('supertype', 'rarity')
    readonly_fields = ('id', 'image_url', 'tcgplayer_url', 'updated_at')
    fieldsets = (
        (None, {'fields': ('id', 'name', 'supertype')}),
        ('Details', {'fields': (
            'hp',
            'types',
            'subtypes',
            'evolves_from',
            'abilities',
            'attacks',
            'weaknesses',
            'resistances',
        )}),
        ('Set Information', {'fields': (
            'set_data',
            'number',
            'rarity',
            'legalities',
        )}),
        ('Additional Info', {'fields': (
            'artist',
            'image_url',
            'tcgplayer_url',
            'updated_at',
        )}),
    )

class PackItemInline(admin.TabularInline):
    model = PackItem
    extra = 0

@admin.register(Pack)
class PackAdmin(admin.ModelAdmin):
    inlines = [PackItemInline]
    list_display = ('id', 'name', 'description')
    search_fields = ('id', 'name')

@admin.register(PackItem)
class PackItemAdmin(admin.ModelAdmin):
    list_display = ('pack', 'tier', 'probability')
    list_filter = ('pack',)
    search_fields = ('pack__name', 'filters')