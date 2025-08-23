import jwt from "jsonwebtoken";
import express from "express";
import User from "../../../mongo/schemas/user.js";
import utils from "../../../../vite-project/src/utils/utils.js";
import Conversation from "../../../mongo/schemas/conversation.js";
import JWT from "../../../mongo/interface/JWT.js";

const app = express.Router();

app.post("/refresh-token", async (req, res) => {
  try {
    // 🆕 AMÉLIORATION : Lire le refresh token depuis le cookie
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token non fourni",
        details: "Veuillez vous reconnecter",
      });
    }

    // Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    //  NOUVEAU : Vérifier que c'est bien un refresh token
    if (decoded.tokenType !== "refresh") {
      return res.status(401).json({
        error: "Token invalide",
        details: "Ce n'est pas un refresh token",
      });
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: "Utilisateur non trouvé",
        details: "Veuillez vous reconnecter",
      });
    }

    // 🆕 NOUVEAU : Générer un nouveau access token
    const newAccessToken = await JWT.generateJwt(String(user._id));

    // 🆕 NOUVEAU : Générer un nouveau refresh token (rotation)
    const newRefreshToken = await JWT.generateRefreshToken(
      String(user._id),
      decoded.sessionId
    );

    // 🆕 NOUVEAU : Set les nouveaux cookies
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth",
    });

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 24 * 60 * 60,
    });
  } catch (error) {
    console.error("Erreur lors du refresh:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Refresh token expiré",
        details: "Veuillez vous reconnecter",
      });
    }

    res.status(401).json({
      error: "Token invalide",
      details: "Veuillez vous reconnecter",
    });
  }
});

app.post("/session/temp", async (req, res) => {
  const { sessionId } = req.body;

  //Créer un token qui expire dans 3h
  const token = jwt.sign(
    { sessionId, isTemp: true, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h",
    }
  );

  res.json({ token });
});

export default app;
