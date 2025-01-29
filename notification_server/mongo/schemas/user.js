import mongoose from "mongoose";
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  firstName: { type: Schema.Types.String },
  lastName: { type: Schema.Types.String },
  phone: { type: Schema.Types.String },
  email: { type: Schema.Types.String },
  priceId: { type: Schema.Types.String },
  hasAccess: { type: Schema.Types.Boolean, default: false },
  password: { type: Schema.Types.String },
  preferencesId: { type: Schema.Types.ObjectId },
  accessToken: { type: Schema.Types.String },
  customerId: { type: Schema.Types.String },
  notifHistory: [{ type: Schema.Types.ObjectId, ref: "appartments" }],
  date: { type: Schema.Types.Date },
});

const Users = mongoose.model("users", usersSchema, "users");

export default Users;
