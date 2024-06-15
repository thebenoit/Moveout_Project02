<script setup>
import navbar from "./components/Navbar.vue"
import Footer from './components/Footer.vue'

</script>

<template>
  
  
  <main >

    <div class="flex-grow  ">
    <navbar />
    <RouterView />
    <Footer />
    
    
    </div>
    
    

  </main>
</template>