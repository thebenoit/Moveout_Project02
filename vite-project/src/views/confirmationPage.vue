<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Félicitations!</h1>
      
      <p class="text-lg text-gray-600 mb-6">
        Vous êtes maintenant abonné(e) à Moveout.ai. Pour accéder à notre service, 
        veuillez envoyer un message texte au:
      </p>
      
      <div class="bg-blue-50 p-4 rounded-lg mb-6">
        <p class="text-xl font-semibold text-blue-800">+1 (218) 595-3780</p>
      </div>
      
      <p class="text-gray-600 mb-8">
        Notre assistant intelligent vous aidera à trouver l'appartement idéal selon vos critères.
      </p>
      
      <button 
        @click="goToHome" 
        class="bg-blue-main hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
      >
        Retour à l'accueil
      </button>
    </div>
    
    <div class="mt-8 text-center text-gray-500">
      
    </div>
  </div>
</template>

<style scoped>
.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-blue-700 {
  background-color: #1d4ed8;
}
</style>
