const appartments = require("../schemas/appartement")

async function getAllAppartments(){
    const docCount = await appartments.countDocuments({});
    console.log("NB_Documents ", docCount);

    //data est égale à tout ce qu'il trouve dans la collection
    const appartData = await appartments.find({});
    console.log("Données récupérées:" + appartData);

    return appartData
}

module.exports = getAllAppartments;