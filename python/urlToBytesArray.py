
from pymongo import MongoClient
from bson.objectid import ObjectId
import requests

#client = MongoClient('mongodb+srv://moveout:qFCPn6LARdjfBAYQ@cluster0.iowm3fd.mongodb.net/')

class Bd:
    #initialiser la base de donnée
    def __init__(self,uri,table,collection):
        self.table = table
        self.collection = collection
        
        #connection à la BD
        self.client = MongoClient(uri)
        self.db = self.client[table]
        self.collection = self.db[collection]
    
  
moveoutBd = Bd("mongodb+srv://moveout:qFCPn6LARdjfBAYQ@cluster0.iowm3fd.mongodb.net/", "Appartements_moveout", "gettoCollection")    
    
def url_to_bytes(image_url):
    response = requests.get(image_url)
    return response.content

cursor = moveoutBd.collection.find({})

for document in cursor:
    if 'for_sale_item' in document and 'listing_photos' in document['for_sale_item']:
        for photo in document['for_sale_item']['listing_photos']:
            if 'image' in photo and 'uri' in photo['image']:
                image_url = photo['image']['uri']
                try:
                    images_bytes = url_to_bytes(image_url)
                     #mettre à jour le document avec les nouvelles données d'image
                     
                    moveoutBd.collection.update_one(
                        {"_id": document["_id"], "for_sale_item.listing_photos.id": photo['id']},
                        {"$set": {"for_sale_item.listing_photos.$.image_bytes": images_bytes}}                              
                     )
                    print(F"Image mise à jour pour le document {document['_id']}, photo ID: {photo['id']}")
                except Exception as e:
                    print(F"Erreur lors de la récupération de l'image {image_url}: {e}")
                    
print("Mise à jour terminée pour tous les documents")
                     
                
                
                

        


    
    