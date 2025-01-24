import amqp from "amqplib";
import dotenv from "dotenv";
import {
  AjouterDansQueue,
  getAppartmentQueue,
  compterNombreNotifications,
} from "../mongo/interface/notification.mjs";
import rabbitmq from "../config/rabbitmq.js";

import user from "../mongo/schemas/user.js";
import Notification from "../mongo/schemas/notification.js";
import twilio from "twilio";
import { sendMoveoutMessage } from "../mongo/interface/twilio.mjs";
import agenda from "../config/agenda.js";

dotenv.config();

async function startWorker() {
  const Queue = "notification";

  try {
    //create a channel
    const channel = await rabbitmq.createChannel("consumer");
    //queue existe? et il doir etre durable
    await channel.assertQueue(Queue, { durable: false });

    console.log("👂 Worker démarré et en attente de notifications...");

    channel.consume(Queue, async (message) => {
      if (message) {
        const notification = JSON.parse(message.content.toString());
        console.log("🚀 Notification reçue:", notification);

        let appartment = await getAppartmentQueue(notification);
        console.log("🚀 Appartement:", appartment.titre);

        let client1 = await user.findById(notification.userId);

        console.log("🚀 User:", client1.firstName);

        try{
          let result = await sendMoveoutMessage(client1, appartment);

        if (!result) {
          console.log("❌ Erreur lors de l'envoi du SMS");
        }
        }catch(error){
          console.error("Erreur lors de l'envoi du message:",error);
        }finally{
        
          
        }
        

        channel.ack(message);
        console.log("😆 Notification traitée:");
      }
    });

    console.log("Worker en cours d’exécution pour consommer la queue...");
  } catch (error) {
    console.error("Erreur lors du démarrage du worker:", error);
  }
}

export default startWorker;
