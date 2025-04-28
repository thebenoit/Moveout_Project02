<script setup>
import { defineProps } from "vue";

const props = defineProps({
  titre: {
    type: String,
    required: true,
  },
  prix: {
    type: String,
    default: "0$/mois",
  },
  prix_rabais: {
    type: String,
    default: "0$/mois",
  },
  buttonText: {
    type: String,
    default: "Continuer Gratuitement",
  },
  buttonLink: {
    type: String,
    default: "",
  },
  points: {
    type: Array,
    default: () => [],
  },
  isPositive: {
    type: Boolean,
    default: false,
  },
  borderColor: {
    type: String,
    default: "black-600",
  },
  shadowColor: {
    type: String,
    default: "black-600",
  },
  buttonColor: {
    type: String,
    default: "black",
  },
  buttonTextColor: {
    type: String,
    default: "white",
  },
});

const handleButtonClick = () => {
  if (props.buttonLink) {
    if (props.buttonLink.startsWith("http")) {
      window.open(props.buttonLink, "_blank");
    } else {
      // Assuming vue-router is available in the parent component
      // This will be handled by the parent component
      this.$emit("button-click");
    }
  }
};
</script>

<template>
  <div
    class="flex flex-col border-2 shadow-lg rounded-3xl bg-white ring-1 ring-black/10"
    :class="{
      'border-yellow-500': borderColor === 'yellow-500',
      'border-blue-main': borderColor === 'blue-main',
      'border-black-600': borderColor === 'black-600',
      'shadow-yellow-500': shadowColor === 'yellow-500',
      'shadow-blue-main': shadowColor === 'blue-main',
      'shadow-black-600': shadowColor === 'black-600',
    }"
  >
    <div class="p-8 pb-0 sm:p-10 sm:pb-0">
        <div class="flex justify-center items-center text-white bg-red-500 rounded-md shadow-md font-bold w-32 text-center mx-auto mb-3">
            <p>50% rabais</p>
        </div>
      <h3
        class="text-2xl font-semibold leading-8 tracking-tight mb-2"
        :class="{
          'text-yellow-500': borderColor === 'yellow-500',
          'text-blue-main': borderColor === 'blue-main',
          'text-black-600': borderColor === 'black-600',
        }"
        id="tier-hobby"
      >
        {{ titre }}
      </h3>
      <h3
        class="text-2xl font-semibold leading-8 tracking-tight mb-5"
        :class="{
          'text-yellow-500': buttonColor === 'yellow-500',
          'text-blue-main': buttonColor === 'blue-main',
          'text-black': buttonColor === 'black',
        }"
        id="tier-team"
      >
        {{ prix }}
        <p class=" text-gray-500 text-sm">au lieu de {{ prix_rabais }}</p>
      </h3>
      
      <a
        @click="handleButtonClick"
        class="inline-block mb-5 px-4 py-2 rounded-full w-full text-center"
        :class="{
          'bg-yellow-500': buttonColor === 'yellow-500',
          'bg-blue-main': buttonColor === 'blue-main',
          'bg-black': buttonColor === 'black',
          'text-white': buttonTextColor === 'white',
        }"
      >
        {{ buttonText }}
      </a>
    </div>
    <div class="flex flex-1 flex-col p-2 pt-0">
      <div
        class="flex flex-1 flex-col justify-between rounded-2xl p-6 pt-0 sm:p-8"
      >
        <ul role="list" class="space-y-6">
          <li
            v-for="(point, index) in points"
            :key="index"
            class="flex items-start"
          >
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6"
                :class="`text-${borderColor}`"
                xmlns="http://www.w3.org/2000/svg"
                :fill="isPositive ? 'none' : undefined"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="
                    isPositive
                      ? 'M4.5 12.75l6 6 9-13.5'
                      : 'M6 18L18 6M6 6l12 12'
                  "
                ></path>
              </svg>
            </div>
            <p class="ml-3 text-sm leading-6 text-gray-600">
              {{ point }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
