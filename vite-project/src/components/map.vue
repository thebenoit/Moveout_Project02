

<template>
    <div>
        <p>{{props.apparts.length}}</p>
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
const BING_API_KEY = 'Ajrg-Pgfa5E3sjD9qv43YUncbLhuhryhxUVANobgCYPCEz1rmzeUkhYt6b6xmGoZ';

// Initialize the map and add the marker on mount
onMounted(() => {
    // Create the map centered on Montreal
    const map = L.map('map').setView([45.5017, -73.5673], 13);

    // Add a tile layer (using CartoDB Positron style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 30,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Function to geocode an address using Bing Maps API
    async function geocodeAddress(address) {
        try {
            // Make an API call to Bing's geocoding service to get coordinates for the given address
            const response = await fetch(`http://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(address)}&key=${BING_API_KEY}`);

            // Parse the JSON response from the API
            const data = await response.json();

            // Check if the response contains any results
            if (data.resourceSets[0].resources.length > 0) {

                // Extract the coordinates of the first result
                const location = data.resourceSets[0].resources[0].point.coordinates;

                // Add a marker to the map at the extracted coordinates
                const marker = L.marker([location[0], location[1]]).addTo(map)
                // Bind a popup to the marker with the address
                marker.bindPopup(address).openPopup();

            } else {
                // Log an error if no results were found
                console.error('No results found for address', address)
            }

        }
        catch (error) {
            // Log any errors that occur during the API call or processing
            console.error('Geocoding error:', error)

        }
    }

        /*geocodeAddress('6081 Avenue du Parc')
        geocodeAddress('1288 Avenue des Canadiens-de-Montréal')
        geocodeAddress('5595 Chemin de la Côte-des-Neiges')
        geocodeAddress('2377 Rue Gamache')*/
        
    console.log('apparts: ', props.apparts)  
    // Add a marker for Montreal
    props.apparts.map(appart => {
      
    const addressParts = appart.custom_sub_titles_with_rendering_flags.map(subtitleObj => subtitleObj.subtitle);
    const address = addressParts.join(', ');
    console.log('address: ', address)
    geocodeAddress(address);
  });

       /* props.apparts.forEach(appart => {
            console.log('appart: ', appart)
            geocodeAddress(appart);
        })*/
    
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