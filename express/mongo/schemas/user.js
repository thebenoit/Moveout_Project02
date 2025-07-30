import mongoose from "mongoose";
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  firstName: { type: Schema.Types.String },
  lastName: { type: Schema.Types.String },
  phone: { type: Schema.Types.String },
  email: { type: Schema.Types.String },
  priceId: { type: Schema.Types.String, required: false },
  //has access to premium plan
  hasAccess: { type: Schema.Types.Boolean, default: false },
  password: { type: Schema.Types.String },
  preferencesId: { type: Schema.Types.ObjectId },
  accessToken: { type: Schema.Types.String },
  customerId: { type: Schema.Types.String, required: false },
  notifHistory: [{ type: Schema.Types.String, required: false }],
  date: { type: Schema.Types.Date },
  // Google Auth fields
  googleId: { type: Schema.Types.String, required: false },
  googlePicture: { type: Schema.Types.String, required: false },
  isGoogleUser: { type: Schema.Types.Boolean, default: false },
  isVerified: { type: Schema.Types.Boolean, default: false },
});

const Users = mongoose.model("users", usersSchema, "users");

export default Users;
