from seleniumwire import webdriver  # Import from seleniumwire
from selenium.webdriver.common.by import By
from pymongo import MongoClient 

from seleniumwire.utils import decode
import json
import time


class Scraper:

    def __init__(self):
        self.driver = webdriver.Chrome()
        self.bd = Bd("mongodb+srv://moveout:qFCPn6LARdjfBAYQ@cluster0.iowm3fd.mongodb.net/", "Appartements_moveout", "appartments")

    def load(self):

        # Go to the Google home page
        self.driver.get(f"https://www.facebook.com/marketplace/montreal/search?minPrice=300&maxPrice=3000&minBedrooms=1&minBathrooms=1&minSqft=500&maxSqft=2000&daysSinceListed=7&query=2%20bedroom%20appartment&exact=false")

        time.sleep(5)

        last_height = self.driver.execute_script("return document.body.scrollHeight")

        try:
            i = 0

            while True:
                # Scroll down to bottom
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

                # Wait to load page
                time.sleep(2)

                # Calculate new scroll height and compare with last scroll height
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break

                last_height = new_height

                i += 1

                if i == 10:
                    break

        except Exception as e:
            print(e)


    def scrape(self):
        # Access requests via the `requests` attribute
        for request in self.driver.requests:
            if request.response:
                if "graphql" in request.url:
                    body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                    body = json.loads(body)
                    
                    if "marketplace_search" in body["data"]:
                        for node in body["data"]["marketplace_search"]["feed_units"]["edges"]:
                            self.bd.add_data(node["node"]["listing"])


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


scraper = Scraper()
scraper.load()
scraper.scrape()


# bd = Bd("mongodb+srv://Moveout:aa91yce7EEMHF1AW@moveout.exzm8uk.mongodb.net/", "Appartements_moveout", "appartments")
# bd.add_data({"test": "test"})