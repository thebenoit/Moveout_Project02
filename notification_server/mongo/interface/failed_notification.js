import FailedNotification from "../schemas/failed_notifications.js";

async function saveFailedNotification(data){
    try {
        const failedNotif = new FailedNotification({
            originalMessage: data.originalMessage,
            error: data.error,
            retryCount: data.retryCount,
            diedAt: data.diedAt,
            status: "failed"
        })
        await failedNotif.save();
        console.log("✅ Notification échouée sauvegardée");
    }catch(error){
        console.error("❌ Erreur sauvegarde notification échouée:", error);
        throw error;
    }
}

export { saveFailedNotification };
