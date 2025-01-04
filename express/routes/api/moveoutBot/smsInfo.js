import express from "express";
const app = express();
import User from "../../../mongo/schemas/user.js";
import { envoyer_reponse } from "../../../logMessages.js";
import httpStatus from "../../../http_status.js";

// informations  envoyer un sms
app.post("/smsInfo/:id", async (req, res) => {
  try {
    console.log("dans smsInfo");
    console.log("User ID", req.params.id);
    const sms_info = await User.findById(req.params.id);
    console.log("First Name", sms_info.firstName);
    envoyer_reponse(req, res, "smsInfo made", httpStatus.Success);
  } catch (error) {
    envoyer_reponse(req, res, "Erreur lors de la récupération des données", httpStatus.Internal_server);
  }
});

app.get("/smsInfo/:id", async (req, res) => {
  envoyer_reponse(req, res, "smsInfo made", httpStatus.Success);
});

export default app;
