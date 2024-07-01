const responses = {
    errors: {
        client: {
            notMatchingPasswords: {message: "Passwords do not match", code: 1},
            notMatchingEmails: {message: "Emails do not match", code: 2},
            alreadyExists: {message: "User with this email or phone number already exists", code: 3},
            missingFields: {message: "All fields are required", code: 4},
            invalidEmail: {message: "Invalid email address", code: 5},
            invalidPhone: {message: "Invalid phone number", code: 6},
            weakPassword: {message: "Password must be at least 8 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character", code: 7},
            accountCreationError: {message: "An error occurred while creating the account", code: 8},
        }
    },
    success: {
        accountCreated: {message: "Account successfully created", code: 9},
    },
    info: {
        welcome: {message: "Welcome to our service", code: 10},
    }
};


module.exports = responses