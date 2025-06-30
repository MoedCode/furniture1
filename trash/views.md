```py
class AboutView(APIView):
    """
    GET:    Retrieve About + logo URL + list of cover image URLs and captions.
    POST:   Create (or partial-update) About with logo + any number of cover images.
    PUT:    Full update of About + logo + cover images (old files cleaned up by model.save()).
    DELETE: Remove About + all cover images (files cleaned up by model.delete()).
    """
    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def get(self, request):
        lang = get_lang(request)
        translation.activate(lang)
        about = About.objects.filter(lang=lang).first() or About.objects.first()
        if not about:
            return Response({"detail": trans_str("Al Salam furniture moving")}, S404)

        about_data = AboutSerializer(about, context={'lang':'en'}).data

        # git all about cover images
        '''
        covers = AboutCoverImage.objects.filter(about=about)
        covers_data = AboutCoverImageSerializer(covers, many=True).data
        if about_data["logo"]:
            about_data["logo-url"] = request.build_absolute_uri('/') + about_data["logo"]
        for cover in covers_data:
            if cover["image"]:
                cover["image-url"] = request.build_absolute_uri('/') + cover["image"]
        # serialize them all result list of dictionaries
        about_data['cover_images'] = covers_data
        '''
        return Response(about_data, S200)

    # check if jusr admin who can update delete about images
    permission_classes = [IsAdminAndLogged]

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        """
        Creates or updates the single About instance.
        If an About exists, it performs a partial update; otherwise, it creates a new one.
        """
        about = about.objects.first()
        if about:
            serialized = AboutSerializer(
                about, data=request.data, partial=True)
        else:
            serialized = AboutSerializer(data=request.data)
        if not serialized.is_valid():
            return Response(serialized.errors, S400)

        serialized.save()
        # get and save cover images
        try:
            files = request.FILES.getlist('cover_images')
            captions = request.data.getlist('captions', [])
            for idx, imag in enumerate(files):
                cap = captions[idx] if idx < len(captions) else ''
                AboutCoverImage.objects.create(
                    about=about, imag=imag, caption=cap)
        except Exception as E:
            return Response({"detail": f"error saving cover images {str(E)}"}, S500)
        return Response(AboutSerializer(about).data, S201)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def put(self, request):
        about = About.objects.first()
        if not about:
            return Response({"detail": "About section does not exist."}, S.HTTP_404_NOT_FOUND)

        # update About base fields and logo
        serializer = AboutSerializer(about, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, S.HTTP_400_BAD_REQUEST)
        about = serializer.save()  # About.save() handles logo cleanup

        # delete specific cover images by ID
        ids_to_delete = request.data.getlist('delete_cover_ids')
        for cover_id in ids_to_delete:
            try:
                cover = AboutCoverImage.objects.get(id=cover_id, about=about)
                cover.delete()  # calls AboutCoverImage.delete()
            except AboutCoverImage.DoesNotExist:
                logger.warning(
                    f"Cover image ID {cover_id} not found or doesn't belong to this About.")

        # add new cover images
        files = request.FILES.getlist('cover_images')
        captions = request.data.getlist('captions', [])
        for idx, img in enumerate(files):
            caption = captions[idx] if idx < len(captions) else ''
            AboutCoverImage.objects.create(
                about=about, image=img, caption=caption)

        return Response(AboutSerializer(about).data, S.HTTP_200_OK)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def delete(self, request):
        about = About.objects.first()
        if not about:
            return Response({"detail": "About section does not exist."}, S.HTTP_404_NOT_FOUND)
        about.delete()  # triggers About.delete() and AboutCoverImage.delete() to clean up files
        return Response(status=S.HTTP_204_NO_CONTENT)
```
```py

class PromoCodeView(APIView):
    def get(self, request):
        code     = get_req_val(request, "code") or None
        promo_id = get_req_val(request, "id")   or None

        # 1) List all
        if not code and not promo_id:
            qs = PromoCode.objects.all()
            if not qs.exists():
                return Response(
                    {"detail": "no promotion codes available yet"},
                    status=S200
                )
            data = PromoCodeSerializer(qs, many=True).data
            return Response(data, status=S200)

        # 2) Validate UUID if given
        if promo_id and not is_valid_uuid(promo_id):
            return Response(
                {"error": f"'{promo_id}' is not a valid UUID4"},
                status=S400
            )

        # 3) Lookup by code or id
        promo_code = None
        if code:
            promo_code = PromoCode.objects.filter(code__iexact=code).first()
        if not promo_code and promo_id:
            promo_code = PromoCode.objects.filter(id=promo_id).first()

        # 4) Handle not found
        if not promo_code:
            return Response(
                {"detail": f"No active promo code matching '{code or promo_id}'"},
                status=S404
            )

        # 5) Serialize and return
        data = PromoCodeSerializer(promo_code).data
        return Response(data, status=S200)
```
# old Orders / OrdersImages admin registry
```py

@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'package', 'transportation_date')
    list_filter = ('transportation_date', 'package')
    search_fields = ('user__username', 'from_address',
                     'to_address', 'phone_number')
    raw_id_fields = ('user', 'package')
    inlines = [OrderImageInline]

    def delete_model(self, request, obj):
        # delete all images (triggers file deletion in their delete())
        for image in obj.order_images.all():
            image.delete()
        # now delete the order itself
        super().delete_model(request, obj)

    def delete_queryset(self, request, queryset):
        # for bulk deletions
        for obj in queryset:
            for image in obj.order_images.all():
                image.delete()
            obj.delete()

    list_display = ('id', 'user', 'package', 'transportation_date')
    list_filter = ('transportation_date', 'package')
    search_fields = ('user__username', 'from_address',
                     'to_address', 'phone_number')
    raw_id_fields = ('user', 'package')
    inlines = [OrderImageInline]


@admin.register(OrderImage)
class OrderImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'image_thumb')
    raw_id_fields = ('order',)

    def image_thumb(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="max-height: 50px;" />')
        return ''
    image_thumb.short_description = 'Image'

    def save_model(self, request, obj, form, change):
        # on update, delete old file if image changed
        if change:
            old = OrderImage.objects.filter(pk=obj.pk).first()
            new_image = form.cleaned_data.get('image')
            if old and new_image and old.image.name != new_image.name:
                import os
                from django.conf import settings
                old_path = os.path.join(settings.MEDIA_ROOT, old.image.name)
                if os.path.exists(old_path):
                    os.remove(old_path)
        super().save_model(request, obj, form, change)

    def delete_model(self, request, obj):
        # delete file when the instance is deleted
        if obj.image and obj.image.name:
            import os
            from django.conf import settings
            path = os.path.join(settings.MEDIA_ROOT, obj.image.name)
            if os.path.exists(path):
                os.remove(path)
            dirpath = os.path.dirname(path)
            if os.path.isdir(dirpath) and not os.listdir(dirpath):
                os.rmdir(dirpath)
        super().delete_model(request, obj)

    def delete_queryset(self, request, queryset):
        import os
        from django.conf import settings
        for obj in queryset:
            if obj.image and obj.image.name:
                path = os.path.join(settings.MEDIA_ROOT, obj.image.name)
                if os.path.exists(path):
                    os.remove(path)
                dirpath = os.path.dirname(path)
                if os.path.isdir(dirpath) and not os.listdir(dirpath):
                    os.rmdir(dirpath)
        super().delete_queryset(request, queryset)

```
# login view
```py
class LoginView(APIView):
    """
    POST /api/login/
    • Expects JSON: { "username": "<username>", "password": "<password>" }
    • If valid, returns:
        {
          "Authorization": "Bearer <access_token>",
          "access": "<access_token>",
          "refresh": "<refresh_token>",
          "detail": "Logged in successfully"
        }
      and also creates an OutstandingToken row for that access token.
    """
    @extend_schema(request=None, responses={200: dict})
    def post(self, request):
        from datetime import datetime, timezone
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({'detail': 'Invalid credentials'}, status=S401)

        # Create JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Extract token info
        jti = access.get('jti')
        iat = access.get('iat')
        exp = access.get('exp')

        # Convert UNIX timestamps to datetime
        created_at = datetime.fromtimestamp(iat, tz=timezone.utc)
        expires_at = datetime.fromtimestamp(exp, tz=timezone.utc)

        # Record the access token manually
        OutstandingToken.objects.get_or_create(
            jti=jti,
            user=user,
            defaults={
                'token': str(access),
                'created_at': created_at,
                'expires_at': expires_at,
            }
        )

        return Response({
            'Authorization': f'Bearer {str(access)}',
            'access': str(access),
            'refresh': str(refresh),
            'detail': 'Logged in successfully'
        }, status=S200)
```
# old JWT logout
```py

class LogoutView(APIView):
    def strip_token_prefix(self, raw: str) -> str:
        """
        If raw starts with “Bearer ” or “token ” (any capitalization), remove that prefix.
        Otherwise, return raw unchanged.
        """
        if not isinstance(raw, str):
            return raw

        lower = raw.lower()
        if lower.startswith("bearer "):
            # remove first 7 characters (“Bearer ”)
            return raw[7:]
        if lower.startswith("token "):
            # remove first 6 characters (“token ”)
            return raw[6:]
        return raw
    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        access =get_from_request(request,["Authorization",  "access"])
        refresh = get_from_request(request,["refresh", "X-Refresh-Token", "X-Token-Refresh"])
        access = self.strip_token_prefix(access)
        if not access:return Response({"error":"No access token provided"}, status=S400)
        if not refresh:return Response({"error":"bo refresh Token provided"}, status=S400)
        tok = OutstandingToken.objects.filter(token=refresh).first()

        return Response({"access":access, "refresh":refresh, "id":tok.user_id}, S200)

        logout(request)

        return Response({'detail': 'Logged out successfully'})
```