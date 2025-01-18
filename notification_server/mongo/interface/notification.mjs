//import notifications from "../schemas/notifications.js";
import User from "../schemas/user.js";
import Preferences from "../schemas/preference.js";
import Facebook from "../schemas/facebook.js";
import Notification from "../schemas/notification.js";
import amqp from "amqplib";
import mongoose from "mongoose";
import dotenv from "dotenv";
import agenda from "../../config/agenda.js";
import rabbitmq from "../../config/rabbitmq.js";

const RABBITMQ_URI = process.env.RABBITMQ_URI;
const AMQP_PORT = process.env.AMQP_PORT;

///retourne le jour actuelle
async function whatDayIsIt() {
  const daysOfTheWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date();
  const currentDay = daysOfTheWeek[today.getDay()];
  console.log(`Today is ${currentDay}`);
  return currentDay;
}
///retourne l'heure et la minute actuelle
async function whatTimeIsIt() {
  const today = new Date();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();
  const currentTime = `${currentHour
    .toString()
    .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
  console.log(`Current time is ${currentTime}`);
  return currentTime;
}
// Helper pour convertir le jour en expression cron
function getCronDay(day) {
  const cronDays = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return cronDays[day.toLowerCase()];
}
//Planifie quand l'envoyer dans la Queue
async function planifierAjouterDansQueue(notification) {
  const { notificationDays, notificationTimes } = notification;

  try {
    await agenda.schedule("in 1 seconds", "sendNotificationToQueue", {
      notification,
    });
  } catch (error) {
    console.error("Erreur lors de la planification de la notification:", error);
  }
}

async function AjouterDansQueue(notification, channelId, Queue) {
  try {
    //create a channel
    const channel = await rabbitmq.createChannel(channelId);
    //queue existe? et il doir etre durable
    await channel.assertQueue(Queue, { durable: false });

    channel.sendToQueue(Queue, Buffer.from(JSON.stringify(notification)), {
      persistent: false,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout dans la queue:", error);
  }

  return rabbitmq.connection;
}

async function clean_price(price) {
  if (!price || typeof price !== "string") {
    console.error("Prix invalide:", price);
    return null;
  }

  // Nettoyer le prix
  price = price.replace(/[^0-9,]/g, "").replace(",", ".");
  price = parseFloat(price);

  return price;
}

async function intoArrayNumber(number) {
  if (typeof number === "string" && number.startsWith("[")) {
    return JSON.parse(number).map(Number);
  }

  if (number.includes(",")) {
    console.log("Yes Il y a une virgule");

    return number.split(",").map(Number);
  } else {
    console.log("No Il n'y a pas de virgule");
    return [Number(number)];
  }
}

async function clean_bedrooms(bedrooms) {
  // Vérifier si bedrooms est une chaîne de caractères
  if (typeof bedrooms !== "string") {
    console.error("Format de chambres invalide:", bedrooms);
    return 1;
  }

  // Extraire le nombre de chambres
  const bedroomCount = parseFloat(bedrooms.split("·")[0].trim());

  // Si ce n'est pas un nombre valide, retourner 1 (pour les studios)
  if (isNaN(bedroomCount)) {
    return 1;
  }

  return bedroomCount;
}

async function ensureConnection() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ Connexion MongoDB établie");
    } catch (error) {
      console.error("❌ Erreur de connexion MongoDB:", error);
      throw error;
    }
  }
}

const create_notification = async (
  event,
  userId,
  notificationTimes,
  notificationDays,
  preferencesId
) => {
  try {
    // S'assurer que la connexion est établie avant de continuer
    await ensureConnection();
    //crée la notification
    const notification = new Notification({
      event: event,
      userId: userId,
      notificationTimes: notificationTimes,
      notificationDays: notificationDays,
      preferenceId: preferencesId,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error);
    throw error;
  }
};

async function compterNombreNotifications(notification) {
  let nombreDays = notification.notificationDays.length;
  let nombreTimes = notification.notificationTimes.length;
  let nombreNotifications = nombreDays + nombreTimes;
  console.log("nombreNotifications: ", nombreNotifications);

  return nombreNotifications;
}

async function getAppartmentQueue(notification) {
  //récupère les préférences de l'utilisateur
  const preferences = await Preferences.findById(
    notification.preferenceId
  ).lean();

  const user = await User.findById(notification.userId);

  if (!user) {
    console.error("User not found");
    return [];
  }

  if (!preferences) {
    console.error(
      "Preferences non trouvées pour l'utilisateur:",
      notification.userId
    );
    return [];
  }

  let nombre_notifications = await compterNombreNotifications(notification);

  const price_query = {
    "for_sale_item.formatted_price.text": {
      $exists: true,
    },
    scraped_at: {
      $exists: true,
    },
  };

  let appartmentQueue = await Facebook.find(price_query).lean();
  let sorted_appartments = [];

  for (const apartment of appartmentQueue) {
    // Vérifier que l'appartement a bien la structure attendue
    if (apartment?.for_sale_item?.formatted_price?.text) {
      try {
        //clean the price
        const price = await clean_price(
          apartment.for_sale_item.formatted_price.text
        );
        //clean the bedrooms
        const bedrooms = await clean_bedrooms(
          apartment.for_sale_item.custom_title
        );

        if (
          price &&
          price >= preferences.budget.minValue &&
          price <= preferences.budget.maxValue
        ) {
          let appart = {
            id: apartment._id,
            titre: apartment.for_sale_item.custom_title,
            images: apartment.for_sale_item.listing_photos,
            price: price,
            bedrooms: "",
          };

          let numberOfBedrooms = JSON.stringify(preferences.numberOfBedrooms);

          const arrayBedrooms = await intoArrayNumber(numberOfBedrooms);
          //si le field n'existe pas
          if (!user.notifHistory) {
            //initialise le field
            user.notifHistory = [];
            await user.save();
          } //si possede l'historique possède l'appartement
          else if (user.notifHistory.includes(appart.id)) {
            //passer au suivant
            continue;
          }

          if (arrayBedrooms.includes(bedrooms)) {
            appart.bedrooms = bedrooms;
            sorted_appartments.push(appart);
          } else {
            continue;
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement du prix:", error);
        continue; // Passer à l'appartement suivant en cas d'erreur
      }
    }
  }

  sorted_appartments.sort(
    (a, b) => new Date(b.scraped_at) - new Date(a.scraped_at)
  );

  let latest_appartement = sorted_appartments[0];

  // 2. Éviter les doublons
  if (
    latest_appartement &&
    !user.notifHistory.includes(latest_appartement.id)
  ) {
    console.log("🚀 Ajout de l'appartement dans l'historique");
    user.notifHistory.push(latest_appartement.id);
  }
  await user.save();

  return latest_appartement;
}

async function envoyer_sms_personnalise(
  user_id,
  nom_client,
  numero_telephone,
  date_pour_envoyer
) {
  /**
   * Envoie un SMS personnalisé au client avec l'appartement le plus récent correspondant à ses critères
   *
   * Args:
   *     user_id (str): ID de l'utilisateur
   *     nom_client (str): Nom du client
   *     numero_telephone (str): Numéro de téléphone au format +1XXXXXXXXXX
   */
  const user_id_object = mongoose.Types.ObjectId(user_id);

  // Récupérer l'appartement correspondant aux critères
  const appartement = await get_latest_matching_apartment(user_id_object);
  if (!appartement) {
    console.log(`Aucun appartement trouvé pour l'utilisateur ${user_id}`);
    return false;
  }

  // Initialiser le client Twilio
  const client = new Client(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  // Extraire les informations de l'appartement
  const prix = appartement.for_sale_item.formatted_price.text;
  const titre = appartement.for_sale_item.marketplace_listing_title;
  const lien = appartement.for_sale_item.share_uri;
  const photo_url =
    appartement.for_sale_item.listing_photos.length > 0
      ? appartement.for_sale_item.listing_photos[0].image.uri
      : null;

  // Message personnalisé
  const message_texte = `Bonjour ${nom_client}! 🫡

Nous avons trouvé un nouvel appartement qui correspond à vos critères! 😆

${titre}
Prix: ${prix}

Voici le lien:
${lien}

À bientôt,
L'équipe MoveOut 🏠`;

  try {
    // Paramètres du message
    const message_params = {
      body: message_texte,
      messaging_service_sid: process.env.TWILIO_MESSAGE_SID,
      send_at: date_pour_envoyer,
      schedule_type: "fixed",
      from: process.env.TWILIO_NUMERO_TWILIO,
      to: numero_telephone,
    };

    // Ajouter l'image si disponible
    if (photo_url) {
      message_params.media_url = [photo_url];
    }

    // Envoi du SMS
    const message = await client.messages.create(message_params);
    console.log(`SMS envoyé avec succès à ${nom_client}!`);
    return true;
  } catch (error) {
    console.log(`Erreur lors de l'envoi du SMS: ${error}`);
    return false;
  }
}

export {
  create_notification,
  getAppartmentQueue,
  compterNombreNotifications,
  clean_price,
  clean_bedrooms,
  AjouterDansQueue,
  planifierAjouterDansQueue,
  whatDayIsIt,
  whatTimeIsIt,
};
