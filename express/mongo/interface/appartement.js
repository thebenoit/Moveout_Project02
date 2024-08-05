const appartments = require("../schemas/appartement")
const facebook = require("../schemas/facebook")


async function fetchPage(pageNumber, pageSize) {
    try {
        const fieldsToSelect = [
            'for_sale_item.location',
            'for_sale_item.custom_title',
            'for_sale_item.custom_sub_titles_with_rendering_flags',
            'for_sale_item.formatted_price.text',
          ].join(' ');
        
        const skipAmount = (pageNumber - 1) * pageSize;
        const results = await facebook.find({}).skip(skipAmount).limit(pageSize).lean().exec();


        return results;
    } catch (err) {
        console.error('Error fetching page:', err);
        throw err;  // Re-throw the error after logging it
    }
}

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
    getFacebookListings,
    fetchPage
};