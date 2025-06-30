# urls.py
from django.urls import path, re_path

from api_core.views import *
from api_core.views_users import *
from api_core.views_admin import *
from api_core.views_media import (
     MediaView, ProtectedMediaView
)
urlpatterns = [

    path('', AboutView.as_view(), name='about'),
    path('/', AboutView.as_view(), name='about'),
                         #after header section
    path('about', AboutView.as_view(), name='about'),
    path('logo', LogoViews.as_view(), name='logo'),
    path('about/logo', LogoViews.as_view(), name='about-logo'),
    path('logo/file', LogoImageFile .as_view(), name='logo-file'),
    path('about/form', AboutFrom.as_view(), name='about_form'),
    path('packages', PackagesView.as_view(), name='packages'),
    path('about/cover-image', CoversView.as_view(), name='cover_image'),
    path('about/cover-image/files',
         CoversFileImagesView.as_view(), name='cover_image_files'),
                         #promotion
    path('about/covers', CoversView.as_view(), name='covers'),
    path('why-choose-us', WhyChooseUsListView.as_view(),
         name='why-choose-us-list'),
    path('why-choose-us/image', WhyChooseUsImageView.as_view(),
         name='whychooseus-image'),
    path('blogs', BlogsListView.as_view(), name='blog-list'),
   path('blog/data', BlogDataView.as_view(), name='blog-list'),
   path('common-questions', CommonQuestionsView.as_view(), name='common-questions'),
   path('cq', CommonQuestionsView.as_view(), name='cq'),
                         #auth
    path('profile/image', ProfileImage.as_view(), name='profile_image'),
    path('login', LoginView.as_view(), name='login'),
    path('login_', LoginView_.as_view(), name='login_'),
    path('logout_', LogoutView.as_view(), name='logout_'),
    path('logout/all', LogoutView.as_view(), name='logout-all'),
    path('logout', LogoutView.as_view(), name='logout'),
                         #user/user related
    path('contact/create', ContactUsView.as_view(), name='contact-create'),
    path('rating', RatingView.as_view(), name='rating'),
    path('users/tokens', UserTokensView.as_view(), name='user-token'),
    path('access-token', AccessToken, name='access-token'),
    path('users', UsersView.as_view(), name='user-view'),
    path('user-data', UsersView.as_view(), name='user-data'),
    path('user/register', UserRegister.as_view(), name='user-register'),
    path('user/activate', UserActivate.as_view(), name='user-activate'),
    path('user/get-code', GetVerificationCode.as_view(), name='get-code'),
    path('register', UserRegister.as_view(), name='register'),
    path('profile', ProfileView.as_view(), name='profile'),
    path('accounts/profile', ProfileView.as_view(), name='profile'),
                         #Order
    path('order', OrdersAPIView.as_view(), name='order'),
    path('order/images', UploadOrderImagesAPIView.as_view(), name='order-images'),
    path('promo_code', PromoCodeView.as_view(), name='promo_code'),
    path('site_data', SiteDataView.as_view(), name='site_data'),
    path('site_data/<str:file_name>', SiteDataView.as_view(), name='site_URLP'),
                         #Admin related
#     path('admin/clean-media/', CleanMedia.as_view(), name='clean_media'),
    path('test',    test_page,   name='test_page'),
#     re_path(r"^media/images/(?P<path>.+)$", ProtectedMediaView.as_view(), name="protected_media"),
#     path("media/", MediaView.as_view(), name="media"),
#     path("send_mail", sim_send, name="send_mail"),
    path('schema', DynamicSchemaView.as_view(), name='dynamic-schema'),
    path("api-docs", ApiDocsView.as_view(), name="api-docs"),
    path("register-from", RegisterFromView.as_view(), name="register-from"),
    path("cache-control/", CacheControlView.as_view(), name="cache-control"),
    path('orders/search/', OrderSearchAPIView.as_view(), name='orders-search'),
]
# print(f"len(urlpatterns){len(urlpatterns)}")

