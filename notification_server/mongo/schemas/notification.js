import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  event: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  status: { type: String, default: "recurring" },
  retryCount: { type: Number, default: 0 },
  notificationTimes: [{ type: String }],
  notificationDays: [{ type: String }],
  preferenceId: { type: Schema.Types.ObjectId, ref: "preferences" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model(
  "notifications",
  notificationSchema,
  "notifications"
);

export default Notification;
