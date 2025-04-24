from django.contrib import admin
from django.urls import path, include, reverse_lazy
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from accounts.views import *

from cards.views import CardViewSet
from cards.views import PackView, PackListView
from cards import views as card_views

router = DefaultRouter()
router.register(r'cards', CardViewSet)
urlpatterns = [
    path('', RedirectView.as_view(url=reverse_lazy('admin:index')), name='site_root'),

    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
    path('api/', include(router.urls)),
    path('api/packs/<str:pack_id>/', PackView.as_view(), name='pack'),
    path('api/packs/', PackListView.as_view(), name='pack-list'),
    path('api/packs/<slug:pack_id>/', PackView.as_view(), name='pack-detail'),
    path('search/', card_views.search, name='search'),
    path('api/', include('pokemessages.urls')),
    path('api/', include('marketplace.urls'))
]