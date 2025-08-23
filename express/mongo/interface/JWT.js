import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../schemas/user.js";
import crypto from "crypto";

/**
 * méthode qui génère un token avec userId & userPreference comme payload
 * @param {*} userId
 * @param {*} prefId
 */
async function generateJwt(userId, sessionId) {
  try {
    // Validation des paramètres
    if (!userId || !process.env.JWT_SECRET) {
      throw new Error("Missing required parameters");
    }

    const payload = {
      iss: process.env.JWT_ISSUER || "moveout-auth",
      aud: ["chat_api", "frontend"],
      sub: userId,

      userId: userId,
      sessionId: sessionId,
      tokenType: "access",
      scope: "chat:read chat:write",
      authProvider: "legacy",

      iat: Math.floor(Date.now() / 1000),
      // Pas d'exp ici - laissé à jwt.sign
      jti: crypto.randomUUID(),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      header: {
        typ: "JWT",
        alg: "HS256",
        kid: "legacy-key-1",
      },
    });

    console.log("Token généré avec succès");
    return token;
  } catch (error) {
    console.log("erreur lors de la création de token: ", error);
    return { error: true };
  }
}

async function generateRefreshToken(userId, sessionId) {
  try {
    const payload = {
      iss: process.env.JWT_ISSUER || "moveout-auth",
      aud: ["chat_api", "frontend"],
      sub: userId,
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,

      userId: userId,
      sessionId: sessionId,
      tokenType: "refresh",
      scope: "auth:refresh",
      authProvider: "legacy",
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      header: {
        typ: "JWT",
        alg: "HS256",
        kid: "legacy-key-1",
      },
    });
  } catch (error) {
    console.log("erreur lors de la création du refresh token: ", error);
    return null;
  }
}

/**
 * Vérifie si un token JWT est expiré
 * @param {string} token - Le token JWT à vérifier
 * @returns {boolean} - true si le token est expiré, false sinon
 */
function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.log(
      "Erreur lors de la vérification de l'expiration du token:",
      error
    );
    return true;
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

  if (isTokenExpired(token)) {
    return res.status(403).json({
      error: true,
      message: "Token expired",
    });
  }

  //peut verifier grace au secret key
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.isTemp) {
    req.decoded = decoded;
    return req.decoded;
  }

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
  isTokenExpired,
  generateRefreshToken,
};
