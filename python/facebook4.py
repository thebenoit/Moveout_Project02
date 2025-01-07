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
import logging
import sys
#logging.basicConfig(level=logging.INFO)
#logger = logging.getLogger(__name__)

from dotenv import load_dotenv
import os
load_dotenv()

# rotating ip library
from requests_ip_rotator import ApiGateway

# # other
import requests
import json
import time
import random
import urllib
import urllib.parse
from time import sleep

##change dépendementd de l'ordi install ici: https://googlechromelabs.github.io/chrome-for-testing/#stable
chromedriver_path = "/Users/jerrybenoit/Downloads/chromedriver-mac-arm64/chromedriver"
class Bd:

    def __init__(self, uri, database_name, apartments_collection,progress_collection):
        
        # connection à la BD
        self.client = MongoClient(uri)
        #initialisation de la base de données
        self.db = self.client[database_name]
        
        #initialisation de la collection d'appartements
        self.apartments = self.db[apartments_collection]
        #initialisation de la collection de progression
        self.progress = self.db[progress_collection]
        
        # Suppression de tous les documents dans la collection
      
        self.apartments.delete_many({})
       

    def add_data(self, data):
        try:
            print("Ajout de data")
            self.apartments.insert_one(data)
            ##print(data)
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")
      
      #Sauvegarde la progression su scraper      
    def save_progress(self, lat, lon, current_km):        
        self.progress.insert_one({"lat": lat, "lon": lon, "current_km": current_km})
      
    #Récupérer la dernière progression su scraper
    def get_last_progress(self):
      #trie par date de dernière mise à jour
        result = self.progress.find_one(sort=[("last_updated", -1)])
        if result:
            return {
            'lat': result['lat'],
            'lon': result['lon'],
            'current_km': result['current_km']
        }
        return None

class Scraper:

    def __init__(self,connection_string, database_name,collection_name,progress_collection) -> None:
    
        self.url = "https://www.facebook.com/marketplace/montreal/propertyrentals?locale=fr_CA"
        #configuration des proxies
        proxies = {
            "http": "http://pc7PiGyTTw-res-any:PC_7kzkaLvMO2XGBa07q@proxy-us.proxy-cheap.com:5959",
            "https": "http://pc7PiGyTTw-res-any:PC_7kzkaLvMO2XGBa07q@proxy-us.proxy-cheap.com:5959"
        }

        proxy_options = {
          
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
        
        self.bd = Bd(connection_string, database_name, collection_name, progress_collection)
        
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
                        print("marketplace_rentals_map_view_stories found")
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
        try:
            for node in body["data"]["viewer"]["marketplace_rentals_map_view_stories"]["edges"]:
                if "for_sale_item" in node["node"] and "id" in node["node"]["for_sale_item"]:
                    listing_id = node["node"]["for_sale_item"]["id"]
                    # Utiliser listing_id comme _id dans le document
                    data = node["node"]
                    data["_id"] = listing_id  # Ajouter l'ID explicitement
                    if not self.bd.apartments.find_one({"_id": listing_id}):
                        print("Ajout de data--------->:")
                        #print(data)
                        data["scraped_at"] = time.time()  # Ajoute un timestamp UNIX
                        self.bd.add_data(data)
        except KeyError as e:
            print(f"Erreur de structure dans le body : {e}")

    
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
            # Méthode pour scraper les données à une position géographique donnée
            try:
                # Met à jour les coordonnées de recherche dans les variables
                self.variables["buyLocation"]["latitude"] = lat
                self.variables["buyLocation"]["longitude"] = lon
                
                # Convertit les variables en JSON et les ajoute au payload
                self.payload_to_send["variables"] = json.dumps(self.variables)

                # Fait une requête POST à l'API GraphQL de Facebook
                resp_body = self.session.post("https://www.facebook.com/api/graphql/", data=urllib.parse.urlencode(self.payload_to_send))
                
                # Vérifie que la réponse contient bien les données d'appartements
                while "marketplace_rentals_map_view_stories" not in resp_body.json()["data"]["viewer"]:
                    print("error") # Affiche une erreur 
                    print(f" resp json {resp_body.json()["data"]["viewer"]}") # Affiche la réponse pour debug
                    # Réessaie la requête
                    resp_body = self.session.post("https://www.facebook.com/api/graphql/", data=urllib.parse.urlencode(self.payload_to_send))

                # Ajoute les annonces trouvées à la base de données
                self.add_listings(resp_body.json())

            except Exception as e:
                print(f"Erreur lors de la tentatice {attempt + 1}: {str(e)}")
                if attempt < self.max_retries - 1:
                    sleep_time = self.retry_delay * (attempt + 1) + random.uniform(1, 5)
                    print(f"Nouvelle tentative dans {sleep_time} secondes...")
                    sleep(sleep_time)
                else:
                    print("Nombre maximum de tentatives atteint, passage au point suivant")
                    return False

            # Attend 5 secondes entre chaque requête
            time.sleep(5)
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


def main():

    # Crée une instance du scraper et fait une première requête
    scraper = Scraper(
    os.getenv('MONGODB_URI'),
    os.getenv('DATABASE_NAME'),
    os.getenv('APARTMENTS_COLLECTION'),
    os.getenv('PROGRESS_COLLECTION')
    )
    #db = Bd(connection_string, database_name, collection_name, progress_collection)
    #scraper.scrape(lat, lon)
    
    last_progress = scraper.bd.get_last_progress()
    if last_progress:
        lat = last_progress['lat']
        lon = last_progress['lon']
        current_km = last_progress['current_km']
        last_run = time.time()
        print(f"Reprise depuis: lat={lat}, lon={lon}, km={current_km} time={last_run}")
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
                    scraper.bd.save_progress(lat, lon, current_km)
                    sleep(random.uniform(3, 7))  # Délai aléatoire

            # Déplace vers le nord
            for _ in range(current_km):
                lat, lon = move_north(lat, lon, 1)
                print(f"north - current_km: {current_km}, lat: {lat}, lon: {lon}")
                if scraper.scrape(lat, lon):
                    scraper.bd.save_progress(lat, lon, current_km)
                    sleep(random.uniform(3, 7))  # Délai aléatoire

            current_km += 1

            # Déplace vers l'ouest
            for _ in range(current_km):
                lat, lon = move_west(lat, lon, 1)
                print(f"west - current_km: {current_km}, lat: {lat}, lon: {lon}")
                if scraper.scrape(lat, lon):
                    scraper.bd.save_progress(lat, lon, current_km)
                    sleep(random.uniform(3, 7))  # Délai aléatoire


            # Déplace vers le sud
            for _ in range(current_km):
                lat, lon = move_south(lat, lon, 1)
                print(f"south - current_km: {current_km}, lat: {lat}, lon: {lon}")
                if scraper.scrape(lat, lon):
                    scraper.bd.save_progress(lat, lon, current_km)
                    sleep(random.uniform(3, 7))  # Délai aléatoire

                
            current_km += 1

    except KeyboardInterrupt:
        print("\nInterruption détectée, sauvegarde de la progression...")
        scraper.bd.save_progress(lat, lon, current_km)
        print(f"Progression sauvegardée à: lat={lat}, lon={lon}, km={current_km}")
        sys.exit(0)

    # Imprime le nombre total de requêtes
    #print(reqs)

if __name__ == "__main__":
   main()