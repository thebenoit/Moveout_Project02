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

async function startAgenda() {
  await agenda.start();

  //affect le jour actuelle dans une variable
  const currentDay = await whatDayIsIt();
  console.log(`Today is ${currentDay}`);
  //affecte l'heure et la minute actuelle dans une variable
  const currentHour = await whatTimeIsIt();
  console.log(`Current time is ${currentHour}`);

  const channel = await rabbitmq.createChannel("consumer_waiting_list");
  channel.assertQueue("waiting_notification", { durable: false });
  channel.consume("waiting_notification", async (message) => {
    if (
      message.status === "pending" &&
      message.notificationDays === currentDay
    ) {
      const notification = JSON.parse(message.content.toString());
      await planifierAjouterDansQueue(notification);
    }
  });

  console.log("🚀Agenda is working...");
}

export default startAgenda;
