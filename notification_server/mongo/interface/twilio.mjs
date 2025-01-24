import twilio from "twilio";
import dotenv from "dotenv";
import User from "../schemas/user.js";
import Notification from "../schemas/notification.js";
import Preferences from "../schemas/preference.js";
import Facebook from "../schemas/facebook.js";

async function sendMoveoutMessage(user, appart) {
  console.log(`user: ${user.phone}`);
  let phoneNumber = "";
  let appartment = undefined;
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  let message_texte = "";

  if (appartment == undefined) {
    console.log("👁 Appartement non trouvé");
    message_texte = `Aucun Appartement trouvé pour l'instant...`;
  } else {
    message_texte = `Bonjour ${user.firstName} 🫡,

    Nous avons trouvé un nouvel appartement qui correspond à vos critères ! 😆
    
    ${appartment.titre}
    💰 Prix : ${appartment.price}
    
    🔗 Lien : ${appartment.link}
    
    À bientôt,
    L'équipe MoveOut 🏠
    `;
  }
  console.log(`user phone: ${user.phone}`);

  if (user) {
    phoneNumber = String(user.phone);
    console.log("phoneNumber1: ", phoneNumber);
    //si le numéro de téléphone ne commence pas par +1, on le rajoute
    if (!phoneNumber.startsWith("+1")) {
      phoneNumber = `+1${phoneNumber}`;
    }
    console.log("phoneNumber: ", phoneNumber);
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

    const message = await client.messages.create(message_params);

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
