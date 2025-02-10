import appartments from "../schemas/appartement.js";
import facebook from "../schemas/facebook.js";

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
async function getSpecificAppartment(limitAppart,filters = {}, skip = 0,pageSize = 10){
  try {
   console.time('fetch optimization in appartments');

    const query = facebook.find(filters)
    .select({
      'for_sale_item.location': 1,
      'for_sale_item.custom_title': 1,
      'for_sale_item.custom_sub_titles_with_rendering_flags': 1,
      'for_sale_item.formatted_price.text': 1,
      'for_sale_item.listing_photos': 1,
      'for_sale_item.id': 1
    })
    .skip(skip)
    .limit(pageSize)
    .lean();  

    //Executer la requete avec timeout
    const appartData = await Promise.race([
      query.exec(),
      new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database Timeout')), 60000)
    )
  ]);
  console.timeEnd('fetch optimization in appartments');
  return appartData;
      

    } catch (error) {
      console.error(`Erreur dans getAllAppartments: ${error}`);
      throw error;
  
      }  }
async function getAllAppartments(limitAppart) {
  try {


    let appartData;


    

    //si limite est plus grand ou égale à zero on ne met pas de limite
    if (limitAppart <= 0) {
      //data est égale à tout ce qu'il trouve dans la collection
      appartData = await facebook.find({}).lean(); //.limit(4000).exec();
      console.log("appart: ", appartData);
    } else {
      console.time("fetch data dans getAllAppartments")
      //data est égale à tout ce qu'il trouve dans la collection
      appartData = await facebook.find({}).lean().limit(limitAppart); 
      console.timeEnd("fetch data dans getAllAppartments")
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

  return appartData;
}

export default {
  getAllAppartments,
  getFacebookListings,
  fetchPage,
  fetchPageForYou,
  nbOfAppart,
  fetchPage2,
  getSpecificAppartment,
};
