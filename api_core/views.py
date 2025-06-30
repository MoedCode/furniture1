# views.py
from django.conf import settings
from api_core.views_H import *
from django.urls import reverse
# print(f"------------ { reverse('home') }------------------")


class IsAdminAndLogged(permissions.BasePermission):
    """
    Allows access only to authenticated admin (staff) users.
    """

    def loggedAndPermission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            request.user.is_staff
        )

        # About Endpoints


class AboutView(APIView):
    """
    GET: Retrieve the About section details.
    - Includes: title, description, logo URL, and list of cover images.
    - Uses Accept-Language to localize data (default fallback to first About entry).
    """
    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)

    def get(self, request):
        lang = get_lang(request)

        # return Response({"lang":lang}, status=S200)
        translation.activate(lang)
        about = About.objects.filter(lang=lang).first()
        if not about:
            return Response({"detail": trans_str("Al Salam furniture moving")}, S404)

        about_data = AboutSerializer(about, context={'lang': 'en'}).data
        about_data["images"] = self.get_covers(request)
        return Response(about_data, S200)
    def get_covers(self, request):
        # check if jusr admin who can update delete about images
        lang = get_lang(request)
        translation.activate(lang)
        about = About.objects.filter(
            lang=lang).first() or About.objects.first()
        if not about:
            Response({"error": "no cover images found"}, status=S404)
        covers = AboutCoverImage.objects.filter(about=about)
        if not covers:
            Response({"error": "no cover images found"}, status=S404)

        covers_data = AboutCoverImageSerializer(covers, many=True).data
        for cover in covers_data:
            del cover["id"]
            if cover["image"]:
                cover["image"] = request.build_absolute_uri(
                    '/') + cover["image"]
        return covers_data
    permission_classes = [IsAdminAndLogged]


class LogoViews(APIView):
    """
    GET: Returns the full absolute URL of the logo image from the About section.
    """

    def get(self, request):
        lang = get_lang(request)
        translation.activate(lang)
        about = About.objects.filter(
            lang=lang).first() or About.objects.first()
        if not about or not about.logo:
            return Response({"error": "no logo image found"}, status=S404)
        logo_url = request.build_absolute_uri('/') + about.logo.url
        return Response({"url": logo_url}, status=S200)


class LogoImageFile(APIView):
    """
    GET: Serves the actual image file (binary response) for the logo.
    - Returns: image/jpeg or image/png (auto-detected).
    """

    def get(self, request):
        about = About.objects.first()
        if not about or not about.logo:
            raise Http404("Logo not found.")

        return FileResponse(about.logo.open("rb"), content_type="image/*")


class CoversView(APIView):
    """
    GET: Retrieves a list of About cover images with captions and image URLs.
    - Filters by language if provided.
    """

    def get(self, request):
        lang = get_lang(request)
        translation.activate(lang)
        about = About.objects.filter(
            lang=lang).first() or About.objects.first()
        if not about:
            Response({"error": "no cover images found"}, status=S404)
        covers = AboutCoverImage.objects.filter(about=about)
        if not covers:
            Response({"error": "no cover images found"}, status=S404)

        covers_data = AboutCoverImageSerializer(covers, many=True).data
        for cover in covers_data:
            if cover["image"]:
                cover["image-url"] = request.build_absolute_uri(
                    '/') + cover["image"]
        return Response(covers_data, status=S201)


class CoversFileImagesView(APIView):
    """
    POST: Returns the actual image file of a cover image (binary response).
    - Requires either:
        - `id`: to fetch by database ID, or
        - `image`: filename from filesystem (relative path)
    - Publicly accessible (no permissions required)
    """

    permission_classes = []  # Public access

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        try:
            image_id = request.data.get('id')
            filename = request.data.get('image')

            if image_id:
                cover = AboutCoverImage.objects.get(id=image_id)
                file_path = cover.image.path
            elif filename:
                file_path = os.path.join(
                    settings.MEDIA_ROOT, 'images/about/covers', filename)
            else:
                return Response({"detail": "image_id or filename must be provided."}, status=400)

            if not os.path.exists(file_path):
                raise FileNotFoundError

            return FileResponse(open(file_path, 'rb'), content_type='image/jpeg')

        except AboutCoverImage.DoesNotExist:
            raise Http404("Image with this ID not found.")
        except FileNotFoundError:
            raise Http404("Image file not found.")
        except Exception as e:
            return Response({"detail": str(e)}, status=500)


@extend_schema_view(
    get=extend_schema(exclude=True)
)
class AboutFrom(APIView):
    permission_classes = [IsAdminAndLogged]

    def get(self, request):
        return render(request, "set_about.html")


class PackagesView(APIView):
    authentication_classes = [SessionAuthentication]
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def get(self, request):
        lang = get_lang(request)
        translation.activate(lang)

        if not Packages.objects.exists():
            return Response({"detail": trans_str("No packages created yet.")}, status=404)
        packages = Packages.objects.all()

        serialized_packages = PackagesSerializer(packages, many=True,
                                                 context={'lang': lang}).data
        return Response(serialized_packages, status=S200)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        serialized_package = PackagesSerializer(data=request.data)
        if not serialized_package or not serialized_package.is_valid:
            return Response(serialized_package.errors, S400)
        serialized_package.save()
        return Response(serialized_package.data, S201)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def put(self, request):
        Package_id = request.query_params.get('id')
        if not Package_id:
            return Response({"details": "package"}, S404)
        try:
            package = Packages.objects.get(Package_id)
        except Packages.DoesNotExist:
            return Response({"detail": f"package {Package_id} not found"}, S404)
        serialized_package = PackagesSerializer(
            package, data=request.data, partial=True)
        if not serialized_package.is_valid():
            return Response(serialized_package.errors, S400)
        serialized_package.save()
        return Response(serialized_package.data, S200)

    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def delete(self, request):
        Package_id = request.query_params.get('id')
        if not Package_id:
            return Response({"details": "package"}, S404)
        try:
            package = Packages.objects.get(Package_id)
        except Packages.DoesNotExist:
            return Response({"detail": f"package {Package_id} not found"}, S404)
        serialized_package = PackagesSerializer(
            package, data=request.data, partial=True)
        package.delete()
        return Response({"detail": f"Package {Package_id}deleted successfully"}, S200)


class WhyChooseUsListView(APIView):
    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def get(self, request):
        lang = lang = get_lang(request)

        # translation.activate(lang)
        if lang.lower() in "arabic":
            lang = 'ar'
        if lang.lower() not in available_langs:
            lang = 'en'

        queryset = WhyChooseUs.objects.filter(lang=lang)
        if not queryset:
            queryset = WhyChooseUs.objects.all()
        serializer = WhyChooseUsSerializer(
            queryset, many=True, context={'request': request}
        )
        return Response(serializer.data, S200)


class WhyChooseUsImageView(APIView):
    """
    Retrieve image of a WhyChooseUs instance by ID or image path.
    Supports ?id=<uuid> or ?image=<relative_path>
    """
    @extend_schema(request=PackagesSerializer, responses=PackagesSerializer)
    def post(self, request):
        uuid = request.data.get("id")
        image_path = request.data.get("image")

        try:
            if uuid:
                obj = WhyChooseUs.objects.get(id=uuid)
                if obj.image:
                    return FileResponse(obj.image.open(), content_type='image/jpeg')

            elif image_path:
                from django.conf import settings
                abs_path = os.path.join(settings.MEDIA_ROOT, image_path)
                if os.path.exists(abs_path):
                    return FileResponse(open(abs_path, 'rb'), content_type='image/jpeg')
        except WhyChooseUs.DoesNotExist:
            raise Http404("Object not found")

        return Response({"detail": "Image not found"}, S404)


class BlogsListView(APIView):
    """
    GET: Return list of blog previews (id, paragraph, full image URL) filtered by language.
    """
    @extend_schema(request=BlogSerializer, responses=BlogSerializer)
    def get(self, request):
        lang = get_lang(request)
        translation.activate(lang)

        blogs = Blogs.objects.filter(language=lang) or Blogs.objects.all()
        if not blogs.exists():
            return Response({"detail": "No blogs found for this language."}, status=S404)

        data = [
            {
                "id": blog.id,
                "paragraph": unescape_newlines(blog.paragraph),

                "image": request.build_absolute_uri(blog.image.url) if blog.image else None,
            }
            for blog in blogs
        ]
        return Response(data, status=S200)


class BlogDataView(APIView):
    def post(self, request):
        blog_id = get_req_val(request=request, key_or_keys="blog_id")
        if not blog_id:
            return Response({"error": "No blog id provided"}, status=S400)
        blog = Blogs.objects.filter(id=blog_id).first()
        if not blog:
            return Response({"error": f"cant find blog with id {blog_id}"}, status=S404)
        blog_dict = BlogSerializer(blog, context={"request": request}).data
        blog_dict["paragraph"] = unescape_newlines(blog_dict["paragraph"])
        blog_dict["article"] = parse_text(blog_dict["article"])
        return Response({"data": blog_dict}, status=S200)

    def get(self, request):
        x = BlogDataView()
        return x.post(request)


class OrderCarView(APIView):
    def post(self, request):
        lang = get_lang(request)
        required_keys = [
            "package", "from_address", "to_address", "transportation_date",
            "transportation_date", "transportation_time", "rooms_number", "phone_number",
            "phone_code", "belonging_description"
        ]
        data = get_req_val(request=request, key_or_keys=required_keys)
        uploaded_paths = request_files(
            request=request, upload_path="images/Orders")


class PromoCodeView(APIView):
    def check_PC(sef, request):
        code = get_req_val(request, "code")
        if not code:
            return Response(
                {"error": "promo code not provided"},
                status=S400
            )

        # Check whether a PromoCode with this code exists
        if not PromoCode.objects.filter(code=code).exists():
            return Response(
                {"error": f"{code} invalid promotion"},
                status=S404
            )
        # Safely fetch it
        promo = PromoCode.objects.get(code=code)
        # Build your payload
        # If value < 1, assume it's already a fraction; otherwise divide by 100
        discount = promo.value if promo.value < 1 else promo.value / 100

        data = {
            "id":    str(promo.id),
            "code":  promo.code,
            "value": discount,
        }
        return Response(data, status=S200)
    def get(self, request):
        return self.check_PC(request)
    def post(self, request):
        return self.check_PC(request)


class CleanMedia(APIView):
    from api_core.utils import clean_media

    def get(self, request):
        clean_media(Orders, "orders")


def test_page(request):
    # just render the login form
    return render(request, 'test.html')

class ApiDocsView(View):
    def get(self, request):
        md_path = os.path.join(settings.BASE_DIR, "docs", "api_documentation.md")
        with open(md_path, "r", encoding="utf-8") as f:
            md_content = f.read()
        html = markdown.markdown(md_content, extensions=["fenced_code", "tables"])
        return HttpResponse(html)
class CommonQuestionsView(APIView):
    def get(self, request):
        lang = get_lang(request)
        # lang = "Arabic" if lang == "ar" else "English"
        # return Response({"detail":lang}, status=S404)

        CQ_objs = CommonQuestions.objects.filter(language=lang)
        if not CQ_objs:
            return Response({"detail":[]}, status=S404)
        CQ_dicts = CommonQuestionsSerializer(CQ_objs, many=True)
        if not CQ_dicts.is_valid:
            return Response({"details":CQ_dicts.errors}, status=S400)
        return Response({"details":CQ_dicts.data}, status=S201)
import json
class SiteDataView(APIView):

    def get(self, request,file_name = None):
        try:
            lang = get_lang(request, "ar")
            # if lang not in [en]
            file_name = get_req_val(request,"file_name") or file_name
            exaction = ".json"
            full_path = os.path.join(settings.BASE_DIR, "site_data",file_name + exaction)
            if not os.path.exists(full_path) or not os.path.isfile(full_path):
                 return Response({"detail":f"file {file_name} not found"}, S400)
            data = {}
            with open(full_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                data = data[lang] or data

            return Response({"detail":data}, S200)
        except Exception as E:
            return Response({"detail":f"{E}","file_name":file_name}, S400)
class  RegisterFromView(APIView):
    def get(self, request):
        return render( request,"register.html")

