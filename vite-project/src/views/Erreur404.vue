<script setup>
// Pas besoin d'importer utils s'il n'est pas utilisé
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Erreur 404</h1>
      <p class="text-xl mb-2">Cette page n'existe pas</p>
      <router-link to="/listings" class="text-blue-main hover:text-blue-700">
        Retourner à la page de listing
      </router-link>
    </div>
  </div>
</template>
