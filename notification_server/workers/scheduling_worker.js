import agenda from "../config/agenda.js";
import twilio from "twilio";
import {
  AjouterDansQueue,
  planifierAjouterDansQueue,
  whatDayIsIt,
  whatTimeIsIt,
} from "../mongo/interface/notification.mjs";
import Notification from "../mongo/schemas/notification.js";
import rabbitmq from "../config/rabbitmq.js";

// Extraire la logique de vérification dans une fonction réutilisable
async function checkAndPlanifyNotifications() {
  const currentDay = await whatDayIsIt();
  console.log(`Today is ${currentDay}`);

  const currentHour = await whatTimeIsIt();
  console.log(`Current time is ${currentHour}`);

  const notifications = await Notification.find({
    status: "pending",
    notificationDays: currentDay,
  });

  for (const notification of notifications) {
    await planifierAjouterDansQueue(notification);
  }
}

/**
 * check a chaque 60s la notification qui est à 20 minutes d'etre envoyée
 * si elle est à 20 minutes, on l'envoie dans la queue
 */
agenda.define("sendNotificationToQueue", async (job) => {
  const { notification } = job.attrs.data;

  try {
    await AjouterDansQueue(notification, "publisher", "notification");
    console.log("\x1b[32mNotification envoyée dans la queue!\x1b[0m");
  } catch (error) {
    console.log(
      "Erreur lors de l'envoi de la notification dans la queue",
      error
    );
  }
});

agenda.define("checkNewNotifications", async (job) => {
  await checkAndPlanifyNotifications();
});

async function startAgenda() {
  await agenda.start();

  //premier lancement
  await checkAndPlanifyNotifications();

  //vérification toutes les 60s
  await agenda.every("60 seconds", "checkNewNotifications");

  console.log("🚀Agenda is working...");
}

export default startAgenda;
