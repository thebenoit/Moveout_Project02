import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../../../mongo/schemas/user.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
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

          let user;
          if (customer.email) {
            user = await User.find({ email: customer.email });

            if (!user) {
              // user = await User.create({
              //   email: customer.email,
              //   name: customer.name,
              //   customerId,
              // });

              console.error(
                `Tentative de paiement d'un utilisateur non inscrit: ${customer.email}`
              );
              throw new Error(
                `Utilisateur non Inscrit. Inscription requise avant le paiement`
              );
            }

            //Mise à jour des droits d'accès
            user.priceId = priceId;
            user.hasAccess = true;
            await user.save();

            //Envoi d'un email de confirmation

            break;
          }
        case "customer.subsciption.deleted": {
          const subscription = await stripe.subscriptions.retrieve(
            event.data.object.id
          );

          const user = await User.findOne({
            customerId: subscription.customer,
          });

          if (user) {
            user.hasAccess = false;
            await user.save();
          }
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
