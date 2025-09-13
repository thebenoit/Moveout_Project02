
<script setup>
import { ref } from 'vue';

const titres = ref([
  "Quelle appartement recherchez-vous ?",
  "Votre maison rêvée est à quel prix ?",
  "Quelles sont vos préférences pour votre futur appartement ?"
]);
</script>

<template>
    <h1 class="text-center">{{ titres[Math.floor(Math.random() * titres.length)] }}</h1>
</template>