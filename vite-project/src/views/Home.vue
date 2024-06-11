<template>
  <div>
    <HeroSection />
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
// Importez les autres composants si nécessaire

export default {
  name: 'Home',
  components: {
    HeroSection,
    // Décommentez et importez les autres composants si nécessaire
    // Cards,
    // Demenagement,
    // Footer
  }
}
</script>

<style scoped>
/**@import '../../App.css';*/
</style>
