import express from "express";
const app = express();
import client from "../../../mongo/interface/client.js";

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file at the very beginning

app.post("/lead", async (req, res) => {
	try {	
		response = await createLead(
			req.body.firstName,
			req.body.lastName,
			req.body.phone,
			req.body.email
		)

        if (response.error) {
            return res.status(400).send(response);
        }

		res.send({success: 1});
	} catch (error) {
		console.error("Erreur lors de la récupération des données:", error);
		res.status(500).send("Erreur lors de la récupération des données");
	}
});

export default app;
