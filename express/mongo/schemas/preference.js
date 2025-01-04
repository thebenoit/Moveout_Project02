import mongoose from "mongoose";
const Schema = mongoose.Schema;

const preferencesSchema = new Schema({
  numberOfBedrooms: { type: Schema.Types.Array, required: false },
  budget: {
    minValue: { type: Schema.Types.Number, required: false },
    maxValue: { type: Schema.Types.Number, required: false },
  },
  locationPreferences: { type: Schema.Types.Array, required: false },
  age: { type: Schema.Types.String, required: false },
  gender: { type: Schema.Types.String, required: false },
  occupation: { type: Schema.Types.String, required: false },
  // salary: { type: Schema.Types.Number, required: false },
  reference: { type: Schema.Types.String, required: false },
  addOnService: { type: Schema.Types.String, required: false },
  notificationTimes: { type: [Schema.Types.Array], required: false }, // Liste de dates durant la journée

  // preferences
  //priceRange: { type: Schema.Types.String, required: false },
  //moveInDate: { type: Schema.Types.Date, required: false },
  //leaseTerm: { type: Schema.Types.String, enum: ['Short-term', 'Long-term'], required: false },

  //numberOfBathrooms: { type: Schema.Types.Number, required: false },
  //apartmentType: { type: Schema.Types.String, required: false },
  //furnished: { type: Schema.Types.Boolean, required: false },
  //petFriendly: { type: Schema.Types.Boolean, required: false },
  //parking: { type: Schema.Types.Boolean, required: false },
  //proximityToPublicTransport: { type: Schema.Types.Boolean, required: false },
  //amenitiesPreferences: { type: Schema.Types.String, required: false }, - to see, how to implemnent
  //buildingType: { type: Schema.Types.String, required: false },
  //smokingPreferences: { type: Schema.Types.String, enum: ['Smoking', 'Non-smoking'], required: false },
  //roommatePreferences: { type: Schema.Types.Boolean }, // with or without roomates
  // proximityToWorkOrSchool: { type: Schema.Types.String, required: false },

  // personal info
  //dob: { type: Schema.Types.Date, required: false },

  //monthlyIncome: { type: Schema.Types.Number, required: false },
  //creditScore: { type: Schema.Types.Number, required: false },
  // currentLivingSituation: { type: Schema.Types.String, required: false },
  //reasonForMoving: { type: Schema.Types.String, required: false },
  //proofOfIncome: { type: Schema.Types.String, required: false },

  // others (maybe for later ?)

  //coSignersRequired: { type: Schema.Types.Boolean, required: false },
  //preferredFloorLevel: { type: Schema.Types.String, required: false },
  // Path to proof of income document
  //preferredUtilitiesIncluded: { type: Schema.Types.[String], required: false },
  //idVerification: { type: Schema.Types.String },  // Path to ID document
  //preferredContactMethod: { type: Schema.Types.String, enum: ['Email', 'Phone', 'SMS'], required: false },
  //frequencyOfUpdates: { type: Schema.Types.String, enum: ['Real-time', 'Daily', 'Weekly'], required: false },
  //notificationPreferences: { type: Schema.Types.[String], required: false },
});

const Preferences = mongoose.model(
  "preferences",
  preferencesSchema,
  "preferences"
);

export default Preferences;
