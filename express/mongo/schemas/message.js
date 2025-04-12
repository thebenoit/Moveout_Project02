

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sessionId: { type: String },
  content: { type: String },
  senderId: { type: String },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'image', 'video', 'audio', 'file'] },
  status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'] },
});

const Messages = mongoose.model(
  "messages",  // Nom du modèle
  messageSchema,        // Définition du schéma
  "messages"            // Nom de la collection
);

export default Messages;
