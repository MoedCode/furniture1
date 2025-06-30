import json

from django.utils.deprecation import MiddlewareMixin

class PrettyJsonMiddleware(MiddlewareMixin):
    """
    Re-format all JSON responses to be pretty-printed with real newlines
    and unescaped Unicode, regardless of which renderer was used.
    """
    def process_response(self, request, response):
        content_type = response.get('Content-Type', '').split(';')[0]
        if content_type == 'application/json' and response.content:
            try:
                # load the existing JSON
                data = json.loads(response.content)
                # re-dump it prettily
                pretty = json.dumps(data, ensure_ascii=False, indent=2)
                response.content = pretty.encode(response.charset or 'utf-8')
                # update Content-Length header
                response['Content-Length'] = str(len(response.content))
            except Exception:
                # if anything goes wrong (invalid JSON, etc.), leave it alone
                pass
        return response
