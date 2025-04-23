from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from accounts.utils import transfer_cards_or_coins
from cards.serializers import CardSerializer
from .models import Message, Trade, TradeCardDetail
from .serializers import MessageSerializer, TradeSerializer
import requests

from django.utils import timezone

User = get_user_model()

# Use request.user to get the current user if we need to authenticate. No authentication ri ght now.

class MessageList(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        messages = Message.objects.filter(recipient=user).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class MessageSend(APIView):
    def post(self, request, sender, recipient):
        try:
            sender_user = User.objects.get(username=sender)
            recipient_user = User.objects.get(username=recipient)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save(
                sender=sender_user,
                recipient=recipient_user,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessageCount(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        unread_count = Message.objects.filter(recipient=user, is_read=False).count()
        return Response({'unread_count': unread_count}, status=status.HTTP_200_OK)

class MessageSent(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        messages = Message.objects.filter(sender=user).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
class MessageDetail(APIView):
    def get(self, request, pk):
        try:
            message = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = MessageSerializer(message)
        return Response(serializer.data)
    def patch(self, request, pk):
        print("patch called for message with id:", pk)
        # print all columns of the Message model for debugging
        messages = Message._meta.get_fields()
        print("messages", messages)
        message = Message.objects.get(pk=pk)
        if not message:
            print( "Message not found")
            return Response(status=status.HTTP_404_NOT_FOUND)
        message.is_read = True
        message.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk):
        message = Message.objects.get(pk=pk)
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TradeList(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        received_trades = Trade.objects.filter(recipient=user).order_by('-timestamp')
        sent_trades = Trade.objects.filter(sender=user).order_by('-timestamp')
        trades = received_trades | sent_trades
        serializer = TradeSerializer(trades, many=True)
        return Response(serializer.data)



    def post(self, request):
        sender_username = request.data.get('sender_username')
        if not sender_username:
            return Response(
                {"detail": "sender_username is required in the request body because authentication is disabled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            sender_user = User.objects.get(username=sender_username)
        except User.DoesNotExist:
            return Response(
                {"detail": f"User with username '{sender_username}' not found."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer_data = request.data.copy()
        serializer_data.get('sender_username')
        print(serializer_data)
        serializer = TradeSerializer(data=serializer_data, context={' request': request})

        if serializer.is_valid():
            trade = serializer.save(sender=sender_user, status='pending')
            print('trade saved, returning response')
            return Response(TradeSerializer(trade, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else:
            print('serializing failed', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TradeDetail(APIView):
    def get(self, request, pk):
        trade = get_object_or_404(Trade.objects, pk=pk)
        serializer = TradeSerializer(trade, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, pk):
        trade = get_object_or_404(Trade, pk=pk)
        if trade.status != 'pending':
             return Response({"detail": f"Trade is already {trade.status} and cannot be changed."}, status=status.HTTP_400_BAD_REQUEST)

        accepted_status = request.data.get('status')

        if accepted_status != "accepted" and accepted_status != "rejected" and accepted_status != "cancelled":
            data = "invalid input. Provided status: " + accepted_status
            return Response({"detail": data }, status=status.HTTP_400_BAD_REQUEST)

        trade.status = accepted_status
        trade.save(update_fields=['status'])

        if trade.status == 'accepted':
            sender = trade.sender
            receiver = trade.recipient
            card_details = trade.card_details.all()
            senders_cards = []
            for card_detail in card_details.filter(direction='offer'):
                senders_cards.append({'card': card_detail.card, 'quantity': card_detail.quantity})
            receivers_cards = []
            for card_detail in card_details.filter(direction='request'):
                receivers_cards.append({'card': card_detail.card, 'quantity': card_detail.quantity})
            coin_data = {'sender_coin_transfer': trade.sender_coins, 'receiver_coin_transfer': trade.recipient_coins}
            transfer_response = transfer_cards_or_coins(sender, receiver, senders_cards, receivers_cards, coin_data)
            if not transfer_response[0]:
                trade.status = 'pending'
                trade.save(update_fields=['status'])
                return Response({"detail": f"Trade {trade.id} failed. {transfer_response[1]}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            trade.delete()
            return Response({"detail": f"Trade {trade.id} deleted successfully."}, status=status.HTTP_200_OK)

        return Response(TradeSerializer(trade, context={'request': request}).data, status=status.HTTP_200_OK)


    def delete(self, request, pk):
        trade = get_object_or_404(Trade, pk=pk)
        trade.delete()
        return Response({"detail": f"Trade {trade.id} deleted successfully."}, status=status.HTTP_200_OK)