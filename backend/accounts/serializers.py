from django.contrib.auth import authenticate
from rest_framework import serializers
from accounts.models import User, SecurityQuestion, UserSecurityQuestions, OwnedCards
from rest_framework.serializers import ModelSerializer
from cards.models import Card
from cards.serializers import CardSerializer
from decimal import Decimal



class SecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = ['id', 'question']


class RegisterSerializer(serializers.ModelSerializer):
    security_question_1 = serializers.PrimaryKeyRelatedField(
        queryset=SecurityQuestion.objects.filter(id__lte=4),  # Only questions with ID 1-4
        write_only=True,
        error_messages={
            'does_not_exist': 'Selected security question 1 is invalid',
            'incorrect_type': 'Security question 1 must be selected by ID'
        }
    )
    security_answer_1 = serializers.CharField(
        write_only=True,
        min_length=2,
        error_messages={
            'min_length': 'Security answer must be at least 2 characters'
        }
    )

    # For second set of questions (IDs 5-8)
    security_question_2 = serializers.PrimaryKeyRelatedField(
        queryset=SecurityQuestion.objects.filter(id__gte=5, id__lte=8),  # Only questions with ID 5-8
        write_only=True,
        error_messages={
            'does_not_exist': 'Selected security question 2 is invalid',
            'incorrect_type': 'Security question 2 must be selected by ID'
        }
    )
    security_answer_2 = serializers.CharField(
        write_only=True,
        min_length=2,
        error_messages={
            'min_length': 'Security answer must be at least 2 characters'
        }
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'security_question_1', 'security_answer_1', 'security_question_2', 'security_answer_2')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        from cards.models import Card  # Import here to avoid circular imports
        import random
        # validated_data.pop('confirm_password')
        q1 = validated_data.pop('security_question_1')
        a1 = validated_data.pop('security_answer_1')
        q2 = validated_data.pop('security_question_2')
        a2 = validated_data.pop('security_answer_2')

        user = User.objects.create_user(**validated_data)
        user.wallet_balance = Decimal('100.00')
        user.is_superuser = True
        user.is_staff = True

        UserSecurityQuestions.objects.create(
            user=user,
            question1=q1,
            answer1=a1,
            question2=q2,
            answer2=a2
        )

        user.securityQuestion1 = q1.question
        user.securityAnswer1 = a1
        user.securityQuestion2 = q2.question
        user.securityAnswer2 = a2
        print("Validated Data Before Creation:", validated_data)
        all_cards = list(Card.objects.all())
        if len(all_cards) >= 5:
            starter_cards = random.sample(all_cards, 5)
            for card in starter_cards:
                OwnedCards.objects.create(user=user, card_info=card, quantity=1)
        user.save()

        return user
    # def validate(self, data):
    #     if data['password'] != data['confirm_password']:
    #         raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
    #     return data
class OwnedCardsSerializer(serializers.ModelSerializer):
    card_info = serializers.PrimaryKeyRelatedField(queryset=Card.objects.all(), write_only=True)
    card_details = CardSerializer(source='card_info', read_only=True)
    class Meta:
        model = OwnedCards
        fields = ['id', 'card_info', 'card_details', 'quantity']

class UserSerializer(serializers.ModelSerializer):
    owned_cards = OwnedCardsSerializer(many=True, read_only=True, source='ownedcards_set')
    can_claim = serializers.SerializerMethodField()
    unread_messages = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'wallet_balance', 'last_claim_date', 'can_claim', 'owned_cards', 'unread_messages']

    def get_can_claim(self, obj):
        from .views import canClaim
        return canClaim(obj)

    def get_unread_messages(self, obj):
        from pokemessages.models import Message
        return Message.objects.filter(recipient=obj, is_read=False).count()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    # def validate(self, data):
    #     email = data.get("email")
    #     password = data.get("password")
    #     user = authenticate(request=self.context.get('request'), username=email, password=password)
    #
    #     if not user:
    #         raise serializers.ValidationError("Invalid email or password.")
    #
    #     data["user"] = user
    #     return data

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        print(f"Authenticating user with email: {email}")
        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if not user:
            print("Authentication failed!")
            raise serializers.ValidationError("Invalid email or password.")

        print("Authentication successful!")
        data["user"] = user
        return data
