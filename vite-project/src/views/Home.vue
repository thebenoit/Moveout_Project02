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
  <div>

    <div class="mx-auto bg-fixed bg-no-repeat flex h-[35dvh] w-full flex-col justify-center overflow-hidden bg-center bg-cover bg-[url(@/assets/images/main1.jpg)]">
      <div class="mx-auto font-poppins text-5xl mb-6 text-white text-center">Trouve un appartement abordable</div>
      <input type="text" placeholder="Chercher par quartier ou ville" class="input input-bordered mx-auto w-5/6 min-w-72 max-w-lg" />
    </div>

    <p class="mt-12 text-center text-3xl text-blue-main font-bold">Comment ça marche ?</p>
    <div class="mt-10 flex justify-around sm:flex-row flex-col">
      <div class="card sm:w-1/5 bg-base-100 mx-auto w-3/4 shadow-none rounded-none ml-44">
        <figure>
          <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-blue-main">1. Inscrivez-vous sur Move out</h2>
          <p class="text-lg">Moveout.ai recherche  tout les site web de listing sur internet... vraiment tout</p>
        </div>
      </div>
      <div class="card sm:w-1/5 bg-base-100 mx-auto w-3/4 shadow-none rounded-none">
        <figure>
          <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-blue-main">2. Communiquez nous vos préférences</h2>
          <p class="text-lg">Moveout.ai  Analyse les meilleures listings selon vos gout et préférences jours et nuits</p>
        </div>
      </div>
      <div class="card sm:w-1/5 bg-base-100 mx-auto w-3/4 shadow-none rounded-none mr-44">
        <figure>
          <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-blue-main">3. Relaxez, on s'occupe du reste</h2>
          <p class="text-lg">Dès qu'un appartement apparait sur le web vous serez le premier à le savoir</p>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-around my-10">
    <button class="btn mt-16 md:w-96 w-1/2 min-w-max bg-blue-main text-white text-3xl tracking-wide font-bold btn-lg shadow-cyan-100 hover:shadow-cyan-500 hover:bg-blue-main shadow-2xl transition-all duration-500 ease-in-out border-none">
      <p>
        Start today for
        <u>free</u>
        !
      </p>
    </button>
  </div>


</template>
