<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ChatInterface from "../components/ChatInterface.vue";
import utils from "../utils/utils.js";

const router = useRouter();
const showChat = ref(false);
const showLoginModal = ref(false);

const searchQuery = ref("");
const identifier = ref("");
const password = ref("");
const messageErreur = ref("");
const messages = ref([]);
const loading = ref(false);



const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  const userMsg = { role: "user", content: searchQuery.value.trim() };
  loading.value = true;
  messages.value = [userMsg];
  showChat.value = true;
};

const addFilter = (filter) => {
  if (!searchQuery.value.includes(filter)) {
    searchQuery.value += (searchQuery.value ? " " : "") + filter;
  }
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const goToSignup = () => {
  router.push({ path: "/signup" });
};

async function login() {
  showChat.value = false;
  console.log("login frontend...");
  try {
    let result = await utils.post("api/client/login", {
      identifier: identifier.value,
      password: password.value,
    });

    if (result.error) {
      console.log("resultError; ", result.error.message);
      messageErreur.value = result.error.message;
    }

    console.log("result lors du login frontend: ", result);

    if (result.token) {
      //utils.setToken(result.token);
      showLoginModal.value = false;
      // Réessayer la requête chat après connexion
      handleSearch();
    }
  } catch (error) {
    console.log("erreur lors du login: ", error);
    messageErreur.value = "Erreur de connexion. Veuillez réessayer.";
  }
}
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    <!-- Main Content -->
    <main
      class="flex flex-col items-center justify-center min-h-screen px-6 pt-24"
    >
      <!-- Main Heading -->
      <h1
        v-if="!showChat"
        class="text-4xl font-bold text-black text-center mb-4"
      >
        Que recherchez-vous ?
      </h1>

      <!-- Subtitle -->
      <p v-if="!showChat" class="text-gray-600 text-center mb-8 max-w-2xl">
        Décrivez votre appartement idéal et laissez l'IA vous aider à le
        trouver.
      </p>

      <!-- Search Input -->
      <div v-if="!showChat" class="w-full max-w-2xl mb-8">
        <div class="relative">
          <textarea
            v-model="searchQuery"
            @keydown.enter.prevent="handleSearch"
            placeholder="Décrivez votre appartement idéal..."
            class="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md"
          ></textarea>
          <div class="absolute bottom-3 right-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="text-gray-400"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Chat Interface -->
      <div v-if="showChat" class="w-full max-w-6xl h-screen">
        <ChatInterface
          :messages="messages"
          :loading="loading"
          @auth-error="showLoginModal = true"
        />
      </div>

      <!-- Filter Buttons -->
      <div v-if="!showChat" class="w-full max-w-2xl">
        <!-- First Row -->
        <div class="flex flex-wrap gap-3 mb-4 justify-center">
          <button
            @click="addFilter('+ 2 chambres')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + 2 chambres
          </button>
          <button
            @click="addFilter('+ balcon')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + balcon
          </button>
          <button
            @click="addFilter('+ proche métro')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + proche métro
          </button>
        </div>

        <!-- Second Row -->
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            @click="addFilter('+ 800€ max')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + 800€ max
          </button>
          <button
            @click="addFilter('+ 50m²')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + 50m²
          </button>
          <button
            @click="addFilter('+ ascenseur')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + ascenseur
          </button>
          <button
            @click="addFilter('+ parking')"
            class="px-4 py-2 bg-gray-100 rounded-full text-base text-black hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            + parking
          </button>
        </div>
      </div>
    </main>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay" @click="closeLoginModal">
      <div class="modal-content" @click.stop>
        <div class="login-card">
          <!-- Error Message -->
          <p v-if="messageErreur" class="error-message">{{ messageErreur }}</p>

          <!-- Header -->
          <div class="login-header">
            <h1 class="login-title">Connexion requise</h1>
            <p class="login-subtitle">
              Connectez-vous pour utiliser l'IA Moveout
            </p>
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
            <a @click="goToSignup" class="signup-link">Créer un compte</a>
          </p>

          <!-- Close Button -->
          <button @click="closeLoginModal" class="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better typography */
.font-sans {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Smooth transitions */
.transition-colors {
  transition: all 0.2s ease-in-out;
}

/* Focus styles for accessibility */
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Floating animation for filter buttons */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* Apply floating animation to filter buttons */
button[class*="px-4 py-2 bg-gray-100"] {
  animation: float 3s ease-in-out infinite;
}

/* Stagger the animation for each button */
button[class*="px-4 py-2 bg-gray-100"]:nth-child(1) {
  animation-delay: 0s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(2) {
  animation-delay: 0.5s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(3) {
  animation-delay: 1s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(4) {
  animation-delay: 1.5s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(5) {
  animation-delay: 2s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(6) {
  animation-delay: 2.5s;
}
button[class*="px-4 py-2 bg-gray-100"]:nth-child(7) {
  animation-delay: 3s;
}

/* Responsive design */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
  }

  .max-w-2xl {
    max-width: 100%;
  }

  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Mobile content adjustments */
  main {
    padding: 1rem;
    padding-top: 6rem;
  }

  /* Mobile search area */
  textarea {
    height: 6rem;
    font-size: 0.875rem;
  }

  /* Mobile filter buttons */
  .flex-wrap {
    gap: 0.5rem;
  }

  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .text-base {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .text-4xl {
    font-size: 1.75rem;
  }

  main {
    padding: 0.75rem;
    padding-top: 5rem;
  }

  textarea {
    height: 5rem;
    font-size: 0.8rem;
  }

  .mb-8 {
    margin-bottom: 1.5rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  max-width: 420px;
  width: 90%;
  max-height: 75vh;
  overflow-y: auto;
  margin: auto;
  position: relative;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
}

/* Form Header */
.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-title {
  font-size: 1.75rem;
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

/* Close Button */
.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

/* Modal Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .form-options {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .login-subtitle {
    font-size: 0.9rem;
  }

  .form-options {
    gap: 0.5rem;
  }
}

.modal-content {
  animation: fadeInUp 0.3s ease-out;
}
</style>
