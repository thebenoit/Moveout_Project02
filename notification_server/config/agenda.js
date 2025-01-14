import Agenda from "agenda";

const agenda = new Agenda({
  db: { address: process.env.DB_URI },
  processEvery: "60 seconds",
});

export default agenda;
