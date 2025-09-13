import Messages from "../schemas/message.js";
import Conversation from "../schemas/conversation.js";



const createMessage = async (messageData) => {
  try {
    const message = await Messages.create(messageData);
    return message;
  } catch (error) {
    console.error("Erreur lors de la création du message:", error);
  }
}

const createConversation = async (conversationData) => {
  try {
    const conversation = await Conversation.create(conversationData);
    return conversation;
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error);
  }
}

const getConversation = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    return conversation;
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error);
  }
}
const ajouterDansConversation = async (conversationId, messageId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    conversation.messages.push(messageId);
    await conversation.save();
  } catch (error) {
    console.error("Erreur lors de l'ajout du message dans la conversation:", error);
  }
}
// Vérifie si la session existe
const sessionExists = async (sessionId) => {
  const conversation = await Conversation.findOne({ sessionId: sessionId });
  return conversation !== null;
}

/**
 * Traite un message et l'ajoute à une conversation existante ou en crée une nouvelle
 * @param {Object} messageData - Les données du message à traiter
 * @returns {Object} Le message créé
 */
const traiterMessage = async (messageData) => {
  try {
    // Vérifie si la session existe
    if(await sessionExists(messageData.sessionId)){
      // Récupère la conversation
      const conversation = await getConversation(messageData.sessionId);
      // Crée un message
      const message = await createMessage(messageData);
      // Ajoute le message dans la conversation
      await ajouterDansConversation(conversation._id, message._id);
      return message;
    } else {
      // Crée une conversation
      const conversation = await createConversation(messageData.sessionId);
      // Crée un message
      const message = await createMessage(messageData);
      // Ajoute le message dans la conversation
      await ajouterDansConversation(conversation._id, message._id);
      return message;
    }
  } catch (error) {
    console.error("Erreur lors du traitement du message:", error);
    throw error;
  }
}



export default {
  createMessage,
  createConversation,
  getConversation,
  ajouterDansConversation,
  sessionExists
};


