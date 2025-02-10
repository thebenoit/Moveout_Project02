import express from "express";
const app = express();
import appartement from "../../../mongo/interface/appartement.js";
import facebook from "../../../mongo/schemas/facebook.js";

let total = 0;
const SIZEPAGE = 30;

app.get("/page/totalAppart", async (req, res) => {
  //total page est égale a total divise par le nombre d'appart dans la page et ont arrondo a l'entier superieur
  const totalPage = Math.ceil(total / SIZEPAGE);
  console.log("totalPage: ", totalPage);

  return totalPage;
});
app.post("/page/:numberBedrooms?/:minPrice?/:maxPrice?", async (req, res) => {
  console.time("API Execution TIme");
  try {
    // Récupérer les paramètres de la query
    const { numberBedrooms, minPrice, maxPrice } = req.query;
    //Récupérer le nombre de page
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize;

    const filters = {};
    if(minPrice || maxPrice){
      filters['for_sale_item.formatted_price.text'] = {};
      if (minPrice) filters['for_sale_item.formatted_price.text'].$gte = minPrice;
      if (maxPrice) filters['for_sale_item.formatted_price.text'].$lte = maxPrice;
    }
    if (numberBedrooms){
      filters['for_sale_item.custom_title'] = new RegExp(`^${numberBedrooms}\\s`);
    }

    const skip = (pageNumber - 1) * pageSize;

    console.time("Data Fetching Time");
     // 3. Récupération parallèle du count et des données
     const [total, appartData] = await Promise.all([
      facebook.countDocuments(filters),
      appartement.getSpecificAppartment(null, filters, skip, pageSize)
    ]);
    console.timeEnd("Data Fetching Time");
    console.time('data_processing');

    const processedData = appartData.map(appart => ({
      total: Math.ceil(total / pageSize),
      id: appart.for_sale_item.id,
      location: [
        appart.for_sale_item.location.latitude,
        appart.for_sale_item.location.longitude
      ],
      customTitle: appart.for_sale_item.custom_title,
      fullAddress: appart.for_sale_item.custom_sub_titles_with_rendering_flags[0].subtitle,
      price: parseFloat(
        appart.for_sale_item.formatted_price.text
          .replace(/[^0-9.,]/g, '')
          .replace(',', '.')
      ),
      bedrooms: appart.for_sale_item.custom_title.split('·')[0].trim()[0],
      img: appart.for_sale_item.listing_photos[0]?.image?.uri ?? ''
    }));
    console.timeEnd('data_processing');
    console.timeEnd("API Execution TIme");

  res.json(processedData);

 
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

export default app;
