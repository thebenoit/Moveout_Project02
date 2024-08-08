const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../schemas/user");

/**
 * méthode qui génère un token avec userId & userPreference comme payload
 * @param {*} userId
 * @param {*} prefId
 */
async function generateJwt(userId, prefId) {
  try {
    const payload = { userId, prefId };
    //génère le token
    const token = jwt.sign(
      { userId: payload.userId, prefId: payload.prefId },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return token;

    console.log('generateJwt; ', token)
  } catch (error) {
    console.log("erreur lors de la création de token: ");
    return { error: true };
  }
}

module.exports = {
  generateJwt,
};
