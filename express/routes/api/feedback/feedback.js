import express from "express";
import feedbackInterface from "../../../mongo/interface/feedback.js";

const router = express.Router();

/**
 * POST /api/feedback
 * Créer un nouveau feedback
 * Body: { content, authorEmail? } - authorEmail est optionnel
 */
router.post("/", async (req, res) => {
  try {
    const { content, authorEmail } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: { message: "Le contenu du feedback est requis", code: 30 },
      });
    }

    const result = await feedbackInterface.createFeedback(
      content,
      authorEmail || null
    );

    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création du feedback:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors de la création du feedback",
        code: 500,
      },
    });
  }
});

/**
 * GET /api/feedback
 * Récupérer tous les feedbacks approuvés, triés par nombre de likes
 * Query params: limit? - Nombre de feedbacks à retourner (optionnel)
 */
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    // Valider que limit est un nombre positif si fourni
    if (limit !== null && (isNaN(limit) || limit <= 0)) {
      return res.status(400).json({
        error: {
          message: "Le paramètre limit doit être un nombre positif",
          code: 38,
        },
      });
    }

    const result = await feedbackInterface.getApprovedFeedbacks(limit);

    if (result.error) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des feedbacks:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors de la récupération des feedbacks",
        code: 500,
      },
    });
  }
});

/**
 * POST /api/feedback/:id/like
 * Liker un feedback
 * Body: { identifier? } - Email ou IP (optionnel, sinon utilise req.ip)
 * Si identifier n'est pas fourni, utilise l'IP de la requête
 */
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { identifier } = req.body;

    if (!id) {
      return res.status(400).json({
        error: { message: "ID du feedback requis", code: 39 },
      });
    }

    // Utiliser l'identifiant fourni ou l'IP de la requête
    const userIdentifier =
      identifier || req.ip || req.headers["x-forwarded-for"] || "anonymous";

    // Vérifier si déjà liké
    const alreadyLiked = await feedbackInterface.checkIfLiked(
      id,
      userIdentifier
    );

    if (alreadyLiked) {
      return res.status(400).json({
        error: { message: "Vous avez déjà liké ce feedback", code: 35 },
      });
    }

    // Ajouter le like
    const result = await feedbackInterface.likeFeedback(id, userIdentifier);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur lors du like du feedback:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors du like du feedback",
        code: 500,
      },
    });
  }
});

/**
 * GET /api/feedback/:id/check-like
 * Vérifier si un feedback a déjà été liké par un identifiant
 * Query params: identifier? - Email ou IP (optionnel, sinon utilise req.ip)
 */
router.get("/:id/check-like", async (req, res) => {
  try {
    const { id } = req.params;
    const identifier =
      req.query.identifier ||
      req.ip ||
      req.headers["x-forwarded-for"] ||
      "anonymous";

    if (!id) {
      return res.status(400).json({
        error: { message: "ID du feedback requis", code: 39 },
      });
    }

    const alreadyLiked = await feedbackInterface.checkIfLiked(id, identifier);

    res.json({
      success: true,
      liked: alreadyLiked,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du like:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors de la vérification du like",
        code: 500,
      },
    });
  }
});

export default router;
