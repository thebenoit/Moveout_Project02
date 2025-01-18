import agenda from "../config/agenda.js";
import twilio from "twilio";
import {
  AjouterDansQueue,
  planifierAjouterDansQueue,
  whatDayIsIt,
  whatTimeIsIt,
} from "../mongo/interface/notification.mjs";
import Notification from "../mongo/schemas/notification.js";
import rabbitmq from "../config/rabbitmq.js";
import { cleanNotifHistory } from "../mongo/interface/user.mjs";

// Extraire la logique de vérification dans une fonction réutilisable
async function checkAndPlanifyNotifications() {
  const currentDay = await whatDayIsIt();
  const currentHour = await whatTimeIsIt();
  console.log(`Today is ${currentDay} à ${currentHour}`);

  const notifications = await Notification.find({
    status: "recurring",
    notificationDays: currentDay,
    notificationTimes: currentHour,
  });

  for (const notification of notifications) {
    console.log(
      `🫡notification trouvé, ${notification._id} à ${new Date().toISOString()}`
    );
    //clean the notifHistory of the user
    await cleanNotifHistory(notification.userId);

    await planifierAjouterDansQueue(notification);
  }
}

async function debugJobs() {
  const jobs = await agenda.jobs();

  console.log("\n🔍 Analyse détaillée des jobs:");
  jobs.forEach((job) => {
    console.log(`\nJob: ${job.attrs.name}`, {
      id: job.attrs._id,
      status: job.attrs.status,
      nextRunAt: job.attrs.nextRunAt,
      lastRunAt: job.attrs.lastRunAt,
      data: job.attrs.data,
    });
  });
}

/**
 * check a chaque 60s la notification qui est à 20 minutes d'etre envoyée
 * si elle est à 20 minutes, on l'envoie dans la queue
 */
agenda.define("sendNotificationToQueue", async (job) => {
  const { notification } = job.attrs.data;

  try {
    await AjouterDansQueue(notification, "publisher", "notification");
    console.log("\x1b[32mNotification envoyée dans la queue!\x1b[0m");

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

agenda.define("checkNewNotifications", async (job) => {
  console.log("\n🕒 Job de vérification démarré:", new Date().toISOString());
  await checkAndPlanifyNotifications();
  console.log("✅ Job de vérification terminé\n");
});

agenda.on("start", (job) => {
  console.log("🟢 job démarré:", job.attrs.name, new Date().toISOString());
});

agenda.on("complete", (job) => {
  console.log("🏁 Job terminé:", job.attrs.name, new Date().toISOString());
});

agenda.on("fail", (err, job) => {
  console.error("❌ Job échoué:", job.attrs.name, err);
});

async function startAgenda() {
  await agenda.start();

  await debugJobs();

  await agenda.cancel({});
  console.log("\n Nettoyages des jobs sendNotificationToQueue");

  await debugJobs();

  // 5. Planifier nouveau job
  const job = await agenda.every("30 seconds", "checkNewNotifications");
  console.log("⏰ Nouveau job planifié avec ID:", job.attrs._id);

  // 6. Vérifier tous les types de jobs
  const tousLesJobs = await agenda.jobs();
  console.log("📋 Détail des jobs planifiés:", {
    total: tousLesJobs.length,
    parType: tousLesJobs.reduce((acc, job) => {
      acc[job.attrs.name] = (acc[job.attrs.name] || 0) + 1;
      return acc;
    }, {}),
  });

  console.log("🚀 Agenda is working...");
}

export default startAgenda;
