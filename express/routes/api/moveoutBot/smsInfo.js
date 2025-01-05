import express from "express";
const app = express();
import User from "../../../mongo/schemas/user.js";
import Preferences from "../../../mongo/schemas/preference.js";
import { envoyer_reponse } from "../../../logMessages.js";
import httpStatus from "../../../http_status.js";

// informations  envoyer un sms
app.post("/smsInfo/:id", async (req, res) => {
  try {
    console.log("dans smsInfo");
    console.log("User ID", req.params.id);
    const sms_info = await User.findById(req.params.id);
    console.log("First Name", sms_info.firstName);
    envoyer_reponse(req, res, "smsInfo made", httpStatus.Success);
  } catch (error) {
    envoyer_reponse(
      req,
      res,
      "Erreur lors de la récupération des données",
      httpStatus.Internal_server
    );
  }
});

app.get("/smsInfo/:id", async (req, res) => {
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
