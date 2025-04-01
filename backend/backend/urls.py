from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import *

from cards.views import CardViewSet

router = DefaultRouter()
router.register(r'cards', CardViewSet)
# router.register(r'register', RegisterView, basename='register')
# router.register(r'login', LoginView, basename='login')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
]