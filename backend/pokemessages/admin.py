from django.contrib import admin
from .models import Message, Trade, TradeItem

class TradeItemInline(admin.TabularInline):
    model = TradeItem
    extra = 1

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ( 'id', 'subject', 'sender', 'recipient', 'timestamp', 'is_read')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('subject', 'body')

@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'timestamp', 'is_read', 'accepted')
    list_filter = ('accepted', 'is_read')
    inlines = [TradeItemInline]

@admin.register(TradeItem)
class TradeItemAdmin(admin.ModelAdmin):
    list_display = ('trade', 'card', 'quantity')
    list_filter = ('card',)