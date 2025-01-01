from twilio.rest import Client
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

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
                return None
                
            preferences = self.collection_preferences.find_one({"_id": user["preferencesId"]})
            if not preferences:
                return None
                
            # Construire la requête en fonction des préférences
            query = {
                "$and": [
                    {"for_sale_item.formatted_price.text": {
                        "$regex": f"^[0-9 ]+\\$",  # Prix en format "XXXX $"
                        "$exists": True
                    }},
                    {"for_sale_item.custom_title": {
                        "$regex": f"({'|'.join(preferences['numberOfBedrooms'])})",
                        "$options": "i"
                    }},
                    {"for_sale_item.custom_sub_titles_with_rendering_flags": {
                        "$elemMatch": {
                            "subtitle": {
                                "$regex": f"({'|'.join(preferences['locationPreferences'])})",
                                "$options": "i"
                            }
                        }
                    }}
                ]
            }
            
            # Ajouter le filtre de budget
            if "budget" in preferences:
                price_query = {
                    "$expr": {
                        "$and": [
                            {"$gte": [
                                {"$toInt": {"$replaceAll": {"input": "$for_sale_item.formatted_price.text", "find": " $", "replacement": ""}}},
                                preferences["budget"]["minValue"]
                            ]},
                            {"$lte": [
                                {"$toInt": {"$replaceAll": {"input": "$for_sale_item.formatted_price.text", "find": " $", "replacement": ""}}},
                                preferences["budget"]["maxValue"]
                            ]}
                        ]
                    }
                }
                query["$and"].append(price_query)
            
            # Récupérer l'appartement le plus récent
            apartment = self.collection_apartments.find_one(
                query,
                sort=[("scraped_at", -1)]
            )
            
            return apartment
            
        except Exception as e:
            print(f"Erreur lors de la récupération de l'appartement: {e}")
            return None
        finally:
            self.client.close()

    def envoyer_sms_personnalise(self, user_id, nom_client, numero_telephone):
        """
        Envoie un SMS personnalisé au client avec l'appartement le plus récent correspondant à ses critères
        
        Args:
            user_id (str): ID de l'utilisateur
            nom_client (str): Nom du client
            numero_telephone (str): Numéro de téléphone au format +1XXXXXXXXXX
        """
        # Récupérer l'appartement correspondant aux critères
        appartement = self.get_latest_matching_apartment(user_id)
        if not appartement:
            print(f"Aucun appartement trouvé pour l'utilisateur {user_id}")
            return False

        # Identifiants Twilio
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        numero_twilio = os.getenv('TWILIO_PHONE_NUMBER')

        # Initialiser le client Twilio
        client = Client(account_sid, auth_token)

        # Extraire les informations de l'appartement
        prix = appartement['for_sale_item']['formatted_price']['text']
        titre = appartement['for_sale_item']['marketplace_listing_title']
        lien = appartement['for_sale_item']['share_uri']
        photo_url = appartement['for_sale_item']['listing_photos'][0]['image']['uri'] if appartement['for_sale_item']['listing_photos'] else None

        # Message personnalisé
        message_texte = f"""Bonjour {nom_client}!🫡

    Nous avons trouvé un nouvel appartement qui correspond à vos critères!😆

    {titre}
    Prix: {prix}

    Voici le lien:
    {lien}

    À bientôt,
    L'équipe MoveOut🏠"""

        try:
            # Paramètres du message
            message_params = {
                'body': message_texte,
                'from_': numero_twilio,
                'to': numero_telephone
            }
            
            # Ajouter l'image si disponible
            if photo_url:
                message_params['media_url'] = [photo_url]

            # Envoi du SMS
            message = client.messages.create(**message_params)
            print(f"SMS envoyé avec succès! SID: {message.sid}")
            return True
            
        except Exception as e:
            print(f"Erreur lors de l'envoi du SMS: {e}")
            return False

    def get_user_info(self,user_id):
        """
        Récupère les informations de l'utilisateur depuis la base de données
        
        Args:
            user_id (str): ID de l'utilisateur
        
        Returns:
            tuple: (nom_complet, numero_telephone) ou (None, None) si non trouvé
        """
        try:
            user = self.collection_users.find_one({"_id": user_id})
            if not user:
                return None, None
                
            nom_complet = f"{user['firstName']} {user['lastName']}"
            numero_telephone = f"+1{user['phone']}"
            
            return nom_complet, numero_telephone
            
        except Exception as e:
            print(f"Erreur lors de la récupération des informations utilisateur: {e}")
            return None, None
        finally:
            self.client.close()

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
            print(f"Impossible de trouver les informations pour l'utilisateur {user_id}")
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
            succes = self.envoyer_sms_pour_utilisateur(user_id)
            resultats.append((user_id, succes))
        return resultats

# Exemple d'utilisation
if __name__ == "__main__":
    # Test avec un seul utilisateur
    user_id = "66bd41ade6e37be2ef4b4fc2"
    send_sms().envoyer_sms_pour_utilisateur(user_id)
    
    # Test avec plusieurs utilisateurs
    user_ids = [
        "66bd41ade6e37be2ef4b4fc2",
        "66bd5b9fdcd4af9a94dcf0d1"
    ]
    send_sms().envoyer_sms_multiple_par_ids(user_ids) 