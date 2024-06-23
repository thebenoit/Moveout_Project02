
<template>
    <div class="map-wrap mt-8">
        <a href="https://www.maptiler.com" class="watermark"><img src="https://api.maptiler.com/resources/logo.svg"
                alt="MapTiler logo" /></a>
        <div class="map" ref="mapContainer"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Map, NavigationControl, Marker } from 'maplibre-gl';

const mapContainer = ref(null);
const map = ref(null);

onMounted(() => {
  const apiKey = 'xHvaxBPFLYXl4wDWBKMi'; // Use environment variables for better security
  const initialState = { lng: -73.67556, lat: 45.53778, zoom: 9 };

  // Initialize the map
  map.value = new Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom,
  });
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove(); // Clean up the map instance on unmount
  }
});
</script>



<style scoped>
@import 'maplibre-gl/dist/maplibre-gl.css';

.map-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 77px); /* Calculate height of the screen minus the heading */
}

.map {
  position: relative;
  width: 100%;
  height: 100%;
}

.watermark {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 999;
}
</style>
