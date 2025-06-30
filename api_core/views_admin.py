from api_core.views_H import *
from api_core.cache_utils import *


class  CacheControlView(APIView):
    authentication_classes = [JWTAuthentication,
                              CsrfExemptSessionAuthentication]
    def get(self, request):
        # tags = list(MODEL_TAGS)
        if not request.user or not request.user.is_superuser:
            return render(request, "admin/notAuth.html", context={"MODEL_TAGS":MODEL_TAGS})

        return render(request, "admin/CacheControl.html", {
    "MODEL_TAGS": MODEL_TAGS,
    "selected_tags": [],  # or [] by default
    })

    def post(self, request):
        # Use Django's native QueryDict to retrieve all selected tags:
        if not request.user or not request.user.is_superuser:
            return Response({"detail":"not authorized"}, status=S401)
        post = request._request.POST
        if "select-all" in post:
            tags = list(MODEL_TAGS.values())
            # flatten the lists of tags
            tags = [t for sub in tags for t in sub]
        else:
            tags = post.getlist("tags")

        resp = invalidate_cache_for_tags(tags)

        # 2) Attempt to parse out JSON
        try:
            payload = resp.json()
        except ValueError:
            # non‑JSON or malformed → treat as error text
            return Response(
                {"detail": f"Error invoking cache API: {resp.text}"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # 3) If the API told us it succeeded…
        if payload.get("success", False):
            revalidated = payload.get("revalidated", [])
            if revalidated:
                # Build a numbered list string
                msg = f"{len(revalidated)} results=> " + list2str(revalidated, ".   -")
            else:
                msg = "Cache API returned success but no tags were revalidated."

            return Response(
                {"detail": msg},
                status=status.HTTP_200_OK
            )

        # 4) Otherwise it failed or partial‑fail
        #    It might include an 'error' or 'not_revalidated' key
        error_detail = payload.get("error") or payload.get("message") or str(payload)
        return Response(
            {"detail": f"Cache invalidation failed: {error_detail}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class DeleteInActiveUsers(APIView):
    authentication_classes = [JWTAuthentication,
                              CsrfExemptSessionAuthentication]
    def get(self, request):
        if not request.user or not request.user.is_superuser:
            return Response({"detail":"not authorized"}, status=S401)
        # in_active =
from rest_framework import serializers, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils.dateparse import parse_date, parse_datetime
from .models import Orders

# Serializer for Orders
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = [
            'id', 'order_state', 'service_type', 'user', 'package',
            'promo_code', 'transportation_date', 'created_at',
            'phone_number', 'from_address', 'to_address'
        ]
        depth = 1  # include related PK/names

FIELD_CHOICES = [
    'order_state', 'service_type', 'package__name', 'promo_code__code',
    'transportation_date', 'created_at', 'user__username',
    'user__email', 'phone_number'
]

class OrderSearchAPIView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, format=None):
        field = request.query_params.get('field')
        q     = request.query_params.get('q')

        if not field or not q:
            return Response(
                {'error': 'Both "field" and "q" query parameters are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if field not in FIELD_CHOICES:
            return Response(
                {'error': f'Invalid field. Must be one of {FIELD_CHOICES}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        lookup = None
        filters = {}
        # date and datetime exact match
        if field in ('transportation_date', 'created_at'):
            # try parse date/datetime
            if field == 'transportation_date':
                val = parse_date(q)
                lookup = f'{field}'
            else:
                val = parse_datetime(q)
                lookup = f'{field}'

            if not val:
                return Response(
                    {'error': f'Invalid date/datetime format for field {field}.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            filters[lookup] = val
        else:
            # text lookup
            lookup = f'{field}__icontains'
            filters[lookup] = q

        try:
            qs = Orders.objects.filter(**filters)
            serializer = OrderSerializer(qs, many=True)
            return Response({'results': serializer.data}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {'error': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )