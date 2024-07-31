const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logsSchema = new Schema({
    message: { type: Schema.Types.Mixed },
    error: { type: Schema.Types.Mixed },
    date: { type: Schema.Types.Date }
});

const Logs = mongoose.model('logs', logsSchema, 'logs');

module.exports = Logs;