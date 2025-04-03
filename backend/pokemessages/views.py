from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Message, Trade
from .serializers import MessageSerializer, TradeSerializer

User = get_user_model()

# Use request.user to get the current user if we need to authenticate

class MessageList(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        messages = Message.objects.filter(recipient=user).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, username):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user, recipient=User.objects.get(username=username))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MessageDetail(APIView):
    def patch(self, request, pk):
        message = Message.objects.get(pk=pk)
        message.is_read = True
        message.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk):
        message = Message.objects.get(pk=pk)
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TradeList(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        trades = Trade.objects.filter(recipient=user).order_by('-timestamp')
        serializer = TradeSerializer(trades, many=True)
        return Response(serializer.data)

    def post(self, request, username):
        data = request.data.copy()
        data['sender'] = request.user.id
        data['recipient'] = User.objects.get(username=username).id

        serializer = TradeSerializer(data=data)
        if serializer.is_valid():
            trade = serializer.save()
            # Handle trade items
            for item in data.get('items', []):
                TradeItem.objects.create(
                    trade=trade,
                    card_id=item['card'],
                    quantity=item['quantity']
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TradeDetail(APIView):
    def patch(self, request, pk):
        trade = Trade.objects.get(pk=pk)
        trade.is_read = True
        if 'accepted' in request.data:
            trade.accepted = request.data['accepted']
        trade.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk):
        trade = Trade.objects.get(pk=pk)
        trade.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)