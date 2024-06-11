const appartments = require("../schemas/appartement")
/**
 * function qui permet de get tout les appart de la base de données
 * et le mettre dans un varibale
 * @returns 
 */
async function getAllAppartments(){
    const docCount = await appartments.countDocuments({});
    console.log("NB_Documents ", docCount);

    //data est égale à tout ce qu'il trouve dans la collection
    const appartData = await appartments.find({});
    console.log("Données récupérées:" + appartData);

    return appartData
}

module.exports = getAllAppartments;