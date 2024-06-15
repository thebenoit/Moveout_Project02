from splinter import Browser
from selenium import webdriver
from bs4 import BeautifulSoup as soup
import re
import pandas as pd
import matplotlib.pyplot as plt
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
from datetime import datetime
from pymongo import MongoClient 
import schedule


mongoUser = "JerryAdmin"
mongoPassword ="Mspdslxd123#"

# Get the current date
current_date = datetime.now().strftime("%Y_%m_%d_%H_%M") 
print("current_date: ",current_date)

collection_name = "appartments"

#connection à la BD
client = MongoClient(f"mongodb://{mongoUser}:{mongoPassword}@localhost:27017/")

#assigne une bd qui existe si ca n'existe pas il va etre crée
db = client["Appartements_moveout"]

collection = db[collection_name]

# Suppression de tous les documents dans la collection
result = collection.delete_many({})

# Affichage du nombre de documents supprimés
print(f"Nombre de documents supprimés : {result.deleted_count}")
print("listes: ",db.list_collection_names())
print("client:",client)
print("collection:",collection)

browser = Browser('chrome')
#browser.driver.set_page_load_timeout(30)  # sets the timeout to 30 seconds

# Définition de l'URL de base
base_url = "https://www.facebook.com/marketplace/montreal/search?"

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
#attempt to only show appartment on the feed
recherche = "appartment"


def scrapeFb():
  room_dict = {}
  for bedrooms in range(1, 3):

      print(f"bedrooms: {bedrooms}")

      # Construction de l'URL complet en formatant correctement la chaîne de requête
      #url = f"{base_url}minPrice={min_price}&maxPrice={max_price}&minBedrooms={min_bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false"


      urls =[
      #
      f"{base_url}minPrice={min_price}&maxPrice={1000}&minBedrooms={bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false",
      f"{base_url}minPrice={min_price}&maxPrice={1500}&minBedrooms={bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false",
      f"{base_url}minPrice={1500}&maxPrice={3000}&minBedrooms={bedrooms}&minBathrooms={min_bathrooms}&minSqft={min_sqft}&maxSqft={max_sqft}&daysSinceListed={days_listed}&query={min_bedrooms}+bedroom+{recherche}&exact=false"
      ]

      for url in urls:
         # print(f"visiting: URL: {url}")  

         
          # Visit the website
          browser.visit(url)
         # print("Url Visité:")

          # Scroll down to load more results

          #define the number of times to scroll the page
          scroll_count = 8

          #Define the delay (in seconds) between each scroll
          scroll_delay = 4

          #Loop to perform scrolling
          for _ in range(scroll_count):
            #Execute Javascript to scroll to the bottom of the page 
            browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

            time.sleep(scroll_delay)

          # Parse the HTML
          html = browser.html
          # Create a BeautifulSoup object from the scraped HTML
          market_soup = soup(html, 'html.parser')
          # Check if HTML was scraped correctly

          #market_soup

        
          #merde  qui sont pas des appartements donc je les mets dans une liste pour supprimer plus tard
          elements_a_supprimer = ['Filters', 'Categories']


          #Extract all the necessary info and insert into lists
          titles_div = market_soup.find_all('span', class_="x1lliihq x6ikm8r x10wlt62 x1n2onr6")

          #for loop that goes everything inside titles div & stripping everything that not pure text
          titles_list = [title.text.strip() for title in titles_div]

          #Nouvelle liste cleans
          titles_clean = [title for title in titles_list if title not in elements_a_supprimer]
          #print("passés ici: titre")
          #print("liste de titre: ",titles_clean)
          
          prices_div = market_soup.find_all('span', class_="x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x3x7a5m x1lkfr7t x1lbecb7 x1s688f xzsf02u")
          prices_list = [price.text.strip() for price in prices_div]
          #print("passés ici: prix")
          #print("liste de prix: ", prices_list)
        
          city_div = market_soup.find_all('span', class_="x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm xi81zsa")
          city_list = [city.text.strip() for city in city_div]
          #print("passés ici: city")
          #print("city_list: ",city_list)

          #x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 xggy1nq x1a2a7pz x1heor9g xt0b8zv x1hl2dhg x1lku1pv
          urls_div = market_soup.find_all('a',class_="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g x1sur9pj xkrqix3 x1lku1pv")
          urls_list = [url.get('href') for url in urls_div]

          #print("passés ici: url")
          #print("url_list: ",urls_list)

          img_div = market_soup.find_all('img', class_="xt7dq6l xl1xv1r x6ikm8r x10wlt62 xh8yej3")
          img_list = [img.get('src') for img in img_div]

          #print("passés ici: img")
          #print("city_list: ",img_list)

          #print("liste imprimés: ")
          #img_list
        
          #prices_list

          #titles_clean


          appartment_list = []

          min_length = min(len(titles_list), len(prices_list), len(city_list), len(urls_list))
          #print("Avant la boucle:")
          print(f"Longueur des listes: titres={len(titles_clean)}, prix={len(prices_list)}, villes={len(city_list)}, urls={len(urls_list)},img={len(img_list)}")

          for title, price, city, url, img in zip(titles_clean, prices_list, city_list, urls_list,img_list):
            #print("Après la boucle :")  
            
          
            apartment_data = {
              
                          "title": title.strip(),
                    
                          "price": int(re.sub(r'[^\d.]', '', price.strip())),
                          "city": city.strip(),
                          "bedrooms": bedrooms,
                          "url": 'https://www.facebook.com/' + url,
                          "img": img,
                          "date_scraped": datetime.now()
                          
                      }
            #print("Entrée dans le bloc try pour : ", apartment_data)
            try:
            #  print("p: ", apartment_data, flush=True)
              collection.insert_one(apartment_data)
            except Exception as e:
              print(f"Erreur lors de l'insertion : {e}")

          # print("p: ", apartment_data)
            #collection.insert_one(apartment_data)

                        
  try:
      print("Essai du bloc try-except")
      raise ValueError("Test d'erreur")
  except Exception as e:
      print(f"Erreur capturée : {e}")
        
  # End the automated browsing session
  browser.quit()

      

scrapeFb()

