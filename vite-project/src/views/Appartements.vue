<script setup>
import { ref } from 'vue';
import CardItem from '../components/CardItem.vue';

const apparts = ref([
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    label: "test",
    text: "test"
  },
  
  {
    path: "https://google.com",
    src: "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
    label: "test",
    text: "test"
  },
  
]);
</script>

<template>
  <div class="px-72">
    <div class="flex flex-wrap gap-5 justify-between">
      <div v-for="appart in apparts" :key="appart.path">
        <CardItem 
          :path="appart.path"
          :label="appart.label"
          :src="appart.src"
          :text="appart.text"
        />
      </div>
    </div>
  </div>
</template>
