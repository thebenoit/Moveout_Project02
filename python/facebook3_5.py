import math
import time
from seleniumwire import webdriver
import seleniumwire.undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from pymongo import MongoClient
from seleniumwire.utils import decode
from selenium.webdriver.chrome.service import Service
import requests
import json
import urllib.parse

class OptimizedScrapper:
    def __init__(self):
        # Configuration MongoDB
        self.uri = "mongodb+srv://moveout:qFCPn6LARdjfBAYQ@cluster0.iowm3fd.mongodb.net/"
        self.db_name = "Appartements_moveout"
        self.collection_name = "appartments"
        
        # Configuration du driver Chrome
        self.chromedriver_path = "/Users/jerrybenoit/Downloads/chromedriver-mac-arm64_2/chromedriver"
        
        # Définir les limites de Montreal
        self.MONTREAL_BOUNDS = {
            'north': 45.7059,
            'south': 45.4139,
            'east': -73.4733,
            'west': -73.9529
        }
        
        # Rayon de recherche optimal (en km)
        self.SEARCH_RADIUS = 2
        
        # Chevauchement pour éviter de manquer des annonces (en km)
        self.OVERLAP_DISTANCE = 0.5
        
        # Initialisation de la base de données
        self.init_database()
        
        # Initialisation du scraper
        self.init_scraper()

    def init_database(self):
        self.client = MongoClient(self.uri)
        self.db = self.client[self.db_name]
        self.collection = self.db[self.collection_name]
        self.collection.delete_many({})

    def init_scraper(self):
        chrome_options = uc.ChromeOptions()
        chrome_options.add_argument('--ignore-ssl-errors=yes')
        chrome_options.add_argument('--ignore-certificate-errors')

        service = Service(self.chromedriver_path)
        
        self.driver = uc.Chrome(
            service=service,
            options=chrome_options,
            seleniumwire_options={}
        )
        
        self.session = requests.Session()
        self.session.verify = False
        
        # Initialisation des variables pour Facebook
        self.variables = {
            "buyLocation": {"latitude": 45.4722, "longitude": -73.5848},
            "categoryIDArray": [1468271819871448],
            "numericVerticalFields": [],
            "numericVerticalFieldsBetween": [],
            "priceRange": [0, 214748364700],
            "radius": 2000,
            "stringVerticalFields": []
        }
        
        self.init_facebook_session()

    def init_facebook_session(self):
        try:
            headers, payload, resp_body = self.get_first_facebook_request()
            self.load_headers(headers)
            self.payload = self.parse_payload(payload)
            self.payload["fb_api_req_friendly_name"] = "CometMarketplaceRealEstateMapStoryQuery"
        except Exception as e:
            print(f"Erreur d'initialisation Facebook : {e}")

    def get_first_facebook_request(self):
        self.driver.get("https://www.facebook.com/marketplace/montreal/propertyrentals?locale=fr_CA")
        time.sleep(15)
        
        for request in self.driver.requests:
            if request.response and "graphql" in request.url:
                resp_body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                resp_body = json.loads(resp_body)
                if "marketplace_rentals_map_view_stories" in resp_body["data"]["viewer"]:
                    return request.headers.__dict__["_headers"], request.body, resp_body
        return None

    def load_headers(self, headers):
        for key, value in headers:
            self.session.headers.update({key: value})
        self.session.headers.update({"x-fb-friendly-name": "CometMarketplaceRealEstateMapStoryQuery"})

    def parse_payload(self, payload):
        decoded_str = urllib.parse.unquote(payload.decode())
        return dict(urllib.parse.parse_qsl(decoded_str))

    def scrape(self, lat, lon):
        try:
            self.variables["buyLocation"]["latitude"] = lat
            self.variables["buyLocation"]["longitude"] = lon
            
            self.payload["variables"] = json.dumps(self.variables)
            
            response = self.session.post(
                "https://www.facebook.com/api/graphql/", 
                data=urllib.parse.urlencode(self.payload)
            )
            
            data = response.json()
            if "marketplace_rentals_map_view_stories" in data["data"]["viewer"]:
                for node in data["data"]["viewer"]["marketplace_rentals_map_view_stories"]["edges"]:
                    self.collection.insert_one(node["node"])
                    
        except Exception as e:
            print(f"Erreur lors du scraping : {e}")
            time.sleep(10)

    def generate_grid_points(self):
        # Initialise une liste vide pour stocker les points de la grille
        points = []
        
        # Commence à la latitude la plus au sud de Montréal
        current_lat = self.MONTREAL_BOUNDS['south']
        
        # Boucle jusqu'à atteindre la latitude nord de Montréal
        while current_lat <= self.MONTREAL_BOUNDS['north']:
            # Pour chaque latitude, commence à la longitude ouest
            current_lon = self.MONTREAL_BOUNDS['west']

            # Boucle jusqu'à atteindre la longitude est
            while current_lon <= self.MONTREAL_BOUNDS['east']:
                # Ajoute le point courant (lat,lon) à la liste
                points.append((current_lat, current_lon))
                
                # Calcule le prochain point longitude:
                # - Multiplie le rayon par 2 pour couvrir le diamètre
                # - Soustrait le chevauchement pour éviter les trous
                # - Divise par 111.32 pour convertir km en degrés
                # - Ajuste selon la latitude avec cos() car les longitudes se resserrent aux pôles
                current_lon += (self.SEARCH_RADIUS * 2 - self.OVERLAP_DISTANCE) / 111.32 / math.cos(current_lat * math.pi / 180)
                
            # Passe à la latitude suivante en convertissant km en degrés (111.32 km/degré)    
            current_lat += (self.SEARCH_RADIUS * 2 - self.OVERLAP_DISTANCE) / 111.32
            
        # Retourne la grille complète de points
        return points
        
    def scrape_montreal(self):
        # Génère la grille de points
        points = self.generate_grid_points()
        total_points = len(points)
        
        for i, (lat, lon) in enumerate(points):
            try:
                self.scrape(lat, lon) 
                print(f"Progress: {i+1}/{total_points} points ({((i+1)/total_points)*100:.2f}%)")
                time.sleep(5)
            except Exception as e:
                print(f"Error scraping point {lat}, {lon}: {e}")
                time.sleep(10)
                # Sauvegarder le point d'erreur pour réessayer plus tard
                
    
    

        