const express = require("express");
const app = express();
const { createPreference } = require("../../../mongo/interface/client");


require('dotenv').config(); // Load environment variables from .env file at the very beginning

module.exports = app.post("/preference", async (req, res) => {
	try {	
		response = await createPreference(
            req.body.preferencesId,
			req.body.numberOfBedrooms,
			req.body.minValue,
            req.body.maxValue,
			req.body.locationPreferences,
			req.body.age,
            req.body.gender,
            req.body.occupation,
            //req.body.salary,
            req.body.reference,
            req.body.addOnService,
		)

        if (response.error) {
            return res.status(400).json({ error: response.error }); // Toujours renvoyer un JSON
        }

		res.send({success: 1});
	} catch (error) {
		console.error("Erreur lors de la récupération des données:", error);
		res.status(500).json({ error: `Erreur lors de la création des préférences ${error}`});

	}
});

