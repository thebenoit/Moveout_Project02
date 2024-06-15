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
  
  <div class="hero overflow-hidden min-h-screen w-screen ">
    <video class="inset-0 h-full object-cover min-h-screen min-w-screen fixed -z-10  " src="@/assets/videos/mtlStreet.mp4" autoplay loop muted></video>
    <div class="hero-overlay bg-opacity-65 inset-0"></div>
    <div class="hero-content text-center text-neutral-content relative z-10 flex items-center justify-center w-full h-full w-full">
      <div class="max-w-md">
        <h1 class="mb-5 text-4xl font-bold ">Tu cherches un Appartement Abordable?</h1>
        <p>Appuie sur le bouton ci-dessous</p>
        <button class="btn btn-outline m-10" @click="handleSubmitButton">Trouver Un Appartement!</button>
      </div>
    </div>
  </div>
</template>

<style>

</style>
