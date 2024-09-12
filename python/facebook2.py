# selenium
from seleniumwire import webdriver  # Import from seleniumwire
from selenium.webdriver.common.by import By
from pymongo import MongoClient 
from seleniumwire.utils import decode
from selenium.webdriver.chrome.options import Options

# rotating ip library
from requests_ip_rotator import ApiGateway

# other
import requests
import json
import time
import urllib


class Bd:

    def __init__(self, uri, table, collection):
        self.table = table
        self.collection = collection

        # connection à la BD
        self.client = MongoClient(uri)
        self.db = self.client[table]
        self.collection = self.db[collection]

    def add_data(self, data):
        try:
            self.collection.insert_one(data)
            print(data)
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")

class Scraper:

    def __init__(self) -> None:
        self.url = "https://www.facebook.com/marketplace/montreal/propertyrentals?locale=fr_CA"

        # proxies = {
        #     'http': 'http://rdqnojgj:nOEVjKbkfAnM3zGP_country-Canada@proxy.proxy-cheap.com:31112',
        #     'https': 'http://rdqnojgj:nOEVjKbkfAnM3zGP_country-Canada@proxy.proxy-cheap.com:31112'
        # }

        proxies = {
            'http': 'http://2dh0lrid:ae1hsoYLTkR7BBUv_country-Canada_session-CQa8U4iO@proxy.proxy-cheap.com:31112',
            'https': 'http://2dh0lrid:ae1hsoYLTkR7BBUv_country-Canada_session-CQa8U4iO@proxy.proxy-cheap.com:31112'
        }

        options = Options()
        proxy_options = {
            'proxy': proxies
        }
        self.driver = webdriver.Chrome(seleniumwire_options=proxy_options, options=options)

        self.session = requests.Session()
        self.session.proxies.update(proxies)
        self.session.verify = False
        
        self.bd = Bd("mongodb+srv://moveout:qFCPn6LARdjfBAYQ@cluster0.iowm3fd.mongodb.net/", "Appartements_moveout", "facebook_old")
        
        self.init_session()
        self.driver.close()


    def get_first_req(self):
        self.driver.get(f"https://www.facebook.com/marketplace/montreal/propertyrentals?locale=fr_CA")

        time.sleep(5)

        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        time.sleep(5)

        # get first request through selenium to get the headers and first results
        for request in self.driver.requests:
            if request.response:
                if "graphql" in request.url:
                    
                    resp_body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                    resp_body = json.loads(resp_body)

                    return request.headers.__dict__["_headers"], request.body, resp_body
    
    def load_headers(self, headers):

        for key, value in headers:
            self.session.headers.update({key: value})

    def get_next_cursor(self, body):
        return body["data"]["viewer"]["marketplace_feed_stories"]["page_info"]["end_cursor"]

    def add_listings(self, body):
        # return [self.bd.add_data(listing["node"]["listing"]) for listing in body["data"]["viewer"]["marketplace_feed_stories"]["edges"]]]

        for node in body["data"]["viewer"]["marketplace_feed_stories"]["edges"]:
            self.bd.add_data(node["node"]["listing"])
    
    def parse_payload(self, payload):
        # Decode the data string
        decoded_str = urllib.parse.unquote(payload.decode())

        # Parse the string into a dictionary
        data_dict = dict(urllib.parse.parse_qsl(decoded_str))
        
        return data_dict
    
    def init_session(self):

        headers, payload_to_send, resp_body = self.get_first_req()
        self.next_cursor = self.get_next_cursor(resp_body)

        # add the first few results
        self.add_listings(resp_body)

        # load headers to requests Sesssion
        self.load_headers(headers)

        # parse payload to normal format
        self.payload_to_send = self.parse_payload(payload_to_send)
        
        self.variables = json.loads(self.payload_to_send["variables"])
        
        self.doc_id = self.payload_to_send["doc_id"]

    def scrape(self, qt=100):
        
        for i in range(0, qt): 
            try:

                # make next payload with right cursor
                self.variables["cursor"] = json.dumps(self.next_cursor)

                self.payload_to_send["variables"] = json.dumps(self.variables)

                resp_body = self.session.post("https://www.facebook.com/api/graphql/", data=urllib.parse.urlencode(self.payload_to_send))

                results = self.add_listings(resp_body.json())

                self.next_cursor = self.get_next_cursor(resp_body.json())

            except Exception as e:
                print(resp_body.content)
                print(resp_body.text)
                
                print("Error", e)

            print("request count: ", i)

            time.sleep(5)


scraper = Scraper()
scraper.scrape()


# doesnt work for facebook :(

# import requests
# from requests_ip_rotator import ApiGateway

# # Create gateway object and initialise in AWS
# # gateway = ApiGateway("https://api.ipify.org")
# gateway = ApiGateway("https://api.ipify.org", regions=["us-east-1", "us-east-2"], access_key_id="AKIAQGYBPW4MXOG5ZGO3", access_key_secret="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")
# gateway.start()

# # Assign gateway to session
# session = requests.Session()
# session.mount("https://api.ipify.org", gateway)

# # Send request (IP will be randomised)
# response = session.get("https://api.ipify.org?format=json", params={"theme": "light"})
# print(response.json())
# # Send request (IP will be randomised)
# response = session.get("https://api.ipify.org?format=json", params={"theme": "light"})
# print(response.json())
# # Send request (IP will be randomised)
# response = session.get("https://api.ipify.org?format=json", params={"theme": "light"})
# print(response.json())

# # Delete gateways
# gateway.shutdown()