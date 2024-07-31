<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <!-- <header class="w-full bg-black shadow-lg items-center font-poppins">
    <Navbar />
  </header> -->
  <main class="flex-grow h-full font-poppins mt-20">
    <RouterView />
  </main>
  <!-- <Footer /> -->
</template>
