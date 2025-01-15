import Agenda from "agenda";

const agenda = new Agenda({
  db: { address: process.env.DB_URI },
  processEvery: "60 seconds",
});

// Force Agenda à rafraîchir son état
agenda.on('ready', () => {
  console.log('Agenda est connecté à MongoDB et prêt à traiter les jobs');
});

// Gestion des erreurs
agenda.on('error', (error) => {
  console.error('Erreur Agenda:', error);
});
export default agenda;
