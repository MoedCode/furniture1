#!/usr/bin/bash

all=("privacy-policy" "terms-conditions" "about" "footer" "packages" \
"logo" "why-choose-us" "blogs" "ratings" "faq")

# Convert Bash array to JSON array string
json_array=$(printf '"%s",' "${all[@]}")
json_array="[${json_array%,}]"  # Remove trailing comma and wrap in brackets

# Send the first request
curl -X POST http://dgc4sk8c0skk4ow4c0sw4oc4.159.69.42.206.sslip.io/api/invalidate-cache \
  -H "Authorization: Bearer 5da7c51b0c235f769224cb42c870c25fee51b36882670fc564d7e53372c7a060" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{
    \"tags\": $json_array
  }"

: <<'c0'
curl -X POST http://dgc4sk8c0skk4ow4c0sw4oc4.159.69.42.206.sslip.io/api/invalidate-cache \
  -H "Authorization: Bearer 5da7c51b0c235f769224cb42c870c25fee51b36882670fc564d7e53372c7a060" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["why-choose-us"]
  }'

c0