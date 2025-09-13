import express from "express";
const app = express();
import client from "../../../mongo/interface/client.js";
import jwt from "jsonwebtoken";
import preference from "./preference.js";
import Preference from "../../../mongo/schemas/preference.js";
import dotenv from "dotenv";
import Mixpanel from "mixpanel";

dotenv.config(); // Load environment variables from .env file at the very beginning

app.post("/signup", async (req, res) => {
  try {
   let response = await client.createAccount(
      req.body.firstName,
      req.body.lastName,
      req.body.phone,
      req.body.email,
      req.body.password
    );

    if (response.error) {
      console.log("response errror signup: ", response.error);
      return res.status(400).send(response);
    }
    console.log("sign up response: ", response.preferenceId);

    // Ensure preferenceId is present
    if (!response.preferenceId) {
      console.error("PreferenceId is missing in the response");
      return res.status(500).send("PreferenceId is missing.");
    }
    let preferenceId = response.preferenceId;

    let userPreference = Preference.findById({ preferenceId });

    res.send({ token: response.accessToken });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

export default app;
