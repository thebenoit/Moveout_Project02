const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facebookSchema = new Schema({
  title: { type: String },
  price: { type: Number },
  city: { type: String },
  bedrooms: { type: Number },
  url: { type: String },
  img: { type: String },
  date_scraped: { type: Date },
});

const Facebook = mongoose.model('facebook', facebookSchema, 'facebook');

module.exports = Facebook;


/** 
* Paste one or more documents here
*/
