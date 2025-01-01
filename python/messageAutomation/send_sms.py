from twilio.rest import Client
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

def envoyer_sms_personnalise(nom_client, numero_telephone):
    """
    Envoie un SMS personnalisé au client
    
    Args:
        nom_client (str): Nom du client
        numero_telephone (str): Numéro de téléphone au format +1XXXXXXXXXX
    """
    # Identifiants Twilio (à mettre dans le .env)
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    numero_twilio = os.getenv('TWILIO_PHONE_NUMBER')
    
    print(f"account_sid: {account_sid} auth_token: {auth_token} numero_twilio: {numero_twilio}")

    # Initialiser le client Twilio
    client = Client(account_sid, auth_token)

    # Message personnalisé
    message_texte = f"""Bonjour {nom_client}!🫡

Nous avons trouvé de nouveaux appartements qui pourraient vous intéresser!😆

Consultez votre liste personnalisée sur notre site.

À bientôt,
L'équipe MoveOut🏠"""

    try:
        # Envoi du SMS
        message = client.messages.create(
            body=message_texte,
            from_=numero_twilio,
            to=numero_telephone
        )
        print(f"SMS envoyé avec succès! SID: {message.sid}")
        return True
        
    except Exception as e:
        print(f"Erreur lors de l'envoi du SMS: {e}")
        return False

def envoyer_sms_multiple(clients):
    """
    Envoie des SMS en masse à une liste de clients
    
    Args:
        clients (list): Liste de tuples (nom_client, numero_telephone)
    """
    # Initialiser le client Twilio
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    numero_twilio = os.getenv('TWILIO_PHONE_NUMBER')
    client = Client(account_sid, auth_token)

    resultats = []
    for nom_client, numero_telephone in clients:
        message_texte = f"""
        Bonjour {nom_client}!🫡,
        
        Nous avons trouvé de nouveaux appartements qui pourraient vous intéresser!😆
        Consultez votre liste personnalisée sur notre site.
        
        À bientôt,
        L'équipe MoveOut
        """

        try:
            message = client.messages.create(
                body=message_texte,
                from_=numero_twilio,
                to=numero_telephone
            )
            resultats.append((numero_telephone, True, message.sid))
            print(f"SMS envoyé à {nom_client}: {message.sid} Status: {message.status}")
        except Exception as e:
            resultats.append((numero_telephone, False, str(e)))
            print(f"Erreur pour {nom_client}: {e}")
            
    return resultats


# Exemple d'utilisation
if __name__ == "__main__":
    envoyer_sms_personnalise("Kemmy Will ", "+14385239294")
    

    # clients = [
    #     ("Jean Dupont", "+14501234567"),
    #     ("Marie Martin", "+33612345678")
    # ]
    # envoyer_sms_multiple(clients) 