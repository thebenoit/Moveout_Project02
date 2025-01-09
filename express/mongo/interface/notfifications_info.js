//import notifications from "../schemas/notifications.js";
import User from "../schemas/user.js";
import Preferences from "../schemas/preference.js";
import Facebook from "../schemas/facebook.js";
import Notification from "../schemas/Notification.js";

async function clean_price(price) {
  console.log("price: avant formatage ", price);
  if (!price || typeof price !== "string") {
    console.error("Prix invalide:", price);
    return null;
  }

  // Nettoyer le prix
  price = price.replace(/[^0-9,]/g, "").replace(",", ".");
  price = parseFloat(price);
  console.log("price après formatage: ", price);
  return price;
}

const create_notification = async (
  event,
  userId,
  notificationTimes,
  notificationDays,
  preferencesId
) => {
  try {
    //crée la notification
    const notification = new Notification({
      event: event,
      userId: userId,
      notificationTimes: notificationTimes,
      notificationDays: notificationDays,
      preferenceId: preferencesId,
    });
    console.log("notification: ", notification);
    //enregistre la notification
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
  const preferences = await Preferences.findById(notification.preferenceId).lean();
  console.log("preferences: ", preferences);

  if (!preferences) {
    console.error("Preferences non trouvées pour l'utilisateur:", notification.userId);
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
        const price = await clean_price(
          apartment.for_sale_item.formatted_price.text
        );
        console.log("preferences: ", preferences);
        console.log("preferences.budget.minValue ", preferences.budget.minValue);
        if (
          price &&
          price >= preferences.budget.minValue &&
          price <= preferences.budget.maxValue
        ) {
          
          sorted_appartments.push(apartment);
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

  sorted_appartments = sorted_appartments.slice(0, nombre_notifications);

  console.log("sorted_appartments.length: ", sorted_appartments.length);
  return sorted_appartments;
}

export default {
  create_notification,
  getAppartmentQueue,
  compterNombreNotifications,
  clean_price,
};
