//import notifications from "../schemas/notifications.js";
import User from "../schemas/user.js";
import Preferences from "../schemas/preference.js";
import Facebook from "../schemas/facebook.js";
import Notification from "../schemas/Notification.js";

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
  const preferences = await Preferences.findById(
    notification.preferenceId
  ).lean();
  console.log("preferences: ", preferences);

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
            price: price,
            bedrooms: "",
          };

          let numberOfBedrooms = JSON.stringify(preferences.numberOfBedrooms);

          const arrayBedrooms = await intoArrayNumber(numberOfBedrooms);

          if (arrayBedrooms.includes(bedrooms)) {
            appart.bedrooms = bedrooms;
            sorted_appartments.push(appart);
          } else {
            console.log("bedrooms not in array");
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

  sorted_appartments = sorted_appartments.slice(0, nombre_notifications);

  console.log("sorted_appartments.length: ", sorted_appartments.length);
  return sorted_appartments;
}

export {
  create_notification,
  getAppartmentQueue,
  compterNombreNotifications,
  clean_price,
  clean_bedrooms,
};
