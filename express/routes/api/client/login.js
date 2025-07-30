import express from "express";
const app = express();
import client from "../../../mongo/interface/client.js";
import generateJTW from "../../../mongo/interface/JWT.js";
import jwt from "jsonwebtoken";
import User from "../../../mongo/schemas/user.js";
import mixpanel from "mixpanel";
import session from "express-session";

app.post("/login", async (req, res) => {
  try {
    const response = await client.login(req.body.identifier, req.body.password);
    const user = await User.findById(response.userId);

    if (response.error) {
      return res.status(400).send(response);
    }

    const sessionID = user.accessToken;

    //set up cookie
    res.cookie("session_id", sessionID, {
      httpOnly: true, // Inaccessible via JavaScript
      secure: true, // HTTPS seulement en production
      sameSite: "strict", // Protection contre les attaques CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      path: "/", // Cookie disponible sur tout le site
    });
    res.send({ token: user.accessToken });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

app.get("/login/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "user non trouvée" });
    }
    console.log("user trouvée: ", user);
    //retourne preference en json
    res.json(user);
  } catch (error) {
    console.log("erreur lors de la recherche dans login");
    res.status(500).send("erreur lors de la recherche dans login");
  }
});

export default app;
