<template>
    <div class="flex justify-center items-center">
      <div class="relative max-w-xl w-full">
        <div>
          <input
            type="range"
            step="100"
            :min="min"
            :max="max"
            @input="mintrigger"
            v-model="minprice"
            class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
          />
  
          <input
            type="range"
            step="100"
            :min="min"
            :max="max"
            @input="maxtrigger"
            v-model="maxprice"
            class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
          />
  
          <div class="relative z-10 h-2">
            <div class="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-gray-200"></div>
            <div
              class="absolute z-20 top-0 bottom-0 rounded-md bg-blue-main"
              :style="{ right: maxthumb + '%', left: minthumb + '%' }"
            ></div>
            <div
              class="absolute z-30 w-6 h-6 top-0 left-0 bg-blue-main rounded-full -mt-2 -ml-1"
              :style="{ left: minthumb + '%' }"
            ></div>
            <div
              class="absolute z-30 w-6 h-6 top-0 right-0 bg-blue-main rounded-full -mt-2 -mr-3"
              :style="{ right: maxthumb + '%' }"
            ></div>
          </div>
        </div>
  
        <div class="flex justify-between items-center py-5">
          <div>
            <input
              type="text"
              maxlength="5"
              @input="mintrigger"
              v-model="minprice"
              class="px-3 py-2 border border-gray-200 rounded w-24 text-center"
            />
          </div>
          <div>
            <input
              type="text"
              maxlength="5"
              @input="maxtrigger"
              v-model="maxprice"
              class="px-3 py-2 border border-gray-200 rounded w-24 text-center"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits,onMounted } from 'vue';

  const emit = defineEmits(['update:minValue', 'update:maxValue']);
  
  const minprice = ref(1000);
  const maxprice = ref(7000);
  const min = ref(100);
  const max = ref(10000);
  const minthumb = ref(0);
  const maxthumb = ref(0);
  
  const mintrigger = () => {
    minprice.value = Math.min(minprice.value, maxprice.value - 500);
    minthumb.value = ((minprice.value - min.value) / (max.value - min.value)) * 100;
    emit('update:minValue', minprice.value);
  };
  
  const maxtrigger = () => {
    maxprice.value = Math.max(maxprice.value, minprice.value + 500);
    maxthumb.value = 100 - (((maxprice.value - min.value) / (max.value - min.value)) * 100);
    emit('update:maxValue', maxprice.value);  // Émet l'événement avec la nouvelle valeur
  };
  
  onMounted(() => {
  mintrigger();
  maxtrigger();
});
  </script>
  
  <style scoped>
  input[type="range"]::-webkit-slider-thumb {
    pointer-events: all;
    width: 24px;
    height: 24px;
    -webkit-appearance: none;
  }
  </style>
  