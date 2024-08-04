const appartments = require("../schemas/appartement")
const facebook = require("../schemas/facebook")

/**
 * function qui permet de get tout les appart de la base de données
 * et le mettre dans un varibale
 * @returns 
 */
async function getAllAppartments(){
    const docCount = await appartments.countDocuments({});
    console.log("NB_Documents 2", docCount);

    //data est égale à tout ce qu'il trouve dans la collection
    const appartData = await appartments.find({});
    //console.log("Données récupérées:" + appartData);

    return appartData
}

async function getFacebookListings(){
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
    getFacebookListings
};