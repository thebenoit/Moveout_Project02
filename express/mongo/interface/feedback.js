import validator from "validator";
import Feedback from "../schemas/feedback.js";
import responses from "../../responses.js";
import createLog from "./logs.js";

/**
 * Créer un nouveau feedback
 * @param {string} content
 * @param {string} authorEmail - Optionnel
 * @returns {Promise<Object>}
 */
const createFeedback = async (content, authorEmail = null) => {
  try {
    // Validation du contenu
    if (!content || content.trim().length === 0) {
      return {
        error: { message: "Le contenu du feedback est requis", code: 30 },
      };
    }

    if (content.length > 1000) {
      return {
        error: {
          message: "Le feedback ne peut pas dépasser 1000 caractères",
          code: 31,
        },
      };
    }

    // Validation email si fourni
    if (authorEmail && !validator.isEmail(authorEmail)) {
      createLog({ email: authorEmail }, responses.errors.client.invalidEmail);
      return { error: responses.errors.client.invalidEmail };
    }

    // Créer le feedback
    const newFeedback = new Feedback({
      content: content.trim(),
      authorEmail: authorEmail || null,
      likes: 0,
      likedBy: [],
      status: "pending", // Par défaut en attente de modération
      createdAt: Date.now(),
    });

    const savedFeedback = await newFeedback.save();

    return {
      success: true,
      feedbackId: savedFeedback._id.toString(),
      message: "Feedback créé avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la création du feedback:", error);
    createLog({ error: error.message }, "Erreur création feedback");
    return {
      error: { message: "Erreur lors de la création du feedback", code: 32 },
    };
  }
};

/**
 * Récupérer tous les feedbacks approuvés, triés par nombre de likes
 * @param {number} limit - Nombre de feedbacks à retourner (optionnel)
 * @returns {Promise<Object>}
 */
const getApprovedFeedbacks = async (limit = null) => {
  try {
    let query = Feedback.find({ status: "approved" })
      .sort({ likes: -1, createdAt: -1 }) // Trier par likes décroissant, puis par date
      .lean();

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    const feedbacks = await query.exec();

    return {
      success: true,
      feedbacks: feedbacks.map((fb) => ({
        id: fb._id.toString(),
        content: fb.content,
        authorEmail: fb.authorEmail || null,
        likes: fb.likes,
        createdAt: fb.createdAt,
      })),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des feedbacks:", error);
    return {
      error: {
        message: "Erreur lors de la récupération des feedbacks",
        code: 33,
      },
    };
  }
};

/**
 * Liker un feedback
 * @param {string} feedbackId
 * @param {string} identifier - Email ou IP de l'utilisateur
 * @returns {Promise<Object>}
 */
const likeFeedback = async (feedbackId, identifier) => {
  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return { error: { message: "Feedback non trouvé", code: 34 } };
    }

    // Vérifier si déjà liké
    if (feedback.likedBy.includes(identifier)) {
      return {
        error: { message: "Vous avez déjà liké ce feedback", code: 35 },
      };
    }

    // Ajouter le like
    feedback.likedBy.push(identifier);
    feedback.likes = feedback.likedBy.length;

    await feedback.save();

    return {
      success: true,
      likes: feedback.likes,
      message: "Feedback liké avec succès",
    };
  } catch (error) {
    console.error("Erreur lors du like du feedback:", error);
    return { error: { message: "Erreur lors du like", code: 36 } };
  }
};

/**
 * Vérifier si un feedback a déjà été liké par un identifiant
 * @param {string} feedbackId
 * @param {string} identifier - Email ou IP
 * @returns {Promise<boolean>}
 */
const checkIfLiked = async (feedbackId, identifier) => {
  try {
    const feedback = await Feedback.findById(feedbackId).lean();
    if (!feedback) {
      return false;
    }
    return feedback.likedBy.includes(identifier);
  } catch (error) {
    console.error("Erreur lors de la vérification du like:", error);
    return false;
  }
};

/**
 * Approuver un feedback (pour admin)
 * @param {string} feedbackId
 * @returns {Promise<Object>}
 */
const approveFeedback = async (feedbackId) => {
  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return { error: { message: "Feedback non trouvé", code: 34 } };
    }

    feedback.status = "approved";
    await feedback.save();

    return {
      success: true,
      message: "Feedback approuvé",
    };
  } catch (error) {
    console.error("Erreur lors de l'approbation:", error);
    return { error: { message: "Erreur lors de l'approbation", code: 37 } };
  }
};

export default {
  createFeedback,
  getApprovedFeedbacks,
  likeFeedback,
  checkIfLiked,
  approveFeedback,
};
