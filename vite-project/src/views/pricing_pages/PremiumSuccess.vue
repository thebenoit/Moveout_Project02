<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();

onMounted(() => {
  router.replace({ path: "/", query: { premiumSuccess: "true" } });
});
</script>

<template>
  <div class="redirecting">Redirection vers l'accueil...</div>
</template>

<style scoped>
.redirecting {
  text-align: center;
  margin-top: 2rem;
}
</style>
