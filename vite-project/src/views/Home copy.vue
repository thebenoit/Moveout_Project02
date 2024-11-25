<script setup>
import { useRouter } from 'vue-router';
import Hero from "../components/HeroSection.vue";
import conect from '@/assets/images/conect.png';
import camionDemenage from '@/assets/images/camionDemenage.svg';
import robot from '@/assets/images/robot.png';
import detente from '@/assets/images/detente.png';
import homeImg from '@/assets/images/main1.jpg'

const router = useRouter();

function handleSubmitButton() {
  router.push('/listings');
  console.log('Navigating to apartments...');
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center">
    <!-- Hero Section -->
    <div class="bg-fixed bg-no-repeat bg-cover bg-center h-[35vh] w-full flex items-center justify-center" 
        :style="{ backgroundImage: `url(${homeImg})` }"
         >
      <div class="text-center text-white">
        <h1 class="font-poppins text-4xl md:text-5xl mb-6">Trouve un appartement abordable</h1>
        <button 
          @click="handleSubmitButton"
          class="bg-blue-main text-white py-3 px-6 rounded-full text-lg md:text-xl font-semibold hover:bg-blue-700 transition-colors">
          Commencer la recherche
        </button>
      </div>
    </div>

    <!-- How It Works Section -->
    <section class="text-center mt-12 w-full px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-blue-main mb-8">Comment ça marche ?</h2>
      <div class="flex flex-col md:flex-row justify-around items-center">
        <!-- Step 1 -->
        <div class="flex flex-col items-center mb-10 md:mb-0 max-w-xs">
          <img :src="conect" alt="Inscrivez-vous" class="w-32 h-32 mb-4">
          <h3 class="text-xl font-semibold mb-2 text-blue-main">1. Inscrivez-vous sur Moveout</h3>
          <p class="text-gray-600">Moveout.ai recherche tout les sites web de listing sur internet... vraiment tout.</p>
        </div>
        <!-- Step 2 -->
        <div class="flex flex-col items-center mb-10 md:mb-0 max-w-xs">
          <img :src="robot" alt="Préférences" class="w-32 h-32 mb-4">
          <h3 class="text-xl font-semibold mb-2 text-blue-main">2. Communiquez-nous vos préférences</h3>
          <p class="text-gray-600">Moveout.ai analyse les meilleurs listings selon vos goûts et préférences jour et nuit.</p>
        </div>
        <!-- Step 3 -->
        <div class="flex flex-col items-center max-w-xs">
          <img :src="detente" alt="Relaxez" class="w-32 h-32 mb-4">
          <h3 class="text-xl font-semibold mb-2 text-blue-main">3. Relaxez, on s'occupe du reste</h3>
          <p class="text-gray-600">Dès qu'un appartement apparaît sur le web, vous serez le premier à le savoir.</p>
        </div>
      </div>
    </section>

    <!-- Start Button Section -->
    <div class="flex justify-center my-12">
      <button 
        @click="handleSubmitButton"
        class="bg-blue-main text-white py-4 px-8 rounded-full text-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
        Start today for <u>free</u>!
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add custom styles for responsiveness */
@media (min-width: 768px) {
  .text-3xl {
    font-size: 2rem;
  }
  .text-4xl {
    font-size: 2.5rem;
  }
  .text-5xl {
    font-size: 3rem;
  }
}
</style>
