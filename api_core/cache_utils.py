import requests

# API endpoint for cache invalidation
API_URL = "http://dgc4sk8c0skk4ow4c0sw4oc4.159.69.42.206.sslip.io/api/invalidate-cache"
HEADERS = {
    "Authorization": "Bearer 5da7c51b0c235f769224cb42c870c25fee51b36882670fc564d7e53372c7a060",
    "Accept":        "application/json",
    "Content-Type":  "application/json",
}
# all_pages = [
#     "privacy-policy", "terms-conditions", "about", "footer",
#     "packages", "logo", "why-choose-us", "blogs", "ratings", "faq"
# ]

# Map each Django model (by class name) to the front-end cache tags it owns
MODEL_TAGS = {
    "About":           ["about"],
    "logo":           ["logo"],
    "Packages":        ["packages"],
    "Why ChooseUs":     ["why-choose-us"],
    "Blogs":           ["blogs"],
    "Rating":          ["ratings"],
    "Footer":          ["footer"],
    "Common Questions": ["faq"],
    "Privacy Policy": ["privacy-policy"],
    "Terms And Conditions": ["terms-conditions"],
    # "Not Exist Tag": ["Not Exist Tag"],
    # Add additional models and tags as needed
}

# A flat list of all unique tags (for the admin UI)
ALL_TAGS = sorted({tag for tags in MODEL_TAGS.values() for tag in tags})


def invalidate_cache_for_tags(tags):
    """
    Invalidate cache for the given list of tag strings.

    :param tags: list of strings, e.g. ['about', 'footer']
    :raises: requests.HTTPError if the request fails
    """
    payload = {"tags": tags}
    resp = requests.post(API_URL, json=payload, headers=HEADERS)
    resp.raise_for_status()
    return resp


def invalidate_cache_for_model(model_name):
    """
    Invalidate cache for the model identified by its class name.

    :param model_name: string e.g. 'About', 'Packages'
    :raises: ValueError if model_name not in mapping
             requests.HTTPError if the request fails
    """
    tags = MODEL_TAGS.get(model_name)
    if not tags:
        raise ValueError(f"No cache tags configured for model '{model_name}'")
    return invalidate_cache_for_tags(tags)
