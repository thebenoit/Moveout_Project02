<script setup>
import utils from '../utils/utils.js';
import { ref, onMounted, computed, watch } from 'vue';

// leaflet
import { LMap, LTileLayer, LControlZoom, LMarker } from "@vue-leaflet/vue-leaflet";
import { LMarkerClusterGroup } from 'vue-leaflet-markercluster'
import "leaflet/dist/leaflet.css";
//import 'vue-leaflet-markercluster/dist/style.css'

// icons
import listingCard from '@/components/listingCard.vue';
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import icon from '../assets/images/marker-icon.png';

// stores
import { useMapStore } from '@/stores/mapStore.js'
import BetaLogo from '@/components/BetaLogo.vue';

const mapStore = useMapStore()


// Initialize the `apparts` ref as an empty array
const apparts = ref([
    // Your list of apartments
]);

// variable qui contient la map leaflet
const map = ref()

const bedrooms = ref(0);
const prixMin = ref(0)
const prixMax = ref(0)
const inputPrixMin = ref(0)
const inputPrixMax = ref(0)

const zoom = ref(12)

const isRendered = ref(false)

function extractBathrooms(description) {
    // Use a regular expression to find the number of bathrooms
    const bathroomMatch = splitDescription(description)[1];

    // Extract and return the number of bathrooms if a match is found
    return bathroomMatch;
}

function splitDescription(description) {
    return description.split("·")[0].trim()[0];
}

function extractBedrooms(description) {
    // Use a regular expression to find the number of bedrooms
    const bedroomMatch = splitDescription(description)[0];

    // Extract and return the number of bedrooms if a match is found
    return bedroomMatch;
}

function extractCity(fullAddress) {
    // Split the address by comma
    console.log('full Address Listing: ', fullAddress)
    const parts = fullAddress.split(",");

    // Reverse the array of parts
    const reversedParts = parts.slice().reverse();

    // Check if there are at least two parts and return the second item from the reversed array
    if (reversedParts.length >= 2) {
        return reversedParts[1].trim();
    } else {
        console.error("Address does not have enough parts");
        return null;
    }
}


onMounted(async () => {
    try {
        mapStore.map = map.value

        // Await the result of `utils.post` and assign it to `apparts.value`
        const response = await utils.post('api/appartements/page', { pageNumer: 1});
        apparts.value = response

        // Set the rendered flag
        isRendered.value = true;
    } catch (error) {
        console.error('Error fetching apartments:', error);
    }
});


// Use ref to access the item container and individual listingCards
const itemRefs = ref({})


function setItemRef(el, idx) {
    if (el) {
        itemRefs.value[idx] = el
    }
}

function scrollToItem(id) {

    const item = itemRefs.value[id];
    if (item) {
        item.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn(`Item with id ${id} not found`);
    }
}

</script>

<template>
    <div class="grid grid-cols-12 relative z-10 h-[85vh] lg:m-6 m-0 transition-all duration-300">

        <div class="w-full h-full col-span-12 lg:col-span-6 p-6 my-auto lg:block">
            <BetaLogo class="mx-auto sm:hidden flex mb-3" />
            <div class="w-full flex justify-between">

                <div>
                    <h1 class="text-2xl font-medium">Montreal</h1>
                    <p class="">1234 results</p>
                </div>
                <div class="flex h-full my-auto space-x-2">
                    <div>saved</div>
                    <input type="checkbox" class="toggle my-auto toggle-primary" checked="checked" />
                </div>
            </div>
            <div class="h-14 mt-2 flex w-full justify-between">
                <div class="overflow-x-auto whitespace-nowrap space-x-3">
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6" />
                        </div>
                        <div>Price</div>
                    </div>

                </div>
                <!-- <div class="my-auto min-w-fit ml-10">display modesa</div> -->
            </div>
            <div class="w-full pt-5 space-y-4 h-[75vh] overflow-y-auto whitespace-nowrap p-2 flex flex-wrap gap-3 justify-around">
                <listingCard v-for="appart in apparts" :key="appart.id" :id="appart.id" :price="appart.price" :city="extractCity(appart.fullAddress)" :bedrooms="extractBedrooms(appart.customTitle)" :bathrooms="extractBathrooms(appart.customTitle)" :rating="0" :img="appart.img" :address="appart.fullAddress" :location="appart.location" :ref="(el) => { setItemRef(el.$el, appart.id) }" />
            </div>
        </div>
        <div class="w-full lg:p-4 col-span-6 block lg:col-start-7 h-full my-auto border-white shadow-2xl">
            <l-map ref="map" v-model:zoom="mapStore.currentZoom" v-model:center="mapStore.currentLocation" class="h-full" :options="{ zoomControl: false }">
                <l-tile-layer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
                <l-control-zoom position="bottomright"></l-control-zoom>
                <l-marker-cluster-group >
                    <l-marker v-for="appart in apparts" :key="appart.id" :lat-lng="appart.location" @click="scrollToItem(appart.id)" />
                </l-marker-cluster-group>
            </l-map>
        </div>
    </div>
</template>

<style>
.leaflet-cluster-anim .leaflet-marker-icon,
.leaflet-cluster-anim .leaflet-marker-shadow {
    -webkit-transition: -webkit-transform .3s ease-out, opacity .3s ease-in;
    -moz-transition: -moz-transform .3s ease-out, opacity .3s ease-in;
    -o-transition: -o-transform .3s ease-out, opacity .3s ease-in;
    transition: transform .3s ease-out, opacity .3s ease-in
}

.leaflet-cluster-spider-leg {
    -webkit-transition: -webkit-stroke-dashoffset .3s ease-out, -webkit-stroke-opacity .3s ease-in;
    -moz-transition: -moz-stroke-dashoffset .3s ease-out, -moz-stroke-opacity .3s ease-in;
    -o-transition: -o-stroke-dashoffset .3s ease-out, -o-stroke-opacity .3s ease-in;
    transition: stroke-dashoffset .3s ease-out, stroke-opacity .3s ease-in
}

.marker-cluster-small {
    background-color: #b5e28c99
}

.marker-cluster-small div {
    background-color: #6ecc3999
}

.marker-cluster-medium {
    background-color: #dbb5369d
}

.marker-cluster-medium div {
    background-color: #ecf00c99
}

.marker-cluster-large {
    background-color: #fd8873ce
}

.marker-cluster-large div {
    background-color: #f1381799
}

.marker-cluster {
    background-clip: padding-box;
    border-radius: 20px
}

.marker-cluster div {
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-top: 5px;
    text-align: center;
    border-radius: 15px;
    font: 12px Helvetica Neue, Arial, Helvetica, sans-serif;
    color: #000;

}

.marker-cluster span {
    line-height: 30px
}
</style>
