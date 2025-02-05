import express from "express";
const app = express();
import User from "../../../mongo/schemas/user.js";
import Preferences from "../../../mongo/schemas/preference.js";
import Notification from "../../../mongo/schemas/notification.js";
import {
  getAppartmentQueue,
  create_notification,
  AjouterDansQueue,
  planifierAjouterDansQueue,
} from "../../../mongo/interface/notification.js";
import httpStatus from "../../../httpStatus.mjs";
import dotenv from "dotenv";

// informations  envoyer un sms
app.post("/notification/send", async (req, res) => {
  try {
    const event = req.body.event;
    const userId = req.body.userId;
    const notificationTimes = req.body.notificationTimes;
    const notificationDays = req.body.notificationDays;
    const preferenceId = req.body.preferenceId;

    let notifVerif = await Notification.findOne({
      userId: userId,
    });
    //modifier la notification
    if (notifVerif) {
      console.log("modifier notification");
      await notifVerif.findByIdAndUpdate(notifVerif._id, {
        notificationDays: notificationDays,
      });

      notifVerif.save();

      //retourner un message de succès

      return res.status(200).json({
        message: "Notification modifiée avec succès",
      });
    }

    //créer la notification et ajouter à la base de données
    console.log("créer notification");
    let notification = await create_notification(
      event,
      userId,
      notificationTimes,
      notificationDays,
      preferenceId
    );
    // Ajouter notificationDays et notificationTimes dans les préférences
    await Preferences.findByIdAndUpdate(
      preferenceId,
      {
        $set: {
          notificationDays: notificationDays,
          notificationTimes: notificationTimes,
        },
      },
      { new: true, upsert: true }
    );

    //await AjouterDansQueue(notification,"publisherToWaitingQueue","waiting_notification");

    res.status(200).json({
      message: "Notification créer avec succès",
      data: notification,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: "Erreur lors de la création de la notification",
      data: error,
    });
  }
});

export default app;
