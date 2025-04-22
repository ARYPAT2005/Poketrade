from django.urls import path
from .views import MarketplaceView, SellItemView

urlpatterns = [
    path('api/marketplace/', MarketplaceView.as_view(), name='marketplace'),
    path('api/sell/', SellItemView.as_view(), name='sell'),
]
