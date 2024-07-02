const Users = require("../schemas/user")
const responses = require("../../responses")
const bcrypt = require('bcryptjs');
const validator = require('validator');

/**
 * function qui permet de get tout les appart de la base de données
 * et le mettre dans un varibale
 * @returns 
 */

async function emailToUserId(email){
    const user = await Users.find({});
}

async function phoneToUserId(phone){

}


// async function createAccount(firstName, lastName, phone, email, password, confirmPassword) {
//     try {
//         // Run checks
//         if (password !== confirmPassword) {
//             return { error: responses.errors.client.notMatchingPasswords };
//         }

//         // Check if the user already exists
//         const existingUser = await Users.findOne({ email: email });
//         if (existingUser) {
//             return { error: responses.errors.client.alreadyExists };
//         }

//         // Check if other required fields are not empty
//         if (!firstName || !lastName || !phone || !email || !password) {
//             return { error: responses.errors.client.missingFields };
//         }

//         // Hash password
//         const hashPassword = await bcrypt.hash(password, 10);


//         // Create user
//         const newUser = new Users({
//             firstName: firstName,
//             lastName: lastName,
//             phone: phone,
//             email: email,
//             password: hashPassword,
//         });

//         // Insert the user into the database
//         // const result = await Users.insertOne(newUser);
//         const savedUser = await newUser.save();
//         const user_id = savedUser._id;

//         // Return user_id
//         return user_id
//     } catch (error) {
//         console.error(error);
//         return { error: responses.errors.client.accountCreationError };
//     } finally {
//         // Close the connection to the MongoDB cluster
//         // await client.close();
//     }
// }

function isStrongPassword(password) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    return passwordRegex.test(password);
}

async function createAccount(firstName, lastName, phone, email, confirmEmail, password, confirmPassword) {
    try {
        // Run checks
        
        if (!isStrongPassword(password)) {
            return { error: responses.errors.client.weakPassword };
        }

        if (password !== confirmPassword) {
            return { error: responses.errors.client.notMatchingPasswords };
        }
        
        if (!validator.isEmail(email)) {
            return { error: responses.errors.client.invalidEmail };
        }

        if (email !== confirmEmail) {
            return { error: messages.errors.client.notMatchingEmails };
        }

        if (!validator.isMobilePhone(phone.toString(), 'en-US')) {
            return { error: responses.errors.client.invalidPhone };
        }

        // Check if the user already exists by email or phone
        const existingUser = await Users.findOne({ $or: [{ email: email }, { phone: phone }] });
        if (existingUser) {
            return { error: responses.errors.client.alreadyExists };
        }

        // Check if other required fields are not empty
        if (!firstName || !lastName || !phone || !email || !confirmEmail || !password) {
            return { error: messages.errors.client.missingFields };
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new Users({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: hashPassword,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Return success message with user_id
        return { message: responses.success.accountCreated, user_id: savedUser._id.toString() };
    } catch (error) {
        console.error(error);
        return { error: responses.errors.client.accountCreationError };
    }
}

async function login(identifier, password) {
    try {
        let user;

        // Check if identifier is an email or phone number
        if (validator.isEmail(identifier)) {
            user = await Users.findOne({ email: identifier });
        } else if (validator.isMobilePhone(identifier, 'en-CA')) {
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

        return { message: responses.success.accountCreated, userId: user._id.toString() };
    } catch (error) {
        console.error(error);
        return { error: responses.errors.client.loginError };
    }
}


module.exports = {
    createAccount,
    login
}