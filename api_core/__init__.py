# __init__.py
import os
APP_LANGS = [('en', 'English'), ('ar', 'Arabic'),]
ROOT_URL = os.environ.get('ROOT_URL', 'http://localhost:8000/')
CONTACTS_EXPIRE_DATE = os.environ.get("CONT_EXP_DD", 30)
# SITE_PHONE_NUMBER = "+20"
PROTECTED_MEDIA = ["profile", "orders"]
CO_NAME = "السلام"
VON_KEY = os.getenv("VON_KEY")
VON_SECRET = os.getenv("VON_SECRET")

import requests

# Global variables
API_URL = "http://dgc4sk8c0skk4ow4c0sw4oc4.159.69.42.206.sslip.io/api/invalidate-cache"
HEADERS = {
    "Authorization": "Bearer 5da7c51b0c235f769224cb42c870c25fee51b36882670fc564d7e53372c7a060",
    "Accept":        "application/json",
    "Content-Type":  "application/json",
}
all_pages = [
    "privacy-policy", "terms-conditions", "about", "footer",
    "packages", "logo", "why-choose-us", "blogs", "ratings", "faq"
]

def invalidate_cache(tags):
    """
    Send a cache-invalidation request for the given tag(s).

    :param tags: str or list of str. If it equals "ALL" (any case), will invalidate all_pages.
                 Otherwise must be one or more tags that exist in all_pages.
    :returns: requests.Response object on success
    :raises: ValueError if any tag is not valid
             requests.HTTPError if the POST fails
    """
    # Normalize input into a list
    if isinstance(tags, str):
        # single string
        if tags.upper() == "ALL":
            selected = all_pages
        else:
            selected = [tags]
    elif isinstance(tags, (list, tuple)):
        # list of strings
        # if any element equals "ALL" (any case), we treat as full list
        if any(isinstance(t, str) and t.upper() == "ALL" for t in tags):
            selected = all_pages
        else:
            selected = list(tags)
    else:
        raise ValueError("`tags` must be a string or a list/tuple of strings")

    # Validate
    invalid = [t for t in selected if t not in all_pages]
    if invalid:
        raise ValueError(f"Invalid tag(s): {invalid}. Valid tags are: {all_pages}")

    # Perform the request
    payload = {"tags": selected}
    resp = requests.post(API_URL, json=payload, headers=HEADERS)
    resp.raise_for_status()  # HTTPError on bad status
    return resp

