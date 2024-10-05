# # # will scrape using facebook's map api
# # # this is done because facebook provides way more information,
# # # eg. up to 100 listings per request, exact location of each listing, etc
# # # which are all super useful and will save us from making a request to each listing

# selenium
from seleniumwire import webdriver  # Import from seleniumwire
import seleniumwire.undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from pymongo import MongoClient 
from seleniumwire.utils import decode
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from selenium.webdriver.chrome.service import Service


# rotating ip library
from requests_ip_rotator import ApiGateway

# # other
import requests
import json
import time
import urllib
import urllib.parse


chromedriver_path = "/Users/jerrybenoit/Desktop/chromedriver-mac-arm64/chromedriver"
class Bd:

    def __init__(self, uri, table, collection):
        self.table = table
        self.collection = collection

        # connection à la BD
        self.client = MongoClient(uri)
        self.db = self.client[table]
        self.collection = self.db[collection]
        
        # Suppression de tous les documents dans la collection
        self.collection.delete_many({})

    def add_data(self, data):
        try:
            self.collection.insert_one(data)
            print(data)
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")

class Scraper:

    def __init__(self) -> None:
        #self.url = "https://www.facebook.com/marketplace/montreal/propertyrentals?exact=false&latitude=45.50889&longitude=-73.63167&radius=7&locale=fr_CA"
        self.url = "https://www.facebook.com/marketplace/montreal/propertyrentals?locale=fr_CA"
        
        proxies = {
            'http': 'http://2dh0lrid:ae1hsoYLTkR7BBUv@proxy.proxy-cheap.com:31112',
            'https': 'http://2dh0lrid:ae1hsoYLTkR7BBUv@proxy.proxy-cheap.com:31112'

        }

        proxy_options = {
            # 'proxy': {
            #     'http': 'http://rdqnojgj:Ma94RUM5saytuL5u@proxy.proxy-cheap.com:31112',
            #     'https': 'http://rdqnojgj:Ma94RUM5saytuL5u@proxy.proxy-cheap.com:31112'
            # }
        }

        chrome_options = uc.ChromeOptions()
        chrome_options.add_argument('--ignore-ssl-errors=yes')
        chrome_options.add_argument('--ignore-certificate-errors')

        service = Service(chromedriver_path)

        self.driver = uc.Chrome(
            service=service,
            options=chrome_options,
            seleniumwire_options=proxy_options
        )

        self.session = requests.Session()
        self.session.proxies.update(proxies)
        self.session.verify = False
        
        self.bd = Bd("mongodb+srv://moveout:qFCPn6LARdjfBAYQ@cluster0.iowm3fd.mongodb.net/", "Appartements_moveout", "appartments")
        
        self.init_session()
        self.driver.close()


    def get_first_req(self):
        self.driver.get(f"https://www.facebook.com/marketplace/montreal/propertyrentals?exact=false&latitude=45.50889&longitude=-73.63167&radius=7&locale=fr_CA")
        #self.driver.get(f"https://www.facebook.com/marketplace/montreal/propertyrentals?exact=false&latitude=45.6006&longitude=-72.862&radius=40&locale=fr_CA")
        time.sleep(15)

        # get first request through selenium to get the headers and first results
        for request in self.driver.requests:
            if request.response:
                if "graphql" in request.url:
                    print("graphql request found")
                    resp_body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                    resp_body = json.loads(resp_body)

                    if "marketplace_rentals_map_view_stories" in resp_body["data"]["viewer"]:
                        return request.headers.__dict__["_headers"], request.body, resp_body
        print("No matching request found")
        return None            
    
    def load_headers(self, headers):

        for key, value in headers:
            self.session.headers.update({key: value})
    
        self.session.headers.update({"x-fb-friendly-name": "CometMarketplaceRealEstateMapStoryQuery"})

    # def get_next_cursor(self, body):
    #     return body["data"]["viewer"]["marketplace_feed_stories"]["page_info"]["end_cursor"]
    def get_next_cursor(self, body):
        try:
            return body["data"]["marketplace_feed_stories"]["page_info"]["end_cursor"]
        except KeyError as e:
            print(f"Erreur d'accès aux données : {e}")
        # Vous pouvez ajouter ici un logging plus détaillé de la structure de body
        return None
    
    def add_listings(self, body):
        #return [self.bd.add_data(listing["node"]["listing"]) for listing in body["data"]["viewer"]["marketplace_feed_stories"]["edges"]]

        for node in body["data"]["viewer"]["marketplace_rentals_map_view_stories"]["edges"]:
            self.bd.add_data(node["node"])
    
    def parse_payload(self, payload):
        # Decode the data string
        decoded_str = urllib.parse.unquote(payload.decode())

        # Parse the string into a dictionary
        data_dict = dict(urllib.parse.parse_qsl(decoded_str))
        
        return data_dict
    
    def init_session(self):
        try:
            headers, payload_to_send, resp_body = self.get_first_req()  
        except Exception as e:
            print(f"Erreur lors de l'obtention de la première requête : {e} header: {headers}")  
 
       
       
       
        self.next_cursor = self.get_next_cursor(resp_body)

        # add the first few results
        self.add_listings(resp_body)

        # load headers to requests Sesssion
        self.load_headers(headers)

        # parse payload to normal format
        self.payload_to_send = self.parse_payload(payload_to_send)

        # update the api name we're using (map api)
        self.payload_to_send["fb_api_req_friendly_name"] = "CometMarketplaceRealEstateMapStoryQuery"
        
        # self.variables = json.loads(self.payload_to_send["variables"])
        self.variables =  {"buyLocation":{"latitude":45.4722,"longitude":-73.5848},"categoryIDArray":[1468271819871448],"numericVerticalFields":[],"numericVerticalFieldsBetween":[],"priceRange":[0,214748364700],"radius":2000,"stringVerticalFields":[]}

    def scrape(self, lat, lon):

        try:

            #update location
            self.variables["buyLocation"]["latitude"] = lat
            self.variables["buyLocation"]["longitude"] = lon

            
            self.payload_to_send["variables"] = json.dumps(self.variables)

            resp_body = self.session.post("https://www.facebook.com/api/graphql/", data=urllib.parse.urlencode(self.payload_to_send))
            
            while "marketplace_rentals_map_view_stories" not in resp_body.json()["data"]["viewer"]:
                print("error")
                print(resp_body.json()["data"]["viewer"])
                resp_body = self.session.post("https://www.facebook.com/api/graphql/", data=urllib.parse.urlencode(self.payload_to_send))

            self.add_listings(resp_body.json())

        except Exception as e:
            print("Error in scrape", e)

        time.sleep(5)


import math

def move_north(latitude, longitude, distance_in_km):
    km_per_degree_latitude = 111
    delta_latitude = distance_in_km / km_per_degree_latitude
    new_latitude = latitude + delta_latitude
    return new_latitude, longitude

def move_south(latitude, longitude, distance_in_km):
    km_per_degree_latitude = 111
    delta_latitude = distance_in_km / km_per_degree_latitude
    new_latitude = latitude - delta_latitude
    return new_latitude, longitude

def move_east(latitude, longitude, distance_in_km):
    km_per_degree_longitude = math.cos(latitude * (math.pi / 180)) * 111.32
    delta_longitude = distance_in_km / km_per_degree_longitude
    new_longitude = longitude + delta_longitude
    return latitude, new_longitude

def move_west(latitude, longitude, distance_in_km):
    km_per_degree_longitude = math.cos(latitude * (math.pi / 180)) * 111.32
    delta_longitude = distance_in_km / km_per_degree_longitude
    new_longitude = longitude - delta_longitude
    return latitude, new_longitude

current_km = 1
reqs = 0

lat = 45.50889
lon = -73.63167

scraper = Scraper()
scraper.scrape(lat, lon)

while current_km <= 50:

    for _ in range(current_km):
        lat, lon = move_east(lat, lon, 1)
        scraper.scrape(lat, lon)
        time.sleep(5)

    for _ in range(current_km):
        lat, lon = move_north(lat, lon, 1)
        scraper.scrape(lat, lon)
        time.sleep(5)


    current_km += 1

    for _ in range(current_km):
        lat, lon = move_west(lat, lon, 1)
        scraper.scrape(lat, lon)
        time.sleep(5)

    for _ in range(current_km):
        lat, lon = move_south(lat, lon, 1)
        scraper.scrape(lat, lon)
        time.sleep(5)

    current_km += 1


import math

def move_north(latitude, longitude, distance_in_km):
    km_per_degree_latitude = 111
    delta_latitude = distance_in_km / km_per_degree_latitude
    new_latitude = latitude + delta_latitude
    return new_latitude, longitude

def move_south(latitude, longitude, distance_in_km):
    km_per_degree_latitude = 111
    delta_latitude = distance_in_km / km_per_degree_latitude
    new_latitude = latitude - delta_latitude
    return new_latitude, longitude

def move_east(latitude, longitude, distance_in_km):
    km_per_degree_longitude = math.cos(latitude * (math.pi / 180)) * 111.32
    delta_longitude = distance_in_km / km_per_degree_longitude
    new_longitude = longitude + delta_longitude
    return latitude, new_longitude

def move_west(latitude, longitude, distance_in_km):
    km_per_degree_longitude = math.cos(latitude * (math.pi / 180)) * 111.32
    delta_longitude = distance_in_km / km_per_degree_longitude
    new_longitude = longitude - delta_longitude
    return latitude, new_longitude

current_km = 1
reqs = 0

lat = 45.50889
lon = -73.63167

while current_km <= 50:

    for _ in range(current_km):
        lat, lon = move_east(lat, lon, 1)
        print(lat, lon)

    for _ in range(current_km):
        lat, lon = move_north(lat, lon, 1)
        print(lat, lon)
        
    current_km += 1

    for _ in range(current_km):
        lat, lon = move_west(lat, lon, 1)
        print(lat, lon)

    for _ in range(current_km):
        lat, lon = move_south(lat, lon, 1)
        print(lat, lon)

    current_km += 1

print(reqs)