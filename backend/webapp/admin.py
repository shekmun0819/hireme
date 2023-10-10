from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
#from django.contrib.auth.admin import UserAdmin
#from django.forms import TextInput, Textarea
from .models import Profile, ChatRoom, ChatMessage, Notification, Freelancer, Booking, Service

# class UserAdminConfig(UserAdmin):
#     model = User
#     search_fields = ('email', 'name', 'contact', 'is_freelancer', 'created_date')
#     list_filter = ('is_freelancer', 'is_active', 'is_staff')
#     ordering = ('-created_date',)
#     list_display = ('email', 'name', 'contact', 'is_freelancer', 'created_date', 'updated_date')
#     fieldsets = (
#         (None, {'fields': ('email', 'name', 'contact', 'created_date', 'updated_date')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active', 'is_freelancer')})
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'name', 'contact','password1', 'password2', 'is_active', 'is_freelancer', 'is_staff')}
#          ),
#     )

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

#admin.site.register(User, UserAdminConfig)
admin.site.register(Profile)
admin.site.register(ChatRoom)
admin.site.register(ChatMessage)
admin.site.register(Notification)
admin.site.register(Freelancer)
admin.site.register(Booking)
admin.site.register(Service)