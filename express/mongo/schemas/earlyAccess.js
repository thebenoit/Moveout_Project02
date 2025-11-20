import mongoose from "mongoose";
const Schema = mongoose.Schema;

const earlyAccessSchema = new Schema({
  firstName: { type: Schema.Types.String },
  lastName: { type: Schema.Types.String },
  email: { type: Schema.Types.String },
  phone: { type: Schema.Types.String },
  status: { 
    type: Schema.Types.String, 
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  stripeSessionId: { type: Schema.Types.String, required: false },
  stripePaymentId: { type: Schema.Types.String, required: false },
  paidAt: { type: Schema.Types.Date, required: false },
  createdAt: { type: Schema.Types.Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, required: false } // Optionnel: si on crée un compte user après
});

const EarlyAccess = mongoose.model('earlyAccess', earlyAccessSchema, 'earlyAccess');

export default EarlyAccess;