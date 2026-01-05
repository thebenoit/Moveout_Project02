<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
// Ensure these assets exist or replace with placeholders
import demoVideo from "@/assets/videos/Demo_Video.mov"; 
import Pricing from "@/components/pricing.vue";
import realestateCards from "@/assets/images/realestate_cards.jpg";

const router = useRouter();

// --- STATE MANAGEMENT ---
const stats = ref({
  totalSignups: 0,
  paidCount: 0,
  spotsRemaining: 47, // Hardcoded start for psychological scarcity if API fails
  maxSpots: 200,
});
const loadingStats = ref(true);
const errorStats = ref(null);

const showSignupForm = ref(false);
const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});
const submitting = ref(false);
const formError = ref(null);

// --- API ACTIONS ---
async function fetchStats() {
  try {
    loadingStats.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}/api/early-access/stats`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.stats) stats.value = data.stats;
    }
  } catch (error) {
    console.warn("Stats fallback active");
  } finally {
    loadingStats.value = false;
  }
}

async function handleSignup() {
  if (!formData.value.firstName || !formData.value.email) {
    formError.value = "Please fill in all required fields.";
    return;
  }
  
  submitting.value = true;
  formError.value = null;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}/api/early-access/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.value),
      }
    );
    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message);
    
    // Proceed to checkout
    await createCheckoutSession();
  } catch (error) {
    formError.value = error.message || "Something went wrong. Please try again.";
  } finally {
    submitting.value = false;
  }
}

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
    if (data.url) window.location.href = data.url;
    else throw new Error("Payment link generation failed");
  } catch (error) {
    formError.value = "Could not redirect to payment provider.";
  }
}

// --- UTILS ---
const openSignupForm = () => (showSignupForm.value = true);
const closeSignupForm = () => {
  showSignupForm.value = false;
  formError.value = null;
};

let statsInterval = null;
onMounted(() => {
  fetchStats();
  statsInterval = setInterval(fetchStats, 30000);
});
onUnmounted(() => {
  if (statsInterval) clearInterval(statsInterval);
});
</script>

<template>
  <div class="landing-page">
    
    <header class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="badge-scarcity">
              <span class="pulse">●</span> Only {{ stats.spotsRemaining }} Founding Member spots left
            </div>
            <h1 class="headline">
              Secure Your Apartment <span class="highlight">Before You Land.</span>
              <br>Zero Scams. Zero Wasted Time.
            </h1>
            <p class="subtitle">
              Don't risk your deposit on "Ghost Listings." Moveout uses Deep Research AI 
              to scan the hidden market, verify landlords, and deliver the top 1% of 
              safe, compliant apartments directly to you.
            </p>
            <div class="cta-wrapper">
              <button
                @click="openSignupForm"
                :disabled="stats.spotsRemaining <= 0"
                class="cta-button-primary"
              >
                <span v-if="stats.spotsRemaining > 0">Start My Risk-Free Search ($99)</span>
                <span v-else>Join Waitlist</span>
              </button>
              <p class="guarantee-text">🔒 100% Money-Back Guarantee if we don't find a match.</p>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="video-frame">
              <video
                :src="demoVideo"
                autoplay loop muted playsinline
                class="demo-video"
              ></video>
              <div class="overlay-tag">Scanning...</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="problem-section">
      <div class="container">
        <h2 class="section-title">The Rental Market is Rigged Against You</h2>
        <div class="problem-grid">
          <div class="problem-card">
            <div class="icon">🚫</div>
            <h3>The Scam Economy</h3>
            <p>Listings with fake photos and "Ghost Landlords" are designed to steal your deposit before you arrive.</p>
          </div>
          <div class="problem-card">
            <div class="icon">📉</div>
            <h3>The 1.4% Vacancy Crisis</h3>
            <p>Good apartments vanish in hours. By the time you see them on Zillow, they are already gone.</p>
          </div>
          <div class="problem-card">
            <div class="icon">🏚️</div>
            <h3>The Hidden Flaws</h3>
            <p>Noisy streets, bed bugs, and mold aren't in the brochure. You only find out after you sign the lease.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mechanism-section">
      <div class="container">
        <h2 class="section-title">Enter Deep Research AI</h2>
        <p class="section-subtitle">
          We don't just "search." We investigate. Moveout acts as your digital detective.
        </p>
        
        <div class="comparison-block">
          <div class="compare-visual">
            <img :src="realestateCards" alt="AI Analysis" class="main-img" />
            <div class="scan-line"></div>
            <div class="floating-badge badge-scam">⚠️ Scam Detected</div>
            <div class="floating-badge badge-safe">✅ Landlord Verified</div>
          </div>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <h3>🛡️ Landlord Identity Check</h3>
            <p>We cross-reference tax records to ensure the person listing the property actually owns it.</p>
            <ul class="feature-list">
              <li>Ownership Validation</li>
              <li>Foreclosure Check</li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>🔊 Environment Analysis</h3>
            <p>We analyze noise complaints, crime maps, and 311 city data to rate the "livability" of the street.</p>
            <ul class="feature-list">
              <li>Noise Level Score</li>
              <li>Safety Heatmap</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="process-section">
      <div class="container">
        <h2 class="section-title">Your Keys in 3 Steps</h2>
        <div class="steps-container">
          <div class="step-item">
            <div class="step-num">1</div>
            <h3>Brain Dump Criteria</h3>
            <p>Tell us your budget, commute needs, and deal-breakers. We intake complex requests (e.g., "Must accept Guarantors").</p>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <h3>We Scan & Verify</h3>
            <p>Our AI processes 5,000+ listings, filters out 99% of junk, and legally verifies the top matches.</p>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <h3>You Get the Shortlist</h3>
            <p>Receive a curated report of the top 3-5 viewable apartments. Click to apply or book a viewing.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="offer-section">
      <div class="container">
        <div class="offer-card">
          <div class="offer-header">
            <span class="tag">Founding Member</span>
            <h2>One-Time Pass</h2>
            <div class="price">
              <span class="currency">$</span>99
              <span class="period">/ Lifetime Access</span>
            </div>
            <p class="price-sub">Standard Price will be $29/month. Save $250+ today.</p>
          </div>
          
          <div class="guarantee-box">
            <div class="shield-icon">🛡️</div>
            <div class="guarantee-content">
              <h4>The "Zero-Risk" Promise</h4>
              <p>You don't know us yet. We take the risk. If we don't find you at least 3 viable, vetted matches within 7 days, <strong>we refund 100% of your money.</strong></p>
            </div>
          </div>

          <button @click="openSignupForm" class="cta-button-primary full-width">
            Get My Verified Shortlist ($99)
          </button>
        </div>
      </div>
    </section>

    <div v-if="showSignupForm" class="modal-backdrop" @click="closeSignupForm">
      <div class="modal-card" @click.stop>
        <button class="close-btn" @click="closeSignupForm">&times;</button>
        
        <div class="modal-header">
          <h3>Secure Your Spot</h3>
          <p>You are {{ stats.spotsRemaining }} spots away from a secure move.</p>
        </div>

        <form @submit.prevent="handleSignup" class="modal-form">
          <div v-if="formError" class="alert-error">{{ formError }}</div>

          <div class="input-group">
            <label>First Name</label>
            <input v-model="formData.firstName" type="text" placeholder="Jane" required />
          </div>
          
          <div class="input-group">
            <label>Last Name</label>
            <input v-model="formData.lastName" type="text" placeholder="Doe" required />
          </div>

          <div class="input-group full">
            <label>Email Address</label>
            <input v-model="formData.email" type="email" placeholder="jane@example.com" required />
          </div>

          <div class="input-group full">
            <label>WhatsApp / Phone</label>
            <input v-model="formData.phone" type="tel" placeholder="+1..." required />
          </div>

          <button type="submit" :disabled="submitting" class="cta-button-primary full-width">
            <span v-if="submitting">Processing...</span>
            <span v-else>Continue to Secure Payment ($99)</span>
          </button>
          
          <p class="micro-copy">🔒 256-bit Encrypted Payment via Stripe</p>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* --- BASE & TYPOGRAPHY --- */
.landing-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #111;
  background: #fff;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

h1, h2, h3 { font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
p { color: #555; line-height: 1.6; }

/* --- HERO SECTION --- */
.hero-section {
  padding: 6rem 0 4rem;
  background: radial-gradient(circle at 50% 0%, #f7f7f7 0%, #fff 100%);
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
}

.badge-scarcity {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff0f0;
  color: #d32f2f;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid #ffcdcd;
}

.pulse {
  animation: pulse 1.5s infinite;
}

.headline {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #2563EB; /* Trust Blue */
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  max-width: 90%;
}

.hero-visual {
  position: relative;
}

.video-frame {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 8px solid #fff;
  position: relative;
}

.demo-video {
  width: 100%;
  display: block;
}

/* --- CTA BUTTONS --- */
.cta-button-primary {
  background: #111;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
}

.cta-button-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  background: #000;
}

.guarantee-text {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.75rem;
  text-align: center;
}

/* --- PROBLEM SECTION --- */
.problem-section {
  padding: 5rem 0;
  background: #FAFAFA;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.problem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.problem-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #eee;
  transition: transform 0.2s;
}

.problem-card:hover { transform: translateY(-5px); }

.icon { font-size: 2.5rem; margin-bottom: 1rem; }

/* --- MECHANISM SECTION --- */
.mechanism-section { padding: 5rem 0; }

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  max-width: 600px;
  margin: -2rem auto 3rem;
}

.comparison-block {
  margin-bottom: 3rem;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.main-img { width: 100%; display: block; }

.floating-badge {
  position: absolute;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.badge-scam { top: 20%; right: 10%; background: #fee2e2; color: #991b1b; }
.badge-safe { bottom: 20%; left: 10%; background: #dcfce7; color: #166534; }

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.feature-card {
  border: 1px solid #eee;
  padding: 2rem;
  border-radius: 12px;
}

.feature-list {
  margin-top: 1rem;
  padding-left: 1.2rem;
  color: #444;
}

/* --- PROCESS SECTION --- */
.process-section {
  padding: 5rem 0;
  text-align: center;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.step-num {
  background: #111;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
}

/* --- OFFER SECTION --- */
.offer-section { padding: 5rem 0; background: #111; color: #fff; }

.offer-card {
  background: #fff;
  color: #111;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
}

.tag {
  background: #2563EB;
  color: #fff;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.price {
  font-size: 4rem;
  font-weight: 800;
  margin: 1rem 0;
}

.currency { font-size: 2rem; vertical-align: super; }
.period { font-size: 1rem; color: #666; font-weight: 400; }

.guarantee-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
}

.shield-icon { font-size: 2rem; }

/* --- MODAL --- */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: grid; place-items: center; z-index: 1000;
}

.modal-card {
  background: #fff;
  width: 90%; max-width: 450px;
  padding: 2rem;
  border-radius: 16px;
  position: relative;
}

.close-btn {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; font-size: 1.5rem; cursor: pointer;
}

.modal-header h3 { margin-top: 0; margin-bottom: 0.5rem; }
.modal-header p { color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; }

.modal-form { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
.input-group.full { grid-column: 1 / -1; }
.full-width { grid-column: 1 / -1; width: 100%; }

.input-group input {
  width: 100%; padding: 0.8rem; border: 1px solid #ddd;
  border-radius: 6px; margin-top: 0.4rem;
}

.micro-copy {
  grid-column: 1 / -1; font-size: 0.75rem; color: #888; text-align: center; margin: 0;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; }
  .headline { font-size: 2.5rem; }
  .cta-wrapper { margin: 0 auto; max-width: 350px; }
  .problem-grid, .steps-container { grid-template-columns: 1fr; }
  .feature-grid { grid-template-columns: 1fr; }
  .modal-form { grid-template-columns: 1fr; }
}
</style>