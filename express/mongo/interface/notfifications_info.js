//import notifications from "../schemas/notifications.js";
import User from "../schemas/user.js";
import Preferences from "../schemas/preferences.js";
import Facebook from "../schemas/facebook.js";

async function clean_price(price) {
  return price.replace(/[^0-9.]/g, "");
}

async function getAppartmentQueue(preferencesId) {
  const preferences = await Preferences.findById(preferencesId);

  price_query = {
    "for_sale_item.formatted_price.text": {
      $exists: True,
    },
    scraped_at: {
      $exists: True,
    },
  };

  let appartmentQueue = await Facebook.find({ price_query });

  let sorted_appartments = [];

  for (apartment in appartmentQueue) {
    price = clean_price(apartment["for_sale_item"]["formatted_price"]["text"]);
    if (
      price &&
      preferences["budget"]["minValue"] <=
        price <=
        preferences["budget"]["maxValue"]
    ) {
      sorted_appartments.append(apartment);
    }
  }
  sorted_appartments.sort(
    (a, b) => new Date(b.scraped_at) - new Date(a.scraped_at)
  );

  sorted_appartments.limit(nombre_notifications);
}
