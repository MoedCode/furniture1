#!/usr/bin/env bash
#
# create_superuser.sh
#
# Usage:
#   export SALAM_ADMN_PWD='YourDesiredPassword'
#   ./create_superuser.sh
#
# This will create a superuser with:
#   Username: Alsalam_admin
#   Email:    Alsalam_admin@gimal.com
#   Password: The value of $SALAM_ADMN_PWD
# (Django must be configured so that `./manage.py createsuperuser --no-input`
#  picks up these DJANGO_SUPERUSER_* variables. This works on Django ≥ 2.1.)

set -e

if [[ -z "$SALAM_ADMN_PWD" ]]; then
  echo "ERROR: You must export SALAM_ADMN_PWD before running this script."
  echo "Example:"
  echo "  export SALAM_ADMN_PWD='S3cureP@ssw0rd!'"
  echo "  ./create_superuser.sh"
  exit 1
fi

# Export Django’s superuser env vars:
export DJANGO_SUPERUSER_USERNAME='Alsalam_admin'
export DJANGO_SUPERUSER_EMAIL='Alsalam_admin@gimal.com'
export DJANGO_SUPERUSER_PASSWORD="$SALAM_ADMN_PWD"

# Run the standard createsuperuser command in non-interactive mode
python3 manage.py createsuperuser --no-input

echo "Done."
