<script setup>
import { ref, onMounted } from 'vue';
import CardItem from '../components/CardItem.vue';
import utils from '../utils/utils.js';
import Footer from '../components/Footer.vue'
import Map from '../components/map2.vue'

// Initialize the `apparts` ref as an empty array
const apparts = ref([]);

const isRendered = ref(false)

onMounted(async () => {
  // Await the result of `utils.get('appartments')` and assign it to `apparts.value`
  const response = await utils.get('appartments');
  apparts.value = response;
  console.log(apparts.value)
  isRendered.value = true
});
</script>


<template>

  <div class="flex h-screen ">

    <div class="flex-1">
      <Map :apparts="apparts"/>
    </div>

    <div class="flex-1 inset-0 overflow-auto">

      <div>
        <h1 class="text-xl font-bold mt-10">Résultats :{{ apparts.length }}</h1>
        <div class="flex flex-wrap gap-5 justify-around my-24 ">

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
            <CardItem :title="appart.custom_title" :price="new Intl.NumberFormat().format(appart.listing_price.amount)" :city="appart.location.reverse_geocode.city" :bedrooms="appart.bedrooms" :url="appart.url" :img="appart.primary_listing_photo.image.uri" />
          </div>
        </div>
      </div>

    </div>
  </div>


</template>
