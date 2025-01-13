import express from "express";
import express from "express";
import cors from "cors"; // permit to access server from differents domain
import bodyParser from "body-parser"; //for form post
import path from "path";
import mongoose from "./mongo/client.js";
import Mixpanel from "mixpanel";
import dotenv from "dotenv/config";
import { fileURLToPath } from "url";


const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(4100, () => {
  console.log("Server is running on port 3000");
});
