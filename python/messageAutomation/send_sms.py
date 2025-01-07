from twilio.rest import Client

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import pytz
# Charger les variables d'environnement
load_dotenv()

def get_mongodb_client():
        """Établit la connexion avec MongoDB"""
        mongodb_uri = os.getenv('MONGODB_URI')
        client = MongoClient(mongodb_uri)
        return client


class send_sms():
    def __init__(self):
        self.client = get_mongodb_client()
        self.db = self.client[os.getenv('DATABASE_NAME')]
        self.collection_users = self.db[os.getenv('USERS_COLLECTION')]
        self.collection_preferences = self.db[os.getenv('PREFERENCES_COLLECTION')]
        self.collection_apartments = self.db[os.getenv('APARTMENTS_COLLECTION')]
         # Identifiants Twilio
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.numero_twilio = os.getenv('TWILIO_PHONE_NUMBER')
        self.message_sid = os.getenv("TWILIO_MESSAGE_SID")
        
   
    def clean_price(self, price):
        try:
            # Supprime tous les caractères non numériques sauf le point
            cleaned = ''.join(char for char in price if char.isdigit() or char == '.')
            return float(cleaned)
        except:
            return None
    

        
       
    def get_latest_matching_apartment(self, user_id):
        """
        Récupère l'appartement le plus récent correspondant aux critères de l'utilisateur
        
        Args:
            user_id (str): ID de l'utilisateur
        
        Returns:
            dict: Appartement correspondant aux critères ou None
        """
        try:
            # Récupérer l'utilisateur et ses préférences
            user = self.collection_users.find_one({"_id": user_id})
            
           
            
            if not user or "preferencesId" not in user:
                print("user not found or preferencesId not in user")
                return None
                
            preferences = self.collection_preferences.find_one({"_id": user["preferencesId"]})
            if not preferences:
                print("preferences not found")
                return None
            
            print("preferencesID", preferences["_id"])
            # Construire la requête en fonction des préférences
            # Construire la requête pour le prix
            # Convertir le prix de "X XXX $" en int pour la comparaison
            
            
            price_query = {
                "for_sale_item.formatted_price.text": {
                    "$exists": True
                },
                "scraped_at": {
                    "$exists": True
                }
            }
            apartments = self.collection_apartments.find(price_query)
            sorted_appartments = []
            # Récupérer l'appartement le plus récent
            #apartment = apartments.sort([("scraped_at", -1)]
                                        #)#find_one(sort=[("scraped_at", -1)])#self.collection_apartments.find_one(price_query, sort=[("scraped_at", -1)])
            for apartment in apartments:
                if apartment:
                    price = self.clean_price(apartment["for_sale_item"]["formatted_price"]["text"])
                    print("price", price)
                    if price and preferences["budget"]["minValue"] <= price <= preferences["budget"]["maxValue"]:
                        sorted_appartments.append(apartment)
            
            sorted_appartments.sort(key=lambda x: x["scraped_at"], reverse=True)
            if sorted_appartments != []:
                #return the most recent apartment
                return sorted_appartments[0]
            return None
            
        except Exception as e:
            print(f"Erreur lors de la récupération de l'appartement: {e}")
            return None

    def envoyer_sms_personnalise(self, user_id, nom_client, numero_telephone,date_pour_envoyer):
        """
        Envoie un SMS personnalisé au client avec l'appartement le plus récent correspondant à ses critères
        
        Args:
            user_id (str): ID de l'utilisateur
            nom_client (str): Nom du client
            numero_telephone (str): Numéro de téléphone au format +1XXXXXXXXXX
        """
        user_id_object = ObjectId(user_id)
        
        
        # Récupérer l'appartement correspondant aux critères
        appartement = self.get_latest_matching_apartment(user_id_object)
        if not appartement:
            print(f"Aucun appartement trouvé pour l'utilisateur {user_id}")
            return False

       

        # Initialiser le client Twilio
        client = Client(self.account_sid, self.auth_token)

        # Extraire les informations de l'appartement
        prix = appartement['for_sale_item']['formatted_price']['text']
        titre = appartement['for_sale_item']['marketplace_listing_title']
        lien = appartement['for_sale_item']['share_uri']
        photo_url = appartement['for_sale_item']['listing_photos'][0]['image']['uri'] if appartement['for_sale_item']['listing_photos'] else None

        # Message personnalisé
        message_texte = f"""Bonjour {nom_client}! 🫡

Nous avons trouvé un nouvel appartement qui correspond à vos critères! 😆

{titre}
Prix: {prix}

Voici le lien:
{lien}

À bientôt,
L'équipe MoveOut 🏠"""

        try:
            # Paramètres du message
            message_params = {
                'body': message_texte,
                "messaging_service_sid": self.message_sid,
                'send_at': date_pour_envoyer,
                'schedule_type': "fixed",
                'from_': self.numero_twilio,
                'to': numero_telephone
            }
            
            # Ajouter l'image si disponible
            if photo_url:
                message_params['media_url'] = [photo_url]

            # Envoi du SMS
            message = client.messages.create(**message_params)
            print(f"SMS envoyé avec succès à {nom_client}!")
            return True
            
        except Exception as e:
            print(f"Erreur lors de l'envoi du SMS: {e}")
            return False

    def get_date_list(self, user_id):
        date_now = datetime.now(pytz.utc)
        date_list = []
        preferences = self.collection_preferences.find_one({"_id":user_id})
        notification_days = str(preferences["notificationDays"])
        notification_times = str(preferences["notificationTimes"])
         
        for day in notification_days:
             
                 # Convertir le jour en numéro de jour de la semaine
             match day.lower():
                 case "sunday":
                         jour_semaine = 6
                         NextSunday = date_now + timedelta(days=6)
                 case "monday": 
                         jour_semaine = 0
                 case "tuesday":
                         jour_semaine = 1
                 case "wednesday":
                         jour_semaine = 2
                 case "thursday":
                         jour_semaine = 3
                 case "friday":
                         jour_semaine = 4
                 case "saturday":
                         jour_semaine = 5
                 case _:
                         print(f"Jour invalide: {day}")
                         continue
                date_list.append('Monday',day,time)
     
        
        
        
        
        # preference_days = preferences["notificationDays"]
        # preference_times = preferences["notificationTimes"]
        
    def create_schedule_message(self,schedule_time_list):
        for time in schedule_time_list:
            formatted_time = time.strftime('%Y-%m-%dT%H:%M:%SZ')  # Conversion en format ISO 8601
            print(formatted_time)
            self.envoyer_sms_pour_utilisateur("66bd41ade6e37be2ef4b4fc2")   
            

    def get_user_info(self,user_id):
        """
        Récupère les informations de l'utilisateur depuis la base de données
        
        Args:
            user_id (str): ID de l'utilisateur
        
        Returns:
            tuple: (nom_complet, numero_telephone) ou (None, None) si non trouvé
        """
        try:
            # Convertir la chaîne user_id en ObjectId
            user_id_object = ObjectId(user_id)
            
            total_users = self.collection_users.count_documents({})
           
            
            user = self.collection_users.find_one({"_id": user_id_object})  # Utiliser l'ObjectId
            
            if not user:
                return None, None
                
            nom_complet = f"{user['firstName']} {user['lastName']}"
            # Convertir en string et vérifier le format du numéro
            numero_telephone = str(user['phone'])
            if not numero_telephone.startswith('+1'):
                numero_telephone = f"+1{numero_telephone}"
            
            return nom_complet, numero_telephone
            
        except Exception as e:
            print(f"Erreur lors de la récupération des informations utilisateur: {e}")
            return None, None

    def envoyer_sms_pour_utilisateur(self, user_id):
        """
        Envoie un SMS à l'utilisateur avec l'appartement correspondant à ses critères
        
        Args:
            user_id (str): ID de l'utilisateur
        
        Returns:
            bool: True si le SMS a été envoyé avec succès, False sinon
        """
        nom_client, numero_telephone = self.get_user_info(user_id)
        if not nom_client or not numero_telephone:
            print(f"Impossible de trouver les informations pour l'utilisateur {user_id} {nom_client} {numero_telephone}")
            return False
            
        return self.envoyer_sms_personnalise(user_id, nom_client, numero_telephone)

    def envoyer_sms_multiple_par_ids(self, user_ids):
        """
        Envoie des SMS en masse à une liste d'utilisateurs à partir de leurs IDs
        
        Args:
            user_ids (list): Liste des IDs utilisateurs
        """
        resultats = []
        for user_id in user_ids:
            
            preference = self.collection_preferences.find_one({"_id":user_id})
            schedule_time_list = preference["notificationTimes"]
            self.create_schedule_message(schedule_time_list)
            
            
            succes = self.envoyer_sms_pour_utilisateur(user_id)
            resultats.append((user_id, succes))
        return resultats

# Exemple d'utilisation
if __name__ == "__main__":
    # Test avec un seul utilisateur
    # user_id = "66bd41ade6e37be2ef4b4fc2"
    # send_sms().envoyer_sms_pour_utilisateur(user_id)
    
    # Test avec plusieurs utilisateurs
    user_ids = [
        "66bd41ade6e37be2ef4b4fc2",
        "66bd5b9fdcd4af9a94dcf0d1",#Liam
        #"67763e39302fa56cd30159bb",#Nathan
        #"67763f7d302fa56cd30159be"#Gesther
        
    ]
    send_sms().envoyer_sms_multiple_par_ids(user_ids) 