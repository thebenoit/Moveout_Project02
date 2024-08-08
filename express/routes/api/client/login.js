const express = require("express");
const app = express();
const { login } = require("../../../mongo/interface/client");
const generateJTW = require("../../../mongo/interface/JWT");
const jwt = require("jsonwebtoken");
const User = require("../../../mongo/schemas/user");

module.exports = app.post("/login", async (req, res) => {
  try {
    const response = await login(req.body.identifier, req.body.password);
    const user = await User.findById(response.userId);

    if (response.error) {
		
      return res.status(400).send(response);
    }

	console.log('user access token; ', user.accessToken)
	console.log('user name ', user.firstName)
    res.send({ token: user.accessToken });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});
