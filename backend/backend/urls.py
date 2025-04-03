from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import *

from cards.views import CardViewSet

router = DefaultRouter()
router.register(r'cards', CardViewSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
]