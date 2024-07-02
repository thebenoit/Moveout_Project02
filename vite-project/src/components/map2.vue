<template>
    <div>

        <div class="map-wrap">
            <div id="map" class="map"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defineProps } from 'vue';
import icon from '../assets/images/marker-icon.png';

const props = defineProps({
    apparts: Array,
});

const BING_API_KEY = 'Ajrg-Pgfa5E3sjD9qv43YUncbLhuhryhxUVANobgCYPCEz1rmzeUkhYt6b6xmGoZ';

let map;

onMounted(() => {
    // Create the map centered on Montreal
    map = L.map('map').setView([45.5017, -73.5673], 11);

    // Add a tile layer (using CartoDB Positron style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 30,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    console.log('Map initialized');
});

watch(
    () => props.apparts,
    (newApparts) => {
        if (newApparts && newApparts.length > 0) {
            console.log('apparts:', newApparts);

            newApparts.forEach((appart) => {
                const addressParts = appart.custom_sub_titles_with_rendering_flags.map(
                    (subtitleObj) => subtitleObj.subtitle
                );
                const address = addressParts.join(', ');
                console.log('address:', address);
                geocodeAddress(address,
                    new Intl.NumberFormat().format(appart.listing_price.amount),
                    appart.primary_listing_photo.image.uri);
            });
        } else {
            console.log('No apparts data available');
        }
    },
    { immediate: true }
);

async function geocodeAddress(address, price, uri) {
    try {
        console.log(`Geocoding address: ${address}`); // Debug: log the address being geocoded
        const response = await fetch(
            `https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(
                address
            )}&key=${BING_API_KEY}`
        );
        const data = await response.json();
        console.log(`Geocoding response for ${address}:`, data); // Debug: log the geocoding response

        if (data.resourceSets[0].resources.length > 0) {
            const location = data.resourceSets[0].resources[0].point.coordinates;
            // var icon = L.icon({iconUrl: icon})

            var iconMarker = L.icon({
                iconUrl: icon,
            });

            const marker = L.marker([location[0], location[1]], {icon: iconMarker}).addTo(map);

            marker.bindPopup(`<div class="da relative flex h-46  overflow-auto ">
  
  <div class="group relative m-0 flex h-22 w-96 rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto sm:max-w-lg">
    <div class="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
      <img src="${uri}" class="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110" alt="" />
    </div>
    <div class="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
      <h1 class="font-serif text-2xl font-bold text-white shadow-xl">${address}</h1>
      <h1 class="text-sm font-light text-gray-200 shadow-xl">${price}$</h1>
    </div>
  </div>
</div>`)
        } else {
            console.error('No results found for address:', address);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
}
</script>

<style scoped>
.map-wrap {
    position: relative;
    width: 100%;
    height: calc(100vh - 27px);
    /* Calculate height of the screen minus the heading */
    z-index: 1;
    /* Ensures the map is behind the navbar */
}

.map {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: -1;
    /* Ensures the map is behind the navbar */
}

.watermark {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 999;
}
</style>