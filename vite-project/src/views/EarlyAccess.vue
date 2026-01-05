<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import demoVideo from "@/assets/videos/Demo_Video.mov";
import unnamedCards from "@/assets/images/unnamed.jpg";
import verifiedCards from "@/assets/images/verified.jpg";
import stressedImage from "@/assets/images/stressed.jpg";
import robotWorking from "@/assets/images/robot_working.jpg";

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
const selectedPlan = ref(null); // 'standard' or 'pro'
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
function openSignupForm(plan = null) {
  selectedPlan.value = plan;
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
          <!-- Text Content -->
          <div class="header-text">
            <h1 class="headline">
              Stop searching. Start living. Find your apartment in 3 days, not
              3 months.
            </h1>
            <p class="subtitle">
              Delegate your search. Our 24/7 AI delivers only the top 1% of
              matches that fit your exact criteria.
            </p>
            <div class="cta-buttons">
          <button
            @click="openSignupForm"
            :disabled="stats.spotsRemaining <= 0"
            class="cta-button-main"
          >
            <span v-if="stats.spotsRemaining <= 0">Full</span>
                <span v-else>Show My Eligible Apartments</span>
              </button>
              <button
                @click="openSignupForm"
                :disabled="stats.spotsRemaining <= 0"
                class="cta-button-secondary"
              >
                <span v-if="stats.spotsRemaining <= 0">Full</span>
                <span v-else>Learn More</span>
          </button>
        </div>
      </div>
          <!-- Demo Video -->
          <div class="header-visual">
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

    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="container">
        <h2 class="benefits-title">The Rental Market is Rigged Against You</h2>
        <p class="benefits-subtitle">
          Listings hide flaws. Photos are staged. Our Deep Research AI digs into tax records, noise complaints, and legal history to reveal what the landlord won't tell you.
        </p>
        
        <!-- Compare Images Section -->
        <div class="compare-section">
          <div class="challenge-comparison">
            <!-- Left: The Trap -->
            <div class="challenge-side challenge-trap">
              <div class="trap-badge">WHAT OTHERS SHOW YOU</div>
              <div class="compare-image-wrapper">
                <img
                  :src="unnamedCards"
                  alt="Real estate listing"
                  class="compare-image compare-image-trap"
                />
                <div class="warning-badge" style="top: 15%; left: 10%;">
                  ⚠️ Owner Identity Mismatch
                </div>
                <div class="warning-badge" style="top: 60%; left: 75%;">
                  ⚠️ High Noise Level (85db)
                </div>
                <div class="warning-badge" style="top: 85%; left: 20%;">
                  ⚠️ 3 Recent Evictions
                </div>
              </div>
            </div>
            <!-- Right: The Truth -->
            <div class="challenge-side challenge-truth">
              <div class="truth-badge">WHAT MOVEOUT REVEALS</div>
              <div class="compare-image-wrapper">
                <img
                  :src="verifiedCards"
                  alt="Real estate listing verified"
                  class="compare-image compare-image-truth"
                />
                <div class="success-badge" style="top: 20%; left: 70%;">
                  ✅ Landlord ID Verified (Tax Records)
                </div>
                <div class="success-badge" style="top: 55%; left: 15%;">
                  ✅ Safe Neighborhood Score
                </div>
                <div class="success-badge" style="top: 80%; left: 65%;">
                  ✅ Lease Audit Passed
                </div>
              </div>
            </div>
          </div>
          <!-- CTA Button -->
          <div class="challenge-cta">
            <button class="challenge-button" @click="openSignupForm">
              START MY SAFETY AUDIT
            </button>
          </div>
        </div>

        <div class="benefits-cards">
          <!-- Stressed Card and Robot Image Side by Side with Captions -->
          <div class="illustration-grid">
            <!-- Stressed Card -->
            <div class="illustration-card illustration-card-problem">
              <div class="illustration-number">01</div>
              <div class="illustration-frame">
                <img
                  :src="stressedImage"
                  alt="Stressed international student"
                  class="illustration-image"
                />
              </div>
              <div class="illustration-content">
                <p class="illustration-caption">Stop waking up at 3 AM to call agents who ignore you.</p>
              </div>
            </div>

            <!-- Robot Image -->
            <div class="illustration-card illustration-card-solution">
              <div class="illustration-number">02</div>
              <div class="illustration-frame">
                <img
                  :src="robotWorking"
                  alt="AI working 24/7"
                  class="illustration-image"
                />
              </div>
              <div class="illustration-content">
                <p class="illustration-caption illustration-caption-highlight">Our AI hunts while you sleep. Wake up to a shortlist.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section">
      <div class="container">
        <h2 class="process-title">How It Works</h2>
        <p class="process-subtitle">
          Get your perfect apartment in just 3 simple steps
        </p>
        <div class="process-cards">
          <div class="process-card">
            <div class="process-number">1</div>
            <h3 class="process-headline">Sign Up & Set Your Criteria</h3>
            <p class="process-description">
              Create your account and tell us exactly what you're looking for:
              budget, location, number of bedrooms, and any special
              requirements.
            </p>
          </div>
          <div class="process-card">
            <div class="process-number">2</div>
            <h3 class="process-headline">AI Finds Perfect Matches</h3>
            <p class="process-description">
              Our AI scans thousands of listings 24/7 and filters them based
              on your criteria. You only see the top 1% of matches that fit
              perfectly.
            </p>
          </div>
          <div class="process-card">
            <div class="process-number">3</div>
            <h3 class="process-headline">Review & Schedule Visits</h3>
            <p class="process-description">
              Get notified instantly when perfect matches are found. Review the
              details and schedule visits directly through our platform.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="container">
        <div class="pricing-grid">
          <!-- Card 1: The Decoy (Standard) -->
          <div class="pricing-card pricing-card-decoy">
            <div class="pricing-card-header">
              <h3 class="pricing-card-title">Standard Access</h3>
              <div class="pricing-card-price">
                <span class="price-amount">$69</span>
                <span class="price-period">One-time</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li class="pricing-feature">
                <span class="feature-text">30 Days Access</span>
              </li>
              <li class="pricing-feature">
                <span class="feature-text">Basic AI Search Criteria</span>
              </li>
              <li class="pricing-feature">
                <span class="feature-text">3 "Deep Research" Reports</span>
              </li>
              <li class="pricing-feature pricing-feature-disabled">
                <span class="feature-text">No Landlord Verification</span>
              </li>
              <li class="pricing-feature pricing-feature-disabled">
                <span class="feature-text">No Money-Back Guarantee</span>
              </li>
            </ul>
            <button 
              class="pricing-button pricing-button-decoy"
              @click="openSignupForm('standard')"
            >
              Get Standard Access
            </button>
          </div>

          <!-- Card 2: The Hero (Founding Member) -->
          <div class="pricing-card pricing-card-hero">
            <div class="pricing-badge">Recommended</div>
            <div class="pricing-card-header">
              <h3 class="pricing-card-title">Founding Member</h3>
              <div class="pricing-card-subtitle">Season Pass</div>
              <div class="pricing-card-price">
                <span class="price-amount">$99</span>
                <span class="price-period">One-time</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li class="pricing-feature pricing-feature-checked">
                <span class="feature-text"><strong>90 Days Access</strong> (Cover your entire move)</span>
              </li>
              <li class="pricing-feature pricing-feature-checked">
                <span class="feature-text"><strong>Unlimited Deep Research</strong> (Scam & Noise Checks)</span>
              </li>
              <li class="pricing-feature pricing-feature-checked">
                <span class="feature-text"><strong>Landlord Identity Verification</strong></span>
              </li>
              <li class="pricing-feature pricing-feature-checked">
                <span class="feature-text"><strong>100% Money-Back Guarantee</strong></span>
              </li>
            </ul>
            <button 
              class="pricing-button pricing-button-hero"
              @click="openSignupForm('pro')"
            >
              Secure My Safe Move ($99)
            </button>
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  background: #ffffff;
}

.container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header Section */
.header-section {
  padding: 8rem 0 6rem;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
}

.header-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(0, 0, 0, 0.01) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(0, 0, 0, 0.01) 0%, transparent 50%);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 950px;
  width: 100%;
  text-align: center;
}

.headline {
  font-size: 4.5rem;
  font-weight: 600;
  line-height: 1.05;
  color: #000000;
  letter-spacing: -0.05em;
  margin: 0;
  text-align: center;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  font-size: 1.35rem;
  line-height: 1.65;
  color: #666666;
  margin: 0;
  text-align: center;
  font-weight: 300;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.15s forwards;
}

.header-visual {
  position: relative;
  width: 100%;
  max-width: 850px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.demo-video {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.demo-video:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08);
}

/* Benefits Section */
.benefits-section {
  padding: 8rem 0;
  background: #ffffff;
  position: relative;
}

.benefits-title {
  font-size: 4rem;
  font-weight: 700;
  color: #000000;
  text-align: center;
  margin: 0 0 2rem 0;
  letter-spacing: -0.04em;
}

.benefits-subtitle {
  font-size: 1.3rem;
  color: #666666;
  text-align: center;
  margin: 0 0 6rem 0;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 300;
}

.benefits-cards {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.benefit-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 0;
  padding: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  overflow: hidden;
  box-shadow: none;
}

.benefit-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
  border-color: #000000;
}

.benefit-card-left {
  grid-template-columns: 1fr 1fr;
}

.benefit-card-right {
  grid-template-columns: 1fr 1fr;
}

.benefit-card-right .benefit-image {
  order: 2;
}

.benefit-card-right .benefit-content {
  order: 1;
}

/* Compare Section */
.compare-section {
  max-width: 1200px;
  margin: 0 auto 4rem auto;
  width: 100%;
}

.challenge-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.challenge-side {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Badge Headers */
.trap-badge {
  display: block;
  margin: 0 auto;
  padding: 0;
  color: #000000;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-align: center;
  width: fit-content;
  opacity: 0.4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
}

.truth-badge {
  display: block;
  margin: 0 auto;
  padding: 0;
  color: #000000;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-align: center;
  width: fit-content;
  opacity: 0.9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
}

.compare-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: visible;
  border-radius: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e8e8e8;
}

.compare-image-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  border-color: #000000;
}

.compare-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* Image Filters */
.compare-image-trap {
  filter: grayscale(0.6);
  opacity: 0.85;
}

/* Overlay Badges */
.warning-badge {
  position: absolute;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  color: #000000;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 0;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  white-space: nowrap;
  max-width: 90%;
  text-align: center;
  letter-spacing: 0.01em;
}

.success-badge {
  position: absolute;
  padding: 0.4rem 0.75rem;
  background: rgba(0, 0, 0, 0.9);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 0;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 10;
  white-space: nowrap;
  max-width: 90%;
  text-align: center;
  letter-spacing: 0.01em;
}

.challenge-cta {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.challenge-button {
  padding: 1.1rem 3rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.challenge-button:hover {
  background: #1a1a1a;
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}


/* Illustration Grid */
.illustration-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 0;
}

.illustration-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 3rem;
  background: #ffffff;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.illustration-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid #000000;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.illustration-card::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border: 1px solid #000000;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

/* Problem Card (Left) - Top Left Corner Accent */
.illustration-card-problem::after {
  top: -8px;
  left: -8px;
  border-right: none;
  border-bottom: none;
}

.illustration-card-problem:hover::after {
  top: -12px;
  left: -12px;
  width: 50px;
  height: 50px;
}

/* Solution Card (Right) - Bottom Right Corner Accent */
.illustration-card-solution::after {
  bottom: -8px;
  right: -8px;
  border-left: none;
  border-top: none;
}

.illustration-card-solution:hover::after {
  bottom: -12px;
  right: -12px;
  width: 50px;
  height: 50px;
}

.illustration-card:hover {
  transform: translateY(-6px);
}

.illustration-card:hover::before {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.illustration-number {
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 5rem;
  font-weight: 300;
  color: #f5f5f5;
  line-height: 1;
  font-family: 'Georgia', serif;
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.illustration-card:hover .illustration-number {
  color: #e8e8e8;
  transform: scale(1.1);
}

.illustration-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid #e8e8e8;
  transition: border-color 0.5s ease;
}

.illustration-card:hover .illustration-frame::before {
  border-color: #000000;
}

.illustration-image {
  width: 90%;
  height: 90%;
  object-fit: contain;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: grayscale(0.2);
}

.illustration-card:hover .illustration-image {
  transform: scale(1.05);
  filter: grayscale(0);
}

.illustration-content {
  position: relative;
  padding-top: 1rem;
}

.illustration-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 1px;
  background: #000000;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.illustration-card:hover .illustration-content::before {
  width: 80px;
}

.illustration-caption {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666666;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.01em;
}

.illustration-caption-highlight {
  color: #000000;
  font-weight: 400;
}

.benefit-image {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #cccccc;
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.benefit-content {
  padding: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.benefit-headline {
  font-size: 2.25rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.benefit-subtext {
  font-size: 1.05rem;
  line-height: 1.75;
  color: #666666;
  margin: 0;
  font-weight: 300;
}

.benefit-features {
  margin-top: 1.5rem;
}

.feature-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-list li {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  position: relative;
  padding-left: 1.5rem;
}

.feature-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #111;
  font-weight: 600;
}


/* Process Section */
.process-section {
  padding: 8rem 0;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.process-title {
  font-size: 3.5rem;
  font-weight: 600;
  color: #000000;
  text-align: center;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.03em;
}

.process-subtitle {
  font-size: 1.25rem;
  color: #666666;
  text-align: center;
  margin: 0 0 5rem 0;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 300;
}

.process-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.process-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 0;
  padding: 3rem 2.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  box-shadow: none;
}

.process-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: #000000;
}

.process-number {
  width: 48px;
  height: 48px;
  border-radius: 0;
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 500;
  flex-shrink: 0;
}

.process-headline {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.process-description {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #666666;
  margin: 0;
  text-align: center;
  font-weight: 300;
}

/* Pricing Section */
.pricing-section {
  padding: 8rem 0;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.pricing-section .container {
  max-width: 1200px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.pricing-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Decoy Card (Standard) - Basic/Gray */
.pricing-card-decoy {
  border-color: #d1d5db;
}

.pricing-card-decoy:hover {
  border-color: #9ca3af;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Hero Card (Founding Member) - Elevated & Prominent */
.pricing-card-hero {
  border: 2px solid #000000;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}

.pricing-card-hero:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  transform: scale(1.03);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #000000;
  color: #ffffff;
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.pricing-card-header {
  margin-bottom: 2rem;
}

.pricing-card-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #000000;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.pricing-card-subtitle {
  font-size: 0.9rem;
  color: #666666;
  margin-bottom: 1rem;
  font-weight: 400;
}

.pricing-card-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 1rem;
}

.price-amount {
  font-size: 3rem;
  font-weight: 700;
  color: #000000;
  line-height: 1;
  letter-spacing: -0.03em;
}

.pricing-card-decoy .price-amount {
  color: #4b5563;
}

.price-period {
  font-size: 1rem;
  color: #666666;
  font-weight: 400;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pricing-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
  padding-left: 1.75rem;
  color: #374151;
  line-height: 1.6;
}

.pricing-feature::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.4em;
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
}

.pricing-feature-checked::before {
  content: '✓';
  width: 20px;
  height: 20px;
  background: #000000;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  top: 0.1em;
  padding: 0;
}

.pricing-card-hero .pricing-feature-checked::before {
  background: #000000;
}

.pricing-feature-disabled {
  color: #9ca3af;
  text-decoration: line-through;
}

.pricing-feature-disabled::before {
  content: '✗';
  background: #d1d5db;
  color: #9ca3af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  width: 18px;
  height: 18px;
  top: 0.2em;
}

.feature-text {
  font-size: 1rem;
  line-height: 1.6;
}

.pricing-button {
  width: 100%;
  padding: 1.1rem 2rem;
  border: 1px solid #000000;
  background: #ffffff;
  color: #000000;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
}

.pricing-button-decoy {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #4b5563;
  font-size: 0.9rem;
  padding: 0.95rem 2rem;
}

.pricing-button-decoy:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.pricing-button-hero {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
  position: relative;
  animation: pulse-button 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.pricing-button-hero:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  animation: none;
}

@keyframes pulse-button {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }
}

/* Stats Section */
.stats-section {
  padding: 6rem 0;
  background: #fafafa;
}

.stats-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.spots-counter {
  margin-bottom: 2.5rem;
}

.loading-spots,
.error-spots {
  color: #999999;
  font-size: 0.9rem;
  font-weight: 300;
}

.spots-info {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.75rem;
}

.spots-number {
  font-size: 3rem;
  font-weight: 600;
  color: #000000;
  letter-spacing: -0.02em;
}

.spots-text {
  font-size: 1.1rem;
  color: #666666;
  font-weight: 300;
}

.cta-buttons {
  display: flex;
  gap: 1.25rem;
  width: 100%;
  max-width: 650px;
  margin-top: 1rem;
  align-self: center;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.45s forwards;
}

.cta-button-main {
  flex: 2;
  padding: 1.2rem 2.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffffff;
  background: #000000;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.01em;
}

.cta-button-secondary {
  flex: 1;
  padding: 1.2rem 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #000000;
  background: transparent;
  border: 1px solid #000000;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.01em;
}

.cta-button-main::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button-main:hover:not(:disabled) {
  background: #1a1a1a;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.cta-button-main:hover:not(:disabled)::before {
  left: 100%;
}

.cta-button-main:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cta-button-secondary:hover:not(:disabled) {
  background: #000000;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cta-button-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.note {
  font-size: 0.85rem;
  color: #999999;
  margin-top: 0.5rem;
  font-weight: 300;
  letter-spacing: 0.01em;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-content {
  max-width: 520px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  position: relative;
}

.signup-form-card {
  background: #ffffff;
  padding: 3rem;
  border-radius: 0;
  border: 1px solid #000000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.form-header {
  position: relative;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.form-subtitle {
  color: #666666;
  font-size: 0.95rem;
  font-weight: 300;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  color: #000000;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f5f5f5;
  transform: rotate(90deg);
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  padding: 0.875rem;
  background: #f5f5f5;
  color: #000000;
  border-radius: 0;
  border-left: 3px solid #000000;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  font-weight: 400;
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
  font-size: 0.8rem;
  font-weight: 500;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  padding: 0.9rem;
  border: 1px solid #e0e0e0;
  border-radius: 0;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #ffffff;
  font-weight: 300;
}

.form-input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 1px #000000;
}

.submit-button {
  width: 100%;
  padding: 1.1rem 1.5rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 0;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1rem;
  letter-spacing: 0.02em;
}

.submit-button:hover:not(:disabled) {
  background: #1a1a1a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.form-note {
  font-size: 0.75rem;
  color: #999999;
  text-align: center;
  margin-top: 1rem;
  font-weight: 300;
}

/* Responsive */
@media (max-width: 1024px) {
  .benefit-card {
    grid-template-columns: 1fr;
  }

  .benefit-card-right .benefit-image {
    order: 1;
  }

  .benefit-card-right .benefit-content {
    order: 2;
  }

  .benefit-image {
    min-height: 250px;
  }

  .benefit-content {
    padding: 2rem;
  }

  .illustration-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .illustration-card {
    padding: 2.5rem;
  }

  .illustration-number {
    font-size: 4rem;
    top: 1.5rem;
    right: 1.5rem;
  }

  .compare-section {
    margin-bottom: 3rem;
  }

  .challenge-comparison {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .trap-badge,
  .truth-badge {
    font-size: 0.75rem;
    padding: 0.625rem 1.25rem;
  }

  .warning-badge,
  .success-badge {
    font-size: 0.65rem;
    padding: 0.4rem 0.7rem;
    max-width: 85%;
  }

  .process-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .process-card:last-child {
    grid-column: 1 / -1;
    max-width: 50%;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 3rem 0;
  }

  .header-content {
    gap: 2rem;
  }

  .header-text {
    max-width: 100%;
  }

  .headline {
    font-size: 2.5rem;
    line-height: 1.15;
  }

  .subtitle {
    font-size: 1rem;
  }

  .illustration-grid {
    gap: 2.5rem;
  }

  .illustration-card {
    padding: 2rem;
  }

  .illustration-number {
    font-size: 3.5rem;
    top: 1.5rem;
    right: 1.5rem;
  }

  .illustration-caption {
    font-size: 1rem;
  }

  .cta-buttons {
    flex-direction: column;
    max-width: 100%;
    gap: 0.75rem;
  }

  .cta-button-main,
  .cta-button-secondary {
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }

  .container {
    padding: 0 1.5rem;
  }

  .demo-video {
    max-width: 100%;
  }

  .benefits-section {
    padding: 3rem 0;
  }

  .compare-section {
    margin-bottom: 2.5rem;
  }

  .challenge-comparison {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .trap-badge,
  .truth-badge {
    font-size: 0.7rem;
    padding: 0.5rem 1rem;
  }

  .warning-badge,
  .success-badge {
    font-size: 0.6rem;
    padding: 0.35rem 0.6rem;
    max-width: 80%;
  }

  .challenge-button {
    padding: 0.875rem 2rem;
    font-size: 0.9rem;
  }

  .stressed-robot-wrapper {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .robot-image-container {
    min-height: 250px;
  }

  .benefit-card-stressed {
    padding: 1.5rem;
  }

  .stressed-image-wrapper {
    max-width: 100%;
  }

  .benefits-title {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .benefits-subtitle {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }

  .benefits-cards {
    gap: 2rem;
  }

  .benefit-card {
    grid-template-columns: 1fr;
  }

  .benefit-image {
    min-height: 200px;
  }

  .benefit-content {
    padding: 1.5rem;
    gap: 1rem;
  }

  .benefit-headline {
    font-size: 1.5rem;
  }

  .benefit-subtext {
    font-size: 1rem;
  }

  .process-section {
    padding: 3rem 0;
  }

  .process-title {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .process-subtitle {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }

  .process-cards {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .process-card {
    padding: 2rem 1.5rem;
    gap: 1.25rem;
  }

  .process-card:last-child {
    grid-column: 1;
    max-width: 100%;
    margin: 0;
  }

  .process-number {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .process-headline {
    font-size: 1.25rem;
  }

  .process-description {
    font-size: 0.95rem;
  }

  .pricing-section {
    padding: 3rem 0;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    max-width: 500px;
  }

  .pricing-card {
    padding: 2.5rem;
  }

  .pricing-card-hero {
    transform: scale(1);
  }

  .pricing-card-hero:hover {
    transform: scale(1.01);
  }

  .price-amount {
    font-size: 2.5rem;
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
    padding: 2rem 0;
  }

  .header-content {
    gap: 1.5rem;
  }

  .header-text {
    max-width: 100%;
  }

  .headline {
    font-size: 2rem;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .illustration-grid {
    gap: 2rem;
    padding: 1rem 0;
  }

  .illustration-card {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .illustration-number {
    font-size: 3rem;
    top: 1rem;
    right: 1rem;
  }

  .illustration-caption {
    font-size: 0.95rem;
  }

  .illustration-card::after {
    width: 30px;
    height: 30px;
  }

  .illustration-card-problem::after {
    top: -6px;
    left: -6px;
  }

  .illustration-card-solution::after {
    bottom: -6px;
    right: -6px;
  }

  .illustration-card-problem:hover::after {
    top: -8px;
    left: -8px;
    width: 35px;
    height: 35px;
  }

  .illustration-card-solution:hover::after {
    bottom: -8px;
    right: -8px;
    width: 35px;
    height: 35px;
  }

  .cta-buttons {
    gap: 0.625rem;
  }

  .cta-button-main,
  .cta-button-secondary {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }

  .container {
    padding: 0 1rem;
  }

  .demo-video {
    max-width: 100%;
  }

  .benefits-section {
    padding: 2.5rem 0;
  }

  .compare-section {
    margin-bottom: 2rem;
  }

  .challenge-comparison {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .trap-badge,
  .truth-badge {
    font-size: 0.65rem;
    padding: 0.5rem 0.875rem;
  }

  .warning-badge,
  .success-badge {
    font-size: 0.55rem;
    padding: 0.3rem 0.5rem;
    max-width: 75%;
  }

  .challenge-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.8rem;
  }

  .benefits-title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .benefits-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .benefits-cards {
    gap: 1.5rem;
  }

  .stressed-robot-wrapper {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .robot-image-container {
    min-height: 200px;
  }

  .benefit-card-stressed {
    padding: 1.25rem;
  }

  .stressed-image-wrapper {
    max-width: 100%;
  }

  .robot-image {
    max-width: 100%;
  }

  .benefit-image {
    min-height: 180px;
  }

  .benefit-content {
    padding: 1.25rem;
    gap: 0.875rem;
  }

  .benefit-headline {
    font-size: 1.25rem;
  }

  .benefit-subtext {
    font-size: 0.9rem;
  }

  .feature-label {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .feature-list li {
    font-size: 0.875rem;
  }

  .process-section {
    padding: 2.5rem 0;
  }

  .process-title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .process-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .process-cards {
    gap: 1.5rem;
  }

  .process-card {
    padding: 1.5rem 1.25rem;
    gap: 1rem;
  }

  .process-number {
    width: 45px;
    height: 45px;
    font-size: 1.25rem;
  }

  .process-headline {
    font-size: 1.125rem;
  }

  .process-description {
    font-size: 0.875rem;
  }

  .pricing-section {
    padding: 2.5rem 0;
  }

  .pricing-grid {
    gap: 2rem;
  }

  .pricing-card {
    padding: 2rem;
  }

  .pricing-card-title {
    font-size: 1.5rem;
  }

  .price-amount {
    font-size: 2.25rem;
  }

  .pricing-button {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }

  .pricing-button-decoy {
    padding: 0.9rem 1.5rem;
    font-size: 0.85rem;
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
