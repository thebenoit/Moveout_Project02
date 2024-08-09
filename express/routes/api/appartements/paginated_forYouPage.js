const express = require("express");
const app = express();
const {
  fetchPage,
  fetchPageForYou,
} = require("../../../mongo/interface/appartement");

module.exports = app.post("/pageForYou", async (req, res) => {
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
    }else{
        console.log('passé par la:')
    }

    appartData = await fetchPageForYou(
      pageNumber,
      100,
      req.body.priceMin,
      req.body.priceMax,
      req.body.numberBedrooms,
      req.body.location
    );
   
    try {
      appartData = appartData.map((appart) => {
        try {
            //trier selon les préférences
          return {
            id: appart.for_sale_item.id,
            location: [appart.for_sale_item.location.latitude, appart.for_sale_item.location.longitude],
            customTitle: appart.for_sale_item.custom_title,
            fullAddress: appart.for_sale_item.custom_sub_titles_with_rendering_flags[0].subtitle,
            price: appart.for_sale_item.formatted_price.text,
            img: appart.for_sale_item.listing_photos[0].image.uri
          };
        } catch (error) {
          return null; // Or handle the error as needed
        }
      } );
    } catch (error) {
      console.log('erreur dans /pageForYou',error);
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
