const mongoose = require("mongoose");

require("dotenv/config");

const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
  .connect(process.env.DB_URI, dbOptions)
  .then(() => console.log(mongoose.modelNames(), "DB Connected"))
  .catch((err) => console.log(err));

module.exports = mongoose