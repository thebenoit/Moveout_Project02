const errors = {
    client: {
        weakPassword: 'Le mot de passe est trop faible.',
        notMatchingPasswords: 'Les mots de passe ne correspondent pas.',
        invalidEmail: 'L\'adresse e-mail fournie est invalide.',
        notMatchingEmails: 'Les adresses e-mail ne correspondent pas.',
        invalidPhone: 'Le numéro de téléphone fourni est invalide.',
        alreadyExists: 'Un compte avec cet e-mail ou ce numéro de téléphone existe déjà.',
        missingFields: 'Tous les champs sont requis.',
        accountCreationError: 'Une erreur est survenue lors de la création du compte.',
        invalidIdentifier: 'L\'identifiant fourni est invalide.',
        userNotFound: 'Aucun utilisateur trouvé avec cet identifiant.',
        invalidPassword: 'Le mot de passe est incorrect.',
        loginError: 'Une erreur est survenue lors de la connexion.'
    }
};

const success = {
    accountCreated: 'Compte créé avec succès.'
};

module.exports = { errors, success };
