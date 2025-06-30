

from django.utils.translation import gettext_lazy as strtrans


from api_core.__init__ import APP_LANGS
available_langs = [l for l, Lang in APP_LANGS]
# print(f"{available_langs}")

packages_key_map = {
    "keys": {
        "en": {
            'name':					'name',
            'price':				   'price',
            'id':				   'id',
            'disassembly_and_assembly': 'disassembly_and_assembly',
            'furniture_wrapping':	  'furniture_wrapping',
            'packing_the_belongings':  'packing_the_belongings',
            'wrapping_before_packing': 'wrapping_before_packing',
            'unpacking_and_organizing': 'unpacking_and_organizing',
            "loading_and_offloading":"loading_and_offloading",
			"unlimited_cardboard":"unlimited_cardboard",
        },
        "ar": {
            'name':					'الاسم',
            'price':				   'السعر',
            'id':				   'id',
            'disassembly_and_assembly': 'التفكيك والتجميع',
            'furniture_wrapping':	  'تغليف الأثاث',
            'packing_the_belongings':  'تغليف المتعلقات',
            'wrapping_before_packing': 'التغليف قبل التعبئة',
            'unpacking_and_organizing': 'فك التعبئة والتنظيم',
            "loading_and_offloading":  "تحميل وتفريغ" ,
			"unlimited_cardboard": "كرتون غير محدود",

        }
    },
    "name": {
        "Economic": "الاقتصادية",
        "Economic +": "الاقتصادية بلس",
        "Basic": "الأساسية",
        "Comprehensive": "المتكاملة",
    }
}
users_key_map = {
    "en": {
        'id': 'id',
        'username': 'username',
        'password': 'password',
        'phone_number': 'phone_number',
        'whatsapp_number': 'whatsapp_number',
        'city': 'city',
                'postal_code': 'postal_code',
                'address': 'address',
                'first_name': 'first_name',
                'last_name': 'last_name',
                'email': 'email',
                'is_staff': 'is_staff',
                'is_superuser': 'is_superuser',
                'is_active': 'is_active',
    },
    "ar": {
        'id': 'المعرف',
        'username': 'اسم المستخدم',
        'password': 'كلمة المرور',
        'phone_number': 'رقم الهاتف',
        'whatsapp_number': 'رقم الواتساب',
        'city': 'المدينة',
                'postal_code': 'الرمز البريدي',
                'address': 'العنوان',
                'first_name': 'الاسم الأول',
                'last_name': 'اسم العائلة',
                'email': 'البريد الإلكتروني',
                'is_staff': 'موظف',
                'is_superuser': 'مشرف',
                'is_active': 'نشط',
    }
}

profile_key_map = {
    "en": {
        'id': 'id',
        'first_name': 'first_name',
        'last_name': 'last_name',
        # 'email': 'email',
        'image': 'image',
    },
    "ar": {
        'id': 'المعرف',
        'first_name': 'الاسم الأول',
        'last_name': 'اسم العائلة',
        # 'email': 'البريد الإلكتروني',
        'image': 'الصورة',
    }
}
about_key_amp = {
    "ar": {
        "description": "الوصف",
        "who_we_are": "من نحن",
        "name": "الاسم",
        "logo": "الشعار"
    },
    "en": {
        "description": "description",
        "who_we_are": "who_we_are",
        "name": "name",
        "logo": "logo"
    }
}
WCU_ke_mapp = {
    "label_kval": {
        "trained workers": "عمالة مدربة",

        "fast transportation": " نقل سريع",

        "charging accuracy": " دقة الشحن",

        "furniture packaging": " تغليف الأثاث",

        "dismantling and installing furniture": " فك وتركيب الأثث"
    }
}


def map_package_data(data: dict, lang: str) -> dict:
    """
    Takes a single-package dict (field → value), applies translation of keys
    (and name‑value), then collects all boolean flags into a 'features' list.
    Returns the transformed dict.
    """
    if lang.lower() in "arabic":
        lang = 'ar'

    lang = lang.lower()
    is_ar = (lang == 'ar')

    # 1️⃣ Choose the right key_map for this language (fall back to English)
    key_map = packages_key_map["keys"].get(
        lang, packages_key_map["keys"]["en"])

    # 2️⃣ Translate all keys in incoming data
    translated = {key_map.get(k, k): v for k, v in data.items()}

    # 3️⃣ If Arabic, translate the package name value too
    if is_ar:
        name_map = packages_key_map["name"]
        if 'الاسم' in translated:
            translated['الاسم'] = name_map.get(
                translated['الاسم'], translated['الاسم'])
    # 4️⃣ Build feature_fields by taking all keys except 'name' & 'price'
    locale_keys = packages_key_map["keys"][lang] if is_ar else packages_key_map["keys"]["en"]
    # locale_keys maps internal→localized, so we want the *values* of that map
    all_fields = list(locale_keys.values())
    # remove the two non‐boolean fields
    feature_fields = [f for f in all_fields if f not in (
        locale_keys['name'], locale_keys['price'], locale_keys['id'])]

    # 5️⃣ Pull out each boolean flag into the features list
    features = []
    for field in feature_fields:
        if field in translated:
            features.append({"name": field, "included": translated.pop(field)})

    # 6️⃣ Assemble the final shape
    return {
        "name":     translated.pop(locale_keys['name']),
        "id":     translated.pop(locale_keys['id']),
        "price":    translated.pop(locale_keys['price']),
        "features": features,
    }


def trans_mapped(data: dict, key_map: dict, lang: str) -> dict:
    """
    Translate the dictionary's keys according to key_map[lang].
    Leaves values untouched.
    """
    if lang.lower() in "arabic":
        lang = 'ar'

    lang = lang.lower()
    # If English or unsupported, pass through
    if lang == "en" or lang not in key_map:
        return data

    lang_keys = key_map[lang]
    translated = {}
    for k, v in data.items():
        # Use the per-language mapping
        new_key = lang_keys.get(k, k)
        translated[new_key] = v

    return translated
