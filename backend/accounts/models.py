from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Create a custom manager to handle user creation logic
from django.contrib.auth.models import AbstractUser, BaseUserManager

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
    wallet_balance = models.IntegerField(default=0)
    # last_claim_date = models.DateField(null=True, blank=True)
    last_claim_date = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

