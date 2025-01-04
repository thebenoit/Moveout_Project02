const express = require("express");
const app = express();
const User = require("../../../mongo/schemas/user");

// informations  envoyer un sms
app.post("/smsInfo/:id", async (req, res) => {
  try {
    console.log("User ID", req.params.id);
    const sms_info = await User.findById(req.params.id);
    console.log("First Name", sms_info.firstName);
    res.json({ message: `Hello word ${sms_info.firstName}` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des données" });
  }
});

app.get("/moveoutBot/:id", async (req, res) => {
  res.json({ message: "Hello World" });
});

module.exports = app;
