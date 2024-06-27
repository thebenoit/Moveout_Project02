<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <header class="w-full bg-black shadow-lg items-center">
    <Navbar />
  </header>
  <main class="flex-grow h-full">
    <RouterView />
  </main>
  <Footer />
</template>
