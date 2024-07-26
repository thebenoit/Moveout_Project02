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
    <div class="h-screen">
      <div class="flex h-1/2 w-full flex-col justify-center overflow-hidden bg-[url(@/assets/images/main1.jpg)] bg-center py-12" style="background-size: 120%;">
        <div class="mx-auto font-poppins text-5xl mb-6 text-white">Trouve un appartement abordable</div>
        <input type="text" placeholder="Type here" class="input input-bordered mx-auto w-5/6 min-w-72 max-w-lg" />
      </div>
      <p class="mt-12 text-center text-3xl text-blue-main font-bold">How does it work ?</p>
      <div class="mt-10 flex justify-around">
        <div class="card w-1/5 bg-base-100 shadow-none rounded-none">
          <figure>
            <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-blue-main">Shoes!</h2>
            <p class="text-lg">If a dog chews shoes whose shoes does he choose?</p>
          </div>
        </div>
        <div class="card w-1/5 bg-base-100 shadow-none rounded-none">
          <figure>
            <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-blue-main">Shoes!</h2>
            <p class="text-lg">If a dog chews shoes whose shoes does he choose?</p>
          </div>
        </div>
        <div class="card w-1/5 bg-base-100 shadow-none rounded-none">
          <figure>
            <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-blue-main">Shoes!</h2>
            <p class="text-lg">If a dog chews shoes whose shoes does he choose?</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-around mb-10">
        <button class="btn mt-16 w-full sm:w-1/2">
          <p>
            Start today for
            <u>free</u>
            !
          </p>
        </button>
      </div>
  </div>
 

</template>
