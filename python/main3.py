from seleniumwire import webdriver  # Import from seleniumwire
from selenium.webdriver.common.by import By

from seleniumwire.utils import decode
import json
import time

# Create a new instance of the Chrome driver
driver = webdriver.Chrome()

# Go to the Google home page
driver.get(f"https://www.facebook.com/marketplace/montreal/search?minPrice=300&maxPrice=3000&minBedrooms=1&minBathrooms=1&minSqft=500&maxSqft=2000&daysSinceListed=7&query=2%20bedroom%20appartment&exact=false")

time.sleep(5)

try:
    i = 0

    while True:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(2)

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break

        last_height = new_height

        i += 1

        if i == 10:
            break

except Exception as e:
    print(e)


# Access requests via the `requests` attribute
for request in driver.requests:
    if request.response:
        if "graphql" in request.url:
            body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
            body = json.loads(body)
            print(body)
