const express = require("express");
const app = express();
const { login } = require("../../../mongo/interface/client");
const jwt = require('jsonwebtoken');


module.exports = app.post("/login", async (req, res) => {
    try {
        const response = await login(
			req.body.identifier,
			req.body.password
		)

        if (response.error) {
            return res.status(400).send(response);
        }
		
        // Generate JWT
		const token = jwt.sign({ userId: response.user_id }, process.env.JWT_SECRET, { expiresIn: '3h' });

		res.send({token: token});
	} catch (error) {
		console.error("Erreur lors de la récupération des données:", error);
		res.status(500).send("Erreur lors de la récupération des données");
	}
});
