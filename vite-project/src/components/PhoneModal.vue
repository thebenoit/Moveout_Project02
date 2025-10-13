<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <!-- Close button -->
        <button class="close-btn" @click="closeModal" aria-label="Fermer">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- Icon -->
        <div class="icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="24" fill="#000" />
            <!-- Gift box -->
            <rect
              x="16"
              y="23"
              width="16"
              height="11"
              rx="1.5"
              stroke="white"
              stroke-width="2.5"
              fill="none"
            />
            <!-- Ribbon vertical -->
            <line
              x1="24"
              y1="23"
              x2="24"
              y2="34"
              stroke="white"
              stroke-width="2.5"
            />
            <!-- Ribbon horizontal -->
            <line
              x1="16"
              y1="28.5"
              x2="32"
              y2="28.5"
              stroke="white"
              stroke-width="2.5"
            />
            <!-- Simple bow - two loops -->
            <circle
              cx="20"
              cy="18"
              r="3"
              stroke="white"
              stroke-width="2"
              fill="none"
            />
            <circle
              cx="28"
              cy="18"
              r="3"
              stroke="white"
              stroke-width="2"
              fill="none"
            />
            <!-- Bow tails -->
            <line
              x1="24"
              y1="20"
              x2="24"
              y2="23"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </div>

        <!-- Content -->
        <div class="modal-body">
          <h2 class="modal-title">Débloquez +5 recherches</h2>
          <p class="modal-description">
            Ajoutez votre numéro et passez de
            <span class="highlight">10 à 15 recherches</span> gratuites par jour
          </p>

          <!-- Form -->
          <form @submit.prevent="submitPhone" class="phone-form">
            <div class="input-wrapper">
              <input
                type="tel"
                class="phone-input"
                placeholder="+33 6 12 34 56 78"
                v-model="phone"
                :class="{ 'has-error': errorMessage }"
                @input="errorMessage = ''"
                autocomplete="tel"
              />
              <Transition name="error-fade">
                <p v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </p>
              </Transition>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="!isLoading">Débloquer maintenant</span>
              <span v-else class="loading-text">
                <span class="spinner"></span>
                Enregistrement...
              </span>
            </button>
          </form>

          <!-- Skip link -->
          <button @click="closeModal" class="skip-link">
            Continuer avec 10 recherches
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
import { parsePhoneNumber } from "libphonenumber-js";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const props = defineProps({
  show: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "phone-added"]);

const phone = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const closeModal = () => {
  emit("close");
};

const validatePhone = (phoneNumber) => {
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed && parsed.isValid();
  } catch {
    return false;
  }
};

const submitPhone = async () => {
  // Validation
  if (!phone.value.trim()) {
    errorMessage.value = "Veuillez entrer un numéro de téléphone";
    return;
  }

  if (!validatePhone(phone.value)) {
    errorMessage.value =
      "Numéro invalide. Utilisez le format international (+33...)";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(`${API_URL}/api/client/phone`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important pour envoyer les cookies (JWT)
      body: JSON.stringify({ phone: phone.value.trim() }),
    });

    const data = await response.json();

    if (response.ok) {
      // Succès ! Notifier le parent
      emit("phone-added", data);
      emit("close");
    } else {
      errorMessage.value = data.error || "Erreur lors de l'enregistrement";
    }
  } catch (error) {
    console.error("Erreur:", error);
    errorMessage.value = "Erreur de connexion. Veuillez réessayer.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Modal Content */
.modal-content {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  max-width: 440px;
  width: 100%;
  padding: 2.5rem 2rem 2rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05),
    0 20px 60px -10px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #000;
}

/* Icon */
.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

/* Modal Body */
.modal-body {
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.modal-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 2rem;
}

.highlight {
  color: #000;
  font-weight: 600;
}

/* Form */
.phone-form {
  margin-bottom: 1rem;
}

.input-wrapper {
  margin-bottom: 1rem;
  min-height: 76px;
}

.phone-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  background: #fafafa;
  color: #000;
  transition: all 0.2s;
  font-family: inherit;
}

.phone-input::placeholder {
  color: #999;
}

.phone-input:focus {
  outline: none;
  border-color: #000;
  background: #fff;
}

.phone-input.has-error {
  border-color: #ff3b30;
  background: #fff5f5;
}

.error-message {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #ff3b30;
  text-align: left;
  padding-left: 0.25rem;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #000;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Skip Link */
.skip-link {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #666;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
}

.skip-link:hover {
  color: #000;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content {
  animation: slideUp 0.3s ease-out;
}

.modal-fade-leave-active .modal-content {
  animation: slideDown 0.25s ease-in;
}

@keyframes slideDown {
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.error-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .modal-content {
    padding: 2rem 1.5rem 1.5rem;
  }

  .modal-title {
    font-size: 1.35rem;
  }

  .modal-description {
    font-size: 0.9rem;
  }
}
</style>
