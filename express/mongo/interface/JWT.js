import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../schemas/user.js";

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

    console.log("generateJwt;");
  } catch (error) {
    console.log("erreur lors de la création de token: ");
    return { error: true };
  }
}

/**
 * middleware qui vérrifie si le il y a un token dans le header de la requete
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function validateToken(req, res) {
  const authorizationHeader = req.headers.authorization;

  let result;

  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access token is missing",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  const options = {
    expireIn: "3h",
  };

  try {
    let user = await User.findOne({
      accessToken: token,
    });

    if (!user) {
      result = {
        error: true,
        message: "Authorization error",
      };

      return res.status(403).json(result);
    }

    result = jwt.verify(token, process.env.JWT_SECRET, options);

    if (!user.username === result.username) {
      result = {
        error: true,
        message: "Invalid token",
      };

      return res.status(401).json(result);
    }

    req.decoded = result;

    console.log("re.decoded: ", req.decoded);

    return req.decoded;
  } catch (error) {
    console.log("erreur lors de la validation du token: ", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        error: true,
        message: "Token expired",
      });
    }

    return res.status(403).json({
      error: true,
      message: `Erreur d'authentification`,
    });
  }
}

export default {
  generateJwt,
  validateToken,
};
