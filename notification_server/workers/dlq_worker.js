import rabbitmq from "../config/rabbitmq.js";
import { saveFailedNotification } from "../mongo/interface/failed_notification.js";

async function startDLQWorker() {
  try {
    console.log("🏥 DLQ Worker démarré...");

    await rabbitmq.consumeMessages(
      "notification.dead.queue",
      async (message) => {
        try {
          const failedMessage = JSON.parse(message.content.toString());
          const headers = message.properties.headers;

          console.log("💀 Message mort reçu:", {
            message: failedMessage,
            retryCount: headers["x-retry-count"],
            firstError: headers["x-first-death-reason"],
            timestamp: headers.timestamp,
          });

          // Sauvegarder dans la base de données
          await saveFailedNotification({
            originalMessage: failedMessage,
            error: headers["x-first-death-reason"],
            retryCount: headers["x-retry-count"],
            diedAt: new Date(),
          });
        } catch (error) {
          console.error("Erreur traitement message DLQ:", error);
          // Ne pas rejeter le message pour éviter une boucle infinie
          channel.ack(message);
        }
      }
    );
  } catch (error) {
    console.error("Erreur dans le DLQ worker:", error);
    process.exit(1);
  }
}

export default startDLQWorker;
