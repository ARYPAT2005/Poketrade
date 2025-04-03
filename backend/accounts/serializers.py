from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from accounts.models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        # validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user
    # def validate(self, data):
    #     if data['password'] != data['confirm_password']:
    #         raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
    #     return data

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        data["user"] = user
        return data

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