import express from "express";
const app = express();
import client from "../../../mongo/interface/client.js";
import generateJTW from "../../../mongo/interface/JWT.js";
import jwt from "jsonwebtoken";
import User from "../../../mongo/schemas/user.js";
import mixpanel from "mixpanel";

app.post("/login", async (req, res) => {
  try {
    const response = await client.login(req.body.identifier, req.body.password);
    const user = await User.findById(response.userId);

    if (response.error) {
      return res.status(400).send(response);
    }
    // mixpanel.identify(response.userId);

    // mixpanel.people.set({
    //   $name: user.firstName,
    //   $email: user.email,
    //   $phone: user.phone,
    // });
    console.log("user access token; ", user.accessToken);
    console.log("user name ", user.firstName);
    res.send({ token: user.accessToken });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

app.get("/login/:id", async (req, res) => {
  try {
    const user = await User.find({ preferencesId: req.params.id });

    if (!user) {
      return res.status(404).json({ error: "user non trouvée" });
    }
    //retourne preference en json
    res.json(user);
  } catch (error) {
    console.log("erreur lors de la recherche dans login");
    res.status(500).send("erreur lors de la recherche dans login");
  }
});

export default app;
