import express from "express";
const app = express();
import User from "../../../mongo/schemas/user.js";
import Preferences from "../../../mongo/schemas/preference.js";
import Notification from "../../../mongo/schemas/Notification.js";
import {
  getAppartmentQueue,
  create_notification,
} from "../../../mongo/interface/notfifications_info.js";
import { envoyer_reponse } from "../../../logMessages.js";
import httpStatus from "../../../http_status.js";

// informations  envoyer un sms
app.post("/notification/send", async (req, res) => {
  try {
    const event = req.body.event;
    const userId = req.body.userId;
    const notificationTimes = req.body.notificationTimes;
    const notificationDays = req.body.notificationDays;
    const preferenceId = req.body.preferenceId;

    //créer la notification et ajouter à la base de données
    let notification = await create_notification(
      event,
      userId,
      notificationTimes,
      notificationDays,
      preferenceId
    );

    // const user = await User.findById(userId);
    // const preferences = await Preferences.findById(preferenceId);

    let appartmentQueue = await getAppartmentQueue(notification);

    res.status(200).json({
      message: "Données récupérées avec succès",
      data: appartmentQueue,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: "Erreur lors de la création de la notification",
      data: error,
    });
  }
});

app.get("/notification/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const preferences = await Preferences.findById(user.preferenceId);
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
