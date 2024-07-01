<template>
    <div>
        <p>{{ props.apparts.length }}</p>
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

const props = defineProps({
    apparts: Array,
});

const BING_API_KEY = 'Ajrg-Pgfa5E3sjD9qv43YUncbLhuhryhxUVANobgCYPCEz1rmzeUkhYt6b6xmGoZ';

let map;

onMounted(() => {
    // Create the map centered on Montreal
    map = L.map('map').setView([45.5017, -73.5673], 13);

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
                geocodeAddress(address);
            });
        } else {
            console.log('No apparts data available');
        }
    },
    { immediate: true }
);

async function geocodeAddress(address) {
    try {
        console.log(`Geocoding address: ${address}`); // Debug: log the address being geocoded
        const response = await fetch(
            `http://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(
                address
            )}&key=${BING_API_KEY}`
        );
        const data = await response.json();
        console.log(`Geocoding response for ${address}:`, data); // Debug: log the geocoding response

        if (data.resourceSets[0].resources.length > 0) {
            const location = data.resourceSets[0].resources[0].point.coordinates;
            const marker = L.marker([location[0], location[1]]).addTo(map);
            marker.bindPopup(address).openPopup();
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