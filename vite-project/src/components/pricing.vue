<script setup>
import { ref, onMounted } from "vue";
const hasAccess = ref(false);
const loadingStatus = ref(true);
const showCancelModal = ref(false);
const cancelling = ref(false);
async function goPremium() {
  try {
    // Appel à l’API pour créer la session Stripe
    const response = await fetch(
      import.meta.env.VITE_NODE_SERVER_URL + "/api/stripe/checkout",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const { url } = await response.json();
    // Redirection vers Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe :", error);
  }
}

async function fetchStatus() {
  try {
    const res = await fetch(
      import.meta.env.VITE_NODE_SERVER_URL + "/api/stripe/subscription/status",
      { credentials: "include" }
    );
    if (res.ok) {
      const data = await res.json();
      hasAccess.value = !!data.hasAccess;
    }
  } catch (e) {
    console.error("Erreur statut abonnement:", e);
  } finally {
    loadingStatus.value = false;
  }
}

async function confirmCancel() {
  try {
    cancelling.value = true;
    const res = await fetch(
      import.meta.env.VITE_NODE_SERVER_URL + "/api/stripe/subscription/cancel",
      { method: "POST", credentials: "include" }
    );
    if (res.ok) {
      hasAccess.value = false;
      showCancelModal.value = false;
    } else {
      const msg = await res.json().catch(() => ({}));
      console.error("Annulation échouée:", msg);
    }
  } catch (e) {
    console.error("Erreur d'annulation:", e);
  } finally {
    cancelling.value = false;
  }
}

onMounted(fetchStatus);
</script>

<template>
  <section class="pricing-hero">
    <div class="container">
      <header class="header">
        <h1>Choisissez votre plan</h1>
        <p>Des recherches adaptées à votre besoin, du gratuit à l’illimité.</p>
      </header>

      <div class="cards">
        <!-- Gratuit -->
        <div class="card">
          <div class="card-head">
            <h2>Gratuit</h2>
            <p class="price">0$<span class="price-unit">/mois</span></p>
          </div>
          <ul class="features">
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              10 recherches / jour
            </li>
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              Filtres essentiels: prix, chambres, localisation
            </li>
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              Accès au bot Moveout
            </li>
          </ul>
          <div class="card-actions placeholder"></div>
        </div>

        <!-- Premium -->
        <div class="card card-accent">
          <div class="card-head">
            <h2>Premium</h2>
            <p class="price">4,99$<span class="price-unit">/mois</span></p>
            <span v-if="!loadingStatus && hasAccess" class="badge current"
              >Current plan</span
            >
          </div>
          <ul class="features">
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              30 recherches / jour
            </li>
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              Filtres avancés: prix, chambres, localisation
            </li>
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              Priorité de traitement et mises à jour plus rapides
            </li>
          </ul>
          <div class="card-actions" v-if="!hasAccess">
            <button
              class="btn contrast"
              @click="goPremium"
              :disabled="loadingStatus"
            >
              Passer Premium
            </button>
          </div>
          <div v-else class="card-actions">
            <button class="btn" @click="showCancelModal = true">
              Gérer l'abonnement
            </button>
          </div>
        </div>

        <!-- Ultimate (en construction) -->
        <div class="card coming">
          <div class="badge">En construction</div>
          <div class="card-head">
            <h2>Ultimate</h2>
            <p class="price">
              9,99$<span class="price-unit">/mois de plus</span>
            </p>
          </div>
          <ul class="features">
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              Recherches illimitées
            </li>
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              Critères libres (ex: propriétaire femme, près de McGill)
            </li>
            <li>
              <span class="icon" aria-hidden="true">✓</span>
              Options avancées (ex: sans enquête de crédit)
            </li>
          </ul>
          <div class="card-actions">
            <button class="btn disabled" disabled>Bientôt disponible</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel subscription modal -->
    <div
      v-if="showCancelModal"
      class="modal-overlay"
      @click="showCancelModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="login-card">
          <h3 class="modal-title">Annuler l'abonnement ?</h3>
          <p class="modal-text">
            Êtes-vous sûr de vouloir résilier votre plan Premium ?
          </p>
          <div class="modal-actions">
            <button class="btn" @click="showCancelModal = false">
              Non, garder
            </button>
            <button
              class="btn contrast"
              :disabled="cancelling"
              @click="confirmCancel"
            >
              {{ cancelling ? "Annulation..." : "Oui, annuler" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Thème clair Moveout */
.pricing-hero {
  background: transparent;
  color: #111;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.header {
  text-align: center;
  margin-bottom: 2rem;
}
.header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #111;
}
.header p {
  color: #6b7280; /* gris moyen */
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
/* tablet */
@media (max-width: 1024px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}
/* mobile */
@media (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

.card {
  position: relative;
  border: 1px solid #e5e7eb; /* gris clair */
  border-radius: 14px;
  background: #fff;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #111;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-accent {
  border: 2px solid #111;
}

.card-head h2 {
  font-size: 1.125rem;
  margin: 0 0 0.25rem 0;
}
.price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
}
.price-unit {
  font-size: 0.9rem;
  color: #6b7280;
  margin-left: 4px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 1rem 0 1.25rem 0;
  color: #374151; /* gris foncé */
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0;
}
.icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  background: #111; /* noir moveout */
  color: #fff;
  border-radius: 50%;
  font-size: 0.75rem;
}

.btn {
  width: 100%;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #111;
  background: #fff;
  color: #111;
}
.btn:hover {
  background: #f3f4f6;
}

.btn.contrast {
  background: #111;
  color: #fff;
}
.btn.contrast:hover {
  background: #1a1a1a;
}

.btn.primary {
  background: #fff;
  color: #111;
}

.btn.disabled,
.btn:disabled {
  background: #f3f4f6;
  color: #9a9a9a;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.coming {
  border-style: dashed;
  border-color: #d1d5db;
}
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f5f5f5;
  color: #111;
  border: 1px solid #e5e7eb;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 999px;
}
.badge.current {
  background: #111;
  color: #fff;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.card-actions {
  margin-top: auto;
}

.card-actions.placeholder {
  height: 44px; /* réserve l'espace d'un bouton pour aligner la hauteur */
}

/* Modal (cancel subscription) */
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
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.modal-text {
  color: #444;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

/* Fix buttons layout inside modal: side-by-side, no overflow */
.modal-actions .btn {
  width: auto;
  flex: 1 1 0;
  min-width: 0;
}

.modal-actions {
  justify-content: stretch;
  margin-top: 0.5rem;
}

/* Responsive container padding */
@media (max-width: 640px) {
  .container {
    padding: 1.5rem 1rem;
  }
}
</style>
