import express from "express";
import validator from "validator";
import User from "../../../mongo/schemas/user.js";
import { requireAuth } from "./me.js";

const router = express.Router();

// Route pour ajouter/mettre à jour le téléphone
router.put("/phone", requireAuth, async (req, res) => {
  try {
    const { phone } = req.body;
    
    // 1. Vérifier que le téléphone est fourni
    if (!phone || !phone.trim()) {
      return res.status(400).json({ 
        error: "Le numéro de téléphone est requis" 
      });
    }

    // 2. Validation internationale du téléphone
    if (!validator.isMobilePhone(phone.trim(), 'any', { strictMode: false })) {
      return res.status(400).json({ 
        error: "Le numéro de téléphone n'est pas valide" 
      });
    }

    // 3. Récupérer l'utilisateur connecté (depuis le token JWT)
    const userId = req.auth.userId;
    
    // 4. Mettre à jour le téléphone dans la base de données
    const user = await User.findByIdAndUpdate(
      userId,
      { phone: phone.trim() },
      { new: true } // Retourne le document mis à jour
    );

    if (!user) {
      return res.status(404).json({ 
        error: "Utilisateur non trouvé" 
      });
    }

    // 5. Succès ! Retourner confirmation
    return res.status(200).json({
      success: true,
      message: "Numéro de téléphone ajouté avec succès",
      bonus: "Vous avez maintenant 15 recherches gratuites par jour ! 🎉"
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout du téléphone:", error);
    return res.status(500).json({ 
      error: "Erreur serveur lors de l'ajout du téléphone" 
    });
  }
});

export default router;