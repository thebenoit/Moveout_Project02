import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import Users from "../schemas/user.js";
import Leads from "../schemas/leads.js";
import Preferences from "../schemas/preference.js";
import responses from "../../responses.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import createLog from "../interface/logs.js";
import jwtInterface from '../interface/JWT.js';


/**
 * function qui permet de get tout les appart de la base de données
 * et le mettre dans un varibale
 * @returns
 */

const emailToUserId = async (email) => {
  const user = await Users.find({});
};

const phoneToUserId = async (phone) => {};

const isStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  return passwordRegex.test(password);
};

// async function createAccount(firstName, lastName, phone, email, confirmEmail, password, confirmPassword) {
 const createAccount = async (
  firstName,
  lastName,
  phone,
  email,
  password
) => {
  try {
    // Run checks

    if (!isStrongPassword(password)) {
      return { error: responses.errors.client.weakPassword };
    }

    // if (password !== confirmPassword) {
    //     return { error: responses.errors.client.notMatchingPasswords };
    // }

    if (!validator.isEmail(email)) {
      return { error: responses.errors.client.invalidEmail };
    }

    // if (email !== confirmEmail) {
    //     return { error: messages.errors.client.notMatchingEmails };
    // }

    if (!validator.isMobilePhone(phone.toString(), "en-US")) {
      return { error: responses.errors.client.invalidPhone };
    }

    // Check if the user already exists by email or phone
    const existingUser = await Users.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (existingUser) {
      return { error: responses.errors.client.alreadyExists };
    }

    // Check if other required fields are not empty
    // if (!firstName || !lastName || !phone || !email || !confirmEmail || !password) {
    if (!firstName || !lastName || !phone || !email || !password) {
      return { error: messages.errors.client.missingFields };
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create Preferences
    const newPreferences = new Preferences({});

    // Save the user to the database
    const savedPreferences = await newPreferences.save();

    // Create user
    const newUser = new Users({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: hashPassword,
      preferencesId: savedPreferences._id.toString(),
      accessToken: "",
      date: Date.now(),
    });

    newUser.accessToken = await jwtInterface.generateJwt(newUser._id, newUser.preferencesId);

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return success message with user_id
    return {
      message: responses.success.accountCreated,
      user_id: savedUser._id.toString(),
      userPhone: savedUser.phone,
      preferenceId: savedUser.preferencesId.toString(),
      accessToken: savedUser.accessToken,
    };
  } catch (error) {
    console.error('Erreur lors de la création du compte: ',error);
    return { error: responses.errors.client.accountCreationError };
  }
};

const createPreference = async (
  idPreference,
  bedrooms,
  maxValue,
  minValue,
  locationPreference,
  age,
  sex,
  occupation,
  reference,
  addOnService
) => {
  //find the id preference
  try {
    // Vérification des champs manquants
    switch (true) {
      case !bedrooms || bedrooms.length === 0:
        return { error: "La case Nombre de chambres est manquante." };
      case !locationPreference || locationPreference.length === 0:
        return { error: "La case Préférence de localisation est manquante." };
      case !age || age.trim() === "":
        return { error: "La case Âge est manquante." };
      case !sex || sex.trim() === "":
        return { error: "La case Genre est manquante." };
      case !occupation || occupation.trim() === "":
        return { error: "La case Occupation est manquante." };
      /**case !reference || reference.trim() === "":
        return { error: "La case reference est manquante." };*/
      case !addOnService || addOnService.trim() === "":
        return { error: "La case Service supplémentaire est manquante." };
    }

    const preference = await Preferences.findById(idPreference);

    if (!preference) {
      throw new Error("Preference not found");
    }

    // Update the fields
    preference.numberOfBedrooms = bedrooms;
    preference.budget.maxValue = maxValue;
    preference.budget.minValue = minValue;
    preference.locationPreferences = locationPreference;
    preference.age = age;
    preference.gender = sex;
    preference.occupation = occupation;
    preference.reference = reference;
    preference.addOnService = addOnService;

    // Save the updated preference
    await preference.save();

    console.log("Preference updated successfully:", preference);
    return { success: true, preference };
  } catch (error) {
    console.error("Error updating preference:", error);
    throw error;
  }
};

const login = async (identifier, password) => {
  try {
    let user;

    // Check if identifier is an email or phone number
    if (validator.isEmail(identifier)) {
      user = await Users.findOne({ email: identifier });
    } else if (validator.isMobilePhone(identifier, "en-CA")) {
      user = await Users.findOne({ phone: identifier });
    } else {
      return { error: responses.errors.client.invalidIdentifier };
    }

    if (!user) {
      return { error: responses.errors.client.userNotFound };
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: responses.errors.client.invalidPassword };
    }
    //si user.accessToken est vide créer un accesToken
    if (!user.accessToken) {
      console.log("accès token créer car vide");

      //create Access Token
      const { error, token } = await generateJwt(user.id, user.preferencesId);
      console.log("uerA: ", user.accessToken);
      //assigne access token
      user.accessToken = token;

      if (!token) {
        return {
          error: `impossible de créer un accès de token veuillez réessayer plus tard ${error}`,
        };
      }
    } else {
      console.log("accès token pas créer car pas vide");
    }

    //save dans la bd
    await user.save();

    return {
      message: responses.success.accountCreated,
      userId: user._id.toString(),
    };
  } catch (error) {
    console.error(error);
    return { error: responses.errors.client.loginError };
  }
};

const logout = async (req, res) => {
  try {
    const { username } = req.decoded;

    let user = await Users.findOne({ username });

    user.accessToken = "";

    await user.save();

    return { message: responses.success.accountLogout };
  } catch (error) {
    console.log("erreur lors du logout: ", error);

    return { error: responses.errors.client.logoutError };
  }
};

const createLead = async (firstName, lastName, phone, email) => {
  try {
    if (!validator.isEmail(email)) {
      // console.log(email, responses.errors.client.invalidEmail)
      createLog({ email: email }, responses.errors.client.invalidEmail);
      return { error: responses.errors.client.invalidEmail };
    }

    if (!validator.isMobilePhone(phone.toString(), "en-US")) {
      // console.log(phone, responses.errors.client.invalidPhone)
      createLog({ phone: phone }, responses.errors.client.invalidPhone);
      return { error: responses.errors.client.invalidPhone };
    }

    // Check if the user already exists by email or phone
    const existingLead = await Leads.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (existingLead) {
      // console.log(responses.errors.client.alreadyExists)
      createLog(
        { email: email, phone: phone },
        responses.errors.client.alreadyExists
      );
      return { error: responses.errors.client.alreadyExists };
    }

    if (!firstName || !lastName || !phone || !email) {
      // console.log(messages.errors.client.missingFields)
      createLog(
        {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
        },
        responses.errors.client.missingFields
      );
      return { error: responses.errors.client.missingFields };
    }

    // Create user
    const newLead = new Leads({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      date: Date.now(),
    });

    // Save the user to the database
    const savedLead = await newLead.save();

    return {
      message: responses.success.accountCreated,
      lead_id: savedLead._id.toString(),
    };
  } catch (error) {
    console.error(error);
    return { error: responses.errors.client.loginError };
  }
};

export default {
  createAccount,
  login,
  logout,
  createLead,
  createPreference,
};
