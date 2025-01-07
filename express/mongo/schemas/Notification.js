import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  event: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  notificationTimes: [{ type: String }],
  notificationDays: [{ type: String }], 
  preferenceId: { type: Schema.Types.ObjectId, ref: 'preferences' }
});

const Notification = mongoose.model('notifications', notificationSchema, 'notifications');

export default Notification;
