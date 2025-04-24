from django.urls import path
from .views import MarketplaceView, SellItemView

urlpatterns = [
    path('marketplace/', MarketplaceView.as_view(), name='marketplace'),
    path('sell/', SellItemView.as_view(), name='sell'),
]

