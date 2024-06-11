const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appartmentSchema = new Schema({
  title: { type: String },
  price: { type: Number },
  city: { type: String },
  bedrooms: { type: Number },
  url: { type: String },
  img: { type: String },
  date_scraped: { type: Date },
});

const Appartments = mongoose.model(
  "Appartments",
   appartmentSchema,
  "appartments"
);

// const mySchemas = { Appartments: Appartments }; // Ici, vous devez passer les objets modèles

module.exports = Appartments;


/** 
* Paste one or more documents here
*/
