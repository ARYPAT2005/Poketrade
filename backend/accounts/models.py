from decimal import Decimal

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, AbstractUser
from django.core.validators import MinValueValidator
from django.db import models
from typing import Optional, TypeVar
from cards.models import Card

# Create a custom manager to handle user creation logic


from typing import Optional, Type, TypeVar

UserType = TypeVar('UserType', bound='User')


class UserManager(BaseUserManager):
    def create_user(self, email: str, username: str, password: Optional[str] = None, **extra_fields) -> UserType:
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    cards = models.ManyToManyField(Card, through='OwnedCards', related_name='owned_cards')

    wallet_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        null=False,
        blank=False,
        # Add these to ensure proper type handling
        validators=[MinValueValidator(Decimal('0.00'))]
    )

    last_claim_date = models.DateTimeField(null=True, blank=True)
    securityQuestion1 = models.CharField(max_length=255, null=True, blank=True)
    securityAnswer1 = models.CharField(max_length=255, null=True, blank=True)
    securityQuestion2 = models.CharField(max_length=255, null=True, blank=True)
    securityAnswer2 = models.CharField(max_length=255, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class SecurityQuestion(models.Model):
    question = models.CharField(max_length=255)

    def __str__(self):
        return self.question

    class Meta:
        verbose_name = "Security Question"
        verbose_name_plural = "Security Questions"


class UserSecurityQuestions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    question1 = models.ForeignKey(SecurityQuestion, related_name='question1', on_delete=models.CASCADE)
    answer1 = models.CharField(max_length=255)
    question2 = models.ForeignKey(SecurityQuestion, related_name='question2', on_delete=models.CASCADE)
    answer2 = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.username} Security Question'

    class Meta:
        verbose_name = "User Security Question"
        verbose_name_plural = "User Security Questions"


class OwnedCards(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ownedcards_set')
    card_info = models.ForeignKey(Card, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.card_info.name} ({self.quantity})"


class Fee(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    name = models.CharField(max_length=255)
    amount = models.IntegerField(default=0)
    description = models.TextField()
