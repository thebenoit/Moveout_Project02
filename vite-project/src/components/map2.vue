<template>
    <div>
        <div class="map-wrap ">

            <div id="map" class="map"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defineProps } from 'vue'

const props = defineProps({

    apparts: Array

})

// Initialize the map and add the marker on mount
onMounted(() => {
    // Create the map centered on Montreal
    const map = L.map('map').setView([45.5017, -73.5673], 13);

    // Add a tile layer (using CartoDB Positron style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Add a marker for Montreal
    L.marker([45.5017, -73.5673]).addTo(map)
        .bindPopup('Montreal')
        .openPopup();
});
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