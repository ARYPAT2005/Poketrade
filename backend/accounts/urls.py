from accounts.views import *
from rest_framework.routers import DefaultRouter
from django.urls import path
from . import views

router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')

urlpatterns = [
    path('login/', LoginView.as_view({'post': 'post'}), name='login'),
    path('logout/', views.logout, name='logout'),
#     path('check-email/', check_email, name='check-email'),
#     path('security-questions/', get_security_questions, name='get-security-questions'),
#     path('verify-security-answers/', verify_security_answers, name='verify-security-answers'),
#     path('reset-password/', reset_password, name='reset-password'),
#     path('check-old-password/', check_old_password, name='check-old-password'),
#     path('user-security-questions/', get_user_security_questions, name='security-questions'),
# ]   +  router.urls


    path('user/<str:username>/', views.UserView.as_view(), name='user-detail'),
    path('wallet/<str:username>/', views.WalletDetail.as_view(), name='wallet-detail'),
    path('claim/<str:username>/', views.ClaimView.as_view(), name='claim'),
    path('check-email/', check_email, name='check-email'),
    path('get-security-questions/', get_security_questions, name='get-security-questions'),
    path('verify-security-answers/', verify_security_answers, name='verify-security-answers'),
    path('reset-password/', reset_password, name='reset-password'),
    path('check-old-password/', check_old_password, name='check-old-password'),
]   +  router.urls
from django.conf import settings

if settings.DEBUG:
    print("Accounts URLs:", router.urls)