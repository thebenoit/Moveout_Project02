<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import demoVideo from "@/assets/videos/Demo_Video.mov";

const router = useRouter();

// Stats Early Access
const stats = ref({
  totalSignups: 0,
  paidCount: 0,
  spotsRemaining: 200,
  maxSpots: 200,
});
const loadingStats = ref(true);
const errorStats = ref(null);

// Formulaire d'inscription
const showSignupForm = ref(false);
const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});
const submitting = ref(false);
const formError = ref(null);

// Récupérer les stats Early Access
async function fetchStats() {
  try {
    loadingStats.value = true;
    errorStats.value = null;
    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}/api/early-access/stats`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des stats");
    }

    const data = await response.json();
    if (data.success && data.stats) {
      stats.value = data.stats;
    }
  } catch (error) {
    console.error("Erreur stats:", error);
    errorStats.value = "Impossible de charger les statistiques";
  } finally {
    loadingStats.value = false;
  }
}

// Soumettre le formulaire d'inscription
async function handleSignup() {
  if (
    !formData.value.firstName ||
    !formData.value.lastName ||
    !formData.value.email ||
    !formData.value.phone
  ) {
    formError.value = "Tous les champs sont requis";
    return;
  }

  try {
    submitting.value = true;
    formError.value = null;

    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}/api/early-access/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.value),
      }
    );

    const data = await response.json();

    if (data.error) {
      formError.value = data.error.message || "Erreur lors de l'inscription";
      return;
    }

    // Si succès, créer la session Stripe
    await createCheckoutSession();
  } catch (error) {
    console.error("Erreur inscription:", error);
    formError.value = "Erreur lors de l'inscription. Veuillez réessayer.";
  } finally {
    submitting.value = false;
  }
}

// Créer la session Stripe Checkout
async function createCheckoutSession() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}/api/early-access/checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.value.email }),
      }
    );

    const data = await response.json();

    if (data.error) {
      formError.value =
        data.error.message ||
        "Erreur lors de la création de la session de paiement";
      return;
    }

    // Rediriger vers Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error("Erreur checkout:", error);
    formError.value = "Erreur lors de la création de la session de paiement";
  }
}

// Ouvrir le formulaire
function openSignupForm() {
  showSignupForm.value = true;
}

// Fermer le formulaire
function closeSignupForm() {
  showSignupForm.value = false;
  formError.value = null;
}

// Polling pour mettre à jour les stats toutes les 30 secondes
let statsInterval = null;

onMounted(() => {
  fetchStats();
  // Mettre à jour les stats toutes les 30 secondes
  statsInterval = setInterval(fetchStats, 30000);
});

onUnmounted(() => {
  if (statsInterval) {
    clearInterval(statsInterval);
  }
});
</script>

<template>
  <div class="early-access-page min-h-screen bg-white">
    <!-- Header Section -->
    <section class="header-section">
      <div class="container">
        <div class="header-content">
          <h1 class="headline">Your unfair advantage in apartment hunting.</h1>
          <!-- CTA Button -->
          <button
            @click="openSignupForm"
            :disabled="stats.spotsRemaining <= 0"
            class="cta-button-main"
          >
            <span v-if="stats.spotsRemaining <= 0">Full</span>
            <span v-else>Reserve my spot</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="demo-section">
      <div class="container">
        <div class="demo-content">
          <div class="demo-visual">
            <video
              class="demo-video"
              :src="demoVideo"
              autoplay
              loop
              muted
              playsinline
            >
              Votre navigateur ne supporte pas la vidéo.
            </video>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats & CTA Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-content">
          <!-- Compteur de spots -->
          <div class="spots-counter">
            <div v-if="loadingStats" class="loading-spots">Chargement...</div>
            <div v-else-if="errorStats" class="error-spots">
              {{ errorStats }}
            </div>
            <div v-else class="spots-info">
              <span class="spots-number">{{ stats.spotsRemaining }}</span>
              <span class="spots-text"
                >/ {{ stats.maxSpots }} spots restants</span
              >
            </div>
          </div>

          <!-- Note -->
          <p class="note">30 jours garantie remboursée</p>
        </div>
      </div>
    </section>

    <!-- Modal Formulaire d'inscription -->
    <div v-if="showSignupForm" class="modal-overlay" @click="closeSignupForm">
      <div class="modal-content" @click.stop>
        <div class="signup-form-card">
          <!-- Header -->
          <div class="form-header">
            <h2 class="form-title">Réserver votre spot Early Access</h2>
            <p class="form-subtitle">
              Complétez vos informations pour accéder au paiement
            </p>
            <button @click="closeSignupForm" class="close-button">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="handleSignup" class="signup-form">
            <!-- Erreur -->
            <div v-if="formError" class="error-message">
              {{ formError }}
            </div>

            <!-- Champs -->
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Prénom *</label>
                <input
                  id="firstName"
                  v-model="formData.firstName"
                  type="text"
                  required
                  placeholder="Jean"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="lastName">Nom *</label>
                <input
                  id="lastName"
                  v-model="formData.lastName"
                  type="text"
                  required
                  placeholder="Dupont"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                placeholder="jean.dupont@example.com"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="phone">Téléphone *</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                required
                placeholder="+1 234 567 8900"
                class="form-input"
              />
            </div>

            <!-- Bouton Submit -->
            <button type="submit" :disabled="submitting" class="submit-button">
              <span v-if="submitting">Traitement...</span>
              <span v-else>Continuer vers le paiement ($19)</span>
            </button>

            <!-- Note -->
            <p class="form-note">
              En continuant, vous serez redirigé vers Stripe pour le paiement
              sécurisé.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.early-access-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.demo-section .container {
  width: 90%;
  max-width: 1600px;
  padding: 2rem 0;
}

/* Header Section */
.header-section {
  padding: 3rem 0 2rem 0;
  background: #ffffff;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
}

.headline {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: #111;
  letter-spacing: -0.03em;
  margin: 0;
  text-align: center;
}

/* Demo Section */
.demo-section {
  padding: 2rem 0 4rem 0;
}

.demo-content {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.demo-visual {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.demo-video {
  width: 100%;
  max-width: 750px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Stats Section */
.stats-section {
  padding: 4rem 0;
  background: #ffffff;
}

.stats-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.spots-counter {
  margin-bottom: 2rem;
}

.loading-spots,
.error-spots {
  color: #999;
  font-size: 0.9rem;
}

.spots-info {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.spots-number {
  font-size: 2rem;
  font-weight: 600;
  color: #111;
}

.spots-text {
  font-size: 1rem;
  color: #666;
  font-weight: 400;
}

.cta-button-main {
  width: 100%;
  max-width: 400px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5);
}

.cta-button-main::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.cta-button-main:hover:not(:disabled) {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.6);
  transform: translateY(-1px);
}

.cta-button-main:hover:not(:disabled)::before {
  left: 100%;
}

.cta-button-main:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.note {
  font-size: 0.875rem;
  color: #999;
  margin-top: 0.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 9999;
}

.modal-content {
  max-width: 480px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  position: relative;
}

.signup-form-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.form-header {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 0.25rem;
}

.form-subtitle {
  color: #666;
  font-size: 0.875rem;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: #f5f5f5;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  padding: 0.75rem;
  background: #fee;
  color: #c33;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #111;
}

.submit-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #111;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background: #333;
}

.submit-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.form-note {
  font-size: 0.75rem;
  color: #999;
  text-align: center;
  margin-top: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-section {
    padding-top: 2rem;
    padding-bottom: 1.5rem;
  }

  .headline {
    font-size: 2.5rem;
    line-height: 1.15;
    padding: 0 1rem;
  }

  .header-content {
    gap: 1.5rem;
  }

  .cta-button-main {
    max-width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }

  .container {
    padding: 0 1.5rem;
  }

  .demo-section {
    padding: 1.5rem 0 3rem 0;
  }

  .demo-video {
    max-width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .signup-form-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding-top: 1.5rem;
    padding-bottom: 1rem;
  }

  .headline {
    font-size: 2rem;
    line-height: 1.2;
    padding: 0 0.5rem;
  }

  .header-content {
    gap: 1.25rem;
  }

  .cta-button-main {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }

  .container {
    padding: 0 1rem;
  }

  .demo-section {
    padding: 1rem 0 2rem 0;
  }

  .demo-video {
    max-width: 100%;
  }

  .stats-section {
    padding: 3rem 0;
  }

  .spots-number {
    font-size: 1.75rem;
  }

  .spots-text {
    font-size: 0.9rem;
  }
}
</style>
