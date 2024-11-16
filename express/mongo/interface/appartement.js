const appartments = require("../schemas/appartement");
const facebook = require("../schemas/facebook");

let totalPage = 0;

/**
 * méthod epour determiner le nombre d'appart dans la bd
 * @returns m
 */
async function nbOfAppart() {
  const totalAppart = await facebook.countDocuments({});
  console.log("totalAppart007 ", totalAppart);
  return totalAppart;
}
async function fetchPage(pageNumber, pageSize) {
  try {
    const fieldsToSelect = [
      "for_sale_item.location",
      "for_sale_item.custom_title",
      "for_sale_item.custom_sub_titles_with_rendering_flags",
      "for_sale_item.formatted_price.text",
    ].join(" ");

    const skipAmount = (pageNumber - 1) * pageSize;
    console.log("skipAmount: ", skipAmount);
    const results = await facebook
      .find({})
      .skip(skipAmount)
      .limit(pageSize)
      .lean()
      .exec();

    return results;
  } catch (err) {
    console.error("Error fetching page:", err);
    throw err; // Re-throw the error after logging it
  }
}
async function fetchPage2(pageSize, pageNumber, appartData) {
  

  try {
    const skipAmount = (pageNumber - 1) * pageSize;
    // console.log("skipAmountCustom: ", skipAmount);

    const pageLimit = skipAmount + pageSize;
    // console.log("pageLimitCustom: ", pageLimit);

    appartData = appartData.slice(skipAmount, pageLimit).map((data, index) => {
      const actualIndex = skipAmount + index + 1; // Correct index calculation for display
      // console.log("Item index on this page: ", actualIndex);

      return data;
    }); //.catch((error) => console.log(`errueur durant le ferchPage2 ${error}`))

    console.log("appartData in fetchPage length: ", appartData.length);
  } catch (error) {
    console.log("erreure pendant le ferch2: ", error);
  }

  return appartData;
}

async function fetchPageForYou(
  pageNumber,
  pageSize,
  priceMin,
  priceMax,
  numberBedrooms,
  location
) {
  try {
    const fieldsToSelect = [
      "for_sale_item.location",
      "for_sale_item.custom_title",
      "for_sale_item.custom_sub_titles_with_rendering_flags",
      "for_sale_item.formatted_price.text",
    ].join(" ");

    const skipAmount = (pageNumber - 1) * pageSize;
    //find appartements on the bd according to preference
    const results = await facebook
      .find({
        //'for_sale_item.formatted_price.text': { $gte: priceMin, $lte: priceMax },
        //'for_sale_item.bedrooms': numberBedrooms,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .lean()
      .exec();

    return results;
  } catch (err) {
    console.error("Error fetching page:", err);
    throw err; // Re-throw the error after logging it
  }
}

async function getAllAppartments() {
  const docCount = await facebook.countDocuments({});
  console.log("NB_Documents", docCount);

  //data est égale à tout ce qu'il trouve dans la collection
  const appartData = await facebook.find({}).lean().exec();//.limit(4000).exec();
 
  return appartData;
}

/**
 * méthode qui prend les données de la bd facebook et le mets
 * dans la constante appartData
 * @returns
 */
async function getFacebookListings() {
  const docCount = await facebook.countDocuments({});
  console.log("NB_Documents facebook", docCount);

  const appartData = await facebook.find({}).limit(100);
  // let apparts = [];

  // try {
  //     apparts = appartData.map((listing) => ({
  //         price: listing.listing_price.amount,
  //         city: listing.reverse_geocode.city,
  //         custom_title: listing.custom_title,
  //     }));
  // } catch (error) {
  //     console.error("An error occurred while mapping apartment data:", error);
  // }

  return appartData;
}

module.exports = {
  getAllAppartments,
  getFacebookListings,
  fetchPage,
  fetchPageForYou,
  nbOfAppart,
  fetchPage2,
};
