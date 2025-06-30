from urllib.parse import urlparse
from api_core.views_H import *


# class CsrfExemptSessionAuthentication(SessionAuthentication):
#     def enforce_csrf(self, request):
#         return  # Disable CSRF check


class NoPostPermission(BasePermission):
    """
    Allow GET, PUT, DELETE only if authenticated.
    Deny POST completely.
    """

    def has_permission(self, request, view):
        if request.method == 'POST':
            return False  # deny all POST
        # For others, require authentication
        return request.user and request.user.is_authenticated


class UserRegister(APIView):
    def post(self, request):
        lang = lang = get_lang(request)

        translation.activate(lang)
        serializer = UsersSerializer(data=request.data, context={'lang': lang})
        if not serializer.is_valid():
            response = Response(errors_(serializer.errors), status=S400)
            # print(f"{errors_(serializer.errors)}")
            return Response(errors_(serializer.errors), status=S400)

        try:
            serializer.save()
        except Exception as e:
            return Response({"detail": str(e)}, status=S500)

        return Response(serializer.data, status=S201)


class UsersView(APIView):
    authentication_classes = [JWTAuthentication,
                              CsrfExemptSessionAuthentication]
    # permission_classes = [NoPostPermission]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def get(self, request):
        lang = lang = get_lang(request)
        translation.activate(lang)
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": trans_str("Not authorized")}, status=S401)

        serializer = UsersSerializer(request.user, context={'lang': lang})

        return Response(serializer.data, status=S200)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        serializer = UsersSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(errors_(serializer.errors), status=S400)

        try:
            serializer.save()
        except Exception as e:
            return Response({"detail": str(e)}, status=S500)

        return Response(serializer.data, status=S201)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def put(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Not authorized"}, status=S401)

        serializer = UsersSerializer(request.user, data=request.data)
        if not serializer.is_valid():
            # print(f"\n\n\n{errors_(serializer.errors)}\n\n\n")
            return Response(errors_(serializer.errors), status=S400)

        try:
            serializer.save()
        except Exception as e:
            return Response({"detail": str(e)}, status=S500)

        return Response(serializer.data, status=S200)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def delete(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Not authorized"}, status=S401)

        try:
            request.user.is_active = False
            request.user.save()
            return Response({"detail": "User deleted"}, status=S204)
        except Exception as e:
            return Response({"detail": str(e)}, status=S500)


class LoginView_(APIView):
    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'detail': 'Logged in successfully'})
        return Response({'detail': 'Invalid credentials'}, S401)


class LoginView(APIView):
    @extend_schema(request=None, responses={200: dict})
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = Users.objects.filter(username=username).first()
        if user:
            if user.is_active:
                user.is_active = True
                user.save()
        user = authenticate(request, username=username, password=password)

        # login(request, user)
        if user is not None:
            # ✅ Create JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'Authorization': f"Bearer {str(refresh.access_token)}",
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'detail': 'Logged in successfully'
            })
        return Response({'detail': 'Invalid credentials'}, S401)
class AccessToken(APIView):
    @extend_schema(request=None, responses={200: dict})
    def post(self, request):
        refresh = get_from_request(request, ["refresh", "X-Refresh-Token", "X-Token-Refresh"])
        if not refresh:
            return Response({"detail": "Refresh token is required."}, status=S400)

        try:
            token = RefreshToken(refresh)

            # Ensure token is not blacklisted
            if BlacklistedToken.objects.filter(token__jti=token['jti']).exists():
                return Response({"detail": "Refresh token has been revoked."}, status=S401)
            str_tok = str(token.access_token)
            return Response({
                "access": str_tok,
                "detail": "New access token issued.",
                "Authorization":"Bearer " + str_tok
            })

        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=S401)

    def get(self, request):
        return self.post(request)

class LogoutView(APIView):

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        refresh = get_from_request(request,["refresh", "X-Refresh-Token", "X-Token-Refresh"])

        if not refresh:return Response({"error":"bo refresh Token provided"}, status=S400)
        try:
            # token = OutstandingToken.objects.filter(token=refresh).first()
            refresh_token = RefreshToken(refresh)
            refresh_token.blacklist()
            return Response({"detail": f"Refresh token revoked successfully."}, status=status.HTTP_200_OK)

        except TokenError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserTokensView(APIView):
    """
    POST   /api/user-tokens/      → List all outstanding tokens for a user
    DELETE /api/user-tokens/      → Revoke (blacklist) all outstanding tokens for a user
    """
    permission_classes = ()  # manual authentication only

    def post(self, request, *args, **kwargs):
        usr = request.data.get("username") or request.data.get("user") or ""
        pwd = request.data.get("password") or ""
        if not usr or not pwd:
            return Response(
                {"detail": "Both 'username' and 'password' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=usr, password=pwd)
        if not user:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = OutstandingToken.objects.filter(user=user)
        data = [{
            "jti":        t.jti,
            "created_at": t.created_at.isoformat(),
            "expires_at": t.expires_at.isoformat(),
            "token":      t.token,
        } for t in tokens]

        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        usr = request.data.get("username") or request.data.get("user") or ""
        pwd = request.data.get("password") or ""
        if not usr or not pwd:
            return Response(
                {"detail": "Both 'username' and 'password' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=usr, password=pwd)
        if not user:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = OutstandingToken.objects.filter(user=user)
        count = 0
        for token in tokens:
            _, created = BlacklistedToken.objects.get_or_create(token=token)

            if created:
                count += 1

        return Response(
            {"detail": f"Revoked {count} token(s) for user."},
            status=status.HTTP_200_OK
        )
class ProfileView(APIView):
    authentication_classes = [JWTAuthentication,
                              CsrfExemptSessionAuthentication]
    # permission_classes = [NoPostPermission]

    @extend_schema(responses=ProfileSerializer)
    def get(self, request):
        lang = lang = get_lang(request)
        translation.activate(lang)

        if not request.user or not request.user.is_authenticated:
            return Response({"detail": trans_str("Not authorized")}, status=S401)

        profile, created = Profile.objects.get_or_create(user=request.user)
        status_ = S201 if created else S200
        serialized_prof = ProfileSerializer(
            profile, context={'lang': lang, 'request': request})
        return Response(serialized_prof.data, status_)

    @extend_schema(request=ProfileSerializer, responses=ProfileSerializer)
    def post(self, request):
        lang = lang = get_lang(request)
        translation.activate(lang)
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": trans_str("Not authorized")}, status=S401)

        data = request.data.copy()
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']

        serializer = ProfileSerializer(data=data,
                                       context={'request': request, 'lang': lang})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=S201)
        return Response(trans_str(serializer.errors["detail"][0]), status=S400)

    @extend_schema(request=ProfileSerializer, responses=ProfileSerializer)
    def put(self, request):
        lang = lang = get_lang(request)
        translation.activate(lang)
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": trans_str("Not authorized")}, status=S401)

        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"detail": trans_str("Profile not found.")}, status=S404)

        data = request.data.copy()
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']

        serializer = ProfileSerializer(profile, data=data, partial=True,
                                       context={'request': request, 'lang': lang})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=S200)
        # print(f"\n\n\n\{serializer.errors}")
        return Response(serializer.errors, status=S400)

    @extend_schema(request=ProfileSerializer, responses=ProfileSerializer)
    def delete(self, request):
        lang = lang = get_lang(request)
        translation.activate(lang)
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": trans_str("Not authorized")}, status=S401)

        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"detail": trans_str("Profile not found.")}, status=S404)

        profile.delete()
        return Response(status=S204)
class GetVerificationCode(APIView):
    # authentication_classes = [JWTAuthentication,
    #                         CsrfExemptSessionAuthentication]
    def get(self, request):
        user = request.user
        send_res = send_V_code(user)
        code = send_res["code"]
        if not send_res["sent"]:
            return Response({"detail":send_res["errors"],"code":code.code}, status=S400)

        return Response({"detail":f"code sent to {user.phone_number}"})

class UserActivate(APIView):
    authentication_classes = [JWTAuthentication,
                              CsrfExemptSessionAuthentication]
    def post(self, request):
        user = request.user
        user_d = UsersSerializer(user).data
        # return Response({"user":user_d})
        code = getTheValidKeyName(["code","verification_code","verificationCode"], request)
        if not code: return Response({"error":"no verification code "}, status=S400)
        valid_code = VerificationCode.objects.filter(user=user, code=code).first()
        if not valid_code:
            return Response({"detail":f"code not {code}correct"}, status=S404)
        if valid_code.is_used or not valid_code.is_valid:
            return Response({"detail":f"code {code} expired"}, status=S404)
        user = Users()
        user.verified_phone = True
        user.is_active = True
        return Response({"detail":"Account activated"})
    def get(self, request):
        return self.post(request)

    pass
class ProfileImage(APIView):
    authentication_classes = [JWTAuthentication,
                              CsrfExemptSessionAuthentication]

    @extend_schema(request=ProfileSerializer, responses=ProfileSerializer)
    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Not authorized"}, status=S401)

        profile = Profile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"detail": "Profile not found."}, status=S404)

        if not profile.image:
            return Response({"detail": "Profile has no image"}, status=S404)

        # Ensure the file exists on disk
        image_path = profile.image.path
        if not os.path.exists(image_path):
            return Response({"detail": "Image file not found on disk"}, status=S404)

        return FileResponse(open(image_path, 'rb'), content_type='image/jpeg')
class ContactUsView(APIView):
    @extend_schema(request=ProfileSerializer, responses=ProfileSerializer)
    def post(self, request):
        lang = get_lang(request)
        keys = ["name", "phone_number", "email", "enquiry", "message"]
        request_data = get_req_val(request=request, key_or_keys=keys)
        result = ContactUsSerializer(data=request_data, lang=lang)
        if not result.is_valid():
            return Response({"detail": result.errors}, status=S400)
        result.save()

        return Response({"detail": "contact created"}, status=S201)


class RatingView(APIView):

    # authentication_classes = [JWTAuthentication]
    # permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication,
                              CsrfExemptSessionAuthentication]

    @extend_schema(request=ProfileSerializer, responses=ProfileSerializer)
    def get(self, request):
        """
        List all ratings created by the current user.
        """
        lang = get_lang(request)
        msg = "app not rated yet" if lang == "en" else "الموقع لم يتم تقييمه بعد"
        ratings = Rating.objects.all()
        if not ratings:
            return Response({"detail": msg}, S404)
        ratings_dicts = RatingSerializer(ratings, many=True).data
        # for
        return Response(ratings_dicts, status=S200)

    @extend_schema(request=ProfileSerializer, responses=ProfileSerializer)
    def post(self, request):
        """
        Create a new rating for the current user.
        """
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": trans_str("Not authorized")}, status=S401)

        data = get_req_val(request, ["comment", "stars"])
        prev_rate = Rating.objects.filter(user=request.user).first()
        if prev_rate:
            if not data["comment"] and not data["stars"]:
                return Response({"error": "no valid data"}, S400)
            prev_rate.comment = data["comment"] or prev_rate.comment
            prev_rate.stars = data["stars"] or prev_rate.stars
            prev_rate.save()
            rate_ser = RatingSerializer(prev_rate).data
            return Response(rate_ser, status=S200)

        data["user"] = request.user
        # print(f"\n\n\n ------{data}`````\n\n\n")
        serializer = RatingSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=S400)

        rating = serializer.save()
        return Response(RatingSerializer(rating).data, status=S201)

########################### ORDER ###########################

class OrdersAPIView(APIView):
    # optional, for the browsable API
    authentication_classes = [JWTAuthentication,SessionAuthentication,]
    # <<— only allow requests with a valid user
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    permission_classes = [IsAuthenticated,]
    def get_all_orders(self, request):
        orders = Orders.objects.filter(user=request.user)
        orders_dicts = []
        for order in orders:

            serializer = OrdersSerializer(
                order, context={'request': request}
            )
            order_dict = serializer.data.copy()
            order_dict["images"] = self.get_order_images(order, request)
            orders_dicts.append(order_dict)


        return Response(orders_dicts, status=S200)
    def get(self, request):
        lang = get_lang(request)
        s = request.query_params.get('select')
        if s == "all":
            return self.get_all_orders(request)
        # 1) SINGLE‐ORDER BRANCH: use get() instead of filter()
        try:
            order = Orders.objects.filter(user=request.user).exclude(order_state="archived").order_by('-created_at').first()
            if not order: return Response({"detail": "no Order  found"}, status=S404)
        except Orders.DoesNotExist:
            return Response({"detail": "Order not found"}, status=S404)

        serializer = OrdersSerializer(
            order, context={'request': request, 'lang': lang}
        )
        order_dict = serializer.data.copy()

        order_dict["images"] = self.get_order_images(order, request)

        return Response(order_dict, status=S200)

        # 2) LIST‐ALL‐ORDERS BRANCH


    def post(self, request):
        lang = get_lang(request)
        order = Orders.objects.filter(user=request.user).exclude(order_state="archived").first()

        if order:
            if order.order_state == "done" or order.order_state == "rejected":
                order.delete()
            else:
                return Response({"detail":f"you have order "})
        data = self.data_preparation(request)
        # return Response(data, status=S200 )
        serializer = OrdersSerializer(
            data=data, context={'request': request, 'lang': lang}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=S404)

        order = serializer.save()

        # handle any uploaded images
        for img in request.FILES.getlist('order_images'):
            OrderImage.objects.create(order=order, image=img)

        return Response(
            {'detail': 'order created', 'id': str(order.id)},
            status=S201
        )

    def put(self, request):
        lang = get_lang(request)
        # order_id = request.query_params.get('order_id')
        # if not order_id:
        #     return Response(
        #         {"detail": "order_id query param required"},
        #         status=S404
        #     )

        try:
            order = Orders.objects.filter(user=request.user).exclude(order_state="archived").order_by('-created_at').first()
        except Orders.DoesNotExist:
            return Response(
                {"detail": "Order not found"},
                status=S404
            )

        data = request.data.copy()
        serializer = OrdersSerializer(
            order,
            data=data,
            partial=True,
            context={'request': request, 'lang': lang}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=S404)

        serializer.save()

        # Add new images
        for img in request.FILES.getlist('order_images'):
            OrderImage.objects.create(order=order, image=img)

        # Any images that were removed in `data['order_images']` will be cleaned up
        # by your OrderImage.save()/delete() logic when omitted.

        return Response(
            OrdersSerializer(
                order, context={'request': request, 'lang': lang}).data,
            status=S200
        )

    def delete(self, request):

        try:
            orders = Orders.objects.filter(user=request.user)
        except Orders.DoesNotExist:
            return Response(
                {"detail": "Order not found"},
                status=S404
            )
        for order in orders:
            if order.order_state != "archived":
                order_images = OrderImage.objects.filter(order=order)
                for image in order_images:
                    image.delete()
                order.order_state ="archived"
                order.save()
        return Response(status=S204)
    def data_preparation(self, request):
        data = request.data.copy()
        c = data["promo_code"] or None
        p = data["package"] or None
        # user
        data['user'] = request.user.id
        # handle promo code
        val_c_id = is_valid_uuid4(c)
        if not val_c_id:
            code_qs = PromoCode.objects.filter(code=c).first()
            if code_qs: data["promo_code"] = code_qs.id
            else: data["promo_code"] = None

        # handle package
        val_p_id = is_valid_uuid4(p)

        if not val_p_id:
            package = Packages.objects.filter(name=p).first()
            if package: data["package"] = package.id
            else: data["package"] = None
        return data
    def get_order_images(self, order:Orders, abs_url):
        if not isinstance(order, Orders):
            return []
        if not isinstance(abs_url, str):
            abs_url = abs_url.build_absolute_uri()
        images_obj = OrderImage.objects.filter(order=order)
        images_urls = []
        for img_obj in images_obj:
            image_url = abs_url + "media/" +img_obj.image.name
            images_urls.append(image_url)
        return images_urls
class UploadOrderImagesAPIView(APIView):
    """
    POST /api/orders/upload-images/
      - Headers: Authorization: Bearer <jwt-token>
      - Content-Type: multipart/form-data
      - Body (form-data):
          • order_id: <UUID or PK of an existing order>
          • order_images: <file #1>
          • order_images: <file #2>
          …
    Creates a new OrderImage for each uploaded file. Returns 201 + list of URLs.
    """
    parser_classes = [FormParser, MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1) Extract and validate order_id
        order_id = request.data.get('order_id')
        if not order_id:
            return Response(
                {"detail": "order_id is required in the form data."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Make sure the order exists and belongs to the requesting user
        order = get_object_or_404(Orders, id=order_id, user=request.user)

        # 2) Check for uploaded files under 'order_images'
        files = request.FILES.getlist('order_images')
        if not files:
            return Response(
                {"detail": "No files were uploaded under 'order_images'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Create an OrderImage for each file
        created_images = []
        for img in files:
            oi = OrderImage.objects.create(order=order, image=img)
            created_images.append(oi)

        # 4) Build a simple response containing each new image's URL
        #    (You can also serialize them if you have an OrderImageSerializer.)
        out = []
        for oi in created_images:
            out.append({
                "id": str(oi.id),
                "image_url": request.build_absolute_uri(oi.image.url)
            })

        return Response(
            {"detail": f"{len(created_images)} image(s) uploaded.", "images": out},
            status=status.HTTP_201_CREATED
        )
# core/views_protected_media.py

