# serializers.py
from .models import Rating
from api_core.serializers_T import *

import os
import re
import phonenumbers
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as strtrans
# Usage example


from api_core.models import (
    About, WhyChooseUs,  Packages, AboutCoverImage,
    Users, Profile, Blogs, ContactUs, Orders, OrderImage, PromoCode,
    CommonQuestions,
    validate_phone, validate_postal_city
)


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ["description", "title","subtitle", "name", "logo"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        restructured = {

            "description": data["description"],
            "title": data["title"],
            "subtitle": data["subtitle"],
            "site_name": data["name"],

        }
        return restructured


class AboutCoverImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutCoverImage
        fields = ['id', 'image', 'caption']

class PackagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Packages
        fields = [
            'id',
            'name',
            'price',
            'disassembly_and_assembly',
            'furniture_wrapping',
            'packing_the_belongings',
            'wrapping_before_packing',
            'unpacking_and_organizing',
            "loading_and_offloading",
            "unlimited_cardboard",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = self.context.get('lang', 'en')
        return map_package_data(data=data, lang=lang)
        if lang not in available_langs or lang == 'en':
            return data

        key_map = packages_key_map["keys"][lang.lower()]
        # Define translation for the name field (only for Arabic)
        name_translations = packages_key_map["name"]
        translated_data = {}
        for field, value in data.items():
            key = key_map.get(field, field)

            # Translate the name value
            if field == 'name' and lang == 'ar':
                value = name_translations.get(value, value)

            translated_data[key] = value
        return translated_data

    def validate_paragraphs(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError(
                strtrans("At least one paragraph is required."))
        for paragraph in value:
            if not paragraph.strip():
                raise serializers.ValidationError(
                    strtrans("Empty paragraphs are not allowed."))
        return value


class WhyChooseUsSerializer(serializers.ModelSerializer):

    class Meta:
        model = WhyChooseUs
        fields = ['label',  'image', 'paragraphs']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = self.context.get("lang")
        restructured = {
            "label": data["label"],

            "content": {
                "image": data["image"],
                "paragraphs": data["paragraphs"],
            }
        }
        return restructured

    def validate_paragraphs(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError(
                strtrans("At least one paragraph is required."))
        for paragraph in value:
            if not paragraph.strip():
                raise serializers.ValidationError(
                    strtrans("Empty paragraphs are not allowed."))
        return value


class UsersSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, min_length=8)

    class Meta:
        model = Users
        fields = [
            'id', 'username', 'password', 'phone_number', 'whatsapp_number',
            'city', 'postal_code', 'address', 'first_name', 'last_name',
            'email', 'is_staff', 'is_superuser', 'is_active',"verified_phone",
            'verified_email','verified_whatsapp'
        ]
        read_only_fields = ['is_staff', 'is_superuser', 'is_active', 'id']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = self.context.get('lang', 'en')

        if lang.lower() in "arabic":
            lang = 'ar'

        if lang.lower() == "en" or lang.lower() not in available_langs:
            return data

        key_map = users_key_map[lang.lower()]

        translated_data = {}
        for field, value in data.items():
            key = key_map.get(field, field)
            # Optionally translate certain field *values* if needed here
            # For example, translating a 'status' field value or so

            translated_data[key] = value

        return translated_data

    def validate_phone_number(self, value):
        valid, msg = validate_phone(value)
        if not valid:
            raise serializers.ValidationError(strtrans(msg))
        return value

    def validate_whatsapp_number(self, value):
        valid, msg = validate_phone(value)
        if not valid:
            raise serializers.ValidationError(strtrans(msg))
        return value

    def validate(self, data):
        postal_code = data.get('postal_code', None)
        city = data.get('city', None)

        if postal_code and city:
            valid, msg = validate_postal_city(postal_code, city)
            if not valid:
                raise serializers.ValidationError(
                    {'postal_code': strtrans(msg)})

        return data

    def create(self, validated_data):
        # Hash the password before saving
        password = validated_data.pop('password')
        user = Users(**validated_data)
        user.password = make_password(password)
        # user.is_active = False
        user.save()

        return user

    def update(self, instance, validated_data):
        # Hash password if it's updated
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'first_name', 'last_name',  'image']
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            # 'email': {'required': False, 'allow_blank': True},
            'image': {'required': False, 'allow_null': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = self.context.get('lang', 'en')
        if lang.lower() in "arabic":
            lang = 'ar'

        key_map = profile_key_map.get(lang.lower(), profile_key_map['en'])

        translated_data = {}
        for field, value in data.items():
            translated_key = key_map.get(field, field)
            translated_data[translated_key] = value

        return translated_data



    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.method == 'POST':
            user = request.user
            if Profile.objects.filter(user=user).exists():
                raise serializers.ValidationError({
                    "detail": "A profile already exists for this user."
                })
        return super().validate(attrs)

    # def validate_email(self, value):
    #     if value and '@' not in value:
    #         raise serializers.ValidationError(
    #             strtrans("Enter a valid email address."))
    #     return value

    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.method == 'POST':
            user = request.user
            if Profile.objects.filter(user=user).exists():
                raise serializers.ValidationError({
                    "detail": strtrans("A profile already exists for this user.")
                })
        return super().validate(attrs)


class BlogSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Blogs
        fields = ['image_url', 'paragraph', 'article']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ContactUsSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        self.lang = kwargs.pop("lang", "en")
        super().__init__(*args, **kwargs)

    class Meta:
        model = ContactUs
        fields = ['name', 'phone_number', 'email', 'enquiry', 'message']

    def _msg(self, en, ar):
        return ar if self.lang == 'ar' else en

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z ]+$', value):
            raise serializers.ValidationError(
                self._msg("Name must contain only Latin letters and spaces.",
                          "الاسم يجب أن يحتوي على أحرف لاتينية ومسافات فقط.")
            )
        return value

    def validate_phone_number(self, value):
        try:
            num = phonenumbers.parse(value, "SA")
        except phonenumbers.NumberParseException:
            raise serializers.ValidationError(
                self._msg("Invalid phone number format.",
                          "تنسيق رقم الهاتف غير صالح.")
            )

        if not (phonenumbers.is_valid_number(num) and phonenumbers.region_code_for_number(num) == "SA"):
            raise serializers.ValidationError(
                self._msg("The phone number is not a valid Saudi Arabian phone number.",
                          "رقم الهاتف ليس رقمًا سعوديًا صحيحًا.")
            )
        return value

    def save_if_valid(self):
        if self.is_valid():
            self.save()
            return {"success": self._msg("Thank you! We’ll contact you soon.",
                                         "شكرًا لك! سنتواصل معك قريبًا.")}
        else:
            return self.errors

# serializers.py


class RatingSerializer(serializers.ModelSerializer):
    # 1) ChoiceField gives built-in error messages and lists valid options
    stars = serializers.ChoiceField(
        choices=Rating.STAR_CHOICES,
        help_text="Select a star rating between 1 and 5."
    )
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )

    # 2) Optional comment field
    comment = serializers.CharField(
        allow_blank=True,
        required=False,
        help_text="Tell us about your experience (optional)."
    )

    class Meta:
        model = Rating
        fields = ["user", "stars", "comment",]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def create(self, validated_data):
        # automatically associate the current user
        user = self.context["request"].user
        return Rating.objects.create(user=user, **validated_data)


class OrderImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderImage
        fields = ['image']  # you can add URLField if you need full URL

# 2. Orders serializer with dynamic key translation


class OrdersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Orders
        # list all the model fields you want to expose
        fields = [
            'id', 'user', 'package', 'promo_code',
            'from_address', 'from_lat', 'from_lng',
            'to_address',   'to_lat',   'to_lng',
            'transportation_date', 'transportation_date_time',
            'rooms_number', 'phone_code', 'phone_number',
            'belonging_description', 'service_type',
            'total', "order_state", "order_state_comment"

        ]
        read_only_fields = ['id']

    # mapping field names → Arabic labels
    ARABIC_FIELD_MAP = {
        'id': 'المعرف',
        'user': 'المستخدم',
        'package': 'الباقة',
        'promo_code': 'رمز_الترويج',
        'from_address': 'عنوان_الاستلام',
        'from_lat': 'خط_عرض_الاستلام',
        'from_lng': 'خط_طول_الاستلام',
        'to_address': 'عنوان_التسليم',
        'to_lat': 'خط_عرض_التسليم',
        'to_lng': 'خط_طول_التسليم',
        'transportation_date': 'تاريخ_النقل',
        'transportation_date_time': 'وقت_النقل',
        'rooms_number': 'عدد_الغرف',
        'phone_code': 'رمز_الهاتف',
        'phone_number': 'رقم_الهاتف',
        'belonging_description': 'وصف_الممتلكات',
        "service_type": "نوع الخدمة",
        "total":"الاجمالي"
    }

    def to_representation(self, instance):
        """
        Override to dynamically translate field names to Arabic when requested.
        """
        data = super().to_representation(instance)
        lang = self.context.get('lang', 'en')
        if lang == 'ar':
            # remap keys
            return {
                self.ARABIC_FIELD_MAP.get(key, key): value
                for key, value in data.items()
            }
        return data


class PromoCodeSerializer(serializers.ModelSerializer):
    """
    Serializer for PromoCode model.
    """
    class Meta:
        model = PromoCode
        fields = ['id', 'code', 'is_percentage',
                  'value', 'active', 'expiry_date']

class OrdersSerializer_(serializers.ModelSerializer):
    """
    Custom serializer that flattens nested front-end payloads and maps field names
    without altering the underlying models.
    """
    class Meta:
        model = Orders
        fields = [
            'id', 'user', 'package', 'promo_code', 'service_type',
            'from_address', 'from_lat', 'from_lng',
            'to_address', 'to_lat', 'to_lng',
            'transportation_date', 'transportation_date_time',
            'rooms_number', 'phone_code', 'phone_number',
            'belonging_description',
        ]
        read_only_fields = ['id']

    def to_internal_value(self, data):
        # Handle both original flat and new nested formats
        payload = data.copy()

        # Map serviceType casing and name
        svc = payload.pop('serviceType', None)
        if svc is not None:
            svc_map = {
                'intracity': 'Intracity',
                'city-to-city': 'City-to-City',
                'citytocity': 'City-to-City',
            }
            payload['service_type'] = svc_map.get(svc.lower(), svc)

        # Flat UUIDs map
        promo = payload.pop('promoCode', None)
        if promo is not None:
            payload['promo_code'] = promo

        # Nested address structures
        for prefix in ('from', 'to'):
            nested = payload.pop(f'{prefix}Address', None)
            if isinstance(nested, dict):
                payload[f'{prefix}_address'] = nested.get('address')
                payload[f'{prefix}_lat'] = nested.get('lat')
                payload[f'{prefix}_lng'] = nested.get('lng')

        # Dates and times
        date = payload.pop('transportationDate', None)
        if date:
            # Accept both ISO date or datetime
            payload['transportation_date'] = date.split('T')[0]
        time = payload.pop('transportationTime', None)
        if time:
            payload['transportation_date_time'] = time

        # Other renames
        num = payload.pop('numberOfRooms', None)
        if num is not None:
            payload['rooms_number'] = num
        code = payload.pop('phoneCountryCode', None)
        if code is not None:
            payload['phone_code'] = code
        phone = payload.pop('phoneNumber', None)
        if phone is not None:
            payload['phone_number'] = phone
        desc = payload.pop('description', None)
        if desc is not None:
            payload['belonging_description'] = desc

        return super().to_internal_value(payload)

    def create(self, validated_data):
        # Pop out user if needed (user passed via view)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class LogoutSerializer(serializers.Serializer):
    """
    Serializer for logging out / blacklisting a refresh token.
    The client must send a valid 'refresh' token in the request body.
    """
    refresh = serializers.CharField()

    def validate(self, attrs):
        """
        You could add extra validation here (e.g. check token format),
        but Simple JWT's `RefreshToken` will throw if it's invalid or expired.
        """
        return super().validate(attrs)
class CommonQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonQuestions
        fields = ["question", "answer"]
    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     return data

COMMON_QUESTIONS = [
    # Arabic FAQs
    {
        "question": "كيف يمكنني طلب خدمة نقل العفش؟",
        "answer": (
            "اختر الباقة المناسبة، حدّد موقع البداية والوجهة، اختر التاريخ والوقت، وأضف وصفًا اختياريًا. "
            "سيُؤكد عدد الرحلات ويكتمل الطلب."
        ),
        "language": "ar",
    },
    {
        "question": "ما المقصود بـ(ريال سعودي/رحلة) ولماذا لا يتم النقل دفعة واحدة؟",
        "answer": (
            "تعني الرحلة التنقل بين الموقعين عدة مرات لضمان سلامة الأثاث. هذا الأسلوب يضمن شفافية "
            "التسعير ويقلل مخاطر التلف."
        ),
        "language": "ar",
    },
    {
        "question": "ما نوع الشاحنات المستخدمة وما سعتها؟",
        "answer": (
            "في الرياض: شاحنة مغلقة (4.5×2 م)، وخيار مفتوحة عند الطلب.\n"
            "بين المدن: شاحنات مغلقة بطول 6 أو 8 م.\n"
            "كل رحلة تستوعب ما يعادل غرفة ونصف تقريبًا."
        ),
        "language": "ar",
    },
    {
        "question": "هل يمكن إتمام نقل العفش في يوم واحد؟",
        "answer": (
            "إذا شملت الخدمة الفك والتغليف والتركيب يستغرق النقل 7–9 ساعات. "
            "وإذا جهّز العميل الأغراض مسبقًا يُنهي النقل في حوالي 5 ساعات."
        ),
        "language": "ar",
    },
    {
        "question": "ما هي طرق الدفع المتاحة؟",
        "answer": (
            "نقبل النقد، التحويل البنكي، أو بوابات الدفع الإلكتروني. "
            "يمكن الدفع بعد انتهاء الخدمة لضمان راحتك."
        ),
        "language": "ar",
    },
    {
        "question": "ما جنسية العمال وهل يوجد تعويض عن الأضرار؟",
        "answer": (
            "فريقنا محترف ومدرّب. يجب تصوير الأغراض قبل النقل بـ72 ساعة. "
            "في حال التلف، يُبلغ خلال 48 ساعة ويُحدد التعويض حسب الفاتورة أو التقييم."
        ),
        "language": "ar",
    },
    {
        "question": "هل تقدمون خدمات إضافية؟",
        "answer": (
            "نحن نقدّم النقل بين المدن، التخزين، والتنظيف، بالإضافة إلى التغليف. "
            "ننصح العملاء بنقل مقتنياتهم الثمينة بأنفسهم."
        ),
        "language": "ar",
    },

    # English FAQs
    {
        "question": "How can I request a furniture moving service?",
        "answer": (
            "Select your package, enter pickup and drop‑off locations, choose date/time, "
            "and optionally describe items. Trips are then confirmed and your request is complete."
        ),
        "language": "en",
    },
    {
        "question": "What does (SAR/trip) mean and why isn’t everything moved at once?",
        "answer": (
            "A trip is one journey between pickup and drop‑off. Multiple trips ensure safe handling, "
            "transparent pricing, and reduce the risk of damage."
        ),
        "language": "en",
    },
    {
        "question": "What types of trucks are used and what is their capacity?",
        "answer": (
            "In Riyadh: closed trucks (4.5×2 m), optional open trucks.\n"
            "Intercity: closed trucks (6 m or 8 m).\n"
            "Each trip fits roughly one and a half rooms."
        ),
        "language": "en",
    },
    {
        "question": "Can the move be completed in one day?",
        "answer": (
            "With disassembly, packing, and reassembly, it takes 7–9 hours. "
            "If you prepare items in advance, we finish in about 5 hours."
        ),
        "language": "en",
    },
    {
        "question": "What payment methods are available?",
        "answer": (
            "We accept cash, bank transfers, and online payment gateways. "
            "You may also pay after service completion for peace of mind."
        ),
        "language": "en",
    },
    {
        "question": "What are the workers’ nationalities and is there compensation for damages?",
        "answer": (
            "Our team is professional and trained. Photograph items 72 hrs before move. "
            "Report damage within 48 hrs; compensation depends on invoice or pre‑move assessment."
        ),
        "language": "en",
    },
    {
        "question": "Do you offer additional services?",
        "answer": (
            "Yes: intercity moves, storage, cleaning, and packing. "
            "We recommend you personally handle your most valuable items."
        ),
        "language": "en",
    },
]