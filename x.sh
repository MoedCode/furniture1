#!/usr/bin/bash
httrack \
  "http://dgc4sk8c0skk4ow4c0sw4oc4.159.69.42.206.sslip.io/ar" \
  -O ./my-local-copy \
  --mirror \                        # shorthand for -r -N -l inf --no-remove-listing
  --page-requisites \               # download CSS, JS, images, fonts…
  --convert-links \                 # fix up links to point at your local files
  --adjust-extension \              # save pages with .html suffix
  --robots=0 \                      # ignore robots.txt (optional)
  --depth=5 \                       # follow links up to 5 levels deep
  "+dgc4sk8c0skk4ow4c0sw4oc4.159.69.42.206.sslip.io/*" \
  "-*" \
  -v
