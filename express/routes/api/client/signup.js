const express = require("express");
const app = express();
const { createAccount } = require("../../../mongo/interface/client");
const jwt = require('jsonwebtoken');

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
            return res.status(400).send(response);
        }

		const token = jwt.sign({ userId: response.user_id }, process.env.JWT_SECRET, { expiresIn: '3h' });

		res.send({token: token});
	} catch (error) {
		console.error("Erreur lors de la récupération des données:", error);
		res.status(500).send("Erreur lors de la récupération des données");
	}
});
