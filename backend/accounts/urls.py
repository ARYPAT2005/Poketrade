from accounts.views import RegisterView, LoginView
from rest_framework.routers import DefaultRouter
from django.urls import path
from . import views

router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')
# router.register(r'login', LoginView, basename='login')


urlpatterns = [
    path('login/', LoginView.as_view({'post': 'post'}), name='login'),
    path('logout/', views.logout, name='logout'),
] +     router.urls
from django.conf import settings

if settings.DEBUG:
    print("Accounts URLs:", router.urls)