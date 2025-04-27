from django.contrib import admin
from marketplace.models import Marketplace

@admin.register(Marketplace)
class MarketplaceAdmin(admin.ModelAdmin):
    autocomplete_fields = ['card']
    list_display = ('id', 'card', 'seller', 'buyer', 'buy_price')
    list_filter = ('seller',)