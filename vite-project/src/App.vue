<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <header class="w-full bg-black shadow-lg items-center p-4">
    <Navbar />
  </header>
  <main class="flex-grow">
    <RouterView />
  </main>
  <Footer />
</template>
