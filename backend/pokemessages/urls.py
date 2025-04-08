from django.urls import path
from django.core.exceptions import PermissionDenied
from .views import MessageList, MessageCount, MessageSend, MessageSent, MessageDetail, TradeList, TradeDetail
urlpatterns = [
    path('messages/<str:username>/', MessageList.as_view()),
    path('messages/send/<str:sender>/<str:recipient>/', MessageSend.as_view(), name='message-send'),
    path('messages/<str:username>/sent/', MessageSent.as_view(), name='message-sent'),
    path('messages/<str:username>/count/', MessageCount.as_view(), name='message-count'),
    path('message/<int:pk>/', MessageDetail.as_view()),
    path('trades/received/<str:username>/', TradeList.as_view(), name='trade-list-received'),
    path('trades/', TradeList.as_view(), name='trade-create'),
    path('trades/<int:pk>/', TradeDetail.as_view(), name='trade-detail'),
]