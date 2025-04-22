import json
from decimal import Decimal

import requests
from django.contrib.auth import login
import logging

from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse

from rest_framework import status, permissions
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny

from accounts.models import UserSecurityQuestions, SecurityQuestion, OwnedCards
from cards.models import Card

logger = logging.getLogger(__name__)
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.serializers import (RegisterSerializer, LoginSerializer, SecurityQuestionSerializer, UserSerializer,
                                  OwnedCardsSerializer)
from pokemessages.models import Message

from django.utils import timezone

User = get_user_model()


def get_user_security_questions(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'Email parameter is required'}, status=400)

    try:
        user = User.objects.get(email=email)
        user_questions = UserSecurityQuestions.objects.get(user=user)

        return JsonResponse({
            'question1': user_questions.question1.question,
            'question2': user_questions.question2.question
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except UserSecurityQuestions.DoesNotExist:
        return JsonResponse({'error': 'Security questions not set for this user'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get_security_questions(request):
    questions = SecurityQuestion.objects.all().values('id', 'question')
    serializer = SecurityQuestionSerializer(questions, many=True)
    return Response(serializer.data)



@api_view(['POST'])
def check_old_password(request):
    try:
        email = request.data.get('email', '').strip().lower()
        new_password = request.data.get('new_password', '')

        user = User.objects.get(email__iexact=email)
        is_same = check_password(new_password, user.password)

        return Response({
            'is_same': is_same,
            'message': 'Same as old password' if is_same else 'Password is new'
        })

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def reset_password(request):
    try:
        email = request.data.get('email', '').strip().lower()
        new_password = request.data.get('new_password', '')

        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters'}, status=400)

        user = User.objects.get(email__iexact=email)
        if check_password(new_password, user.password):
            return Response({'error': 'New password cannot be the same as old password'}, status=400)
        user.password = make_password(new_password)
        user.save()

        return Response({'success': 'Password updated successfully'})

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def check_email(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip().lower()

        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)

        # Check if user exists
        try:
            user = User.objects.get(email=email)
            return JsonResponse({
                'success': True,
                'message': 'Email verified',
                'user_id': user.id  # Optional
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'Email not found'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# @api_view(['POST'])
# def display_security_questions(request):
#     email = request.data.get('email', '').strip().lower()
#
#     if not email:
#         return Response({'error': 'Email is required'}, status=400)
#
#     try:
#         user = User.objects.get(email__iexact=email)
#         security_questions = UserSecurityQuestions.objects.get(user=user)
#         return Response({
#             'question1': security_questions.question1.question,
#             'question2': security_questions.question2.question
#         })
#     except User.DoesNotExist:
#         return Response({'error': 'No account found with this email'}, status=404)
#     except UserSecurityQuestions.DoesNotExist:
#         return Response({'error': 'Security questions not set up for this user'}, status=404)

    email = request.data.get('email', '').strip().lower()

    if not email:
        return Response({'error': 'Email is required'}, status=400)

    try:
        exists = User.objects.filter(email__iexact=email).exists()
        return Response({
            'exists': exists,
            'email': email  # Optional: return the normalized email
        })
    except Exception as e:
        return Response({
            'error': 'Server error while checking email',
            'details': str(e)
        }, status=500)


# @api_view(['POST'])
# def get_security_questions(request):
#     email = request.data.get('email', '').strip().lower()
#
#     if not email:
#         return Response({'error': 'Email is required'}, status=400)
#
#     try:
#         user = User.objects.get(email__iexact=email)
#         security_questions = UserSecurityQuestions.objects.get(user=user)
#         return Response({
#             'question1': security_questions.question1.question,
#             'question2': security_questions.question2.question
#         })
#     except User.DoesNotExist:
#         return Response({'error': 'No account found with this email'}, status=404)
#     except UserSecurityQuestions.DoesNotExist:
#         return Response({'error': 'Security questions not set up for this user'}, status=404)

@api_view(['POST'])
def verify_security_answers(request):
    try:
        email = request.data.get('email', '').strip().lower()
        answer1 = request.data.get('answer1', '').strip().lower()
        answer2 = request.data.get('answer2', '').strip().lower()

        user = User.objects.get(email__iexact=email)
        security_questions = UserSecurityQuestions.objects.get(user=user)

        print("\n--- DEBUGGING SECURITY ANSWERS ---")
        print(f"User email: {email}")
        print(f"Stored Answer 1: '{security_questions.answer1}'")
        print(f"User Provided Answer 1: '{answer1}'")
        print(f"Stored Answer 2: '{security_questions.answer2}'")
        print(f"User Provided Answer 2: '{answer2}'")

        # Normalize comparison
        stored_answer1 = security_questions.answer1.strip().lower()
        stored_answer2 = security_questions.answer2.strip().lower()
        user_answer1 = answer1.strip().lower()
        user_answer2 = answer2.strip().lower()

        # More debug logs
        print("\n--- AFTER NORMALIZATION ---")
        print(f"Normalized Stored Answer 1: '{stored_answer1}'")
        print(f"Normalized User Answer 1: '{user_answer1}'")
        print(f"Normalized Stored Answer 2: '{stored_answer2}'")
        print(f"Normalized User Answer 2: '{user_answer2}'")

        verified = (stored_answer1 == user_answer1 and
                    stored_answer2 == user_answer2)

        print(f"\nVerification Result: {verified}\n")

        return Response({
            'verified': verified,
            'email': email
        })


    except UserSecurityQuestions.DoesNotExist:
        return Response({'error': 'Security questions not set up for this user'}, status=404)

class RegisterView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        print("Received data:", request.data)  # Debugging
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print("Serializer valid")
            user = serializer.save()
            print("User saved:", user)
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
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully"})
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
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response(serializer.data)

class DeckView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        owned_cards = user.ownedcards_set.all()
        serializer = OwnedCardsSerializer(owned_cards, many=True, context={'request': request})
        return Response(serializer.data)




class PaymentView(APIView):
    def put(self, request, username, amount):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user.wallet_balance is None:
            user.wallet_balance = Decimal('0.00')

        if amount > user.wallet_balance:
            return Response({
                'success': False,
                'message': 'Insufficient funds.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user.wallet_balance -= amount
        user.save()

        return Response({
            'success': True,
            'message': 'Payment successful!',
            'wallet_balance': user.wallet_balance
        }, status=status.HTTP_200_OK)

class EarnView(APIView):
    def put(self, request, username, amount):
        user = User.objects.get(username=username)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user.wallet_balance is None:
            user.wallet_balance = Decimal('0.00')

        user.wallet_balance += amount
        user.save()

        return Response({
            'success': True,
            'message': 'Earned successfully!',
            'wallet_balance': user.wallet_balance
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

        if user.wallet_balance is None:
            user.wallet_balance = Decimal('0.00')

        user.wallet_balance += Decimal('100.00')
        user.last_claim_date = now
        user.save()

        return Response({
            'username': user.username,
            'success': True,
            'message': 'Claim successful! Your wallet has been credited.',
            'wallet_balance': user.wallet_balance,
            'amount_claimed': 100.00,
            'last_claim_date': user.last_claim_date
        }, status=status.HTTP_200_OK)

