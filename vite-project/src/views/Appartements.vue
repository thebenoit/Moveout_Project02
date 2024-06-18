<script setup>
import { ref, onMounted } from 'vue';
import CardItem from '../components/CardItem.vue';
import utils from '../utils/utils.js';
import Footer from '../components/Footer.vue'

// Initialize the `apparts` ref as an empty array
const apparts = ref([]);

const isRendered = ref(false)

onMounted(async () => {
  // Await the result of `utils.get('appartments')` and assign it to `apparts.value`
  const response = await utils.get('appartments');
  apparts.value = response;
  isRendered.value = true
});
</script>


<template>
  
  <div class="flex inset-0 bg-slate-500">
    <div>
      <div class="flex flex-wrap gap-5 justify-between mx-32 mt-24">
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
        
      
        <div v-for="appart in apparts" :key="appart.url">
          
          <CardItem
            :title="appart.title"
            :price="appart.price"
            :city="appart.city"
            :bedrooms="appart.bedrooms"
            :url="appart.url"
            :img="appart.img"
          />
        </div> 
      </div>

    </div>   
  </div>
</template>
