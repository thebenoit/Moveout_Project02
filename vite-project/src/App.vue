<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <!-- <div id="app" class="min-h-screen flex flex-col">
    <Navbar />
    <div class="flex-grow">
      <RouterView />
    </div>
    <Footer />
  </div> -->
  <header class="w-full  bg-black shadow-lg items-center p-4">
      <Navbar />
    </header>
    <main class="flex-grow mt-9">
      <RouterView />
    </main>
    <Footer />

</template>
