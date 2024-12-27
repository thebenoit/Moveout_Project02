from splinter import Browser
import json
from selenium import webdriver
from bs4 import BeautifulSoup as soup
import re
import pandas as pd
import matplotlib.pyplot as plt
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
from datetime import datetime
from pymongo import MongoClient
import schedule


class Bd:

    def __init__(self, uri, table, collection):
        self.uri = uri
        self.table = table
        self.collection = collection

        # connection à la BD
        self.client = MongoClient()
        self.db = self.client[TABLE_NAME]
        self.collection = self.db[COLLECTION_NAME]

        # Suppression de tous les documents dans la collection
        self.collection.delete_many({})


class Scraper:

    def __init__(self):
        self.results = []
        self.html_xpath = "//div[@class='x9f619 x78zum5 x1r8uery xdt5ytf x1iyjqo2 xs83m0k x1e558r4 x150jy0e x1iorvi4 xjkvuk6 xnpuxes x291uyu x1uepa24']"

        # Définition des paramètres de recherche pour les appartements
        min_price = 300  # Prix minimum en dollars
        max_price = 1000  # Prix maximum en dollars
        min_bedrooms = 2  # Nombre minimum de chambres
        min_bathrooms = 1  # Nombre minimum de salles de bains
        min_sqft = 500  # Superficie minimum en pieds carrés
        max_sqft = 2000  # Superficie maximum en pieds carrés
        days_listed = 7  # Nombre de jours depuis la mise en ligne
        pets_allowed = True  # Animaux autorisés
        furnished = False  # Meublé ou non
        neighborhood = "Montreal"  # Quartier souhaité
        recherche = "appartment"

        options = webdriver.ChromeOptions()
        options.set_capability('goog:loggingPrefs', {'performance': 'ALL'})
        self.browser = webdriver.Chrome(options=options)


    def scrape(self):
        base_url = "https://www.facebook.com/marketplace/montreal/search?"

        url = f"https://www.facebook.com/marketplace/montreal/search?minPrice=300&maxPrice=3000&minBedrooms=1&minBathrooms=1&minSqft=500&maxSqft=2000&daysSinceListed=7&query=2%20bedroom%20appartment&exact=false"
        
        self.browser.get(url)
        
        SCROLL_PAUSE_TIME = 2
            
        # Get scroll height
        last_height = self.browser.execute_script("return document.body.scrollHeight")

        try:
            i = 0

            while True:
                # Scroll down to bottom
                self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

                # Wait to load page
                time.sleep(SCROLL_PAUSE_TIME)

                # Calculate new scroll height and compare with last scroll height
                new_height = self.browser.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break

                last_height = new_height

                i+=1

                if i == 1:
                    break
        
        except Exception as e:
            print(e)
        
        finally:

            # Locate the parent elements
            parent_elements = self.browser.find_elements(By.XPATH, self.html_xpath)

            # Iterate through each parent element and get its children
            for idx, parent_element in enumerate(parent_elements):
                print(f"Parent Element {idx + 1}: {parent_element.tag_name}, {parent_element.text}")
                
                # Get children elements of the current parent
                children = parent_element.find_elements(By.XPATH, './*')
                
                # Print details about the children
                for child_idx, child in enumerate(children):
                    print(f"  Child {child_idx + 1}: {child.tag_name}, {child.text}")
            
            
            # elements = self.browser.find_elements(By.XPATH, self.html_xpath)
            
            # # results = [[*e.text.splitlines(), i.get_attribute("src")] for e, i in zip(elements, images)]
            # # results = [[*e.text.splitlines(), e.find_element(By.TAG_NAME, "img").get_attribute("src")] for e in elements]

            # results = []

            # for e in elements:
            #     try:
            #         temp = []
            #         temp.append(e.text.splitlines())
            #         temp.append(e.find_element(By.TAG_NAME, "img").get_dom_attribute("src"))
            #         results.append(temp)

            #     except Exception as e:
            #         print(e)
            

            # for result in results:
            #     print(result)

            # self.browser.quit()

        self.update_bd()

    def get_response_body(self, request_id):
        try:
            response_body = self.browser.execute_cdp_cmd('Network.getResponseBody', {'requestId': request_id})
            print(response_body)
            return response_body
        except Exception as e:
            print(e)
            return None

        
    
    def update_bd(self):
        pass
        
        


# MONGO_URI = "mongodb+srv://Moveout:aa91yce7EEMHF1AW@moveout.exzm8uk.mongodb.net/"
# TABLE_NAME = "Appartements_moveout"
# COLLECTION_NAME = "appartments"


# def scrapeFb():
#   room_dict = {}
#   for bedrooms in range(1, 3):

#         print(f"bedrooms: {bedrooms}")

#         # Construction de l'URL complet en formatant correctement la chaîne de requête
#         # url = f"{base_url}minPrice={min_price}&maxPrice={max_price}&minBedrooms={min_bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false"

#         urls = [
#             f"{base_url}minPrice={min_price}&maxPrice={1000}&minBedrooms={bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false",
#             f"{base_url}minPrice={min_price}&maxPrice={1500}&minBedrooms={bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false",
#             f"{base_url}minPrice={1500}&maxPrice={3000}&minBedrooms={bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false"
#         ]

#         for url in urls:
#             # print(f"visiting: URL: {url}")  

            
#             # Visit the website
#             browser.visit(url)
#             # print("Url Visité:")

#             # Scroll down to load more results

#             #define the number of times to scroll the page
#             scroll_count = 2

#             #Define the delay (in seconds) between each scroll
#             scroll_delay = 4

#             #Loop to perform scrolling
#             for _ in range(scroll_count):
#                 #Execute Javascript to scroll to the bottom of the page 
#                 browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

#                 time.sleep(scroll_delay)
                

#             # Parse the HTML
#             html = browser.html
#             # Create a BeautifulSoup object from the scraped HTML
#             market_soup = soup(html, 'html.parser')
#             # Check if HTML was scraped correctly

#             #market_soup
            
#             #merde  qui sont pas des appartements donc je les mets dans une liste pour supprimer plus tard
#             elements_a_supprimer = ['Filters', 'Categories']


#             #Extract all the necessary info and insert into lists
#             titles_div = market_soup.find_all('span', class_="x1lliihq x6ikm8r x10wlt62 x1n2onr6")

#             #for loop that goes everything inside titles div & stripping everything that not pure text
#             titles_list = [title.text.strip() for title in titles_div]

#             #Nouvelle liste cleans
#             titles_clean = [title for title in titles_list if title not in elements_a_supprimer]
#             #print("passés ici: titre")
#             #print("liste de titre: ",titles_clean)
            
#             prices_div = market_soup.find_all('span', class_="x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x3x7a5m x1lkfr7t x1lbecb7 x1s688f xzsf02u")
#             prices_list = [price.text.strip() for price in prices_div]
#             #print("passés ici: prix")
#             #print("liste de prix: ", prices_list)
            
#             city_div = market_soup.find_all('span', class_="x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm xi81zsa")
#             city_list = [city.text.strip() for city in city_div]
#             #print("passés ici: city")
#             #print("city_list: ",city_list)

#             #x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 xggy1nq x1a2a7pz x1heor9g xt0b8zv x1hl2dhg x1lku1pv
#             urls_div = market_soup.find_all('a',class_="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g x1sur9pj xkrqix3 x1lku1pv")
#             urls_list = [url.get('href') for url in urls_div]

#             #print("passés ici: url")
#             #print("url_list: ",urls_list)

#             img_div = market_soup.find_all('img', class_="xt7dq6l xl1xv1r x6ikm8r x10wlt62 xh8yej3")
#             img_list = [img.get('src') for img in img_div]

#             appartment_list = []

#             min_length = min(len(titles_list), len(prices_list), len(city_list), len(urls_list))
#             #print("Avant la boucle:")
#             print(f"Longueur des listes: titres={len(titles_clean)}, prix={len(prices_list)}, villes={len(city_list)}, urls={len(urls_list)},img={len(img_list)}")

#             for title, price, city, url, img in zip(titles_clean, prices_list, city_list, urls_list,img_list):
#                 #print("Après la boucle :")  
                
            
#                 apartment_data = {
                
#                             "title": title.strip(),
                        
#                             "price": int(re.sub(r'[^\d.]', '', price.strip())),
#                             "city": city.strip(),
#                             "bedrooms": bedrooms,
#                             "url": 'https://www.facebook.com/' + url,
#                             "img": img,
#                             "date_scraped": datetime.now()
                            
#                         }
#                 #print("Entrée dans le bloc try pour : ", apartment_data)
#                 try:
#                 #  print("p: ", apartment_data, flush=True)
#                 collection.insert_one(apartment_data)
#                 print(apartment_data)
#                 except Exception as e:
#                 print(f"Erreur lors de l'insertion : {e}")

#             # print("p: ", apartment_data)
#                 #collection.insert_one(apartment_data)

                        
#   try:
#       print("Essai du bloc try-except")
#       raise ValueError("Test d'erreur")
#   except Exception as e:
#       print(f"Erreur capturée : {e}")
        
#   # End the automated browsing session
#   browser.quit()

      

# scrapeFb()


a = Scraper()
a.scrape()