import Agenda from "agenda";

const agenda = new Agenda({
  db: { address: process.env.DB_URI },
  processEvery: "5 seconds",
  defaultConcurrency: 2,
  maxConcurrency: 4,
  locklimit: 0,
  lockLifetime: 60000,
});

// Force Agenda à rafraîchir son état
agenda.on("ready", async () => {
  console.log("Agenda est connecté à MongoDB et prêt à traiter les jobs");

  const jobLocked = await agenda.jobs({
    lockedAt: {
      $exists: true,
    },
  });

  for (const job of jobLocked) {
    console.log("Job bloqué");
  }
});

// Gestion des erreurs
agenda.on("error", (error) => {
  console.error("Erreur Agenda:", error);
});

export default agenda;
