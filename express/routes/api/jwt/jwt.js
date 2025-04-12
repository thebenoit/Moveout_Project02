import jwt from "jsonwebtoken";
import express from "express";
import User from "../../../mongo/schemas/user.js";
import utils from "../../../../vite-project/src/utils/utils.js";
import Conversation from "../../../mongo/schemas/conversation.js";


const app = express.Router();

app.post("/refresh-token", async (req, res) => {
  const oldToken = req.headers.authorization?.split(" ")[1];

  if (!oldToken) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);

    // Géneerer un nouveau token
    const newToken = utils.generateJwt(decoded.userId);

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: "Token invalide" });
  }
});

app.post("/session/temp", async (req, res) => {
  const { sessionId } = req.body;

  //Créer un token qui expire dans 3h
  const token = jwt.sign(
    { sessionId,
      isTemp: true,
      iat: Math.floor(Date.now() / 1000)  
    }, 
    process.env.JWT_SECRET, {
      expiresIn: "3h"
    }
  );

  res.json({ token });
});

export default app;
