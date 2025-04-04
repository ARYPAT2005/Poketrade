from django.contrib.auth import login
import logging
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.serializers import (RegisterSerializer, LoginSerializer)

from django.utils import timezone

User = get_user_model()
class RegisterView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        print("Received data:", request.data)  # Debugging
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.set_password(request.data['password'])
            user.save()
            return Response({"message": "User registered successfully!", "user": serializer.data},
                            status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)  # Debugging
            return Response(serializer.errors, status=400)



# for login web request/response
class LoginView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            return Response({"message": "Login successful", "user": user.username, "email": user.email}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def logout(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'})

def canClaim(user):
    now = timezone.now()
    last_claim_date = user.last_claim_date
    if last_claim_date and (now - last_claim_date).total_seconds() < 86400:
        return False  # Cannot claim yet
    return True  # Can claim

class UserView(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response({
            'username': user.username,
            'email': user.email,
            'wallet_balance': user.wallet_balance,
            'last_claim_date': user.last_claim_date,
            'can_claim': canClaim(user),
        }, status=status.HTTP_200_OK)

class WalletDetail(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        wallet_balance = user.wallet_balance  # Assuming you have a wallet_balance field in your User model
        return Response({
            'username': user.username,
            'wallet_balance': wallet_balance
                         }, status=status.HTTP_200_OK)

class ClaimView(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        last_claim_date = user.last_claim_date

        return Response({
            'username': user.username,
            'last_claim_date': last_claim_date,
            'can_claim': canClaim(user),
        }, status=status.HTTP_200_OK)

    # if last_claim_date is more than 24 hours ago, allow claim
    def post(self, request, username):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        now = timezone.now()
        last_claim_date = user.last_claim_date

        if not canClaim(user):
            return Response({
                'username': user.username,
                'success': False,
                'message': 'You can only claim once every 24 hours.',
                'last_claim_date': last_claim_date
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's wallet balance and last claim date
        user.wallet_balance += 100
        user.last_claim_date = now
        user.save()

        return Response({
            'username': user.username,
            'success': True,
            'message': 'Claim successful! Your wallet has been credited.',
            'wallet_balance': user.wallet_balance,
            'amount_claimed': 100,
            'last_claim_date': user.last_claim_date
        }, status=status.HTTP_200_OK)

