from django.contrib import admin
from .models import Message, Trade, TradeCardDetail, User


class TradeCardDetailInline(admin.TabularInline):
    model = TradeCardDetail
    extra = 0
    autocomplete_fields = ['card']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'sender', 'recipient', 'timestamp')
    list_filter = ('timestamp', 'sender', 'recipient')
    search_fields = ('subject', 'body', 'sender__username', 'recipient__username')
    readonly_fields = ('timestamp',)

@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    inlines = [TradeCardDetailInline]
    list_display = ('id', 'sender', 'recipient', 'status', 'timestamp')
    list_filter = ('status', 'timestamp', 'sender', 'recipient')
    search_fields = ('sender__username', 'recipient__username', 'message')
    list_editable = ('status',)
    readonly_fields = ('timestamp',)