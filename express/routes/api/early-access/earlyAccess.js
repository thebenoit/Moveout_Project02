import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import earlyAccessInterface from "../../../mongo/interface/earlyAccess.js";

dotenv.config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Assurer un URL valide avec schéma explicite
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const frontendBase = frontendUrl.endsWith("/")
  ? frontendUrl.slice(0, -1)
  : frontendUrl;

/**
 * POST /api/early-access/signup
 * Créer une inscription Early Access
 * Body: { firstName, lastName, email, phone }
 */
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: { message: "Tous les champs sont requis", code: 4 },
      });
    }

    const result = await earlyAccessInterface.createEarlyAccessSignup(
      firstName,
      lastName,
      email,
      phone
    );

    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de l'inscription Early Access:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors de l'inscription Early Access",
        code: 500,
      },
    });
  }
});

/**
 * GET /api/early-access/stats
 * Récupérer les statistiques Early Access (spots restants, total signups)
 * Public - pas besoin d'authentification
 */
router.get("/stats", async (req, res) => {
  try {
    const result = await earlyAccessInterface.getEarlyAccessStats();

    if (result.error) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors de la récupération des stats",
        code: 500,
      },
    });
  }
});

/**
 * POST /api/early-access/checkout
 * Créer une session Stripe Checkout pour le paiement Early Access ($19)
 * Body: { email }
 */
router.post("/checkout", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: { message: "Email requis", code: 4 },
      });
    }

    // Vérifier que l'inscription existe
    const earlyAccess = await earlyAccessInterface.findByEmail(email);
    if (!earlyAccess) {
      return res.status(404).json({
        error: {
          message:
            "Inscription Early Access non trouvée. Veuillez d'abord vous inscrire.",
          code: 24,
        },
      });
    }

    // Vérifier que le paiement n'a pas déjà été effectué
    if (earlyAccess.status === "paid") {
      return res.status(400).json({
        error: {
          message: "Vous avez déjà payé pour l'accès Early Access",
          code: 25,
        },
      });
    }

    // Vérifier les spots disponibles
    const stats = await earlyAccessInterface.getEarlyAccessStats();
    if (stats.error || stats.stats.spotsRemaining <= 0) {
      return res.status(400).json({
        error: {
          message: "Tous les spots Early Access sont déjà réservés",
          code: 26,
        },
      });
    }

    // Vérifier la configuration Stripe Price ID pour Early Access
    const earlyAccessPriceId = process.env.STRIPE_EARLY_ACCESS_PRICE_ID;
    if (!earlyAccessPriceId) {
      console.error("⚠️ STRIPE_EARLY_ACCESS_PRICE_ID non défini dans .env");
      return res.status(500).json({
        error: {
          message: "Configuration Stripe manquante (EARLY_ACCESS_PRICE_ID)",
          code: 27,
        },
      });
    }

    // Créer la session Checkout Stripe pour paiement unique ($19)
    const session = await stripe.checkout.sessions.create({
      mode: "payment", // Paiement unique (pas d'abonnement)
      payment_method_types: ["card"],
      line_items: [
        {
          price: earlyAccessPriceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        earlyAccessId: earlyAccess._id.toString(),
        email: email,
        type: "early_access",
      },
      success_url: `${frontendBase}/early-access/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBase}/early-access?canceled=true`,
    });

    // Mettre à jour l'inscription avec le sessionId
    await earlyAccessInterface.updateStripeSessionId(email, session.id);

    // Retourner l'URL de redirection
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors de la création de la session de paiement",
        code: 500,
      },
    });
  }
});

/**
 * GET /api/early-access/verify/:sessionId
 * Vérifier le statut d'un paiement via sessionId Stripe
 */
router.get("/verify/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: { message: "Session ID requis", code: 28 },
      });
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        error: { message: "Session non trouvée", code: 29 },
      });
    }

    // Trouver l'inscription Early Access
    const earlyAccess = await earlyAccessInterface.findByStripeSessionId(
      sessionId
    );

    if (!earlyAccess) {
      return res.status(404).json({
        error: {
          message: "Inscription Early Access non trouvée pour cette session",
          code: 30,
        },
      });
    }

    // Vérifier le statut de paiement
    if (session.payment_status === "paid" && earlyAccess.status !== "paid") {
      // Mettre à jour le statut si le paiement est réussi
      await earlyAccessInterface.updateEarlyAccessStatus(
        earlyAccess.email,
        sessionId,
        session.payment_intent
      );
    }

    res.json({
      success: true,
      paymentStatus: session.payment_status,
      earlyAccessStatus: earlyAccess.status,
      paid: session.payment_status === "paid",
    });
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    res.status(500).json({
      error: {
        message: "Erreur lors de la vérification du paiement",
        code: 500,
      },
    });
  }
});

export default router;
