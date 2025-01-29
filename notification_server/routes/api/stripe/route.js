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
            user = await User.create({
              email: customer.email,
              name: customer.name,
              customerId,
            });
          } else {
            console.error("Utilisateur non trouvé");
            throw new Error("Utilisateur non trouvé");
          }

          //Mise à jour des droits d'accès
          user.priceId = priceId;
          user.hasAccess = true;
          await user.save();

          break;
        }
    }
  }
);

export default router;
