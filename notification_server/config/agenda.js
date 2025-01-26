import Agenda from "agenda";

const agenda = new Agenda({
  db: { address: process.env.DB_URI },
  processEvery: "5 seconds",
  defaultConcurrency: 2,
  maxConcurrency: 4,
  locklimit: 4,
  lockLifetime: 60000,
});

// Force Agenda à rafraîchir son état
agenda.on("ready",async () => {
  console.log("Agenda est connecté à MongoDB et prêt à traiter les jobs");
  
  const jobLocked = await agenda.jobs(
    {
      lockedAt: {
        $exists: true,
      }
    }
    
  )

  if(jobLocked.length > 0){
    console.log(`${jobLocked.length} jobs bloqués `);

    if (jobLocked[0].lastFinishedAt && jobLocked[0].lastFinishedAt < new Date(Date.now() - 30000)) {
      console.log(`${jobLocked[0].name} job bloqué depuis plus de 30 seconds, on le relache`);
      await jobLocked[0].unlock();
    }

  }
});

// Gestion des erreurs
agenda.on("error", (error) => {
  console.error("Erreur Agenda:", error);
});


export default agenda;
