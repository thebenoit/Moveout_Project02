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

Voici un appartement qui pourrait vous plaire:
https://www.facebook.com/marketplace/item/269473882927938/?ref=browse_tab&referral_code=marketplace_top_picks&referral_story_type=top_picks&locale=fr_CA

À bientôt,
L'équipe MoveOut🏠"""

    try:
        # Envoi du SMS
        message = client.messages.create(
            body=message_texte,
            from_=numero_twilio,
            to=numero_telephone,
            media_url=["https://scontent.fymq2-1.fna.fbcdn.net/v/t45.5328-4/463425096_8629748043735064_1439418837299247984_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=iDmSQbC0AZIQ7kNvgE2VOfz&_nc_zt=23&_nc_ht=scontent.fymq2-1.fna&_nc_gid=Atu8tkrWx_dgGKyJ0brkA5U&oh=00_AYBCXBfa4TVqzxycX0YpxnKTzgo5bU2cO1oWcBW3-mIW9A&oe=677B4674"]
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
        message_texte = f"""Bonjour {nom_client}! 🫡

✨ Nouveaux appartements trouvés pour vous! ✨

🏠 Voici un appartement qui pourrait vous plaire:

👉 https://www.facebook.com/marketplace/item/269473882927938

À bientôt!
- L'équipe MoveOut 🏡"""

        try:
            message = client.messages.create(
                body=message_texte,
                from_=numero_twilio,
                to=numero_telephone,
                media_url=["https://scontent.fymq2-1.fna.fbcdn.net/v/t45.5328-4/463425096_8629748043735064_1439418837299247984_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=iDmSQbC0AZIQ7kNvgE2VOfz&_nc_zt=23&_nc_ht=scontent.fymq2-1.fna&_nc_gid=Atu8tkrWx_dgGKyJ0brkA5U&oh=00_AYBCXBfa4TVqzxycX0YpxnKTzgo5bU2cO1oWcBW3-mIW9A&oe=677B4674"]
            )
            resultats.append((numero_telephone, True, message.sid))
            print(f"SMS envoyé à {nom_client}: {message.sid} Status: {message.status}")
        except Exception as e:
            resultats.append((numero_telephone, False, str(e)))
            print(f"Erreur pour {nom_client}: {e}")
            
    return resultats


# Exemple d'utilisation
if __name__ == "__main__":
    # envoyer_sms_personnalise("Kemmy Will ", "+14385239294")
    

    clients = [
        ("Kemmy Will Benoit", "+14385239294"),
        ("Roos Keen Ely benoit", "+15145891865")
    ]
    envoyer_sms_multiple(clients) 