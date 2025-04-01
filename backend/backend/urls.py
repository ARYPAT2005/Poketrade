from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cards.views import CardViewSet
from cards import views as card_views


router = DefaultRouter()
router.register(r'cards', CardViewSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('search/', card_views.search, name='search'),
]
