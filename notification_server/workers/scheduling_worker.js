import agenda from "../config/agenda.js";
import twilio from "twilio";
import {AjouterDansQueue} from "../mongo/interface/notification.mjs"

/**
 * check a chaque 60s la notification qui est à 20 minutes d'etre envoyée
 * si elle est à 20 minutes, on l'envoie dans la queue
 */
agenda.define("sendNotificationToQueue", async (job) => {
  const {notification} = job.attrs.data

  try{
    await AjouterDansQueue(notification);
    console.log("\x1b[32mNotification envoyée dans la queue!\x1b[0m");
  }catch(error){
    console.log("Erreur lors de l'envoi de la notification dans la queue", error);
  }

  
});

async function startAgenda(){
  await agenda.start();

  const notification = await Notification.find({
    isRecurring: true,
    status: 'pending'
  })

  for (const notification of notifications) {
    await planifierAjouterDansQueue(notification);
  }
}

export default startAgenda;