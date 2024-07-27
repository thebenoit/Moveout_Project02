<script setup>
import utils from "../../utils/utils.js";
import MultiSlider from "../../components/ui/input/multirange-input/multiRangeInput.vue"
import {ref} from 'vue'

const minValue = ref(0);
const maxValue = ref(100);
</script>

<template>
  <div class="h-screen">
    <section>
      <h1 class="text-xl text-blue-main text-center">
        Comprendre vos préférences...
      </h1>
    </section>

    <section>
      <div class="bg-gray-200 m-10 border-2 rounded-md  shadow-lg">
        <h2 class="m-2 text-gray-500 text-center">
          ces réponses nous permetra de selectionner les appartements qui vous
          correspondent le mieux
        </h2>
      </div>

      <div>
        <div class="card card-body border-2 w-full">
          <div class="card card-body border-2 m-5 shadow-lg rounded-lg">
            <h1 class="text-blue-main text-center mb-5">Combien de chambre?</h1>
            <div class=" ">
              <ul class="flex flex-row justify-center ">
                <li><p class="btn btn-active m-2">1</p></li>
                <li><p class="btn btn-active m-2">2</p></li>
                <li><p class="btn btn-active m-2">3</p></li>
                <li><p class="btn btn-active m-2">4</p></li>
                <li><p class="btn btn-active m-2">5+</p></li>
              </ul>
            </div>
            
          </div>
          <div class="card card-body border-2 m-5 shadow-lg rounded-lg">
            <h1 class="text-center mb-5 text-blue-main">Votre Budget</h1>

            <MultiSlider :min="0" :max="100" @update:minValue="minValue = $event" @update:maxValue="maxValue = $event"></MultiSlider>
          </div>
          
        </div>
      </div>
    </section>

    <div class="hero overflow-hidden flex flex-col justify-end w-full">
      <ul class="steps">
        <li class="step step-primary">Register</li>
        <li class="step step-primary">Choose plan</li>
        <li class="step step-primary">Purchase</li>
        <li class="step step-primary">Receive Product</li>
      </ul>
    </div>
  </div>
</template>
