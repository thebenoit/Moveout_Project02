import express from "express";
import cors from "cors"; // permit to access server from differents domain
// import bodyParser from "body-parser"; //for form post
import path from "path";
import Mixpanel from "mixpanel";
import dotenv from "dotenv/config";
import { fileURLToPath } from "url";
import mongoose from "./config/client.mjs";
import startWorker from "./workers/messenger_worker.js";
import startAgenda from "./workers/scheduling_worker.js";
import startDLQWorker from "./workers/dlq_worker.js";
import rabbitmq from "./config/rabbitmq.js";

import notification from "./routes/api/notification/notifications.js";
// stripe
import stripeWebhookRouter from "./routes/api/stripe/route.js";

const app = express();
// Obtenir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration détaillée de CORS
app.use(
  cors({
    origin: "*", // ou spécifiez les domaines autorisés, ex: ['http://localhost:3000', 'https://votreapp.com']
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true, // si vous avez besoin de supporter les cookies/auth
  })
);

app.use(
  "/api/stripe/",
  //express.raw({type: "application/json"}),
  stripeWebhookRouter
);

// Ajouter ces middlewares avant vos routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/")));

// ✅ Solution recommandée(en production met ca)
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS.split(','),
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

// stripe
// app.use("/api/stripe", stripeWebhookRouter);
app.use("/api/", notification);

app.get("/", (req, res) => {
  res.send("The notification server is running...");
});

app.listen(process.env.PORT, () => {
  console.log(`notification server is running on port ${process.env.PORT}`);
});

//Démarrer le worker dans le même processus
startWorker().catch((error) => {
  console.error("❌ Erreur worker:", error);
});

startAgenda().catch((error) => {
  console.error("❌ Erreur agenda:", error);
});

startDLQWorker().catch((error) => {
  console.error("❌ Erreur DLQ worker:", error);
});
