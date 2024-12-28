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

from dotenv import load_dotenv
import os
load_dotenv()

# rotating ip library
from requests_ip_rotator import ApiGateway

# # other
import requests
import json
import time
import urllib
import urllib.parse

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
            return {'lat': result[0], 'lon': result[1], 'current_km': result[2]}
        return None

from Scraper import Scraper

class FacebookMarketplaceScraper(Scraper):
    def __init__(self, connection_string, database_name, collection_name, progress_collection):
        base_url = "https://www.facebook.com/marketplace/montreal/propertyrentals?locale=fr_CA"
        super().__init__(connection_string, database_name, collection_name, progress_collection, base_url)
        
        # Configuration spécifique pour Facebook
        self.variables = {
            "buyLocation": {"latitude": 45.4722, "longitude": -73.5848},
            "categoryIDArray": [1468271819871448],
            "numericVerticalFields": [],
            "numericVerticalFieldsBetween": [],
            "priceRange": [0, 214748364700],
            "radius": 2000,
            "stringVerticalFields": []
        }
        
        self.configure_graphql("CometMarketplaceRealEstateMapStoryQuery", self.variables)
        
    def scrape(self, lat, lon):
        try:
            self.variables["buyLocation"]["latitude"] = lat
            self.variables["buyLocation"]["longitude"] = lon
            
            payload = {
                "variables": json.dumps(self.variables),
                "fb_api_req_friendly_name": self.graphql_api_name
            }
            
            response = self.make_request("https://www.facebook.com/api/graphql/", payload)
            if response and "marketplace_rentals_map_view_stories" in response["data"]["viewer"]:
                self.add_listings(response)
                
        except Exception as e:
            print(f"Erreur lors du scraping: {e}")
            
        time.sleep(5)

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

# Initialisation des variables
current_km = 1 # Distance courante du centre
reqs = 0 # Compteur de requêtes
lat = 45.49971 # Latitude de départ (Montréal)
lon = -73.66610 # Longitude de départ

# Crée une instance du scraper et fait une première requête
scraper = Scraper(
   os.getenv('MONGODB_URI'),
   os.getenv('DATABASE_NAME'),
   os.getenv('APARTMENTS_COLLECTION'),
   os.getenv('PROGRESS_COLLECTION')
)
scraper.scrape(lat, lon)

# Boucle principale qui parcourt la zone en spirale
while current_km <= 20:
    # Déplace vers l'est
    for _ in range(current_km):
        lat, lon = move_east(lat, lon, 1)
        print("east")
        print(f"current_km: {current_km}")
        print(f"lat, {lat}, lon: {lon}")
        scraper.scrape(lat, lon)
        time.sleep(5)

    # Déplace vers le nord
    for _ in range(current_km):
        lat, lon = move_north(lat, lon, 1)
        print("north")
        print(f"current_km: {current_km}")
        print(f"lat, {lat}, lon: {lon}")
        scraper.scrape(lat, lon)
        time.sleep(5)

    current_km += 1

    # Déplace vers l'ouest
    for _ in range(current_km):
        lat, lon = move_west(lat, lon, 1)
        print("west")
        print(f"current_km: {current_km}")
        print(f"lat, {lat}, lon: {lon}")
        scraper.scrape(lat, lon)
        time.sleep(5)

    # Déplace vers le sud
    for _ in range(current_km):
        lat, lon = move_south(lat, lon, 1)
        print("south")
        print(f"current_km: {current_km}")
        print(f"lat, {lat}, lon: {lon}")
        scraper.scrape(lat, lon)
        time.sleep(5)

    current_km += 1



# Imprime le nombre total de requêtes
print(reqs)