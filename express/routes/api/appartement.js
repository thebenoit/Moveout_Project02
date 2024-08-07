const express = require("express");
const app = express();
const { getFacebookListings } = require("../../mongo/interface/appartement");

/**
 * 
 */
module.exports = app.get("/appartments", async (req, res) => {
	try {
		// const appartments = schemas.Appartments;
		// console.log("Recherche dans la collection: ", appartments.collection.name);

		// const docCount = await appartments.collection.countDocuments({});
		// console.log("NB_Documents ", docCount);

		// //data est égale à tout ce qu'il trouve dans la collection
		// const appartData = await appartments.find({});
		// console.log("Données récupérées:");

		//prend les données de la bd facebook et le met dans la const
		appartData = await getFacebookListings();

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
