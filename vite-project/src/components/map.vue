<template>
    <div class="map-wrap mt-8">
        <a href="https://www.maptiler.com" class="watermark"><img src="https://api.maptiler.com/resources/logo.svg"
                alt="MapTiler logo" /></a>
        <div class="map" ref="mapContainer"></div>
    </div>
</template>

<script>
import { Map } from 'maplibre-gl';
import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';

export default {
    name: "Map",
    setup() {
        const mapContainer = shallowRef(null);
        const map = shallowRef(null);

        onMounted(() => {
            const apiKey = 'xHvaxBPFLYXl4wDWBKMi';

            const initialState = { lng: -73.67556, lat: 45.53778, zoom: 9 };

            map.value = markRaw(new Map({
                container: mapContainer.value,
                style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
                center: [initialState.lng, initialState.lat],
                zoom: initialState.zoom
            }));

        }),
            onUnmounted(() => {
                map.value?.remove();
            })

        return {
            map, mapContainer
        };
    }
};
</script>


<style scoped>
@import 'node_modules/maplibre-gl/dist/maplibre-gl.css';


.map-wrap {
    position: relative;
    width: 100%;
    height: calc(100vh - 77px);
    /* calculate height of the screen minus the heading */
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