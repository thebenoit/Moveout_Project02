import mongoose from "mongoose";
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  sessionId: { type: String },
  createdAt: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

const Conversation = mongoose.model(
  "Conversations",
  conversationSchema,
  "conversations"
);

export default Conversation;