const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leadsSchema = new Schema({
  firstName: { type: Schema.Types.String },
  lastName: { type: Schema.Types.String },
  phone: { type: Schema.Types.String },
  email: { type: Schema.Types.String },
});

const Leads = mongoose.model('leads', leadsSchema, 'leads');

module.exports = Leads;