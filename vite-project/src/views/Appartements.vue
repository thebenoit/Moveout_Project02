<script setup>
import { ref } from 'vue';
import CardItem from '../components/CardItem.vue';

const apparts = ref([
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
]);
</script>

<template>
  <div class="grid grid-cols-3 gap-5">
    <div v-for="appart in apparts" :key="appart.path">
      <CardItem 
        :path="appart.path"
        :label="appart.label"
        :src="appart.src"
        :text="appart.text"
      />
    </div>
  </div>
</template>
