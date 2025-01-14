import amqp from "amqplib";
import dotenv from "dotenv";
import {
  AjouterDansQueue,
  getAppartmentQueue,
  compterNombreNotifications,
} from "../mongo/interface/notification.mjs";

import user from "../mongo/schemas/user.js";
import twilio from "twilio";

dotenv.config();
async function startWorker() {
  const Queue = "notification";

  //connect to rabbitmq
  const connection = await amqp.connect(process.env.RABBITMQ_URI);
  //create a channel
  const channel = await connection.createChannel();
  //queue existe? et il doir etre durable
  await channel.assertQueue(Queue, { durable: false });

  console.log("👂 Worker démarré et en attente de notifications...");

  channel.consume(Queue, async (message) => {
    if (message) {
      const notification = JSON.parse(message.content.toString());
      console.log("🚀 Notification reçue:", notification);

      //const appartmentQueue = await getAppartmentQueue(notification);
      console.log("🚀 Notification userID", notification.userId);
      let client1 = await user.findById(notification.userId);
      console.log("🚀 User:", client1);

      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      console.log("👁Telephone Twilion", process.env.TWILIO_PHONE_NUMBER);
      const message_texte = `Bonjour! ${client1.firstName} Votre Notification va être envoyée le ${notification.notificationDays[0]}.`;

      try {
        const message_params = {
          body: message_texte,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: "+14385239294",
          // messaging_service_sid: process.env.TWILIO_MESSAGE_SID,
        };

        const message = await client.messages.create(message_params);
        console.log(`SMS envoyé avec succès!`);
      } catch (error) {
        console.log(`Erreur lors de l'envoi du SMS: ${error}`);
      }

      channel.ack(message);
      console.log("😆 Notification traitée:");
    }
  });

  console.log("Worker en cours d’exécution pour consommer la queue...");
}

export default startWorker;
