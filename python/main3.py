from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on('request', lambda request: print(f'Request: {request.url}'))
    page.on('response', lambda response: print(f'Response: {response.url}'))
    page.goto(f"https://www.facebook.com/marketplace/montreal/search?minPrice=300&maxPrice=3000&minBedrooms=1&minBathrooms=1&minSqft=500&maxSqft=2000&daysSinceListed=7&query=2%20bedroom%20appartment&exact=false")

    while True:
        page.keyboard.down('End')


