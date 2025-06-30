from api_core.models_H import *
from django.core.validators import RegexValidator, EmailValidator


class Users(AbstractUser, Base):
    """
    Custom user for furniture‑moving site, with Saudi‑specific contact & location.
    """
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    email = models.EmailField(
        max_length=254,
        null=False,
        blank=False,
        unique=True,
        help_text="Required. User’s primary email.",
    )
    password = models.CharField(
        max_length=128,
        help_text="Password (will be hashed automatically)"
    )
    phone_number = models.CharField(max_length=16, unique=True,
                                    help_text="Primary Saudi phone, e.g. +966501234567"
                                    )
    whatsapp_number = models.CharField(max_length=16, unique=True,
                                       help_text="Primary Saudi phone, e.g. +966501234567"
                                       )
    city = models.CharField(
        max_length=100, help_text="City in Saudi Arabia"
    )
    postal_code = models.CharField(
        max_length=5, help_text="5‑digit Saudi postal code"
    )
    address = models.CharField(
        max_length=255, help_text="Street address / exact location"
    )
    verified_phone = models.BooleanField(default=False, null=False, blank=False )
    verified_whatsapp = models.BooleanField(default=False, null=False, blank=False )
    verified_email = models.BooleanField(default=False, null=False, blank=False )

    def save(self, *args, **kwargs):
        if self.is_active:
            self.is_active = True
        if self.is_superuser:
            if not self.phone_number:
                rand_numb = str(uuid4)[:15]
                self.phone_number = rand_numb
                self.whatsapp_number = rand_numb
                super().save(*args, **kwargs)
        if not self.is_superuser:
            # Validate phone numbers
            valid, msg = validate_phone(self.phone_number)
            if not valid:
                raise ValidationError({"phone_number": msg})

            valid, msg = validate_phone(self.whatsapp_number)
            if not valid:
                raise ValidationError({"whatsapp_number": msg})

            # Validate postal code and city
            valid, msg = validate_postal_city(self.postal_code, self.city)
            if not valid:
                raise ValidationError({"postal_code": msg})
            valid, msg = validate_email(self.email)
            if not valid:
                raise ValidationError({"email": msg})

        super().save(*args, **kwargs)
        is_new = self._state.adding
        if is_new:
            Profile.objects.create(user=self)


    def delete(self, *args, **kwargs):
        try:
            user_orders = Orders.objects.filter(user=self)
            if user_orders:
                print(f"{user_orders}")
                for order in user_orders:
                    order.delete()
        except Exception as E:
            raise E
        try:
            profile = self.profile
        except Profile.DoesNotExist:
            profile = None

        if profile:
            profile.delete()

        # 3) Finally delete the User row itself
        super().delete(*args, **kwargs)
def profile_image_path(instance, filename):
    # Extension of uploaded file
    ext = filename.split('.')[-1]
    # Image saved as <profile_id>.<ext> in 'profile_images' folder
    return f'images/profile/{instance.id}.{ext}'


class Profile(Base):
    user = models.OneToOneField(
        "Users", on_delete=models.CASCADE)  # Required link to User
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    image = models.ImageField(
        upload_to=profile_image_path, blank=True, null=True)


    def delete_old_image(self):
        """Delete old image if it exists in 'profile_images' folder with profile id"""
        folder = 'profile_images'
        for ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']:
            path = os.path.join(folder, f"{self.id}.{ext}")
            if os.path.isfile(path):
                os.remove(path)

    def save(self, *args, **kwargs):
        # Check if the object already has an ID (i.e., it's not a new object)
        if self.id:
            try:
                # Try to fetch the existing object
                old = Profile.objects.get(id=self.id)
                if old.image and old.image != self.image:  # Check if the image has changed
                    # If the old image exists, delete it
                    if os.path.isfile(old.image.path):
                        os.remove(old.image.path)
            except ObjectDoesNotExist:
                # If the object doesn't exist (perhaps it was deleted), do nothing
                pass

        # Proceed with saving the object (whether it's a new one or an update)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete image file when profile is deleted
        # self.delete_old_image()
        # super().delete(*args, **kwargs)
        if self.image and os.path.isfile(self.image.path):
            print(f"\n\n\n\n\n {self.image.path}")
            os.remove(self.image.path)
        super().delete(*args, **kwargs)

    def __str__(self):
        return f'{self.first_name} {self.last_name}' if self.first_name or self.last_name else "Profile"


class ContactUs(Base):
    # 1) Name: “Roman” letters only
    name = models.CharField(
        max_length=100,
        help_text="Your full name (Latin letters only)."
    )

    # Saudi phone: +9665XXXXXXXX or 05XXXXXXXX

    phone_number = models.CharField(max_length=16, unique=False,
                                    help_text="Primary Saudi phone, e.g. +966501234567"
                                    )
    # Email: standard email format
    email = models.EmailField(
        blank=False, help_text="Contact email address.email@example")

    # Enquiry type: optional choice
    ENQUIRY_CHOICES = [
        ('complaint', 'Complaint'),
        ('inquiry',   'Inquiry'),
        ('join_us',   'Join Us'),
    ]
    enquiry = models.CharField(
        max_length=20,
        choices=ENQUIRY_CHOICES,
        blank=True,  # optional
        help_text="Type of enquiry (optional)."
    )

    # 5) Message: free‑form text
    message = models.TextField(
        help_text="Your message or details."
    )

    class Meta:
        verbose_name = "Contact Us Submission"
        verbose_name_plural = "Contact Us Submissions"
        ordering = ['-created_at']  # ✅ Fix: use correct field name from Base

    def __str__(self):
        return f"{self.name} ({self.enquiry or 'No type'})"

    def clean(self):
        super().clean()
        # Name only roman letters + spaces
        if not re.match(r'^[A-Za-z ]+$', self.name):
            raise ValidationError(
                {"name": "Name must contain only Latin letters and spaces."})


class Rating(Base):
    STAR_CHOICES = [(i, f"{i} star{'s' if i > 1 else ''}")
                    for i in range(1, 6)]

    user = models.OneToOneField(
        "Users",
        on_delete=models.CASCADE,
        related_name="ratings",
        help_text="The user who submitted this rating."
    )
    stars = models.PositiveSmallIntegerField(
        choices=STAR_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Number of stars (1–5). Cannot be zero.",
    )
    comment = models.TextField(
        blank=True,
        help_text="Optional: user’s written experience of the app."
    )

    class Meta:

        verbose_name = "App Rating"
        verbose_name_plural = "App Ratings"

    def __str__(self):
        return f"{self.user} — {self.stars}★"




class Orders(Base):
    """
    Orders model representing a furniture-moving booking, linked to a user and a Package.
    Stores pickup/dropoff addresses, dates, contact info, description, and image paths.

    Overrides `save` to remove any image files that were deleted from the `images` list.
    Overrides `delete` to clean up all associated image files.
    """
    required_keys = [
        "package", "from_address", "to_address", "transportation_date",
        "transportation_date_time", "rooms_number", "phone_number",
        "phone_code", "belonging_description"
    ]

    user = models.ForeignKey(
        "Users",
        on_delete=models.CASCADE,
        related_name="orders",
        help_text="The user who placed this order"
    )

    package = models.ForeignKey(
        "Packages",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
        help_text="The chosen package for this order"
    )
    promo_code = models.ForeignKey(
        "PromoCode",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
        help_text="Optional promotional code applied to this order"
    )
    # Google Maps address fields
    service_type = models.CharField(
        max_length=50,
        choices=[
            ('Intracity',     'Intracity'),
            ('City-to-City',  'City-to-City'),
        ],
        default='City-to-City',
        help_text="Select either Intracity or City-to-City",
         null=False, blank=False

    )
    from_address = models.CharField(
        max_length=255, help_text="Pickup address from Google Maps",
         null=False, blank=False, default="untitled",

        )
    from_lat = models.DecimalField(
        max_digits=60, decimal_places=25,
         null=False, blank=False, default=0
    )
    from_lng = models.DecimalField(
        max_digits=60, decimal_places=25,
         null=False, blank=False, default=0

    )

    to_address = models.CharField(
        max_length=255, help_text="Dropoff address from Google Maps",
         null=False, blank=False, default="untitled",

        )
    to_lat = models.DecimalField(
        max_digits=60, decimal_places=25,
         null=False, blank=False, default=0
    )
    to_lng = models.DecimalField(
        max_digits=60, decimal_places=25,
         null=False, blank=False, default=0

    )

    transportation_date = models.DateField(
        help_text="Date of transportation",
         null=False, blank=False, default="untitled",
        )
    transportation_date_time = models.TimeField(
        help_text="Time of transportation",
          null=False, blank=False, default="untitled",

        )

    rooms_number = models.PositiveSmallIntegerField(
         null=False, blank=False, default=0,
        help_text="Number of rooms to move"
        )

    phone_code = models.CharField(
        max_length=8, help_text="International phone code, e.g. +20",
         null=False, blank=False, default="untitled",

        )
    phone_number = models.CharField(
        max_length=20, help_text="Customer's phone number without code",
          null=False, blank=False, default="untitled",

        )

    belonging_description = models.TextField(
        help_text="Description of items belonging to the customer",
        )
    total = models.IntegerField(
         null=False, blank=False, default=0
    )
    order_state = models.CharField(
        max_length=25,
        choices=[
            ("on hold",     "On Hold"),
            ("accepted",    "Accepted"),
            ("in progress", "In Progress"),
            ("done",        "Done"),
            ("rejected",    "Rejected"),
            ("archived",    "Archived"),
        ],
        default="on hold", null=False,blank=False,
        help_text="Current status of the order (e.g. on hold, accepted, in progress, done, rejected)."
    )

    order_state_comment = models.TextField(
        null=True,
        blank=True,
        help_text="Optional comment explaining why the order is in its current state."
    )
    class Meta:
        verbose_name = "Orders"
        verbose_name_plural = "Orders"
        constraints = [
            # Enforce that order_state must be one of the valid choices at the database level
            CheckConstraint(
                check=Q(order_state__in=["on hold", "accepted", "in progress", "done", "rejected", "archived"]),
                name="orders_order_state_valid"
            )
        ]
    def apply_promo_code(self):
        promo = self.promo_code
        # if there’s no promo, or it’s inactive/expired, just do nothing
        if not promo or not promo.active:
            return

        if promo.expiry_date and promo.expiry_date < date.today():
            return

        # compute discount
        if promo.is_percentage:
            discount_amount = (self.total * Decimal(promo.value)) / Decimal("100.00")
        else:
            discount_amount = Decimal(promo.value)

        # subtract, never below zero
        self.total = max(Decimal("0.00"), self.total - discount_amount)
    def save(self, *args, **kwargs):
        # 1) compute base total (e.g. from package price)
        base_price = getattr(self.package, 'price', None)
        if base_price is not None:
            self.total = base_price

        # 2) apply the promo if it’s valid
        self.apply_promo_code()

        # 3) persist
        super().save(*args, **kwargs)
    def delete(self, *args, **kwargs):
        order_images = OrderImage.objects.filter(order=self)
        for image in order_images:
            image.delete()
        super().delete(*args, **kwargs)

    def clean(self):
        from datetime import date
        missing = [
            key for key in self.required_keys if not getattr(self, key, None)]
        if missing:
            raise ValidationError(
                f"Missing required fields: {', '.join(missing)}")

        if not self.phone_number.isdigit():
            raise ValidationError("phone_number must contain only digits.")
        if not (self.phone_code.startswith("+")) or not self.phone_code[1:].isdigit():
            raise ValidationError(
                "phone_code must start with '+' followed by digits.")
        if self.transportation_date < date.today():
            raise ValidationError("transportation_date cannot be in the past.")




def order_image_upload_path(instance, filename):
    # Store images in: MEDIA_ROOT/orders/<order_id>/<filename>
    return f"images/orders/{instance.order.id}/{filename}"


class OrderImage(Base):
    max_images = os.getenv("MAX_ORDER_IMAGES") or 15
    order = models.ForeignKey(
        "Orders",
        on_delete=models.CASCADE,
        related_name="order_images"
    )
    image = models.ImageField(upload_to=order_image_upload_path)

    def save(self, *args, **kwargs):
        # Delete the old file if it exists and a new one is being uploaded
        if OrderImage.objects.filter(order=self.order.id).count() > 14:
            return {"Error":"Exceed image limit number"}
        if self.id:
            old = OrderImage.objects.filter(id=self.id).first()
            if old and old.image and old.image.name != getattr(self.image, 'name', None):
                old_path = os.path.join(settings.MEDIA_ROOT, old.image.name)
                if os.path.exists(old_path):
                    os.remove(old_path)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete the image file from the filesystem
        image_path = os.path.join(settings.MEDIA_ROOT, self.image.name)
        if os.path.exists(image_path):
            os.remove(image_path)

        # Remove the order directory if it's now empty
        order_dir = os.path.dirname(image_path)
        if os.path.isdir(order_dir) and not os.listdir(order_dir):
            os.rmdir(order_dir)

        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Image for Order {self.order.id}"
class VerificationCode(Base):
    """Model to store verification codes with expiration."""

    user = models.ForeignKey(
        "Users",  # String reference to avoid circular import
        on_delete=models.CASCADE,
        related_name="verification_codes"
    )
    code = models.CharField(max_length=6)  # Six digits code
    is_used = models.BooleanField(default=False, null=False, blank=False )
    receiver_number = models.CharField(
        blank=False, null=False, default="untitled",
        max_length=16
    )
    expire_date = models.DateTimeField(
        default=timezone.now() + timezone.timedelta(minutes=30),
        null=False, blank=False
        )
    is_valid = models.BooleanField(default=True, null=False, blank=False )

    def save(self, *args, **kwargs):
        """Generate code automatically if not provided and set expiration date."""
        if not self.code:
            self.code = str(uuid4().int)[:6]  # Random 6 digit code
        if not self.expire_date:
            self.expire_date = timezone.now() + timezone.timedelta(minutes=30)  # Set expiration after 5 mins
        if (not self.receiver_number or self.receiver_number == "untitled") and self.user.phone_number:
            self.receiver_number = self.user.phone_number
        self.validate()
        super().save(*args, **kwargs)


    def validate(self):
        """Check if the code is valid and not expired."""
        self.is_valid = not self.is_used and self.expire_date > timezone.now()
        return self.is_valid

    def __str__(self):
        return f"Verification Code {self.code} for {self.user.username} to {self.receiver_number}"
    @classmethod
    def clear_codes(cls, user=None, code=None, clear_all=False):
        """
        Clear expired codes:
        - By user
        - By specific code
        - Clear all expired codes
        """
        if not user and not clear_all and not code:
            raise ValueError("You must provide user, code, or set clear_all=True")

        if code:
            try:
                specific_code = cls.objects.get(code=code)
                if specific_code.expire_date < timezone.now() and not specific_code.is_used:
                    specific_code.delete()
                    return f"Verification code {code} deleted."
                else:
                    return "Code is not expired or already used."
            except cls.DoesNotExist:
                return "Verification code not found."

        if user:
            expired_codes = cls.objects.filter(user=user, expire_date__lt=timezone.now(), is_used=False)
        elif clear_all:
            expired_codes = cls.objects.filter(expire_date__lt=timezone.now(), is_used=False)
        else:
            expired_codes = cls.objects.none()

        count = expired_codes.delete()
        return f"{count[0]} expired codes deleted."