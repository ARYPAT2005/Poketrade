from accounts.views import *
from rest_framework.routers import DefaultRouter
from django.urls import path
from . import views

router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')

urlpatterns = [
    path('login/', LoginView.as_view({'post': 'post'}), name='login'),
    path('logout/', views.logout, name='logout'),
    path('check-email/', check_email, name='check-email'),
    path('get-security-questions/', get_security_questions, name='get-security-questions'),
    path('verify-security-answers/', verify_security_answers, name='verify-security-answers'),
    path('reset-password/', reset_password, name='reset-password'),
    path('check-old-password/', check_old_password, name='check-old-password'),
]   +  router.urls

from django.conf import settings

if settings.DEBUG:
    print("Accounts URLs:", router.urls)