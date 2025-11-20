import mongoose from "mongoose";
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  content: { type: Schema.Types.String, required: true },
  authorEmail: { type: Schema.Types.String, required: false }, // Optionnel (peut être anonyme)
  likes: { type: Schema.Types.Number, default: 0 },
  likedBy: [{ type: Schema.Types.String }], // Array d'emails/IPs qui ont liké
  createdAt: { type: Schema.Types.Date, default: Date.now },
  status: {
    type: Schema.Types.String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Feedback = mongoose.model("feedback", feedbackSchema, "feedback");

export default Feedback;
