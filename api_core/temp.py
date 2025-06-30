			mapped, to_map = [], data

   for package in to_map:

				print(f"\n\n {to_map}\n\n")
				temp_package =  {}
				temp_package["features"] = [];
				for key, val in package.items():
					if isinstance(val, int) or isinstance(val, str):
						temp_package[key] = val
						continue
					temp = {}
					temp[key] = val
					temp_package["features"].append(temp)
				mapped.append(temp_package)


def map_package(data):
    mapped , to_map = [], data
    for package in to_map:

        temp_package =  {}
        temp_package["features"] = [];
        for key, val in package.items():
            if isinstance(val, int) or isinstance(val, str):
                temp_package[key] = val
                continue
            temp = {}
            temp[key] = val
            temp_package["features"].append(temp)
    mapped.append(temp_package)
    return mapped


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
         null=False, blank=False default="untitled",

        )
    from_lat = models.DecimalField(
        max_digits=9, decimal_places=6,
         null=False, blank=False default="untitled",
    )
    from_lng = models.DecimalField(
        max_digits=9, decimal_places=6,
         null=False, blank=False default="untitled",

    )

    to_address = models.CharField(
        max_length=255, help_text="Dropoff address from Google Maps",
         null=False, blank=False default="untitled",

        )
    to_lat = models.DecimalField(
        max_digits=9, decimal_places=6,
         null=False, blank=False default="untitled",
    )
    to_lng = models.DecimalField(
        max_digits=9, decimal_places=6,
         null=False, blank=False default="untitled",

    )

    transportation_date = models.DateField(
        help_text="Date of transportation",
         null=False, blank=False default="untitled",
        )
    transportation_date_time = models.TimeField(
        help_text="Time of transportation",
          null=False, blank=False default="untitled",

        )

    rooms_number = models.PositiveSmallIntegerField(
         null=False, blank=False default="untitled",,
        help_text="Number of rooms to move"
        )

    phone_code = models.CharField(
        max_length=8, help_text="International phone code, e.g. +20",
         null=False, blank=False default="untitled",

        )
    phone_number = models.CharField(
        max_length=20, help_text="Customer's phone number without code",
          null=False, blank=False default="untitled",

        )

    belonging_description = models.TextField(
        help_text="Description of items belonging to the customer",
        )
    total = models.IntegerField(
         null=False, blank=False default="untitled",
    )
    class Meta:
        verbose_name = "Orders"
        verbose_name_plural = "Orders"

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

# for order search in admin
from django.template.response import TemplateResponse
from api_core.views_admin import OrderSearchAPIView
from django.contrib.auth.decorators import user_passes_test
superuser_required = user_passes_test(lambda u: u.is_active and u.is_superuser)
class MyAdminSite(admin.AdminSite):
    site_header = 'Alsalam Administration'
    site_title = 'Alsalam Admin'
    index_title = 'Dashboard'

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path('orders-search/', self.admin_view(superuser_required(self.orders_search_view)), name='orders-search'),
        ]
        return custom + urls

    def orders_search_view(self, request):
        api_view = OrderSearchAPIView.as_view()
        response = api_view(request._request)
        data = response.data

        context = dict(
            self.each_context(request),
            title='Order Search',
            fields=data.get('fields', []),
            results=data.get('results', []),
            error=data.get('error'),
            query_field=request.GET.get('field', ''),
            query_val=request.GET.get('q', ''),
        )
        return TemplateResponse(request, 'admin/orders_search.html', context)

# Instantiate custom site and register
admin_site = MyAdminSite(name='myadmin')
admin_site.register(Orders, OrdersAdmin)