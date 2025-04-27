from django.contrib import admin

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, SecurityQuestion, UserSecurityQuestions, OwnedCards, Fee

admin.site.register(SecurityQuestion)
admin.site.register(UserSecurityQuestions)


# questions = [
#     "What is your mother's maiden name?",
#     "What was the name of your first pet?",
#     "What city were you born in?",
#     "What is your favorite book?",
#     "What is your favorite food?",
#     "What was the name of your elementary school?",
#     "What was your dream job as a child?",
#     "What is your favorite sports team?",
# ]
#
# for question_text in questions:
#     SecurityQuestion.objects.create(question=question_text)


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

class OwnedCardsInline(admin.TabularInline):
    model = OwnedCards
    extra = 0
    autocomplete_fields = ['card_info']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    inlines = [OwnedCardsInline]
    list_display = ('username', 'email', 'wallet_balance')
    list_filter = ('username', 'email', 'wallet_balance')
    list_editable = ('wallet_balance',)
    search_fields = ('username', 'email')


admin.site.register(Fee)
