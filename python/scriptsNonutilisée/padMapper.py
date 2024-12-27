from splinter import Browser
from selenium import webdriver
from bs4  import BeautifulSoup as soup
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

collection_name = "padmapper"

#connection à la BD
client = MongoClient(f"mongodb+srv://moveout:qFCPn6LARdjfBAYQ@cluster0.iowm3fd.mongodb.net/")

#assigne une bd qui existe si ca n'existe pas il va etre crée
db = client["Appartements_moveout"]

collection = db[collection_name]


browser = Browser('chrome')
#browser.driver.set_page_load_timeout(30)  # sets the timeout to 30 seconds

# Définition de l'URL de base
base_url = "https://www.zumper.com/apartments-for-rent/montreal-qc/cheap"

browser.visit(base_url)

scroll_count = 2

#Define the delay (in seconds) between each scroll
scroll_delay = 2

for _ in range(scroll_count):
    browser.execute_script("window.scrollTo(0, document.body.scrollHeight)")

    time.sleep(scroll_delay)

html = browser.html
 # Create a BeautifulSoup object from the scraped HTML
market_soup = soup(html, 'html.parser')

#merde  qui sont pas des appartements donc je les mets dans une liste pour supprimer plus tard
elements_a_supprimer = ['Filters', 'Categories']

titles_div = market_soup.find_all('a', class_="chakra-link DetailPageLink css-jdbqfd e1k4it830")
titles_list = [title.text.strip() for title in titles_div]

address_div = market_soup.find_all('p', class_="chakra-text ListingCardContentSection-fullAddress-shortTermPropertyText css-190nd4v e1k4it830")
address_list = [address.text.strip() for address in address_div]

bedrooms_div = market_soup.find_all('p', class_='chakra-text css-bnpuq6 e1k4it830')
bedrooms_list = [bedrooms.text.strip() for bedrooms in bedrooms_div]

bath_div = market_soup.find_all('p', class_='chakra-text css-190nd4v e1k4it830')
bath_list = [bath.text.strip() for bath in bath_div]


prices_div = market_soup.find_all('p', class_='chakra-heading css-eoz7du-display20To24 e1k4it830')
prices_list = [prices.text.strip() for prices in prices_div]

#img_div = market_soup.find_all('img', class_='css-nibaq4')
#img_list = [img.get('src') for img in img_div]

urls_div = market_soup.find_all('a', class_='chakra-link DetailPageLink css-jdbqfd e1k4it830')
urls_list = [url.get('href') for url in urls_div]

# Ajout pour récupérer toutes les images pour chaque appartement
apartments_div = market_soup.find_all('div', class_='ListingCardImageSection-container-box css-7qxvbb e1k4it830')



appartment_list = []

min_length = min(len(titles_list), len(prices_list), len(bath_list), len(urls_list))
#print("Avant la boucle:")
print(f"Longueur des listes: titres={len(titles_list)}, prix={len(prices_list)}, bath={len(bath_list)}, urls={len(urls_list)},img={len(apartments_div)}")





for title, url,  price, bath, address,apartment_div in zip(titles_list, urls_list, prices_list,bath_list, address_list,apartments_div):
    img_tags = apartment_div.find_all('img', class_='css-nibaq4')
    img_list = [img.get('src') for img in img_tags]
    #print(f"titre: {title}\n prix: {price}\n ,bath: {bath}\n  url: {url}\n, img: {img}, address: {address}")

    apartment_data = {
        "title": title.strip(),
        "url": 'https://www.zumper.com' + url,
        "price": int(re.findall(r'\d+', price.strip())[0]),       
        "address": address,     
        "bath": bath.strip(),
        "img": img_list,
        "date_scraped": datetime.now(),
        



    }

    try:
        collection.insert_one(apartment_data)
        print(apartment_data)
    except Exception as e:
        print(f"Erreur lors de l'insertion {e}")


browser.quit()




