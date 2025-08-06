<script setup>
import { ref } from "vue";
import ListingCard from "../components/listingCard.vue";

// Données réelles pour le listing card (appartement de Mirabel)
const testListingData = ref({
  id: "735722512514179",
  img: "https://scontent.fbps3-1.fna.fbcdn.net/v/t45.5328-4/524367999_1271636137671899_3776660177679562695_n.jpg?stp=c0.133.320.159a_dst-jpg_p320x320_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=vDAV4KoRHykQ7kNvwHzl7Xp&_nc_oc=AdlqDUVJJqiyKL71rAySroZcZAz43KOEppjJCMFZ-e0CmND7-QHCGTQvA4_3lNuhHkY&_nc_zt=23&_nc_ht=scontent.fbps3-1.fna&_nc_gid=09fhxdJkJ74B3P6gYshbVA&oh=00_AfXfLQQN8Ja59cZvDLrXb38UukIP7hMaW7-J6HtzZQwPwA&oe=68996754",
  city: "Mirabel",
  address: "18164 Rue Charles, Mirabel, QC",
  bedrooms: "2",
  bathrooms: "1",
  rating: 4,
  price: 1295,
  location: {
    lat: 45.70406,
    lng: -73.9224,
  },
  // Données supplémentaires pour les tests
  title: "Appartement de 2 chambres et 1 salle de bain",
  surface: "950 sq ft",
  budget: "CA$1,295",
  photos: [
    "https://scontent.fbps3-1.fna.fbcdn.net/v/t45.5328-4/524367999_1271636137671899_3776660177679562695_n.jpg?stp=c0.133.320.159a_dst-jpg_p320x320_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=vDAV4KoRHykQ7kNvwHzl7Xp&_nc_oc=AdlqDUVJJqiyKL71rAySroZcZAz43KOEppjJCMFZ-e0CmND7-QHCGTQvA4_3lNuhHkY&_nc_zt=23&_nc_ht=scontent.fbps3-1.fna&_nc_gid=09fhxdJkJ74B3P6gYshbVA&oh=00_AfXfLQQN8Ja59cZvDLrXb38UukIP7hMaW7-J6HtzZQwPwA&oe=68996754",
    "https://scontent.fbps3-1.fna.fbcdn.net/v/t45.5328-4/525193683_1399675287979423_9200114929251910696_n.jpg?stp=c0.133.320.159a_dst-jpg_p320x320_tt6&_nc_cat=108&ccb=1-7&_nc_sid=247b10&_nc_ohc=fNzDlnqdx-sQ7kNvwFo3Mz8&_nc_oc=Adkvy3vjNNtjBPJxoTIS_K9cMjy8byVuKVYEnO8txgUurqE6HYcuKAdjgJB0o66qAl0&_nc_zt=23&_nc_ht=scontent.fbps3-1.fna&_nc_gid=09fhxdJkJ74B3P6gYshbVA&oh=00_AfWz2zHZ3tt3fEaIcP_6Dp8XoOmoHrt-S1L8mkfUGkB46A&oe=68998B64",
    "https://scontent.fbps3-1.fna.fbcdn.net/v/t45.5328-4/524988863_760245623090508_6266479193706617913_n.jpg?stp=c0.133.320.159a_dst-jpg_p320x320_tt6&_nc_cat=109&ccb=1-7&_nc_sid=247b10&_nc_ohc=3_tcIu71dLUQ7kNvwHp3mnc&_nc_oc=AdlQ1gHMaZMVdKopow_bR6iJ36-jW7Fk0iqN4L7xEXKYMk9HOtmXnWqm43tdj5m33wg&_nc_zt=23&_nc_ht=scontent.fbps3-1.fna&_nc_gid=09fhxdJkJ74B3P6gYshbVA&oh=00_AfXuah3f5lCPwwRYw51czesiyWBmCaT1fsfsuLZxKZl8jQ&oe=689974F9",
    "https://scontent.fbps3-1.fna.fbcdn.net/v/t45.5328-4/523920578_1259487992543497_7873085187870958507_n.jpg?stp=c0.133.320.159a_dst-jpg_p320x320_tt6&_nc_cat=109&ccb=1-7&_nc_sid=247b10&_nc_ohc=5_QyYVLPDxYQ7kNvwEDmEg7&_nc_oc=Adkcy4ql31Qsa4txVWtw94McyiKcSiKW_Zn9bxViY3ntH6CExfFuGbNhrpuoKxGeNSY&_nc_zt=23&_nc_ht=scontent.fbps3-1.fna&_nc_gid=09fhxdJkJ74B3P6gYshbVA&oh=00_AfUOmJLlR1NgWBoEYfavRjTtN6TML8YMR0ax0khf6qWT2w&oe=68995DAE",
    "https://scontent.fbps3-1.fna.fbcdn.net/v/t45.5328-4/524714241_1302874864791197_3135990938000446179_n.jpg?stp=c0.133.320.159a_dst-jpg_p320x320_tt6&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=hkTQ_KjGSkcQ7kNvwG4AWvw&_nc_oc=AdnX1G_oYwDaUILr2BuDPi3fC4elsnnlYxWPQ5HpzeoDZiLdc0jiGpc-VMzRLS5TZpk&_nc_zt=23&_nc_ht=scontent.fbps3-1.fna&_nc_gid=09fhxdJkJ74B3P6gYshbVA&oh=00_AfU_aSUyIYQWhlaZZ4vcJz8hhKB79LP6mHncEyXy2od33A&oe=6899900E",
  ],
});

// État du carrousel
const currentImageIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

// Navigation du carrousel
const nextImage = () => {
  if (currentImageIndex.value < testListingData.value.photos.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0; // Retour au début
  }
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = testListingData.value.photos.length - 1; // Aller à la fin
  }
};

// Gestion du swipe tactile
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
};

const handleTouchEnd = (event) => {
  touchEndX.value = event.changedTouches[0].clientX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 50; // Seuil minimum pour déclencher le swipe
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe vers la gauche -> image suivante
      nextImage();
    } else {
      // Swipe vers la droite -> image précédente
      previousImage();
    }
  }
};

// Navigation par clavier
const handleKeyDown = (event) => {
  if (event.key === "ArrowLeft") {
    previousImage();
  } else if (event.key === "ArrowRight") {
    nextImage();
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- En-tête avec onglets -->
    <div class="flex items-center p-3 md:p-4 border-b border-gray-200 bg-white">
      <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          class="px-3 md:px-4 py-1.5 md:py-2 text-gray-900 bg-white rounded-md text-xs md:text-sm font-medium shadow-sm"
        >
          Preview
        </button>
        <button
          class="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 rounded-md text-xs md:text-sm font-medium hover:text-gray-900"
        >
          Code
        </button>
      </div>
    </div>

    <!-- Zone de contenu principal -->
    <div class="flex-1 flex items-center justify-center p-4 md:p-8">
      <div class="relative w-full max-w-4xl">
        <!-- Bouton de navigation gauche -->
        <button
          @click="previousImage"
          class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block"
          :class="{ 'opacity-50 cursor-not-allowed': currentImageIndex === 0 }"
        >
          <div
            class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
          >
            <svg
              class="w-5 h-5 md:w-6 md:h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </div>
        </button>

        <!-- Indicateur de position -->
        <div class="text-center mb-4">
          <span class="text-sm text-gray-600">
            {{ currentImageIndex + 1 }} sur
            {{ testListingData.photos.length }}
          </span>
        </div>

        <!-- Carrousel d'images -->
        <div
          class="relative overflow-hidden rounded-lg mx-2 md:mx-16 shadow-lg border border-gray-200"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
          @keydown="handleKeyDown"
          tabindex="0"
        >
          <div class="flex transition-transform duration-300 ease-in-out">
            <img
              :src="testListingData.photos[currentImageIndex]"
              :alt="`Image ${currentImageIndex + 1} de l'appartement`"
              class="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
            />
          </div>

          <!-- Indicateurs de navigation (points) -->
          <div
            class="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2"
          >
            <button
              v-for="(photo, index) in testListingData.photos"
              :key="index"
              @click="currentImageIndex = index"
              class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors"
              :class="index === currentImageIndex ? 'bg-white' : 'bg-white/50'"
            ></button>
          </div>
        </div>

        <!-- Informations du listing -->
        <div class="mt-4 md:mt-6 mx-2 md:mx-16">
          <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2">
            {{ testListingData.title }}
          </h3>
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 space-y-1 sm:space-y-0"
          >
            <span>{{ testListingData.city }}</span>
            <span class="font-semibold text-green-600">{{
              testListingData.budget
            }}</span>
          </div>
          <div
            class="flex flex-wrap items-center mt-2 text-xs md:text-sm text-gray-500"
          >
            <span>{{ testListingData.bedrooms }} chambres</span>
            <span class="mx-1 md:mx-2">•</span>
            <span>{{ testListingData.bathrooms }} salle(s) de bain</span>
            <span class="mx-1 md:mx-2">•</span>
            <span>{{ testListingData.surface }}</span>
          </div>
        </div>

        <!-- Bouton de navigation droite -->
        <button
          @click="nextImage"
          class="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block"
          :class="{
            'opacity-50 cursor-not-allowed':
              currentImageIndex === testListingData.photos.length - 1,
          }"
        >
          <div
            class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
          >
            <svg
              class="w-5 h-5 md:w-6 md:h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Informations de debug en bas -->
    <div class="p-3 md:p-4 border-t border-gray-200 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gray-50 rounded-lg p-3 md:p-4">
          <h3 class="text-gray-900 font-semibold mb-2 text-sm md:text-base">
            Données de test :
          </h3>
          <div class="text-gray-600 text-xs md:text-sm space-y-1">
            <p>
              <span class="text-gray-500">Titre :</span>
              {{ testListingData.title }}
            </p>
            <p>
              <span class="text-gray-500">Surface :</span>
              {{ testListingData.surface }}
            </p>
            <p>
              <span class="text-gray-500">Budget :</span>
              {{ testListingData.budget }}
            </p>
            <p>
              <span class="text-gray-500">Photos :</span>
              {{ testListingData.photos.length }} images
            </p>
            <p>
              <span class="text-gray-500">Coordonnées :</span>
              {{ testListingData.location.lat }},
              {{ testListingData.location.lng }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques pour la page de test */
.min-h-screen {
  min-height: 100vh;
}

/* Animation d'entrée pour les éléments */
.rounded-lg {
  animation: fadeInUp 0.5s ease-out;
}

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

/* Effet de hover pour les boutons de navigation */
button:hover .bg-white {
  background-color: #f9fafb;
}

/* Responsive design amélioré */
@media (max-width: 1024px) {
  .max-w-4xl {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .mx-2.md\:mx-16 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  /* Ajustements pour mobile */
  .h-96 {
    height: 16rem;
  }

  .text-lg {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .mx-2.md\:mx-16 {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }

  .h-96 {
    height: 14rem;
  }

  /* Masquer les boutons de navigation sur mobile */
  .hidden.md\:block {
    display: none;
  }

  /* Indicateurs plus visibles sur mobile */
  .w-2.h-2 {
    width: 0.5rem;
    height: 0.5rem;
  }
}

@media (max-width: 480px) {
  .mx-2.md\:mx-16 {
    margin-left: 0;
    margin-right: 0;
  }

  .h-96 {
    height: 12rem;
  }

  /* Espacement réduit sur très petit écran */
  .space-x-1 {
    gap: 0.125rem;
  }

  .space-y-1 {
    gap: 0.125rem;
  }
}

/* Amélioration de l'accessibilité */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Transition fluide pour les images */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}
</style>
