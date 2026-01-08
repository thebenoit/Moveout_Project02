import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../../mongo/schemas/user.js";

dotenv.config();
const router = express.Router();
router.use(cookieParser());

// Use test key in development, live key in production
const stripeKey = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_SECRET_KEY_TEST;

const stripe = new Stripe(stripeKey);

// Assurer un URL valide avec schéma explicite
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const frontendBase = frontendUrl.endsWith("/")
  ? frontendUrl.slice(0, -1)
  : frontendUrl;
router.post("/checkout", async (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ error: "Authentification requise" });
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
  const userId = payload.userId || payload.sub;
  if (!userId) {
    return res.status(401).json({ error: "Token mal formé" });
  }

  // --- Récupérer l'utilisateur depuis MongoDB ---
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  // --- Vérifier la configuration Stripe Price ID ---
  const priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
  if (!priceId) {
    console.error("⚠️ STRIPE_MONTHLY_PRICE_ID non défini dans .env");
    return res
      .status(500)
      .json({ error: "Configuration Stripe manquante (PRICE_ID)" });
  }

  // --- Créer la session Checkout Stripe ---
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", // ou "payment" si paiement unique
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email, // fallback email
    metadata: { userId }, // on lie la session à ton user
    success_url: `${frontendBase}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendBase}/pricing/cancel`,
  });

  // --- Retourner l'URL que le front utilisera pour rediriger ---
  res.json({ url: session.url });
});

// Récupérer le statut d'abonnement
router.get("/subscription/status", async (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
  const user = await User.findById(payload.userId || payload.sub).lean();
  if (!user) return res.status(404).json({ error: "user_not_found" });
  res.json({
    hasAccess: !!user.hasAccess,
    priceId: user.priceId || null,
    customerId: user.customerId || null,
  });
});

// Annuler l'abonnement immédiatement
router.post("/subscription/cancel", async (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
  const user = await User.findById(payload.userId || payload.sub);
  if (!user) return res.status(404).json({ error: "user_not_found" });
  if (!user.customerId)
    return res.status(400).json({ error: "no_customer_id" });

  try {
    const subs = await stripe.subscriptions.list({
      customer: user.customerId,
      status: "active",
      limit: 3,
    });
    const activeSub = subs.data.find(
      (s) => s.status === "active" || s.status === "trialing"
    );
    if (!activeSub) {
      return res.status(404).json({ error: "no_active_subscription" });
    }

    const cancelled = await stripe.subscriptions.cancel(activeSub.id);

    user.hasAccess = false;
    await user.save();

    return res.json({
      success: true,
      subscriptionId: cancelled.id,
      status: cancelled.status,
    });
  } catch (err) {
    console.error("Stripe cancel error:", err.message);
    return res
      .status(500)
      .json({ error: "stripe_cancel_failed", message: err.message });
  }
});

export default router;
