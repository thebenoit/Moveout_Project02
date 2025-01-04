import express from "express";
import cors from "cors"; // permit to access server from differents domain
import bodyParser from "body-parser"; //for form post
import path from "path";
import mongoose from "./mongo/client.js";
import Mixpanel from "mixpanel";
import dotenv from "dotenv/config";
import { fileURLToPath } from "url";

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
import moveoutBot_smsInfo from "./routes/api/moveoutBot/smsInfo.js";

// Obtenir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); //calling express to use server
app.use(bodyParser.json()); //apcepting as json data to read it
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/")));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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

// moveoutBot
app.use("/api/moveoutBot", moveoutBot_smsInfo);

// app.use("/api/client/", client_logout);
// app.use("/client/", client_appartements);

const port = process.env.PORT || 4000; //port to run the serve on
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
