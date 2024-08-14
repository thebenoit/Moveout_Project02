const express = require("express");
const app = express();
const { fetchPage } = require("../../../mongo/interface/appartement");

app.post("/page/:numberBedrooms?/:minPrice?/:maxPrice?", async (req, res) => {
  try {
    // Récupérer les paramètres de la query
    const { numberBedrooms, minPrice, maxPrice } = req.query;

    const pageNumber = req.body.pageNumber || 1;
    let appartData = await fetchPage(pageNumber, 434);

    // Initialiser un tableau pour stocker les valeurs des chambres
    let bedroomsArray = [];

    // Si `numberBedrooms` est défini, on le convertit en tableau de nombres
    if (numberBedrooms) {
      // Si `numberBedrooms` contient une virgule, c'est une liste
      if (numberBedrooms.includes(",")) {
        bedroomsArray = numberBedrooms.split(",").map(Number);
      } else {
        // Sinon, c'est un seul nombre, on le convertit en tableau avec un seul élément
        bedroomsArray = [Number(numberBedrooms)];
      }
    }

    try {
      appartData = appartData
        .map((appart) => {
          try {
            // Extraire et convertir le prix
            const priceText = appart.for_sale_item.formatted_price.text;
            const price = parseFloat(
              priceText.replace(/[^0-9.,]/g, "").replace(",", ".")
            );

            // Extraire le premier caractère qui représente le nombre de chambres et le convertir en float
            let bedrooms = parseFloat(
              appart.for_sale_item.custom_title.split("·")[0].trim()[0]
            );
            // Si ce n'est pas un nombre (comme "S" dans studio), on met 1
            if (isNaN(bedrooms)) {
              bedrooms = 1;
            }

            return {
              id: appart.for_sale_item.id,
              location: [
                appart.for_sale_item.location.latitude,
                appart.for_sale_item.location.longitude,
              ],
              customTitle: appart.for_sale_item.custom_title,
              fullAddress:
                appart.for_sale_item.custom_sub_titles_with_rendering_flags[0]
                  .subtitle,
              price,
              bedrooms: bedrooms.toString(),
              img: appart.for_sale_item.listing_photos[0]?.image?.uri ?? "",
            };
          } catch (error) {
            console.log(appart.for_sale_item.id);
            return null; // Or handle the error as needed
          }
        })
        .filter((appart) => appart !== null) // Filtrer les valeurs nulles
        .filter(
          (appart) =>
            (!minPrice || appart.price >= parseFloat(minPrice)) &&
            (!maxPrice || appart.price <= parseFloat(maxPrice))
        )
        .filter(
          (appart) =>
            bedroomsArray.length === 0 ||
            bedroomsArray.includes(parseInt(appart.bedrooms))
        );
    } catch (error) {
      console.log(error);
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

module.exports = app;
