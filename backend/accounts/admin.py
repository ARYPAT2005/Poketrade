from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, SecurityQuestion, UserSecurityQuestions

admin.site.register(User, UserAdmin)
admin.site.register(SecurityQuestion)
admin.site.register(UserSecurityQuestions)
