const responses = {
    errors: {
        client: {
            notMatchingPasswords: {message: "Les mots de passe ne correspondent pas", code: 1},
            notMatchingEmails: {message: "Les e-mails ne correspondent pas", code: 2},
            alreadyExists: {message: "Un utilisateur avec cet e-mail ou ce numéro de téléphone existe déjà", code: 3},
            missingFields: {message: "Tous les champs sont requis", code: 4},
            invalidEmail: {message: "Adresse e-mail invalide", code: 5},
            invalidPhone: {message: "Numéro de téléphone invalide", code: 6},
            weakPassword: {message: "Le mot de passe doit comporter au moins 8 caractères, contenir au moins un chiffre, une lettre majuscule, une lettre minuscule et un caractère spécial", code: 7},
            accountCreationError: {message: "Une erreur est survenue lors de la création du compte", code: 8},
            invalidIdentifier: {message: "Format d'e-mail ou de numéro de téléphone invalide", code: 9},
            userNotFound: {message: "Utilisateur non trouvé", code: 10},
            invalidPassword: {message: "Mot de passe invalide", code: 11},
            loginError: {message: "Une erreur est survenue lors de la connexion", code: 12},
            logoutError: {message: 'Une erreur est survenu lors de la deconnexion', code: 13}
        }
    },
    success: {
        accountCreated: {message: "Compte créé avec succès", code: 14},
        loginSuccessful: {message: "Connexion réussie", code: 15},
        accountLogout: {message: 'Compte déconnecté avec succès', code: 16}
    },
    info: {
        welcome: {message: "Bienvenue dans notre service", code: 17},
    }
};

export default responses;
