<script setup>
import { ref, onMounted } from 'vue';
import CardItem from '../components/CardItem.vue';
import utils from '../utils/utils.js';

// Initialize the `apparts` ref as an empty array
const apparts = ref([]);

onMounted(async () => {
  // Await the result of `utils.get('appartments')` and assign it to `apparts.value`
  const response = await utils.get('appartments');
  apparts.value = response;
});
</script>


<template>
  
  <div class="px-72">
    
    <div class="flex flex-wrap gap-5 justify-between">
      
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
</template>
