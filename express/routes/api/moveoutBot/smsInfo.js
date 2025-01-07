import express from "express";
const app = express();
import User from "../../../mongo/schemas/user.js";
import Preferences from "../../../mongo/schemas/preference.js";
import { envoyer_reponse } from "../../../logMessages.js";
import httpStatus from "../../../http_status.js";

// informations  envoyer un sms
app.post("/notification/send", async (req, res) => {
  try {
    const event = req.body.event;
    const userId = req.body.userId;
    const preferencesId = req.body.preferencesId;

    console.log("event: ", event);
    const user = await User.findById(userId);
    const preferences = await Preferences.findById(preferencesId);

    let appartmentQueue = await getAppartmentQueue(preferences);
    
    res.status(200).json({
      message: "Données récupérées avec succès",
      data: event,
    });
  } catch (error) {
    console.log("error: ", error);
  }
});

app.get("/notification/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const preferences = await Preferences.findById(user.preferencesId);
    //Créer un objet avec les données de l'utilisateur et les préférences
    const sms_info = {
      user: user.toObject(),
      preferences: preferences.toObject(),
    };

    if (!sms_info) {
      return res.status(404).send("Utilisateur introuvable.");
    }
    res.status(200).json({
      message: "Données récupérées avec succès",
      data: sms_info,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

export default app;
