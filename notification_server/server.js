import express from "express";
import cors from "cors"; // permit to access server from differents domain
// import bodyParser from "body-parser"; //for form post
import path from "path";
import Mixpanel from "mixpanel";
import dotenv from "dotenv/config";
import { fileURLToPath } from "url";

import notification from "./routes/api/notification/notifications.js";

const app = express();

// Ajouter ces middlewares avant vos routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/", notification);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
