import express from "express";
const app = express();
import appartementInterface from "../../mongo/interface/appartement.js";

/**
 *
 */
app.get("/appartments", async (req, res) => {
  try {
    //prend les données de la bd facebook et le met dans la const
    const appartData = await appartementInterface.getFacebookListings();

    if (appartData.length === 0) {
      console.log("Aucune donnée trouvée", appartData);
      return res.status(404).send("Aucune donnée trouvée");
    }

    res.send(appartData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).send("Erreur lors de la récupération des données");
  }
});

export default app;
