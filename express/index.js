const express = require("express");
const cors = require("cors"); // permit to access server from differents domain
const bodyParser = require("body-parser"); //for form post
const path = require("path");
const mongoose = require("./mongo/client.js");

// routes
const appartments = require("./routes/api/appartement.js");
const client_singup = require("./routes/api/client/signup.js");
const client_login = require("./routes/api/client/login.js");
const client_lead = require("./routes/api/client/leads.js");

const client_logout = require("./routes/api/client/logout.js");
const client_appartements = require("./routes/api/client/custom_appartements.js");
const client_preference = require("./routes/api/client/preference.js")

// config
require("dotenv/config");

const app = express(); //calling express to use server
app.use(bodyParser.json()); //apcepting as json data to read it
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/")));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api", appartments);

// api

// client
app.use("/api/client", client_singup);
app.use("/api/client", client_login);
app.use("/api/client", client_lead);
app.use("/api/client", client_preference);

// app.use("/api/client/", client_logout);
// app.use("/client/", client_appartements);

const port = process.env.PORT || 4000; //port to run the serve on
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
