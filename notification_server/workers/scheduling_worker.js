import agenda from "../config/agenda.js";
import twilio from "twilio";
import {
  AjouterDansQueue,
  planifierAjouterDansQueue,
  whatDayIsIt,
  whatTimeIsIt,
} from "../mongo/interface/notification.js";
import Notification from "../mongo/schemas/notification.js";
import rabbitmq from "../config/rabbitmq.js";
import { cleanNotifHistory } from "../mongo/interface/user.mjs";

async function getExactTime() {
  console.log(
    new Date().getHours(),
    "h: ",
    new Date().getMinutes(),
    "m:",
    new Date().getSeconds(),
    "s",
    new Date().getMilliseconds(),
    "ms"
  );
}

// async function removeLockedJobs(){
//   const lockedJobs = await agenda.jobs({})
// }
// Extraire la logique de vérification dans une fonction réutilisable
async function checkAndPlanifyNotifications() {
  console.log("🚀 Début de checkAndPlanifyNotifications");

  const currentDay = await whatDayIsIt();
  const currentHour = await whatTimeIsIt();
  console.log(`Today is ${currentDay} à ${currentHour}`);

  const notifications = await Notification.find({
    status: "test",
    notificationDays: currentDay,
    notificationTimes: currentHour,
  });

  for (const notification of notifications) {
    console.log(
      `🫡notification trouvé, ${
        notification._id
      } à ${new Date().getHours()}h:${new Date().getMinutes()}m:${new Date().getSeconds()}s`
    );

    //clean the notifHistory of the user
    await cleanNotifHistory(notification.userId);
    console.log("notification length:", notifications.length);
    await planifierAjouterDansQueue(notification);
  }
}

/**
 * check a chaque 60s la notification qui est à 20 minutes d'etre envoyée
 * si elle est à 20 minutes, on l'envoie dans la queue
 */
agenda.define("sendNotificationToQueue", async (job) => {
  const { notification } = job.attrs.data;

  try {
    await AjouterDansQueue(notification, "publisher", "notification");

    await job.remove();
  } catch (error) {
    console.log(
      "Erreur lors de l'envoi de la notification dans la queue",
      error
    );
    await job.fail(error);
    await job.remove();
    throw error;
  }
});
agenda.define("each10seconds", async (job) => {
  console.log("🏃🏾 each10seconds--->");
  await getExactTime();
});

agenda.define("checkNewNotifications", async (job) => {
  console.log("🏃🏾 checkNewNotifications");
  try {
    console.log("👁Avant checkAndPlanifyNotifications");
    await checkAndPlanifyNotifications();
  } catch (error) {
    console.error("Erreur lors de checkNotification:", error);
  }
});

agenda.on("ready", () => {
  console.log("Agenda est prêt et connecté à MongoDB.");
});
agenda.on("error", (err) => {
  console.error("Erreur de connexion MongoDB pour Agenda:", err);
});

agenda.on("start", (job) => {
  console.log(
    "🟢 job démarré:",
    job.attrs.name,
    new Date().getHours(),
    "h: ",
    new Date().getMinutes(),
    "m:",
    new Date().getSeconds(),
    "s",
    new Date().getMilliseconds(),
    "ms"
  );
});

agenda.on("complete", (job) => {
  console.log(
    "🏁 Job terminé:",
    job.attrs.name,
    new Date().getHours(),
    "h: ",
    new Date().getMinutes(),
    "m:",
    new Date().getSeconds(),
    "s",
    new Date().getMilliseconds(),
    "ms"
  );
});

agenda.on("fail", (err, job) => {
  console.error("❌ Job échoué:", job.attrs.name, err);
});

async function startAgenda() {
  try {
    await agenda.start();
    await getExactTime();

    await agenda.cancel({ name: "sendNotificationToQueue" });
    console.log("\n Nettoyages des jobs sendNotificationToQueue");

    // Planifier les nouveaux jobs avec try/catch séparés
    if (agenda.jobs({ name: "checkNewNotifications" }).length === undefined) {
      console.log("Planifie un checkNewNotification");
      try {
        await agenda.every(
          "60 seconds",
          "checkNewNotifications",
          {},
          {
            skipImmediate: false,
            timezone: "America/Toronto",
          }
        );
        console.log("✅ Job checkNewNotifications planifié");
      } catch (error) {
        console.error("❌ Erreur planification checkNewNotifications:", error);
      }
    }

    console.log("🚀 Agenda is working...");
  } catch (error) {
    console.error("⛔️Erreur lors du démarrage du worker:", error);
  }
}

export default startAgenda;
