<script setup>
import Pricing from "@/components/pricing.vue";
</script>

<template>
  <div class="pricing-page">
    <Pricing />
  </div>
</template>

<style scoped>
.pricing-page {
  padding-top: 80px; /* espace pour la navbar fixe */
  display: flex;
  justify-content: center;
}

@media (max-width: 640px) {
  .pricing-page {
    padding-top: 70px;
  }
}
</style>
