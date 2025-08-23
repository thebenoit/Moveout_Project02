import express from "express";
const app = express();
import client from "../../../mongo/interface/client.js";
import JWT from "../../../mongo/interface/JWT.js"; // ← Importer l'objet complet
import jwt from "jsonwebtoken";
import User from "../../../mongo/schemas/user.js";
import mixpanel from "mixpanel";
import session from "express-session";

app.post("/login", async (req, res) => {
  try {
    const response = await client.login(req.body.identifier, req.body.password);
    const user = await User.findById(response.userId);

    if (response.error) {
      return res.status(400).send(response);
    }

    // Utiliser JWT.generateJwt (notez le nom exact)
    const jwtToken = await JWT.generateJwt(
      String(user._id),
     // String(user.preferences?._id),
      false
    );

    console.log("Nouveau JWT généré pour user:", user._id);

    res.cookie("session_id", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.send({ token: jwtToken });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

app.get("/login/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "user non trouvée" });
    }
    console.log("user trouvée: ", user);
    //retourne preference en json
    res.json(user);
  } catch (error) {
    console.log("erreur lors de la recherche dans login");
    res.status(500).send("erreur lors de la recherche dans login");
  }
});

export default app;
