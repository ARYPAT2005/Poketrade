from django.contrib.auth import login
import logging
from rest_framework import status, permissions

logger = logging.getLogger(__name__)
from rest_framework import viewsets
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.serializers import (RegisterSerializer, LoginSerializer)

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
            user.set_password(user.password)
            user.save()
            return Response({"message": "User registered successfully!", "user": serializer.data},
                            status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)  # Debugging
            return Response(serializer.errors, status=400)



# for login web request/response
class LoginView(viewsets.ViewSet):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            return Response({"message": "Login successful", "user": user.username, "email": user.email}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

