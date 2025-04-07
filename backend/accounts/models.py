from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, AbstractUser
from django.db import models
from typing import Optional, TypeVar


# Create a custom manager to handle user creation logic


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
    answer1= models.CharField(max_length=255)
    question2 = models.ForeignKey(SecurityQuestion, related_name='question2', on_delete=models.CASCADE)
    answer2 = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.username} Security Question'

    class Meta:
        verbose_name = "User Security Question"
        verbose_name_plural = "User Security Questions"
