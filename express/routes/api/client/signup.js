const express = require("express");
const app = express();
const { createAccount } = require("../../../mongo/interface/client");
const jwt = require('jsonwebtoken');
const preference = require("./preference");

require('dotenv').config(); // Load environment variables from .env file at the very beginning


module.exports = app.post("/signup", async (req, res) => {
	try {	
		response = await createAccount(
			req.body.firstName,
			req.body.lastName,
			req.body.phone,	
			req.body.email,
			//req.body.confirmEmail,
			req.body.password,
			//req.body.confirmPassword
		)

        if (response.error) {
			console.log('response errror signup: ', response.error)
            return res.status(400).send(response);
        }
		console.log('sign up response: ', response.preferenceId,)

		 // Ensure preferenceId is present
		 if (!response.preferenceId) {
            console.error('PreferenceId is missing in the response');
            return res.status(500).send("PreferenceId is missing.");
        }
		//génère un token
		//const token = utils.
		//jwt.sign({ userId: response.user_id, preferenceId: response.preferenceId}, process.env.JWT_SECRET, { expiresIn: '3h' });
		console.log('access token: ', response.accessToken)
		res.send({token: response.accessToken});
	} catch (error) {
		console.error("Erreur lors de la récupération des données:", error);
		res.status(500).send("Erreur lors de la récupération des données");
	}
});

