import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../../mongo/schemas/user.js";
import Preference from "../../../mongo/schemas/preference.js";

const router = express.Router();

/**
 * Google Authentication Controller
 * Gère l'authentification Google avec les bonnes pratiques OOP
 */
class GoogleAuthController {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * Vérifie le token Google
   */
  async verifyGoogleToken(token) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      console.error("Erreur lors de la vérification du token Google:", error);
      throw new Error("Token Google invalide");
    }
  }

  /**
   * Trouve ou crée un utilisateur basé sur les données Google
   */
  async findOrCreateUser(googleData) {
    try {
      // Chercher l'utilisateur par email Google
      let user = await User.findOne({ email: googleData.email });

      if (!user) {
        // Créer un nouvel utilisateur
        user = new User({
          email: googleData.email,
          firstName:
            googleData.given_name || googleData.name?.split(" ")[0] || "",
          lastName:
            googleData.family_name ||
            googleData.name?.split(" ").slice(1).join(" ") ||
            "",
          phone: "", // L'utilisateur devra ajouter son numéro plus tard
          googleId: googleData.sub,
          googlePicture: googleData.picture,
          isGoogleUser: true,
          isVerified: true, // Les utilisateurs Google sont automatiquement vérifiés
        });

        await user.save();
        console.log("Nouvel utilisateur Google créé:", user.email);
      } else {
        // Mettre à jour les informations Google si nécessaire
        if (!user.googleId) {
          user.googleId = googleData.sub;
          user.googlePicture = googleData.picture;
          user.isGoogleUser = true;
          await user.save();
        }
      }

      return user;
    } catch (error) {
      console.error(
        "Erreur lors de la création/recherche de l'utilisateur:",
        error
      );
      throw new Error("Erreur lors de la gestion de l'utilisateur");
    }
  }

  /**
   * Crée un token JWT pour l'utilisateur
   */
  createJWTToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isGoogleUser: user.isGoogleUser,
      isTemp: false,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  }

  /**
   * Gère l'authentification Google
   */
  async handleGoogleAuth(req, res) {
    try {
      const { email, name, given_name, family_name, picture, sub } = req.body;

      if (!email || !sub) {
        return res.status(400).json({
          success: false,
          error: "Données Google manquantes",
        });
      }

      // Créer l'objet de données Google
      const googleData = {
        email,
        name,
        given_name,
        family_name,
        picture,
        sub,
      };

      // Trouver ou créer l'utilisateur
      const user = await this.findOrCreateUser(googleData);

      // Créer un token JWT
      const token = this.createJWTToken(user);

      // Vérifier si l'utilisateur a des préférences
      const hasPreferences = await Preference.findOne({ userId: user._id });

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isGoogleUser: user.isGoogleUser,
          hasPreferences: !!hasPreferences,
        },
        redirectUrl: hasPreferences ? "/foryou" : "/signup",
      });
    } catch (error) {
      console.error("Erreur lors de l'authentification Google:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de l'authentification Google",
      });
    }
  }
}

// Instance du contrôleur
const googleAuthController = new GoogleAuthController();

// Route pour l'authentification Google
router.post("/google-auth", async (req, res) => {
  await googleAuthController.handleGoogleAuth(req, res);
});

export default router;
