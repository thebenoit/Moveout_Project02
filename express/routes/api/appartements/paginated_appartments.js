const express = require("express");
const app = express();
const { fetchPage } = require("../../../mongo/interface/appartement");

module.exports = app.post("/page", async (req, res) => {
	try {
		const pageNumber = req.body.pageNumber || 1

		appartData = await fetchPage(pageNumber, 656);

		try{
			appartData = appartData.map((appart) => {
				try {
					return {
						id: appart.for_sale_item.id,
						location: [appart.for_sale_item.location.latitude, appart.for_sale_item.location.longitude],
						customTitle: appart.for_sale_item.custom_title,
						fullAddress: appart.for_sale_item.custom_sub_titles_with_rendering_flags[0].subtitle,
						price: appart.for_sale_item.formatted_price.text,
						img: appart.for_sale_item.listing_photos[0]?.image?.uri ?? '',
					};
				} catch (error) {
					console.log(appart.for_sale_item.id)
					return null; // Or handle the error as needed
				}
			})
		} catch(error){
			console.log(error)
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
