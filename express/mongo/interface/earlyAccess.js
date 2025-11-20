import validator from "validator";
import EarlyAccess from "../schemas/earlyAccess.js";
import responses from "../../responses.js";
import createLog from "./logs.js";

const MAX_EARLY_ACCESS_SPOTS = 200;

/**
 * Créer une inscription Early Access
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} phone
 * @returns {Promise<Object>}
 */
const createEarlyAccessSignup = async (firstName, lastName, email, phone) => {
  try {
    // Validation email
    if (!validator.isEmail(email)) {
      createLog({ email }, responses.errors.client.invalidEmail);
      return { error: responses.errors.client.invalidEmail };
    }

    // Validation téléphone
    if (
      !validator.isMobilePhone(phone.toString(), "any", { strictMode: false })
    ) {
      createLog({ phone }, responses.errors.client.invalidPhone);
      return { error: responses.errors.client.invalidPhone };
    }

    // Vérifier les champs requis
    if (!firstName || !lastName || !email || !phone) {
      createLog(
        { firstName, lastName, email, phone },
        responses.errors.client.missingFields
      );
      return { error: responses.errors.client.missingFields };
    }

    // Vérifier si l'email existe déjà
    const existingSignup = await EarlyAccess.findOne({ email });
    if (existingSignup) {
      return { error: responses.errors.client.alreadyExists };
    }

    // Vérifier le nombre de spots disponibles
    const paidCount = await EarlyAccess.countDocuments({ status: "paid" });
    if (paidCount >= MAX_EARLY_ACCESS_SPOTS) {
      return {
        error: {
          message: "Tous les spots Early Access sont déjà réservés",
          code: 20,
        },
      };
    }

    // Créer l'inscription
    const newEarlyAccess = new EarlyAccess({
      firstName,
      lastName,
      email,
      phone,
      status: "pending",
      createdAt: Date.now(),
    });

    const savedEarlyAccess = await newEarlyAccess.save();

    return {
      success: true,
      earlyAccessId: savedEarlyAccess._id.toString(),
      message: "Inscription Early Access créée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la création Early Access:", error);
    createLog({ error: error.message }, "Erreur création Early Access");
    return { error: responses.errors.client.accountCreationError };
  }
};

/**
 * Mettre à jour le statut d'un Early Access après paiement
 * @param {string} email
 * @param {string} stripeSessionId
 * @param {string} stripePaymentId
 * @returns {Promise<Object>}
 */
const updateEarlyAccessStatus = async (
  email,
  stripeSessionId,
  stripePaymentId
) => {
  try {
    const earlyAccess = await EarlyAccess.findOne({ email });
    if (!earlyAccess) {
      return {
        error: { message: "Inscription Early Access non trouvée", code: 21 },
      };
    }

    earlyAccess.status = "paid";
    earlyAccess.stripeSessionId = stripeSessionId;
    earlyAccess.stripePaymentId = stripePaymentId;
    earlyAccess.paidAt = Date.now();

    await earlyAccess.save();

    return {
      success: true,
      message: "Statut Early Access mis à jour",
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour Early Access:", error);
    return { error: { message: "Erreur lors de la mise à jour", code: 22 } };
  }
};

/**
 * Récupérer les statistiques Early Access
 * @returns {Promise<Object>}
 */
const getEarlyAccessStats = async () => {
  try {
    const totalSignups = await EarlyAccess.countDocuments({});
    const paidCount = await EarlyAccess.countDocuments({ status: "paid" });
    const pendingCount = await EarlyAccess.countDocuments({
      status: "pending",
    });
    const spotsRemaining = Math.max(0, MAX_EARLY_ACCESS_SPOTS - paidCount);

    return {
      success: true,
      stats: {
        totalSignups,
        paidCount,
        pendingCount,
        spotsRemaining,
        maxSpots: MAX_EARLY_ACCESS_SPOTS,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    return {
      error: { message: "Erreur lors de la récupération des stats", code: 23 },
    };
  }
};

/**
 * Trouver un Early Access par email
 * @param {string} email
 * @returns {Promise<Object>}
 */
const findByEmail = async (email) => {
  try {
    const earlyAccess = await EarlyAccess.findOne({ email }).lean();
    return earlyAccess;
  } catch (error) {
    console.error("Erreur lors de la recherche Early Access:", error);
    return null;
  }
};

/**
 * Trouver un Early Access par session Stripe
 * @param {string} stripeSessionId
 * @returns {Promise<Object>}
 */
const findByStripeSessionId = async (stripeSessionId) => {
  try {
    const earlyAccess = await EarlyAccess.findOne({ stripeSessionId }).lean();
    return earlyAccess;
  } catch (error) {
    console.error("Erreur lors de la recherche par session Stripe:", error);
    return null;
  }
};

/**
 * Mettre à jour le stripeSessionId d'un Early Access
 * @param {string} email
 * @param {string} stripeSessionId
 * @returns {Promise<Object>}
 */
const updateStripeSessionId = async (email, stripeSessionId) => {
  try {
    const earlyAccess = await EarlyAccess.findOne({ email });
    if (!earlyAccess) {
      return {
        error: { message: "Inscription Early Access non trouvée", code: 21 },
      };
    }

    earlyAccess.stripeSessionId = stripeSessionId;
    await earlyAccess.save();

    return {
      success: true,
      message: "Session Stripe mise à jour",
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la session Stripe:", error);
    return {
      error: { message: "Erreur lors de la mise à jour", code: 24 },
    };
  }
};

export default {
  createEarlyAccessSignup,
  updateEarlyAccessStatus,
  getEarlyAccessStats,
  findByEmail,
  findByStripeSessionId,
  updateStripeSessionId,
};
