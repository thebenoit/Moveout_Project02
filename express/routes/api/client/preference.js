const express = require("express");
const app = express();
const { createPreference } = require("../../../mongo/interface/client");
const Preference = require("../../../mongo/schemas/preference");

require("dotenv").config(); // Load environment variables from .env file at the very beginning
/**
 * permet de retrouver préférence grace à son ID
 */
app.get("/preference/:id", async (req, res) => {
  try {
    const pref = await Preference.findById(req.params.id);

    if (!pref) {
      return res.status(404).json({ error: "Préférence non trouvée" });
    }
    //retourne preference en json
    res.json(pref);
  } catch (error) {
    console.log("erreur lors de la recupération de préférence: ", error);
  }
});
app.post("/preference", async (req, res) => {
  try {
    response = await createPreference(
      req.body.preferencesId,
      req.body.numberOfBedrooms,
      req.body.maxValue,
      req.body.minValue,
      req.body.locationPreferences,
      req.body.age,
      req.body.gender,
      req.body.occupation,
      req.body.reference,
      req.body.addOnService
    );

    if (response.error) {
      return res.status(400).json({ error: response.error }); // Toujours renvoyer un JSON
    }

    res.send({ success: 1 });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res
      .status(500)
      .json({ error: `Erreur lors de la création des préférences ${error}` });
  }
});

module.exports = app;
