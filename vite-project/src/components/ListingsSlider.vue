<template>
  <div class="listings-slider">
    <div class="slider-container" ref="sliderContainer">
      <div
        class="slider-track"
        ref="sliderTrack"
        :style="{ transform: `translateX(-${currentOffset}px)` }"
      >
        <div
          v-for="(listing, index) in listings"
          :key="listing.id"
          class="listing-card"
          role="button"
          tabindex="0"
          :aria-label="`Open details for ${listing.title}`"
          @click="openListingUrl(listing)"
          @keyup.enter="viewListing(listing)"
          :ref="
            (el) => {
              if (el) slideRefs[index] = el;
            }
          "
        >
          <!-- Image principale avec carrousel -->
          <div class="image-container">
            <div class="image-carousel">
              <img
                :src="listing.images[currentImageIndex[index] || 0]?.src"
                :alt="
                  listing.images[currentImageIndex[index] || 0]?.alt ||
                  listing.title
                "
                class="listing-image"
                @error="handleImageError"
              />

              <!-- Navigation des images -->
              <button
                v-if="listing.images.length > 1"
                @click.stop="previousImage(index)"
                class="image-nav prev-image"
                :class="{ disabled: (currentImageIndex[index] || 0) === 0 }"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>

              <button
                v-if="listing.images.length > 1"
                @click.stop="nextImage(index)"
                class="image-nav next-image"
                :class="{
                  disabled:
                    (currentImageIndex[index] || 0) ===
                    listing.images.length - 1,
                }"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
              <!-- gradient overlay -->
              <div class="image-gradient" aria-hidden="true"></div>
            </div>

            <!-- Indicateurs d'images -->
            <div v-if="listing.images.length > 1" class="image-indicators">
              <div
                v-for="(image, imgIndex) in listing.images.slice(0, 5)"
                :key="imgIndex"
                class="indicator"
                :class="{
                  active: (currentImageIndex[index] || 0) === imgIndex,
                }"
                @click="setImageIndex(index, imgIndex)"
              ></div>
              <span v-if="listing.images.length > 5" class="more-images">
                +{{ listing.images.length - 5 }}
              </span>
            </div>
          </div>

          <!-- Contenu de la carte -->
          <div class="card-content" @click.stop>
            <p class="listing-price" :aria-label="`Price ${listing.price}`">
              {{ listing.price }}
            </p>
            <p v-if="listing.location" class="listing-location">
              {{ listing.location }}
            </p>
            <h3 class="listing-title">{{ listing.title }}</h3>

            <!-- Facts row -->
            <div class="listing-facts" role="list" aria-label="Key facts">
              <div
                class="fact"
                v-if="
                  listing.bedrooms !== undefined && listing.bedrooms !== null
                "
                role="listitem"
                :aria-label="labels.bedsAria(listing.bedrooms)"
              >
                <span class="fact-emoji" aria-hidden="true">🛏️</span>
                <span>{{ listing.bedrooms }}</span>
              </div>
              <div
                class="fact"
                v-if="
                  listing.bathrooms !== undefined && listing.bathrooms !== null
                "
                role="listitem"
                :aria-label="labels.bathsAria(listing.bathrooms)"
              >
                <span class="fact-emoji" aria-hidden="true">🚿</span>
                <span>{{ listing.bathrooms }}</span>
              </div>
              <div v-if="listing.area" class="fact" role="listitem">
                <span class="fact-emoji" aria-hidden="true">📐</span>
                <span>{{ listing.area }}</span>
              </div>
              <div
                v-else-if="listing.neighborhood"
                class="fact"
                role="listitem"
              >
                <span class="fact-emoji" aria-hidden="true">📍</span>
                <span>{{ listing.neighborhood }}</span>
              </div>
            </div>

            <div class="listing-actions">
              <button
                class="action-btn primary"
                @click.stop="viewListing(listing)"
                :aria-label="labels.ctaAria(listing.title)"
              >
                {{ labels.cta }}
                <svg
                  class="btn-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M10 6l-1.41 1.41L12.17 11H4v2h8.17l-3.58 3.59L10 18l6-6-6-6z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation du slider -->
    <button
      @click="previousSlide"
      class="slider-nav prev-slide"
      :class="{ disabled: currentSlide === 0 }"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>

    <button
      @click="nextSlide"
      class="slider-nav next-slide"
      :class="{ disabled: currentSlide >= maxIndex }"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </button>

    <!-- Indicateurs de slide -->
    <div class="slide-indicators">
      <div
        v-for="(_, index) in Math.ceil(listings.length / slidesPerView)"
        :key="index"
        class="slide-indicator"
        :class="{ active: Math.floor(currentSlide / slidesPerView) === index }"
        @click="goToSlide(index * slidesPerView)"
      ></div>
    </div>

    <!-- Modal pour les détails du listing -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <span>×</span>
        </button>

        <!-- En-tête du modal -->
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedListing?.title }}</h2>
          <div class="modal-price">{{ selectedListing?.price }}</div>
        </div>

        <!-- Images du modal -->
        <div class="modal-images" v-if="selectedListing?.images?.length">
          <div class="modal-image-container">
            <img
              :src="selectedListing.images[modalImageIndex]?.src"
              :alt="
                selectedListing.images[modalImageIndex]?.alt ||
                selectedListing.title
              "
              class="modal-image"
              @error="handleImageError"
            />

            <!-- Navigation des images si plus d'une image -->
            <div
              v-if="selectedListing.images.length > 1"
              class="modal-image-nav"
            >
              <button class="modal-nav-btn prev" @click="prevModalImage">
                <span>‹</span>
              </button>
              <button class="modal-nav-btn next" @click="nextModalImage">
                <span>›</span>
              </button>
            </div>

            <!-- Indicateurs d'images -->
            <div
              v-if="selectedListing.images.length > 1"
              class="modal-image-indicators"
            >
              <div
                v-for="(_, index) in selectedListing.images"
                :key="index"
                class="modal-indicator"
                :class="{ active: index === modalImageIndex }"
                @click="modalImageIndex = index"
              ></div>
            </div>
          </div>
        </div>

        <!-- Détails du listing -->
        <div class="modal-details">
          <div class="modal-specs">
            <div class="spec-item">
              <span class="spec-icon">🛏️</span>
              <span>{{ selectedListing?.bedrooms }} chambres</span>
            </div>
            <div class="spec-item">
              <span class="spec-icon">🛁</span>
              <span
                >{{ selectedListing?.bathrooms }} salle{{
                  selectedListing?.bathrooms > 1 ? "s" : ""
                }}
                de bain</span
              >
            </div>
            <div v-if="selectedListing?.location" class="spec-item">
              <span class="spec-icon">📍</span>
              <span>{{ selectedListing.location }}</span>
            </div>
          </div>

          <!-- Description complète -->
          <div class="modal-description">
            <h3>Description</h3>
            <div class="description-content">
              {{ selectedListing?.description }}
            </div>
          </div>

          <!-- Actions du modal -->
          <div class="modal-actions">
            <a
              class="modal-btn primary"
              :href="selectedListing?.url || '#'"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir sur Facebook
            </a>
            <button class="modal-btn secondary" @click="closeModal">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  listings: {
    type: Array,
    required: true,
  },
  locale: {
    type: String,
    default: "fr",
    validator: (val) => ["fr", "en"].includes(val),
  },
});

// Refs
const sliderContainer = ref(null);
const sliderTrack = ref(null);
const slideRefs = reactive({});

// État du slider
const currentSlide = ref(0);
const currentOffset = ref(0);
const slideWidth = ref(320);
const slidesPerView = ref(3);

// État des images par listing
const currentImageIndex = reactive({});

// Computed
const maxSlide = computed(() => {
  // Used for page indicators
  return Math.max(0, props.listings.length - slidesPerView.value);
});

// Max index used for left/right nav disabling
const maxIndex = computed(() => Math.max(0, props.listings.length - 1));

// Méthodes pour la navigation des images
const previousImage = (listingIndex) => {
  const current = currentImageIndex[listingIndex] || 0;
  if (current > 0) {
    currentImageIndex[listingIndex] = current - 1;
  }
};

const nextImage = (listingIndex) => {
  const current = currentImageIndex[listingIndex] || 0;
  const maxIndex = props.listings[listingIndex].images.length - 1;
  if (current < maxIndex) {
    currentImageIndex[listingIndex] = current + 1;
  }
};

const setImageIndex = (listingIndex, imageIndex) => {
  currentImageIndex[listingIndex] = imageIndex;
};

// Méthodes pour la navigation du slider
const centerOnIndex = (index) => {
  if (!sliderContainer.value || !sliderTrack.value) return;
  const targetEl = slideRefs[index];
  if (!targetEl) return;

  const containerWidth = sliderContainer.value.offsetWidth;
  const targetCenter = targetEl.offsetLeft + targetEl.offsetWidth / 2;
  const rawOffset = targetCenter - containerWidth / 2;
  const maxPossibleOffset = Math.max(
    0,
    sliderTrack.value.scrollWidth - containerWidth
  );
  currentOffset.value = Math.min(Math.max(0, rawOffset), maxPossibleOffset);
};

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value = Math.max(0, currentSlide.value - 1);
    centerOnIndex(currentSlide.value);
  }
};

const nextSlide = () => {
  if (currentSlide.value < maxIndex.value) {
    currentSlide.value = Math.min(maxIndex.value, currentSlide.value + 1);
    centerOnIndex(currentSlide.value);
  }
};

const goToSlide = (slideIndex) => {
  currentSlide.value = Math.min(maxIndex.value, slideIndex);
  centerOnIndex(currentSlide.value);
};

// Méthodes utilitaires
const handleImageError = (event) => {
  event.target.src = "/src/assets/images/no_data.svg";
};

// Modal state
const showModal = ref(false);
const selectedListing = ref(null);
const modalImageIndex = ref(0);

// Actions
const viewListing = (listing) => {
  selectedListing.value = listing;
  modalImageIndex.value = 0;
  showModal.value = true;
};

const openListingUrl = (listing) => {
  if (listing?.url) {
    window.open(listing.url, "_blank");
  } else {
    viewListing(listing);
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedListing.value = null;
};

const nextModalImage = () => {
  if (selectedListing.value && selectedListing.value.images.length > 0) {
    modalImageIndex.value =
      (modalImageIndex.value + 1) % selectedListing.value.images.length;
  }
};

const prevModalImage = () => {
  if (selectedListing.value && selectedListing.value.images.length > 0) {
    modalImageIndex.value =
      (modalImageIndex.value - 1 + selectedListing.value.images.length) %
      selectedListing.value.images.length;
  }
};

// Gestion du redimensionnement
const updateSliderDimensions = () => {
  if (!sliderContainer.value) return;

  const containerWidth = sliderContainer.value.offsetWidth;
  const cardWidth = 320;
  const gap = 20;

  slidesPerView.value = Math.max(
    1,
    Math.floor((containerWidth + gap) / (cardWidth + gap))
  );
  slideWidth.value = cardWidth + gap;
  // Re-center current index after a resize
  centerOnIndex(currentSlide.value);
};

// Navigation au clavier
const handleKeydown = (event) => {
  switch (event.key) {
    case "ArrowLeft":
      previousSlide();
      break;
    case "ArrowRight":
      nextSlide();
      break;
  }
};

// Lifecycle
onMounted(() => {
  updateSliderDimensions();
  window.addEventListener("resize", updateSliderDimensions);
  window.addEventListener("keydown", handleKeydown);

  // Initialiser les index d'images
  props.listings.forEach((_, index) => {
    currentImageIndex[index] = 0;
  });

  // Center on first card at mount
  centerOnIndex(currentSlide.value);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSliderDimensions);
  window.removeEventListener("keydown", handleKeydown);
});

// Labels by locale
const labels = computed(() => {
  const fr = {
    cta: "Voir plus",
    ctaAria: (title) => `Voir plus de détails pour ${title}`,
    bedsAria: (n) => `${n} chambre${n > 1 ? "s" : ""}`,
    bathsAria: (n) => `${n} salle${n > 1 ? "s" : ""} de bain`,
  };
  const en = {
    cta: "View details",
    ctaAria: (title) => `View more details for ${title}`,
    bedsAria: (n) => `${n} bed${n > 1 ? "s" : ""}`,
    bathsAria: (n) => `${n} bath${n > 1 ? "s" : ""}`,
  };
  return props.locale === "en" ? en : fr;
});
</script>

<style scoped>
.listings-slider {
  position: relative;
  width: 100%;
  padding: 2rem 0;
}

.slider-container {
  overflow: hidden;
  width: 100%;
  padding: 0 60px; /* Espace pour les boutons de navigation */
}

.slider-track {
  display: flex;
  gap: 20px;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.listing-card {
  flex: 0 0 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
}

.listing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.listing-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.4), 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Images */
.image-container {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.image-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}
/* Bottom gradient overlay for future overlays */
.image-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0));
  pointer-events: none;
}

.listing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease,
    transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.listing-card:hover .listing-image {
  transform: scale(1.04);
}

.image-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
}

.image-nav:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.image-nav.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prev-image {
  left: 8px;
}

.next-image {
  right: 8px;
}

.image-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  align-items: center;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.more-images {
  font-size: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 4px;
}

/* Contenu */
.card-content {
  padding: 1.5rem;
}

.listing-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.listing-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  flex: 1;
  margin-right: 1rem;
}

.listing-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111111;
  margin: 0;
}

.listing-location {
  margin: 0.25rem 0 0.25rem 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.listing-facts {
  display: flex;
  gap: 0.75rem;
  margin: 0.75rem 0 1rem 0;
  color: #4b5563;
}

.fact {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.fact-emoji {
  font-size: 1rem;
  line-height: 1;
}

.listing-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn.primary {
  background: #111111;
  color: white;
}

.action-btn.primary:hover {
  background: #000000;
  transform: translateY(-1px);
}

.btn-arrow {
  margin-left: 8px;
}

/* Navigation du slider */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.slider-nav:hover {
  background: #000000;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.slider-nav.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prev-slide {
  left: 12px;
}

.next-slide {
  right: 12px;
}

/* Indicateurs de slide */
.slide-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
}

.slide-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slide-indicator.active {
  background: #111111;
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 1200px) {
  .slider-container {
    padding: 0 50px;
  }
}

@media (max-width: 768px) {
  .listing-card {
    flex: 0 0 280px;
  }

  .slider-container {
    padding: 0 40px;
  }

  .slider-nav {
    width: 40px;
    height: 40px;
  }

  .card-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .listing-card {
    flex: 0 0 260px;
  }

  .slider-container {
    padding: 0 35px;
  }
}

/* Styles pour le modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  backdrop-filter: blur(4px);
  animation: fadeIn 180ms ease-out;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: scaleIn 220ms ease-out;
  transform-origin: center;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 1.5rem;
  transition: background 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.9);
}

.modal-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.modal-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111111;
}

.modal-images {
  position: relative;
}

.modal-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-image-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none;
}

.modal-nav-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  pointer-events: auto;
  transition: all 0.2s ease;
}

.modal-nav-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* Keyframes for subtle animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Respect users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .listing-image,
  .slider-track,
  .slider-nav,
  .modal-overlay,
  .modal-content {
    transition: none !important;
    animation: none !important;
  }
}

.modal-image-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.modal-indicator {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-indicator.active {
  background: white;
  transform: scale(1.2);
}

.modal-details {
  padding: 2rem;
}

.modal-specs {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #374151;
}

.spec-icon {
  font-size: 1.1rem;
}

.modal-description {
  margin-bottom: 2rem;
}

.modal-description h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.description-content {
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.modal-btn.primary {
  background: #111111;
  color: white;
}

.modal-btn.primary:hover {
  background: #000000;
  transform: translateY(-1px);
}

.modal-btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.modal-btn.secondary:hover {
  background: #e5e7eb;
}

/* Responsive pour le modal */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    border-radius: 12px;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .modal-details {
    padding: 1.5rem;
  }

  .modal-specs {
    flex-direction: column;
    gap: 1rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
  }

  .modal-image-container {
    height: 250px;
  }
}
</style>
