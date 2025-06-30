from api_core.views_H import *
import os
from django.conf import settings
# from django.contrib.staticfiles.views import serve as static_serve

from api_core.__init__ import PROTECTED_MEDIA
# class MediaView(APIView):
#     def get(self, request):

class MediaView(APIView):
    # def str_sub (self, sub_from, str):
    #     for c in str:
    #         if
    def get(self, request):
        user = request.user
        path =  request.query_params.get('path', "")
        full_path = os.path.join(settings.MEDIA_ROOT, "images", path)
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            raise Http404("File not found")

        if not user or not user.is_authenticated:
            return Response({"detail":"Not Authorized"}, status=S404)


        # return Response({"usr":request.user.username, "full_path":full_path},status=S200)

        if "orders" in path:
            order_id = Orders.objects.filter(user=user).first().id
            if str(order_id) in path:
                return FileResponse(open(full_path, 'rb'))
        if "profile" in path:
            if request.user:
                print(f"\n {'-'*100}\n")
                profile = Profile.objects.filter(user=user).first()
                if profile and profile.image.path:
                    return FileResponse(open(profile.image.path, "rb"))


class ProtectedMediaView(View):
    permission_classes = [IsAuthenticated]

    """
    Serves files under MEDIA_ROOT/images/<path> but checks:
    - If <path> starts with a protected folder (e.g. "profile/…" or "orders/…"),
      only allow if request.user.is_authenticated AND request.user.is_staff.
    - Otherwise, serve normally with the correct Content-Type so the browser shows it inline.
    """
    def serve_file(self, request, path, *args, **kwargs):

        # 2) Build the full filesystem path:
        full_path = os.path.join(settings.MEDIA_ROOT, "images", path)

        # 3) If the file doesn’t exist or isn’t a file, return 404:
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            raise Http404("File not found")

        # 4) Determine the correct MIME type:
        mime_type, encoding = mimetypes.guess_type(full_path)
        if mime_type is None:
            # Fallback to binary if unknown:
            mime_type = "application/octet-stream"

        # 5) Stream the file with the correct Content-Type:
        return FileResponse(open(full_path, "rb"), content_type=mime_type)

    def get(self, request, path, *args, **kwargs):
        # `path` is the portion after 'media/images/' (e.g. "profile/avatar.jpg").
        # Split once to get the first folder name:
        parts = path.split("/", 1)
        first_folder = parts[0] if parts else ""
        user = request.user
        # 1) If this request is for a protected folder, enforce admin‐only
        if first_folder in PROTECTED_MEDIA:

            if (user.is_authenticated and user.is_staff):
                print(f"\n\n\n{request.headers}")
                return self.serve_file(request, path, *args, **kwargs)
        URL = request.build_absolute_uri()
        if "order" in URL or "profile" in URL:
            params = {"path":path}
            base = reverse("media")
            url = f"{base}?{urlencode(params)}"
            print(f"\n\n\n\n direct-url: {url} \n\n\n")
            return redirect(url)
        else:
            return self.serve_file(request, path, *args, **kwargs)

'''
class ProtectedMediaView_(View):
    from api_core.__init__ import PROTECTED_MEDIA
    """
    Serves files under MEDIA_ROOT/images/<path> but checks:
    - If <path> starts with a protected folder (e.g. "profile/..." or "orders/..."),
      only allow if request.user.is_authenticated and request.user.is_staff (admin).
    - Otherwise, serve normally.
    """

    def get(self, request, path, *args, **kwargs):
        # `path` is the portion after 'media/images/' (e.g. "profile/avatar.jpg").
        # Split by slash to see if first segment is protected:
        parts = path.split("/", 1)
        first_folder = parts[0] if parts else ""

        # 1) If this request is for a protected folder, enforce admin‐only
        if first_folder in PROTECTED_MEDIA:
            user = request.user
            if not request.user or not request.user.is_superuser:
                return HttpResponseForbidden("You do not have permission to access this file.")

        # 2) Compute full filesystem path
        full_path = os.path.join(settings.MEDIA_ROOT, "images", path)

        # 3) If file doesn’t exist, return 404
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            raise Http404("File not found")

        # 4) Open and stream the file
        return FileResponse(open(full_path, "rb"), content_type="application/octet-stream")

'''
