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
import sqlite3
from datetime import datetime
import sys
import random
from time import sleep

##change dépendementd de l'ordi install ici: https://googlechromelabs.github.io/chrome-for-testing/#stable
chromedriver_path = "/Users/jerrybenoit/Downloads/chromedriver-mac-arm64/chromedriver"
class SqliteDB:
    def __init__(self, db_name="marketplace.db"):
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()
        
        # Création de la table avec une contrainte UNIQUE sur listing_id
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS listings (
                listing_id TEXT PRIMARY KEY,
                title TEXT,
                price REAL,
                bedrooms INTEGER,
                bathrooms INTEGER,
                images ARRAY,
                location TEXT,
                latitude REAL,
                longitude REAL,
                description TEXT,
                creation_time TEXT,
                last_updated TEXT
            )
        ''')

        # Création d'une table pour sauvegarder la progression
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS progress (
                last_lat REAL,
                last_lon REAL,
                current_km INTEGER,
                last_updated TEXT
            )
        ''')
        self.conn.commit()

    def save_progress(self, lat, lon, current_km):
        self.cursor.execute('''
            INSERT OR REPLACE INTO progress 
            (last_lat, last_lon, current_km, last_updated)
            VALUES (?, ?, ?, ?)
        ''', (lat, lon, current_km, datetime.now().isoformat()))
        self.conn.commit()

    def get_last_progress(self):
        self.cursor.execute('SELECT last_lat, last_lon, current_km FROM progress ORDER BY last_updated DESC LIMIT 1')
        result = self.cursor.fetchone()
        if result:
            return {'lat': result[0], 'lon': result[1], 'current_km': result[2]}
        return None

    def add_data(self, data):
        try:
            # Extraction des données pertinentes
            listing_data = {
                'listing_id': data.get('id'),
                'title': data.get('marketplace_listing_title'),
                'price': data.get('listing_price', {}).get('amount'),
                'location': data.get('location_text', {}).get('text'),
                'latitude': data.get('location', {}).get('latitude'),
                'longitude': data.get('location', {}).get('longitude'),
                'description': data.get('marketplace_listing_description'),
                'creation_time': data.get('creation_time'),
                'last_updated': datetime.now().isoformat()
            }

            # Insertion ou mise à jour si existe déjà (UPSERT)
            self.cursor.execute('''
                INSERT OR REPLACE INTO listings 
                (listing_id, title, price, location, latitude, longitude, description, creation_time, last_updated)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                listing_data['listing_id'],
                listing_data['title'],
                listing_data['price'],
                listing_data['location'],
                listing_data['latitude'],
                listing_data['longitude'],
                listing_data['description'],
                listing_data['creation_time'],
                listing_data['last_updated']
            ))
            self.conn.commit()
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")

    def __del__(self):
        self.conn.close()

class Scraper:

    def __init__(self) -> None:
        #self.url = "https://www.facebook.com/marketplace/montreal/propertyrentals?exact=false&latitude=45.50889&longitude=-73.63167&radius=7&locale=fr_CA"
        self.url = "https://www.facebook.com/marketplace/montreal/propertyrentals?locale=fr_CA"
        #configuration des proxies
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
        
        self.bd = SqliteDB()
        
        self.init_session()
        self.driver.close()

        self.max_retries = 3
        self.retry_delay = 10

    def get_first_req(self):
        self.driver.get(f"https://www.facebook.com/marketplace/montreal/propertyrentals?exact=false&latitude=45.50889&longitude=-73.63167&radius=7&locale=fr_CA")
        #allow the page to load fully including any JavaScript that triggers API requests
        time.sleep(15)

        # get first request through selenium to get the headers and first results
        for request in self.driver.requests:
            #if request is a response
            if request.response:
                #if request is a graphql request
                if "graphql" in request.url:
                    print("graphql request found")
                    #decode the response body
                    resp_body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                    #convert the response body to a json object
                    resp_body = json.loads(resp_body)

                    #if the response body contains the data we want
                    if "marketplace_rentals_map_view_stories" in resp_body["data"]["viewer"]:
                        #return the headers, body, and response body
                        return request.headers.__dict__["_headers"], request.body, resp_body
        print("No matching request found")
        return None            
    
    def load_headers(self, headers):
        # Cette méthode charge les en-têtes HTTP dans la session
        
        # Pour chaque paire clé-valeur dans les en-têtes fournis
        for key, value in headers:
            # Met à jour les en-têtes de la session avec la nouvelle paire clé-valeur
            self.session.headers.update({key: value})
        
        # Ajoute un en-tête spécifique pour identifier le type de requête Facebook
        # Cet en-tête indique qu'on utilise l'API de recherche immobilière sur la carte
        self.session.headers.update({"x-fb-friendly-name": "CometMarketplaceRealEstateMapStoryQuery"})


    def get_next_cursor(self, body):
        try:
            return body["data"]["marketplace_feed_stories"]["page_info"]["end_cursor"]
        except KeyError as e:
            print(f"Erreur d'accès aux données : {e}")
        # Vous pouvez ajouter ici un logging plus détaillé de la structure de body
        return None
    
    def add_listings(self, body):


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
        for attempt in range(self.max_retries):
            try:
                self.variables["buyLocation"]["latitude"] = lat
                self.variables["buyLocation"]["longitude"] = lon
                
                self.payload_to_send["variables"] = json.dumps(self.variables)

                resp_body = self.session.post(
                    "https://www.facebook.com/api/graphql/",
                    data=urllib.parse.urlencode(self.payload_to_send),
                    timeout=30  # Ajout d'un timeout
                )
                
                if resp_body.status_code != 200:
                    raise Exception(f"Status code: {resp_body.status_code}")

                json_data = resp_body.json()
                
                if "marketplace_rentals_map_view_stories" not in json_data["data"]["viewer"]:
                    print(f"Tentative {attempt + 1}: Données non trouvées, nouvelle tentative dans {self.retry_delay} secondes")
                    sleep(self.retry_delay + random.uniform(1, 5))
                    continue

                self.add_listings(json_data)
                return True

            except Exception as e:
                print(f"Erreur lors de la tentative {attempt + 1}: {str(e)}")
                if attempt < self.max_retries - 1:
                    sleep_time = self.retry_delay * (attempt + 1) + random.uniform(1, 5)
                    print(f"Nouvelle tentative dans {sleep_time} secondes...")
                    sleep(sleep_time)
                else:
                    print("Nombre maximum de tentatives atteint, passage au point suivant")
                    return False

        return False

# Importe le module math pour les calculs géographiques
import math

# Fonctions utilitaires pour déplacer le point de recherche dans différentes directions
def move_north(latitude, longitude, distance_in_km):
    # Déplace le point vers le nord d'une distance donnée
    km_per_degree_latitude = 111 # 1 degré = 111km en latitude
    delta_latitude = distance_in_km / km_per_degree_latitude
    new_latitude = latitude + delta_latitude
    return new_latitude, longitude

def move_south(latitude, longitude, distance_in_km):
    # Déplace le point vers le sud
    km_per_degree_latitude = 111
    delta_latitude = distance_in_km / km_per_degree_latitude 
    new_latitude = latitude - delta_latitude
    return new_latitude, longitude

def move_east(latitude, longitude, distance_in_km):
    # Déplace le point vers l'est en tenant compte de la latitude
    km_per_degree_longitude = math.cos(latitude * (math.pi / 180)) * 111.32
    delta_longitude = distance_in_km / km_per_degree_longitude
    new_longitude = longitude + delta_longitude
    return latitude, new_longitude

def move_west(latitude, longitude, distance_in_km):
    # Déplace le point vers l'ouest
    km_per_degree_longitude = math.cos(latitude * (math.pi / 180)) * 111.32
    delta_longitude = distance_in_km / km_per_degree_longitude
    new_longitude = longitude - delta_longitude
    return latitude, new_longitude

# Fonction principale modifiée
def main():
    scraper = Scraper()
    db = SqliteDB()
    
    # Récupération du dernier point sauvegardé
    last_progress = db.get_last_progress()
    if last_progress:
        lat = last_progress['lat']
        lon = last_progress['lon']
        current_km = last_progress['current_km']
        print(f"Reprise depuis: lat={lat}, lon={lon}, km={current_km}")
    else:
        lat = 45.49971
        lon = -73.66610
        current_km = 1

    try:
        while current_km <= 20:
            # Déplace vers l'est
            for _ in range(current_km):
                lat, lon = move_east(lat, lon, 1)
                print(f"east - current_km: {current_km}, lat: {lat}, lon: {lon}")
                if scraper.scrape(lat, lon):
                    db.save_progress(lat, lon, current_km)
                sleep(random.uniform(3, 7))  # Délai aléatoire

            # Même chose pour les autres directions...
            # [Code pour les autres directions]

            current_km += 1

    except KeyboardInterrupt:
        print("\nInterruption détectée, sauvegarde de la progression...")
        db.save_progress(lat, lon, current_km)
        print(f"Progression sauvegardée à: lat={lat}, lon={lon}, km={current_km}")
        sys.exit(0)

if __name__ == "__main__":
    main()