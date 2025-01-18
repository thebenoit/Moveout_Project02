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

dotenv.config();

async function startWorker() {
  const Queue = "notification";

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
      console.log("🚀 Appartement:", appartment.length);


      let client1 = await user.findById(notification.userId);
      
      console.log("🚀 User:", client1.firstName);

      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      const message_texte = `Bonjour ${client1.firstName}!

Voici l'appartement que j'ai trouvé pour vous!

🏠 Appartement: ${appartment.titre}
💰 Prix: ${appartment.price}
🛏️ Nombre de chambres: ${appartment.bedrooms}

`;

      try {
        const message_params = {
          body: message_texte,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: "+14385239294",
          // messaging_service_sid: process.env.TWILIO_MESSAGE_SID,
        };
        console.log(appartment.images[0]);
        if(appartment.images.length > 0){
          message_params.mediaUrl = appartment.images[0].image.uri;
        }
        
        const message = await client.messages.create(message_params);
        
        // await Notification.findByIdAndUpdate(
        //   notification._id,
        //   {
        //     $set: {
        //       status: "sent",
        //     },
        //   },
        //   { new: true, upsert: true }
        // );
        console.log(`SMS envoyé avec succès! ${appartment.titre}`);
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
