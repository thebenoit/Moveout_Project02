# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client
from datetime import datetime, timedelta
import pytz
from dotenv import load_dotenv

load_dotenv()

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
message_sid = os.getenv("TWILIO_MESSAGE_SID")
numero_twilio = os.getenv("TWILIO_NUMERO_TWILIO")
client = Client(account_sid, auth_token)

utc_time = datetime.now(pytz.utc)
in20Minutes = utc_time + timedelta(minutes=20)
formatted_time = in20Minutes.strftime('%Y-%m-%dT%H:%M:%SZ')  # Conversion en format ISO 8601
print(formatted_time)
message = client.messages.create(
    body="This is a scheduled message",
    messaging_service_sid=message_sid,
    from_=numero_twilio,
    to="+14385239294",
    send_at=formatted_time,
    schedule_type="fixed",
)

print(message.body)