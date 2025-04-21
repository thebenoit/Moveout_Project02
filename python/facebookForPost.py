import requests
from bs4 import BeautifulSoup
import re
import json
import time
import os
import random
from pymongo import MongoClient
from seleniumwire import webdriver
import seleniumwire.undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Chemin vers le chromedriver - à adapter selon votre système
chromedriver_path = os.getenv("CHROMEDRIVER_PATH", "/Users/jerrybenoit/Downloads/chromedriver-mac-arm64/chromedriver")

class Bd:

    def __init__(self, uri, database_name, apartments_collection, marketplace_ids_collection, progress_collection):
        
        # connection à la BD
        self.client = MongoClient(uri)
        # initialisation de la base de données
        self.db = self.client[database_name]
        
        # initialisation de la collection d'appartements
        self.apartments = self.db[apartments_collection]
        # initialisation de la collection de progression
        self.progress = self.db[progress_collection]
        # initialisation de la collection d'IDs Facebook Marketplace
        self.marketplace_ids = self.db[marketplace_ids_collection]
        
        # Suppression de tous les documents dans la collection
        self.apartments.delete_many({})
       

    def add_data(self, data):
        try:
            print("Ajout de data")
            self.apartments.insert_one(data)
            # print(data)
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")
      
    # # Sauvegarde la progression du scraper      
    # def save_progress(self, lat, lon, current_km):        
    #     self.progress.insert_one({"lat": lat, "lon": lon, "current_km": current_km, "last_updated": time.time()})
      
    # Récupérer la dernière progression du scraper
    # def get_last_progress(self):
    #     # trie par date de dernière mise à jour
    #     result = self.progress.find_one(sort=[("last_updated", -1)])
    #     if result:
    #         return {
    #             'lat': result['lat'],
    #             'lon': result['lon'],
    #             'current_km': result['current_km']
    #         }
    #     return None

class FacebookMarketplaceScraper:
    def __init__(self, mongo_uri=None, database_name=None, collection_name=None, progress_collection=None, marketplace_ids_collection=None):
        print("Initialisation du scraper")
        # Utiliser les variables d'environnement si les paramètres ne sont pas fournis
        self.mongo_uri = mongo_uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
        self.database_name = database_name or os.getenv("DATABASE_NAME", "Appartements_moveout")
        self.collection_name = collection_name or os.getenv("APPARTMENTS_POSTS_COLLECTION", "appartments_posts")
        self.marketplace_ids_collection = marketplace_ids_collection or os.getenv("APARTMENTS_COLLECTION", "appartments")
        self.progress_collection = progress_collection or os.getenv("PROGRESS_COLLECTION", "scraper_progress")
        
        # Initialisation de la connexion MongoDB
        self.bd = Bd(self.mongo_uri, self.database_name, self.collection_name, self.marketplace_ids_collection, self.progress_collection)
        
        proxies = {
            "http": os.getenv("PROXIES_URL"),
            "https": os.getenv("PROXIES_URL")
        }

        proxy_options = {
          
        }
        
        # Configuration du navigateur Chrome
        self.chrome_options = uc.ChromeOptions()
        self.chrome_options.add_argument('--headless')
        self.chrome_options.add_argument('--ignore-ssl-errors=yes')
        self.chrome_options.add_argument('--ignore-certificate-errors')
        
        # Initialiser le service Chrome
        self.service = Service(chromedriver_path)
        
        
        
        # Nombre maximum de tentatives et délai entre les tentatives
        self.max_retries = 3
        self.retry_delay = 10
        
    def get_marketplace_ids(self):
        """Récupère les IDs Facebook Marketplace à partir de la collection MongoDB"""
        try:
                        # Vérifier le contenu de la collection
            count = self.bd.marketplace_ids.count_documents({})
            print(f"Nombre de documents dans la collection : {count}")
            
            # Afficher quelques documents pour vérifier leur structure
            print("Exemple de documents :")
            for doc in self.bd.marketplace_ids.find().limit(3):
                print(doc)
            # Récupère tous les documents dans la collection
            documents = self.bd.marketplace_ids.find()
            marketplace_ids = []
            for doc in documents:
                marketplace_ids.append(doc['_id'])
                print("Ajout des IDs Facebook Marketplace",doc["_id"])
            
            
            return marketplace_ids
        except Exception as e:
            print(f"Erreur lors de la récupération des IDs Facebook Marketplace: {e}")
            return []
        
        
    def initialize_driver(self):
        print("Initialisation du navigateur Chrome")
        
        """Initialise et retourne une nouvelle instance du navigateur Chrome"""
        try:
            return uc.Chrome(
                service=self.service,
                options=self.chrome_options,
                
            )
        except Exception as e:
            print(f"Erreur lors de l'initialisation du navigateur Chrome: {e}")
            return None
        
    def get_facebook_marketplace_url(self, item_id):
        """Construit l'URL Facebook Marketplace à partir de l'ID de l'article"""
        try:
            return f"https://www.facebook.com/marketplace/item/{item_id}"
        except Exception as e:
            print(f"Erreur lors de la construction de l'URL: {e}")
            return None
    
    def extract_data_from_html(self, html_content, item_id):
        """Extrait les données pertinentes du HTML de la page Facebook Marketplace"""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extraction des données
        data = {
            "id": item_id,
            "images": [],            
        }
        
        # Nouvelle méthode pour extraire les images
        preload_links = soup.find_all('link', {
            'rel': 'preload',
            'as': 'image',
            'data-preloader': 'adp_MarketplacePDPC2CMediaViewerWithImagesQueryRelayPreloader_{N}'
        })
        
        for link in preload_links:
            if 'href' in link.attrs:
                if 'scontent.fymq3-1.fna.fbcdn.net' in link['href']:
                    data["images"].append(link['href'])
       
        # # Extraction du titre
        # title_element = soup.find('h1', class_=lambda c: c and 'x1heor9g' in c)
        # if title_element:
        #     data["title"] = title_element.text.strip()
        #     print("title",data["title"],"\n")
        
        
        # # Extraction du prix
        # price_element = soup.find('span', class_=lambda c: c and all(cls in c for cls in ['x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x3x7a5m x1lkfr7t x1lbecb7 x1s688f xzsf02u']))
        # if price_element:
        #     data["price"] = price_element.text.strip()
        #     print("price", data["price"], "\n")
        
        # # Pour l'adresse
        # address_element = soup.find('span', class_=lambda c: c and all(cls in c for cls in ['x193iq5w', 'xeuugli', 'x13faqbe']))
        # if address_element:
        #     data["address"] = address_element.text.strip()
        #     print("address", data["address"], "\n")
            
        return data
    
    def add_data(self, data):
        try:
            print("Ajout de data")
            self.bd.apartments.insert_one(data)
            # print(data)
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")
    
    
def main():
        scraper = FacebookMarketplaceScraper()
        driver = scraper.initialize_driver()
        # Liste des IDs Facebook Marketplace à parcourir
        marketplace_ids = scraper.get_marketplace_ids()
        print(marketplace_ids)
        # Parcourir chaque ID et extraire les données
        for item_id in marketplace_ids:
            print("item_id: ",item_id)
            url = f"https://www.facebook.com/marketplace/item/{item_id}"
            print(f"Traitement de l'annonce: {url}")
            driver.get(url)
            # Attendre que la page se charge complètement
            time.sleep(3)  # Ajustez ce délai selon les besoins
            
            html_content = driver.page_source
            data = scraper.extract_data_from_html(html_content,item_id)
            scraper.add_data(data)
        
        
if __name__ == "__main__":
    main()
