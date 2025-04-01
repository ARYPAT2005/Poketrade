# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import User

admin.site.register(User, UserAdmin)

# Custom UserAdmin to manage the user in the Django admin
# class CustomUserAdmin(UserAdmin):
#     model = User
#     list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
#     search_fields = ('username', 'email')
#     ordering = ('username',)
#     fieldsets = (
#         (None, {'fields': ('username', 'email', 'password')}),
#         ('Personal info', {'fields': ('first_name', 'last_name')}),
#         ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
#         ('Important dates', {'fields': ('last_login', 'date_joined')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('username', 'email', 'password1', 'password2')}
#         ),
#     )
#
# # Register the custom User model in Django admin
# admin.site.register(User, CustomUserAdmin)
