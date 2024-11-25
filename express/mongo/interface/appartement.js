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
    console.log(`pageSize: `,pageSize);
    console.log(`pageNumber: `,pageNumber);
    const skipAmount = (pageNumber - 1) * pageSize;
     console.log("skipAmountCustom: ", skipAmount);

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
    const skipAmount = (pageNumber - 1) * pageSize;
    //find appartements on the bd according to preference
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

async function getAllAppartments(limitAppart) {
  try {
    const docCount = await facebook.countDocuments({});
    console.log("NB_Documents", docCount);
    let appartData;

    //appartData = await facebook.find({}).lean().limit(100);

    //si limite est plus grand ou égale à zero on ne met pas de limite
    if (limitAppart <= 0) {
      console.log(`Pas de limite`);
      //data est égale à tout ce qu'il trouve dans la collection
      appartData = await facebook.find({}).lean(); //.limit(4000).exec();
      console.log("appart: ", appartData);
    } else {
      console.log(`limite: ${limitAppart}`);
      //data est égale à tout ce qu'il trouve dans la collection
      appartData = await facebook.find({}).lean().limit(limitAppart); //.limit(4000).exec();
      console.log(`Passée limite:`);
    }

    return appartData;
  } catch (error) {
    console.log(`erreur dans le getAllAppartments: ${error}`);
    throw error;
  }
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
