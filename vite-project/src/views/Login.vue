<script setup lang="ts">
import { ref } from "vue";
import utils from "../utils/utils";
import { useRouter } from "vue-router";

const identifier = ref("");
const password = ref("");
const messageErreur = ref("");

const router = useRouter();

async function login() {
  try {
    let result = await utils.post("api/client/login", {
      identifier: identifier.value,
      password: password.value,
    });
    //si il y a une erreur rentre dans la variable  pour afficher à l'user
    if (result.error) {
      console.log("resultError; ", result.error.message);
      messageErreur.value = result.error.message;
    }
   //si il y a un token
    if (result.token) {
      //stocker le token dans le sessionStorage
      utils.setToken(result.token);
      router.push({
        path: "/",
        query: { refresh: Date.now() },
      });
    }
  } catch (error) {
    console.log("erreur lors du login: ", error);
  }
}

const versSignup = () => {
  router.push({ path: "/signup" });
};
</script>

<style>
/* Page Container */
.page-container {
  min-height: 100vh;
  background: #2d3748;
  display: flex;
  flex-direction: column;
}

/* Top Navigation Bar */
.top-navbar {
  background: #e2e8f0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
  text-decoration: none;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.navbar-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.navbar-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.navbar-btn-outline {
  background-color: white;
  color: black;
  border: 1px solid #d1d5db;
}

.navbar-btn-outline:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.navbar-btn-solid {
  background-color: black;
  color: white;
}

.navbar-btn-solid:hover {
  background-color: #374151;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-card {
  background: white;
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  position: relative;
}

/* Form Header */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  color: #1a1a1a;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Remember Me and Forgot Password */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #1a1a1a;
}

.forgot-password {
  font-size: 0.9rem;
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Button Styles */
.login-button {
  width: 100%;
  padding: 0.875rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.login-button:hover {
  background: #333;
  transform: translateY(-1px);
}

/* Separator */
.separator {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.separator::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
  transform: translateY(-50%);
}

.separator span {
  background: white;
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

/* Google Button */
.google-button {
  width: 100%;
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
}

.google-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Signup Prompt */
.signup-prompt {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.signup-link {
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
  cursor: pointer;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Error Message */
.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* Lightning Bolt Icon */
.lightning-icon {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 60px;
  height: 60px;
  background: #fbbf24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
  z-index: 10;
}

.lightning-svg {
  width: 30px;
  height: 30px;
  fill: #1a1a1a;
}

/* Responsive */
@media (max-width: 768px) {
  .top-navbar {
    padding: 0.75rem 1rem;
  }

  .navbar-brand {
    font-size: 1.125rem;
  }

  .logo-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .navbar-buttons {
    gap: 0.5rem;
  }

  .navbar-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .main-content {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
    margin: 0;
  }

  .login-title {
    font-size: 1.75rem;
  }

  /* Garder les options côte à côte même sur mobile */
  .form-options {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .top-navbar {
    padding: 0.5rem 1rem;
  }

  .navbar-brand {
    font-size: 1rem;
  }

  .logo-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .navbar-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .login-card {
    padding: 1.5rem 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .login-subtitle {
    font-size: 0.9rem;
  }

  /* Réduire l'espacement sur très petit écran */
  .form-options {
    gap: 0.5rem;
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>

<template>
  <div class="page-container">
    <!-- Top Navigation Bar -->
    <nav class="top-navbar">
      <a href="/" class="navbar-brand">
        <img src="/Moveout_Logo2.svg" alt="Moveout Logo" class="logo-icon" />
        <span>Moveout</span>
      </a>
      <div class="navbar-buttons">
        <button class="navbar-btn navbar-btn-outline">Se connecter</button>
        <button @click="versSignup" class="navbar-btn navbar-btn-solid">
          S'inscrire
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <div class="login-card">
        <!-- Error Message -->
        <p v-if="messageErreur" class="error-message">{{ messageErreur }}</p>

        <!-- Header -->
        <div class="login-header">
          <h1 class="login-title">Se connecter</h1>
          <p class="login-subtitle">Accédez à votre compte MoveoutAI</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="login">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-input"
              placeholder="votre@email.com"
              v-model="identifier"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input
              type="password"
              class="form-input"
              placeholder="••••••••"
              v-model="password"
              required
            />
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>
            <a href="#" class="forgot-password">Mot de passe oublié ?</a>
          </div>

          <button type="submit" class="login-button">Se connecter</button>
        </form>

        <!-- Separator -->
        <div class="separator">
          <span>OU</span>
        </div>

        <!-- Google Sign-In Button -->
        <button class="google-button">
          <div class="google-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          Se connecter avec Google
        </button>

        <!-- Signup Prompt -->
        <p class="signup-prompt">
          Pas encore de compte ?
          <a @click="versSignup" class="signup-link">Créer un compte</a>
        </p>
      </div>
    </div>
  </div>
</template>
