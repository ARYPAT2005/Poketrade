from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cards.views import CardViewSet
from cards.views import PackView, PackListView

router = DefaultRouter()
router.register(r'cards', CardViewSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/packs/<str:pack_id>/', PackView.as_view(), name='pack'),
    path('api/packs/', PackListView.as_view(), name='pack-list'),
    path('api/packs/<slug:pack_id>/', PackView.as_view(), name='pack-detail'),
]
