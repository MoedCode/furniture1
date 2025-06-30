# views_H.py
import uuid
import mimetypes
import os
import re
import logging
from datetime import datetime
import markdown
from api_core.views_H import *
from django.shortcuts import get_object_or_404, render

from api_core.models import *
from api_core.models_users import *
from .serializers import (
    AboutSerializer, AboutCoverImageSerializer, PackagesSerializer,
    UsersSerializer, ProfileSerializer, WhyChooseUsSerializer, BlogSerializer,
    ContactUsSerializer, RatingSerializer, OrdersSerializer,
    OrderImageSerializer, PromoCodeSerializer, OrdersSerializer_, LogoutSerializer,
    CommonQuestionsSerializer
)
from api_core.models import (
    About, WhyChooseUs,  Packages, AboutCoverImage,
    Users, Profile, Blogs, ContactUs, Rating, Orders, OrderImage, PromoCode,
    VerificationCode, CommonQuestions,
    validate_postal_city, validate_phone
)
from rest_framework import generics
from rest_framework import status
from  django.urls import reverse
from urllib.parse import urlencode
from django.views import View

from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken,  AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import logout as django_logout
from django.contrib.sessions.models import Session
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import get_language_from_request
from api_core.serializers import available_langs
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema
from drf_spectacular.generators import SchemaGenerator
from django.contrib.auth import authenticate, login, logout
from rest_framework.authentication import SessionAuthentication

from django.utils import translation
from django.utils.translation import gettext as trans_str
from alsalam_app.settings import MEDIA_ROOT
from django.shortcuts import get_object_or_404,redirect
from django.core.files.storage import default_storage
from rest_framework import status as S, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User

from django.http import FileResponse, Http404 ,HttpResponse

from rest_framework.permissions import BasePermission, SAFE_METHODS
from drf_spectacular.utils import extend_schema_view, extend_schema
logger = logging.getLogger(__name__)

S200 = S.HTTP_200_OK
S201 = S.HTTP_201_CREATED
S202 = S.HTTP_202_ACCEPTED
S203 = S.HTTP_203_NON_AUTHORITATIVE_INFORMATION
S204 = S.HTTP_204_NO_CONTENT
S205 = S.HTTP_205_RESET_CONTENT
S304 = S.HTTP_304_NOT_MODIFIED
S400 = S.HTTP_400_BAD_REQUEST
S401 = S.HTTP_401_UNAUTHORIZED
S401 = S.HTTP_402_PAYMENT_REQUIRED
S403 = S.HTTP_403_FORBIDDEN
S404 = S.HTTP_404_NOT_FOUND
S405 = S.HTTP_405_METHOD_NOT_ALLOWED
S406 = S.HTTP_406_NOT_ACCEPTABLE
S408 = S.HTTP_408_REQUEST_TIMEOUT
S500 = S.HTTP_500_INTERNAL_SERVER_ERROR

def list2str(items: list[str], separator: str = "\n") -> str:
    """
    Convert a list of strings into a single string with each item on its own
    """
    lines = [f"{idx}. {item}" for idx, item in enumerate(items, start=1)]
    return separator.join(lines)
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Disable CSRF check

def  errors_(ser_errors):
        errors = {}
        for key, value in ser_errors.items():
                errors[key] = ", ".join(value)
        return errors
def get_relative_path(request, full_url=None) -> str:
    """
    Returns the URL‐path (including leading slash) by removing the
    request.build_absolute_uri('/') prefix from full_url (or from request.build_absolute_uri() if full_url is None).

    Examples:
      - If request.build_absolute_uri() is "http://127.0.0.1:8000/media/images/…",
        and request.build_absolute_uri("/") is "http://127.0.0.1:8000/",
        this returns "/media/images/…".
    """
    # 1) Determine the “full” absolute URI to strip
    raw = full_url or request.build_absolute_uri()

    # 2) Get the base (always ends with a slash)
    base = request.build_absolute_uri("/")            # e.g. "http://127.0.0.1:8000/"

    # 3) Remove the trailing slash off of base so we don’t end up with two slashes
    prefix = base.rstrip("/")                          # e.g. "http://127.0.0.1:8000"

    # 4) If raw starts with that prefix, cut it out; otherwise, return raw as‐is
    if raw.startswith(prefix):
        return raw.replace(prefix, "", 1)              # yields "/media/images/…"
    return raw
def get_lang(request, def_lang="en"):
    """
    Extract language code from request headers or query params, falling back to:
      1. Custom headers / query params in this order:
         ['lang', 'language', 'language_code', 'x-lang', 'accept-language']
      2. Django-detected language
      3. Default 'en'
    """
    # 1) Keys to look up, in priority order
    keys = [
        'lang',
        'language',
        'language_code',
        'x-lang',
        'accept-language',
    ]
    # 2) Normalize headers lower-case
    headers = {k.lower(): v for k, v in request.headers.items()}
    # 3) Try each key against headers, then query params
    lang = None
    for key in keys:
        # header first
        val = headers.get(key)
        if not val:
            # then query param
            val = request.query_params.get(key)
        if val:
            lang = val
            break
    # 4) Fallbacks
    if not lang:
        lang = get_language_from_request(request) or def_lang
    # 5) Normalize “ar,en;q=0.9” → “ar”
    lang = lang.lower().split(',')[0].strip()
    # 6) Ensure only supported values
    supported = {'en', 'ar'}
    return lang if lang in supported else 'en'



class DynamicSchemaView(APIView):
    """
    API endpoint that generates and returns the OpenAPI schema JSON on-demand.
    """

    @extend_schema(
        description="Get the current OpenAPI JSON schema",
        responses={200: dict},
    )
    def get(self, request, *args, **kwargs):
        generator = SchemaGenerator(title="Your API Title")
        schema = generator.get_schema(request=request)
        return Response(schema)


def get_req_val(request, key_or_keys):
    if isinstance(key_or_keys, (list, tuple)):
        return {

            key: request.query_params.get(key) or request.data.get(key)
            for key in key_or_keys
        }
    else:
        return (
            request.query_params.get(key_or_keys) or
            request.data.get(key_or_keys)
        )


def request_files(request: object, upload_path: str, is_absolute: bool = False) -> list[str]:
    from uuid import uuid4
    """
    Save all uploaded files from request.FILES into the specified directory.

    Args:
        request (HttpRequest): Django request containing request.FILES.
        upload_path (str):
            - If `is_absolute` is False: path relative to settings.MEDIA_ROOT
              (no leading/trailing slash).
            - If `is_absolute` is True: absolute filesystem path.
        is_absolute (bool):
            If True, `upload_path` is treated as an absolute path on disk.
            Otherwise, it's treated as a subdirectory under MEDIA_ROOT.

    Returns:
        List[str]: A list of absolute filesystem paths to the saved files.
    """
    saved_files_paths, target_dir = [], ""
    if is_absolute:
        target_dir = upload_path
    else:
        target_dir = os.path.join(MEDIA_ROOT, upload_path)
    # Iterate through every file (supports both single and multiple uploads)
    for field in request.FILES:
        for uploaded in request.FILES.getlist(field):
            # Generate a random filename , preserve '+' original extent
            ext = os.path.splitext(uploaded.name)[1]
            new_name = f"{uuid4().hex}{ext}"
            relative_path = os.path.join(upload_path, new_name)
            # save Django default storage (handles local or remote backends)
            saved_name = default_storage.save(relative_path, uploaded)
            # covert to absolute filesystem
            full_name = default_storage.path(saved_name)
            saved_files_paths.append(full_name)
    return saved_files_paths


def is_valid_uuid(uuid_str):
    pattern = re.compile(
        r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$')
    return bool(pattern.match(uuid_str))






def unescape_newlines(s: str) -> str:
    return s.replace('\r\n', '') \
            .replace('\r',   '')   \
            .replace('\n',   '')

def parse_text(text: str) -> list[str]:
    # Remove all literal "\r" and carriage return characters
    cleaned = re.sub(r'(\\r|\r)', '', text)
    # Split by both literal "\n" and actual newline
    lines = re.split(r'(?:\\n|\n)', cleaned)
    # Remove empty lines and strip leading/trailing spaces
    return [line.strip() for line in lines if line.strip()]

def is_valid_uuid4(c: str) -> bool:
    """
    Returns True if `c` is a valid UUID4 string, False otherwise.
    """
    try:
        val = uuid.UUID(c, version=4)
    except (ValueError, AttributeError, TypeError):
        return False
    # Ensure the string is in canonical form (optional)
    return str(val) == c

def get_from_request(request, keys, default=None):
    # Ensure keys is a list
    if isinstance(keys, str):
        keys = [keys]
    for k in keys:
        # Try request.data
        v = request.data.get(k, None) if hasattr(request, "data") else None
        if v is not None:
            return v
        # Try request.headers
        v = request.headers.get(k, None) if hasattr(request, "headers") else None
        if v is not None:
            return v
    return default
def getTheValidKeyName(possKeysNames:list, request):
    possKeysNames = [possKeysNames]
    if not isinstance(possKeysNames, list)or not len(list): return
    for key in possKeysNames:
        value = get_from_request(key, request)
        if value: return value
def get_V_code(user):
    try:
        code_obj = VerificationCode(user=user)
        code_obj.save()
        return code_obj
    except Exception as E:
        print("-"*50, f"{E}", "_"*50)
        return False, E

from vonage import Vonage, Auth, HttpClientOptions
from vonage_sms import SmsMessage
from api_core.__init__ import *

def send_V_code(user):
    if not isinstance(user, Users):
        return None
    try:
        phone = user.phone_number

        code = get_V_code(user)
        sms = f"your verification code {code.code}"
        auth = Auth(
            api_key=VON_KEY,
            api_secret=VON_SECRET,
        )
        options = HttpClientOptions()
        client = Vonage(auth=auth, http_client_options=options)


        message = SmsMessage(
            to=phone,
            from_=CO_NAME,
            text=sms,
        )
        response = client.sms.send(message)

        msg = response.messages[0]
        return {"code":code, "sent":True}
    except Exception as E:
        return {"errors":f"Message failed: {E}", "sent":False, "code":code}


if __name__ == "__main__":


    def get_media_path(Class, keys=""):
        if not keys:
            keys = ["image", "logo"]
        objects = list(Class.objects.all())

        paths = []
        for obj in objects:
            for k in keys:
                if hasattr(obj, k):
                    img = getattr(obj, k, "")
                    paths.append(img.path)
        return paths

    get_media_path(Profile)
    def clean_media(dir_name):
        pass

