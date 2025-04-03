from django.urls import path
from .views import MessageList, MessageCount, MessageSend, MessageSent, MessageDetail, TradeList, TradeDetail

urlpatterns = [
    path('messages/<str:username>/', MessageList.as_view()),
    path('messages/send/<str:sender>/<str:recipient>/', MessageSend.as_view(), name='message-send'),
    path('messages/<str:username>/sent/', MessageSent.as_view(), name='message-sent'),
    path('messages/<str:username>/count/', MessageCount.as_view(), name='message-count'),
    path('message/<int:pk>/', MessageDetail.as_view()),
    path('trades/<str:username>/', TradeList.as_view()),
    path('trades/<int:pk>/', TradeDetail.as_view()),
]

# Get messages: GET /api/messages/<username>/
# Count unread messages: GET /api/messages/<username>/count/
# Send message: POST /api/messages/<username>/
# {
#   "subject": "Meeting",
#   "body": "Let's meet tomorrow"
# }
# Mark message read: PATCH /api/messages/<pk>/
# Delete message: DELETE /api/messages/<pk>/
# Get trades: GET /api/trades/<username>/
# Create trade: POST /api/trades/<username>/ with payload:
# {
#     "message": "Trade proposal",
#     "items": [
#         {"card": 1, "quantity": 3},
#         {"card": 2, "quantity": 1}
#     ]
# }
# Respond to trade: PATCH /api/trades/<pk>/ with {"accepted": true/false}
# Delete trade: DELETE /api/trades/<pk>/