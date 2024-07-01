const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  email: { type: String },
  password: { type: String }
});

const Users = mongoose.model('users', usersSchema, 'users');

module.exports = Users;