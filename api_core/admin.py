# admin.py

from .models import ContactUs
from django.contrib import admin
from alsalam_app import settings
from django.utils.safestring import mark_safe
from .forms import (
    WhyChooseUsAdminForm, BlogAdminForm,
    # OrdersAdminForm
)
from api_core.models import (
    About, WhyChooseUs,  Packages, AboutCoverImage,
    Users, Profile, Blogs, Rating, Orders, OrderImage, PromoCode,
    CommonQuestions
)
# Register your models here.
# admin.site.register(About)
# admin.site.register(Packages)
admin.site.register(CommonQuestions)



##################################################################################
# api_core/admin.py
from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required

from api_core import utils
from api_core.models import Orders, Profile   # ← your real model names

from django.contrib.sessions.models import Session
############ Header ######################

admin.site.site_header  = "El-salam Administration"   # Top-left header text
admin.site.site_title   = "El-salam Admin Portal"     # Text that shows in your browser’s title bar
admin.site.index_title  = "Welcome to El-salam Admin" # Title on the main index page

########################################
# admin.site.register(Session)
@staff_member_required
def clean_media_view(request):
    # list of (ModelClass, subdir_under_MEDIA_ROOT)
    to_clean = [
        (AboutCoverImage, 'about'),
        (Blogs, 'blogs'),
        (About, 'logos'),
        (Profile, 'profile'),
        (WhyChooseUs, 'why_us'),
        (OrderImage,  'orders'),
    ]

    reports = []
    for model_class, subdir in to_clean:
        report = utils.clean_media(model_class, subdir)
        reports.append(report)

    return render(request, "admin/clean_media.html", {"reports": reports})

# — now hook it into the admin’s URLs —


def _get_admin_urls(old_urls):
    def get_urls():
        custom = [
            path("clean-media/", admin.site.admin_view(clean_media_view),
                 name="clean_media"),
        ]
        return custom + old_urls()
    return get_urls


admin.site.get_urls = _get_admin_urls(admin.site.get_urls)

##################################################################################


class AboutCoverImageInline(admin.TabularInline):
    model = AboutCoverImage
    extra = 1  # Show 1 empty form by default
    fields = ('image', 'caption')  # Display only relevant fields


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    inlines = [AboutCoverImageInline]

    def delete_model(self, request, obj):
        for cover in obj.cover_images.all():
            cover.delete()  # call delete to remove image
        obj.delete()

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            for cover in obj.cover_images.all():
                cover.delete()
            obj.delete()


@admin.register(Packages)
class PackagesAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')
    list_filter = ('disassembly_and_assembly',
                   'furniture_wrapping', 'packing_the_belongings')
    search_fields = ('mnames', )


@admin.register(WhyChooseUs)
class WhyChooseUsAdmin(admin.ModelAdmin):
    form = WhyChooseUsAdminForm
    list_display = ('label', 'lang', 'order', '__str__')
    list_filter = ('lang',)
    ordering = ('lang', 'order')

    def delete_model(self, request, obj):
        obj.delete()

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            obj.delete()


@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):

    # Fields to display in the user list view in admin panel
    list_display = ('username', 'email', 'first_name',
                    'last_name', 'is_staff', 'is_active')

    # Fields you can filter users by in the sidebar
    list_filter = ('is_staff', 'is_superuser', 'is_active')

    # Fields used in search box
    search_fields = ('username', 'email', 'first_name', 'last_name')

    # Fields to order the list by
    ordering = ('username',)

    # The fieldsets control the layout of the user edit form in the admin
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('phone_number',
         'whatsapp_number', 'city', 'postal_code', 'address','email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff',
         'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fields that appear when creating a new user in admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

    # Password validation fields to make create user form work with hashed passwords
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['password'].help_text = (
            "Raw passwords are not stored, so you cannot see the password."
        )
        return form
    def delete_queryset(self, request, queryset):
        """
        Override the bulk‐delete action so that each
        Users.delete() is called (not queryset.delete()).
        """
        for user in queryset:
            user.delete()

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'image')
    search_fields = ('first_name', 'last_name')

    def delete_model(self, request, obj):
        obj.delete()  # This triggers the custom delete method in the model

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            obj.delete()


@admin.register(Blogs)
class BlogsAdmin(admin.ModelAdmin):
    form = BlogAdminForm
    list_display = ('id', 'paragraph', 'language', 'created_at')
    search_fields = ('paragraph',)

    def has_add_permission(self, request):
        return request.user.is_superuser or request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_view_permission(self, request, obj=None):
        return True  # Let all users view, restrict others


@admin.register(ContactUs)
class ContactUsAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email', 'enquiry', 'created_at')
    search_fields = ('name', 'email', 'phone_number')
    readonly_fields = ('name', 'phone_number', 'email',
                       'enquiry', 'message', 'created_at', 'updated_at')

    def has_add_permission(self, request):
        return False  # Prevent adding manually from admin

    def has_change_permission(self, request, obj=None):
        return False  # Contacts are immutable

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff
# admin.py


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = (
        "user_link",
        "stars_display",
        "short_comment",
        "created_at",
    )
    list_filter = ("stars", "created_at")
    search_fields = (
        "user__username",
        "comment",
        "user__email",
    )
    # Replace dropdown with a lookup widget
    raw_id_fields = ("user",)
    # How many rows per page
    list_per_page = 50

    def user_link(self, obj):
        return obj.user.username
    user_link.short_description = "User"

    def stars_display(self, obj):
        return "★" * obj.stars + "☆" * (5 - obj.stars)
    stars_display.short_description = "Rating"

    def short_comment(self, obj):
        if not obj.comment:
            return "-"
        return obj.comment if len(obj.comment) <= 50 else obj.comment[:47] + "…"
    short_comment.short_description = "Comment"


class OrderImageInline(admin.TabularInline):
    model = OrderImage
    extra = 1  # show one extra blank form
    readonly_fields = ('preview',)
    fields = ('image', 'preview',)

    def preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="max-height: 100px; margin:2px;" />')
        return ''
    preview.short_description = 'Current Image'


# class OrderImageInline(admin.TabularInline):
#     model = OrderImage
#     extra = 1  # show one extra blank form
#     readonly_fields = ('preview',)
#     fields = ('image', 'preview',)

#     def preview(self, obj):
#         if obj.image:
#             return mark_safe(f'<img src="{obj.image.url}" style="max-height: 100px; margin:2px;" />')
#         return ''
#     preview.short_description = 'Current Image'


class OrderImageInline(admin.TabularInline):
    model = OrderImage
    extra = 0               # don’t show blank rows by default
    fields = ('image_thumb', 'image',)  # show thumbnail + file chooser
    readonly_fields = ('image_thumb',)
    can_delete = True       # show the “Delete” checkbox

    def image_thumb(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" style="max-height:50px;"/>'
            )
        return ""
    image_thumb.short_description = "Preview"

    # When the inline’s “Delete” box is checked, Django will call obj.delete()
    # so implement delete behavior on the model itself (or here) to remove the file.


from django.contrib import admin
from rangefilter.filters import (
    DateRangeFilter,         # just dates
    DateTimeRangeFilter,     # dates + times
)
from .models import Orders, OrderImage

@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = (
        'order_state','id','user','package',
        'transportation_date','created_at',
    )
    raw_id_fields = ('user', 'package', 'promo_code')  # if Orders has a FK to PromoCode

    # 1) Date‐range pickers for both created_at and transportation_date
    list_filter = (
        ('created_at',       DateRangeFilter),
        ('transportation_date', DateRangeFilter),
        'order_state',       # dropdown of your choice‐field states
        'package',           # dropdown of Package instances
        'promo_code',        # dropdown of PromoCode instances
    )

    # 2) Text search boxes for user name, phone, and ID
    search_fields = (
        'id',
        'user__username',
        'phone_number',
    )
    inlines = [ OrderImageInline ]
@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'value', 'is_percentage',
                    'active', 'expiry_date')
    list_filter = ('is_percentage', 'active')
    search_fields = ('code',)
