import express from "express";
const app = express();
import appartement from "../../../mongo/interface/appartement.js";

export default app.post("/pageForYou", async (req, res) => {
  try {
    console.log("Requête reçue avec req.body :", req.body);
    const {
      pageNumber = 1,
      priceMin,
      priceMax,
      numberBedrooms,
      location,
    } = req.body;

    if (!priceMin || !priceMax || !numberBedrooms || !location) {
      return res.status(400).send("Missing required fields");
    } else {
      console.log('passé par la:');
    }

    let appartData = await appartement.fetchPageForYou(
      pageNumber,
      500,
      priceMin,
      priceMax,
      numberBedrooms,
      location
    );

    try {
      appartData = appartData
        .map((appart) => {
          try {
            
            // Extraire et convertir le prix
            const priceText = appart.for_sale_item.formatted_price.text;
            const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.'));

            //extraire le premier caractère qui est  bedroom et converti le en float
            let bedrooms = parseFloat(appart.for_sale_item.custom_title.split("·")[0].trim()[0])
            // si ce n'est pas un nombre comme s dans studio ou c dans chambre privé met 1
            if(isNaN(bedrooms)){
              
              bedrooms = 1;
            }
      
            // Retourner les informations de l'appartement
            
            return {
              id: appart.for_sale_item.id,
              location: [appart.for_sale_item.location.latitude, appart.for_sale_item.location.longitude],
              customTitle: appart.for_sale_item.custom_title,
              fullAddress: appart.for_sale_item.custom_sub_titles_with_rendering_flags[0].subtitle,
              price,
              bedrooms: bedrooms.toString(),
              img: appart.for_sale_item.listing_photos[0].image.uri
            };
          } catch (error) {
            return null; // Or handle the error as needed
          }
        })
        .filter(appart => appart !== null) // Filter out any null values
        .filter(appart => appart.price >= priceMin && appart.price <= priceMax) // Filter by price range
        .filter(appart => numberBedrooms.includes(appart.bedrooms));

    } catch (error) {
      console.log('erreur dans /pageForYou', error);
    }

    if (appartData.length === 0) {
      console.log("Aucune donnée trouvée", appartData);
      return res.status(404).send("Aucune donnée trouvée");
    }

    res.send(appartData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});
