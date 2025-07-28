<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const searchQuery = ref("");

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push("/listings");
  }
};

const addFilter = (filter) => {
  if (!searchQuery.value.includes(filter)) {
    searchQuery.value += (searchQuery.value ? " " : "") + filter;
  }
};
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    <!-- Main Content -->
    <main
      class="flex flex-col items-center justify-center min-h-screen px-6 pt-24"
    >
      <!-- Main Heading -->
      <h1 class="text-4xl font-bold text-black text-center mb-4">
        Que recherchez-vous ?
      </h1>

      <!-- Subtitle -->
      <p class="text-gray-600 text-center mb-8 max-w-2xl">
        Décrivez votre appartement idéal et laissez l'IA vous aider à le
        trouver.
      </p>

      <!-- Search Input -->
      <div class="w-full max-w-2xl mb-8">
        <div class="relative">
          <textarea
            v-model="searchQuery"
            @keydown.enter.prevent="handleSearch"
            placeholder="Décrivez votre appartement idéal..."
            class="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md"
          ></textarea>
          <div class="absolute bottom-3 right-3">
            <div class="w-4 h-4 bg-gray-400 transform rotate-45"></div>
          </div>
        </div>
      </div>

      <!-- Filter Buttons -->
      <div class="w-full max-w-2xl">
        <!-- First Row -->
        <div class="flex flex-wrap gap-2 mb-3">
          <button
            @click="addFilter('+ 2 chambres')"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm text-black hover:bg-gray-200 transition-colors"
          >
            + 2 chambres
          </button>
          <button
            @click="addFilter('+ balcon')"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm text-black hover:bg-gray-200 transition-colors"
          >
            + balcon
          </button>
          <button
            @click="addFilter('+ proche métro')"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm text-black hover:bg-gray-200 transition-colors"
          >
            + proche métro
          </button>
        </div>

        <!-- Second Row -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="addFilter('+ 800€ max')"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm text-black hover:bg-gray-200 transition-colors"
          >
            + 800€ max
          </button>
          <button
            @click="addFilter('+ 50m²')"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm text-black hover:bg-gray-200 transition-colors"
          >
            + 50m²
          </button>
          <button
            @click="addFilter('+ ascenseur')"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm text-black hover:bg-gray-200 transition-colors"
          >
            + ascenseur
          </button>
          <button
            @click="addFilter('+ parking')"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm text-black hover:bg-gray-200 transition-colors"
          >
            + parking
          </button>
        </div>
      </div>
    </main>
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

  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  .text-sm {
    font-size: 0.75rem;
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
</style>
