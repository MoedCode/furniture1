# api_core/renderers.py
import json
from rest_framework.renderers import JSONRenderer

class UnescapedJSONRenderer(JSONRenderer):
    """
    Outputs pretty-printed JSON with real newlines,
    unescaped Unicode, and knows how to serialize UUIDs.
    """
    charset = 'utf-8'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return json.dumps(
            data,
            ensure_ascii=False,
            indent=2,
            default=str        # ← this lets json.dumps call str() on UUIDs, dates, etc.
        ).encode(self.charset)