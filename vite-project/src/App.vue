<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="w-full bg-black shadow-lg items-center font-poppins">
      <Navbar />
    </header>
    <main class="flex-grow font-poppins mt-20">
      <RouterView />
    </main>
    <Footer class="mt-16"/>
  </div>
</template>
