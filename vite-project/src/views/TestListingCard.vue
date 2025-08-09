<script setup>
import { ref, computed } from "vue";
import ListingsSlider from "../components/ListingsSlider.vue";
import { sampleListings } from "../data/sampleListings.js";

// Utilisation des données complètes du slider
const listings = ref(sampleListings);

// Garder seulement la logique pour le modal de détail

// État d'affichage détaillé (bottom sheet mobile)
const showDetail = ref(false);
const detailListing = ref(null);
const detailPhotos = computed(() => {
  if (!detailListing.value?.images) return [];
  // Adapter selon la structure des images (array d'objets avec src)
  return detailListing.value.images.map((img) =>
    typeof img === "string" ? img : img.src
  );
});

// Carrousel (pour la fiche détaillée)
const currentImageIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

function openDetail(listing) {
  detailListing.value = listing;
  currentImageIndex.value = 0;
  showDetail.value = true;
}

function closeDetail() {
  showDetail.value = false;
}

const nextImage = () => {
  if (!detailPhotos.value.length) return;
  currentImageIndex.value =
    (currentImageIndex.value + 1) % detailPhotos.value.length;
};

const previousImage = () => {
  if (!detailPhotos.value.length) return;
  currentImageIndex.value =
    (currentImageIndex.value - 1 + detailPhotos.value.length) %
    detailPhotos.value.length;
};

// Gestion du swipe tactile (fiche)
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
};
const handleTouchEnd = (event) => {
  touchEndX.value = event.changedTouches[0].clientX;
  handleSwipe();
};
const handleSwipe = () => {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) nextImage();
    else previousImage();
  }
};

// Navigation par clavier (fiche)
const handleKeyDown = (event) => {
  if (event.key === "ArrowLeft") previousImage();
  else if (event.key === "ArrowRight") nextImage();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Section principale -->
    <div
      class="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
    >
      <!-- En-tête -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-black mb-4">
          Découvrez nos propriétés disponibles
        </h1>
        <p class="text-gray-600 text-lg max-w-2xl">
          Parcourez une sélection de logements qui pourraient vous intéresser
          grâce à notre slider horizontal
        </p>
      </div>

      <!-- Slider des listings -->
      <div class="w-full max-w-7xl">
        <ListingsSlider :listings="listings" />
      </div>
    </div>

    <!-- Fiche détaillée en bottom sheet (z-[100]) -->
    <div
      v-if="showDetail"
      class="fixed inset-0 z-[100]"
      @keydown.esc="closeDetail"
    >
      <div class="absolute inset-0 bg-black/40" @click="closeDetail"></div>

      <div
        class="absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:max-w-3xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-slideUp"
        @click.stop
      >
        <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3"></div>

        <div class="px-4 pb-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                {{ detailListing?.title }}
              </h2>
              <div class="text-sm text-gray-500 mt-1">
                {{ detailListing?.bedrooms }} chambres •
                {{ detailListing?.bathrooms }} salle(s) de bain
              </div>
            </div>
            <div class="text-green-600 font-semibold text-lg md:text-xl">
              {{ detailListing?.price }}
            </div>
          </div>

          <div
            class="relative overflow-hidden rounded-lg mt-4 shadow-lg border border-gray-200"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @keydown="handleKeyDown"
            tabindex="0"
          >
            <img
              v-if="detailPhotos.length"
              :src="detailPhotos[currentImageIndex]"
              :alt="`Image ${currentImageIndex + 1}`"
              class="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover"
            />

            <div
              class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
            >
              <button
                v-for="(p, i) in detailPhotos"
                :key="i"
                @click="currentImageIndex = i"
                class="w-2.5 h-2.5 rounded-full"
                :class="i === currentImageIndex ? 'bg-white' : 'bg-white/50'"
              />
            </div>

            <button
              class="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow"
              @click="previousImage"
            >
              <svg
                class="w-5 h-5 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              class="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow"
              @click="nextImage"
            >
              <svg
                class="w-5 h-5 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <p
            class="mt-5 text-sm md:text-base text-gray-700 whitespace-pre-line"
          >
            {{ detailListing?.description }}
          </p>

          <div class="mt-5">
            <a
              :href="detailListing?.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
              >Voir sur Facebook</a
            >
          </div>

          <div class="mt-5 flex justify-center md:hidden">
            <button
              @click="closeDetail"
              class="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
@keyframes slideUp {
  from {
    transform: translateY(12%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slideUp {
  animation: slideUp 220ms ease-out;
}
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
