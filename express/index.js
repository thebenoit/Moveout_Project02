import express from "express";
import cors from "cors"; // permit to access server from differents domain
import bodyParser from "body-parser"; //for form post
import path from "path";
import mongoose from "./mongo/client.js";
import Mixpanel from "mixpanel";
import dotenv from "dotenv/config";
import { fileURLToPath } from "url";
import stripeWebhookRouter from "./routes/Stripe/stripe.js";
import chat from "./routes/api/chat/chat.js";
import jwtRouter from "./routes/api/jwt/jwt.js";

// Create an instance of the mixpanel client
var mixpanel = Mixpanel.init("d41fbc564b7544ce2d7c92cb6d8beb63", {
  track_pageview: true,
  debug: true,
});

// routes

// apparts
import appartments from "./routes/api/appartement.js";
import paginated_appartments from "./routes/api/appartements/paginated_appartments.js";
import paginated_forYouPage from "./routes/api/appartements/paginated_forYouPage.js";

// client
import client_singup from "./routes/api/client/signup.js";
import client_login from "./routes/api/client/login.js";
import client_lead from "./routes/api/client/leads.js";

import client_logout from "./routes/api/client/logout.js";
import client_preference from "./routes/api/client/preference.js";

// Obtenir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); //calling express to use server

app.use(
  cors({
    origin: [
      "https://www.moveout.ai",
      "http://localhost:5173",
      "https://notificationserver.online",
    ], // Add your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Authorization"],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 204,
  })
);

//app.options("*", cors());

//app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use("/api/stripe", stripeWebhookRouter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/")));

//app.use(cors(corsOptions));

//app.options('*', cors(corsOptions));

app.use("/api", appartments);

// api

// client
app.use("/api/client", client_singup);
app.use("/api/client", client_login);
app.use("/api/client", client_lead);
app.use("/api/client", client_preference);

// apparts
app.use("/api/appartements", paginated_appartments);
// apparts personalisé
app.use("/api/appartements", paginated_forYouPage);

// chat
app.use("/api/chat", chat);

// jwt
app.use("/api/jwt", jwtRouter);

// app.use("/api/client/", client_logout);
// app.use("/client/", client_appartements);

const port = process.env.PORT || 4000; //port to run the serve on
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
