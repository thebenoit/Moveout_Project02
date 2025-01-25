import twilio from "twilio";
import dotenv from "dotenv";
import User from "../schemas/user.js";
import Notification from "../schemas/notification.js";
import Preferences from "../schemas/preference.js";
import Facebook from "../schemas/facebook.js";

async function sendMoveoutMessage(user, appartment) {
  let phoneNumber = "";

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  let message_texte = "";

  if (appartment == undefined) {
    console.log("👁 Appartement non trouvé");
    message_texte = `Aucun Appartement trouvé pour l'instant...`;
  } else {
    message_texte = `Bonjour ${user.firstName} 🫡,\n\nNous avons trouvé un nouvel appartement qui correspond à vos critères ! 😆\n\n${appartment.titre}\n💰 Prix : ${appartment.price}\n\n🔗 Lien : ${appartment.link}\n\nÀ bientôt,\nL'équipe MoveOut 🏠`;
  }
  console.log(`user phone: ${user.phone}`);

  if (user) {
    phoneNumber = String(user.phone);

    //si le numéro de téléphone ne commence pas par +1, on le rajoute
    if (!phoneNumber.startsWith("+1")) {
      phoneNumber = `+1${phoneNumber}`;
    }
  } else {
    console.log("❌  numéro de téléphone undefined pour ", user.firstName);
    return;
  }
  try {
    console.log("phoneNumber4: ", phoneNumber);
    const message_params = {
      body: message_texte,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      messaging_service_sid: process.env.TWILIO_MESSAGE_SID,
    };

    if (appartment != undefined) {
      message_params.mediaUrl = appartment.images[0].image.uri;
    }
    //envoyer le message
    const message = await client.messages.create(message_params);

    //get les infos du message
    const messageDetails = await client.messages(message.sid).fetch();
    //si il y a une erreur throw une erreur
    console.log("messageDetails: ", messageDetails);
    if (
      messageDetails.status != "delivered" ||
      messageDetails.status != "sent"
    ) {
      throw new Error("SMS non envoyé", messageDetails.status);
    }

    //seulement en mode test avant de lancer le code en prod
    // await Notification.findByIdAndUpdate(
    //   notification._id,
    //   {
    //     $set: {
    //       status: "test",
    //     },
    //   },
    //   { new: true, upsert: true }
    // );
    console.log(`SMS envoyé avec succès!`);
    return true;
  } catch (error) {
    console.log(`Erreur lors de l'envoi du SMS: ${error}`);
  }
}

export { sendMoveoutMessage };
