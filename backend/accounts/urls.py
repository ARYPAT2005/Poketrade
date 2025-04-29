from accounts.views import *
from rest_framework.routers import DefaultRouter
from django.urls import path
from . import views

router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')

urlpatterns = [
                  path('login/', LoginView.as_view({'post': 'post'}), name='login'),
                  path('logout/', views.logout, name='logout'),
                  path('user/<str:username>/', views.UserView.as_view(), name='user-detail'),
                  path('wallet/<str:username>/', views.WalletDetail.as_view(), name='wallet-detail'),
                  path('claim/<str:username>/', views.ClaimView.as_view(), name='claim'),
                  # verifies email in reset password:
                  path('check-email/', check_email, name='check-email'),
                  # grabs all 8 security questions
                  path('get-security-questions/', get_security_questions, name='get-security-questions'),
                  # verifies the user's security answers for reset password
                  path('verify-security-answers/', verify_security_answers, name='verify-security-answers'),
                  path('reset-password/', reset_password, name='reset-password'),
                  # checks if the old password is same as the new password that's being reset
                  path('check-old-password/', check_old_password, name='check-old-password'),
                  # grabs the only 2 security questions that the user answered when registering
                  path('user-security-questions/', get_user_security_questions, name='security-questions'),
                  path('deck/<str:username>/', views.DeckView.as_view(), name='deck'),
                  path('user/<str:username>/pay/<int:amount>/', views.PaymentView.as_view(), name='pay'),
                  path('user/<str:username>/earn/<int:amount>/', views.EarnView.as_view(), name='earn'),
                  path('fees/<str:fee_id>/', views.FeeView.as_view(), name='fee-detail'),
                  path('users/list/<str:username>/', get_users, name='user-list'),

              ] + router.urls
from django.conf import settings

if settings.DEBUG:
    print("Accounts URLs:", router.urls)
