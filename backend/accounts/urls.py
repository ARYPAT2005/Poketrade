from accounts.views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')
router.register(r'login', LoginView, basename='login')

urlpatterns = router.urls