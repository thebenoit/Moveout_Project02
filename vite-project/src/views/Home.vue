<script setup>

import { useRouter } from 'vue-router';
import Hero from "../components/HeroSection.vue"



const router = useRouter();

function handleSubmitButton() {
  router.push('/appartements')
  console.log('vers appartmentd')
}
</script>


<template>
  
  <div class="hero overflow-hidden h-screen w-full">
    <img class="inset-0 object-cover h-screen w-full" src="@/assets/images/pexels-5.jpg"></img>
    <div class="hero-overlay bg-opacity-65 inset-0"></div>
    <div class="hero-content text-center text-neutral-content relative z-10 flex items-center justify-center w-full ">
      <div class="">
        <h1 class="mb-5 text-4xl font-bold ">À la recherche d'un appartement abordable?</h1>
        <button class="btn btn-outline m-10 bg-cyan-500 border-none hover:bg-cyan-400 hover:shadow-cyan-300 hover:shadow-lg" @click="handleSubmitButton">Trouver Un Appartement!</button>
      </div>
    </div>
  </div>
</template>

<style>

</style>
