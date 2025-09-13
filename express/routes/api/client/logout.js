import express from "express";
const app = express();
import client from "../../../mongo/interface/client.js";
import jwt from "jsonwebtoken";
import User from "../../../mongo/schemas/user.js";

// Corriger la route (ajouter le slash)
app.post("/logout", async (req, res) => {
  try {
    // Récupérer le token depuis les cookies
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (accessToken) {
      try {
        // Décoder le token pour obtenir l'userId
        const decoded = jwt.decode(accessToken);
        const userId = decoded?.userId;

        if (userId) {
          // Appeler la fonction de déconnexion côté base de données
          const result = await client.logout(req, res);

          if (result.error) {
            console.log("Erreur dans le résultat du logout: ", result);
            return res.status(400).send(result);
          }
        }
      } catch (decodeError) {
        console.log("Erreur lors du décodage du token: ", decodeError);
      }
    }

    // 🆕 NOUVEAU : Supprimer les cookies d'authentification
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });

    res.clearCookie("session_id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });

    // Réponse de succès
    res.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.log("Erreur lors du post logout: ", error);
    res.status(500).send("Erreur lors du logout");
  }
});

export default app;
