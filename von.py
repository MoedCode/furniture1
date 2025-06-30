#!/usr/bin/env python3
"""
Standalone script to send an SMS via Vonage (formerly Nexmo).

Usage:
  Interactive mode: ./von.py
  CLI mode:         ./von.py --phone "+201234567890" --message "Hello from Vonage!"

Environment variables required:
  VONAGE_API_KEY       Your Vonage API key
  VONAGE_API_SECRET    Your Vonage API secret

Options:
  -f, --from SENDER    Override default sender name/number
  -q, --quiet          Only print success/failure message
  -v, --verbose        Print full API response
"""



# von.py — send an SMS via the Vonage SMS API using v4 of the SDK
from os import getenv
from vonage import Vonage, Auth, HttpClientOptions
from vonage_sms import SmsMessage

def main(phone_number, sms):
    # 1️⃣ Authenticate
    auth = Auth(
        api_key=getenv("VON_KEY"),
        api_secret=getenv("VON_SECRET"),
    )

    # HttpClientOptions is optional; you can omit it if you don’t need custom timeouts, etc.
    options = HttpClientOptions()

    # 2️⃣ Create the Vonage client
    client = Vonage(auth=auth, http_client_options=options)

    # 3️⃣ Build your SMS message
    message = SmsMessage(
        to=phone_number,
        from_="Vonage APIs",
        text=sms,
    )

    # 4️⃣ Send it
    response = client.sms.send(message)
    print(f"{response.__dict__}")
    # 5️⃣ Inspect the response
    msg = response.messages[0]
    if msg.status == "0":
        print("Message sent successfully.")
    else:
        print(f"Message failed with error: {msg.error_text}")

if __name__ == "__main__":
    phones = [ "201060860125"]
    msg = "Alsamurai bemsy we be2olak as7a lelkalam"
    for  phone in phones:

        main(phone, msg)



'''
import os
import sys
import argparse

try:
    from vonage import Auth, Vonage
    from vonage_sms import SmsMessage
except ImportError:
    sys.stderr.write("Missing dependencies. Run: pip install vonage vonage-sms\n")
    sys.exit(1)


def send_sms(to_number: str, text: str, sender: str, verbose: bool):
    """Send an SMS using Vonage SMS v4 SDK."""
    api_key = os.getenv('VONAGE_API_KEY')
    api_secret = os.getenv('VONAGE_API_SECRET')

    if not api_key or not api_secret:
        sys.stderr.write("Error: Set VONAGE_API_KEY and VONAGE_API_SECRET environment variables.\n")
        sys.exit(1)

    # Validate phone format
    if not to_number.startswith('+'):
        sys.stderr.write("Error: Phone number must start with '+'. Use international format.\n")
        sys.exit(1)

    # Authenticate and send
    auth = Auth(api_key=api_key, api_secret=api_secret)
    client = Vonage(auth)
    message = SmsMessage(to=to_number, from_=sender, text=text)
    response = client.sms.send(message)
    result = response.model_dump(exclude_unset=True)

    # Handle output
    if verbose:
        print("Response:", result)

    msgs = result.get('messages', [])
    success = bool(msgs and msgs[0].get('status') == '0')

    if success:
        if not verbose:
            print("✓ SMS sent successfully to {}".format(to_number))
        sys.exit(0)
    else:
        status = msgs[0].get('status') if msgs else 'unknown'
        sys.stderr.write(f"Error: SMS failed with status {status}\n")
        if not verbose:
            print("Response:", result)
        sys.exit(1)


def interactive_input():
    """Prompt user for phone number and message."""
    try:
        phone = input("Enter recipient phone number (e.g. +201234567890): ").strip()
        message = input("Enter message text: ").strip()
    except (EOFError, KeyboardInterrupt):
        sys.stderr.write("Input cancelled by user.\n")
        sys.exit(1)

    if not phone or not message:
        sys.stderr.write("Error: both phone and message are required.\n")
        sys.exit(1)
    return phone, message


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Send SMS via Vonage')
    parser.add_argument('--phone', help='Recipient phone number in international format')
    parser.add_argument('--message', help='Text message to send')
    parser.add_argument('-i', '--interactive', action='store_true', help='Run in interactive mode')
    parser.add_argument('-f', '--from', dest='sender', default='MyApp', help='Override sender name/number')
    parser.add_argument('-q', '--quiet', action='store_true', help='Only print success/failure')
    parser.add_argument('-v', '--verbose', action='store_true', help='Print full API response')
    args = parser.parse_args()

    if args.interactive or not (args.phone and args.message):
        phone, message = interactive_input()
    else:
        phone, message = args.phone, args.message

    send_sms(phone, message, sender=args.sender, verbose=args.verbose)
'''