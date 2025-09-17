import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../../mongo/schemas/user.js";
import mongoose from "../../mongo/client.js";

dotenv.config();
const router = express.Router();
// Note: express.raw doit précéder tout parser de cookie/json
// Le router de webhook ne passe PAS par cookieParser
// app.js monte stripeWebhookRouter *avant* cookieParser()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.get("/webhook/test", (req, res) => {
  res.send("Hello World");
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    console.log("🔑 Signature reçue:", sig);
    console.log("🔒 Webhook Secret:", webhookSecret ? "Présent" : "Manquant");

    let event;
    console.log("🔴 Webhook reçu:");

    try {
      console.log("🔴dans le try");
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log("✅ Webhook vérifié:", event.type);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      //Gestion des évènements
      switch (event.type) {
        case "checkout.session.completed":
          const session = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
              expand: ["line_items"],
            }
          );
          const customerId = session?.customer;
          const customer = await stripe.customers.retrieve(customerId);
          const priceId = session?.line_items?.data[0]?.price.id;

          const userId = session.metadata.userId;

          if (!userId) {
            console.error(
              "❌ Pas de metadata.userId dans session:",
              session.id
            );
            return res.status(400).end();
          }

          console.log("🔴 Customer trouvé:", customer.email);
          //update l'utilisateur
          // On met à jour directement par ID
          const user = await User.findByIdAndUpdate(
            userId,
            {
              customerId,
              stripeEmail: session.customer_email,
              priceId,
              hasAccess: true,
            },
            { new: true }
          );

          if (!user) {
            console.error(`Utilisateur introuvable pour ID=${userId}`);
            return res.status(404).end();
          }
          console.log(`✅ ${user.email} passé en premium`);
          break;

        case "customer.subscription.deleted": {
          const subscription = await stripe.subscriptions.retrieve(
            event.data.object.id
          );

          // 1. Vérifier si on a un customer
          if (!subscription.customer) {
            console.log("⚠️ Pas de customerId dans la subscription");
            return res.json({
              received: true,
              warning: "No customer ID in subscription",
            });
          }

          console.log("🔴 Subscription supprimée:", subscription.customer);

          const user = await User.findOne({
            customerId: subscription.customer,
          });

          // 3. Vérifier si l'utilisateur existe
          if (!user) {
            console.log(
              "⚠️ Utilisateur non trouvé pour customerId:",
              subscription.customer
            );
            return res.json({
              received: true,
              warning: "User not found for this customer ID",
            });
          }

          user.hasAccess = false;
          await user.save();

          break;
        }

        default:
          console.log(`évènement non géré ${event.type}`);
      }
      //Réponse de succès
      res.json({ received: true });
    } catch (error) {
      console.error(
        `Erreur Stripe: ${error.message}  | Type d'évènement:${event.type}`
      );

      if (error.message.includes("Utilisateur non inscrit")) {
        return res.status(400).json({
          error: error.message,
          type: "unregistered_user_error",
        });
      }

      res.status(500).json({
        error: "Erreur interne du serveur",
        message: error.message,
      });
    }
  }
);

export default router;
