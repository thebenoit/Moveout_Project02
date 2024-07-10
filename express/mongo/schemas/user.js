const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  firstName: { type: Schema.Types.String },
  lastName: { type: Schema.Types.String },
  phone: { type: Schema.Types.String },
  email: { type: Schema.Types.String },
  password: { type: Schema.Types.String },
  preferencesId: { type: Schema.Types.ObjectId },
});

const Users = mongoose.model('users', usersSchema, 'users');

module.exports = Users;