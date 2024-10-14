<script setup>
import utils from "../utils/utils.js";
import { ref, onMounted, onUnmounted, computed, watch, defineProps } from "vue";
import { useRouter } from "vue-router";

// leaflet
import {
  LMap,
  LTileLayer,
  LControlZoom,
  LMarker,
  LPopup,
} from "@vue-leaflet/vue-leaflet";
import { LMarkerClusterGroup } from "vue-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
//import 'vue-leaflet-markercluster/dist/style.css'

// icons
import listingCard from "@/components/listingCard.vue";
import {
  CurrencyDollarIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  Squares2X2Icon,
  MapIcon,
} from "@heroicons/vue/24/outline";

import icon from "../assets/images/marker-icon.png";

const props = defineProps({
  isLargeScreen: {
    type: Boolean,
    required: true,
  },
  displayModeIsMap: {
    type: Boolean,
    required: true,
  },
  apparts: {
    type: Array,
    required: true,
  },
  mapStore: {
    type: Object,
    required: true,
  },
});

function extractBathrooms(description) {
  // Use a regular expression to find the number of bathrooms
  const bathroomMatch = splitDescription(description)[1];

  // Extract and return the number of bathrooms if a match is found
  return bathroomMatch;
}

function splitDescription(description) {
  return description.split("·")[0].trim()[0];
}
function scrollToItem(id) {
  //setTimeout(() => {
  // Existing code
  try {
    const item = itemRefs.value[id];
    if (item && item.nodeType === 1) {
      console.log("item node: ", item);
      // Ensuring it's an element node
      item.nextElementSibling.scrollIntoView({ behavior: "smooth" });
    } else if (item && item.nextElementSibling) {
      console.log("element: ", item);
      console.warn(
        `Item with id ${id} is not an element, but has a next sibling`
      );
      item.nextElementSibling.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Item with id ${id} not found or has no next sibling`);
    }
  } catch (error) {
    console.log("Error during scrollToItem:", error);
  }
  //}, 0); // Adjust the delay as necessary
}

function extractCity(fullAddress) {
  // Split the address by comma

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

function extractBedrooms(description) {
  // Use a regular expression to find the number of bedrooms
  const bedroomMatch = splitDescription(description)[0];

  // Extract and return the number of bedrooms if a match is found
  return bedroomMatch;
}
</script>
<template>
  <div
    :class="{
      hidden: !displayModeIsMap,
      'w-full lg:p-4 col-span-12 block lg:col-start-7 h-full my-auto border-white shadow-2xl':
        displayModeIsMap || isLargeScreen,
    }"
  >
    <l-map
      ref="map"
      v-model:zoom="mapStore.currentZoom"
      v-model:center="mapStore.currentLocation"
      class="h-full"
      :options="{ zoomControl: false }"
    >
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-control-zoom position="bottomright"></l-control-zoom>
      <l-marker-cluster-group ref="markerCluster">
        <l-marker
          v-for="appart in apparts"
          :key="appart.id"
          :lat-lng="appart.location"
          @click="scrollToItem(appart.id)"
        >
          <LPopup class="p-0">
            <listingCard
              :key="appart.id"
              :id="appart.id"
              :price="appart.price"
              :city="extractCity(appart.fullAddress)"
              :bedrooms="extractBedrooms(appart.customTitle)"
              :bathrooms="extractBathrooms(appart.customTitle)"
              :rating="0"
              :img="appart.img"
              :address="appart.fullAddress"
              :location="appart.location"
            />
          </LPopup>
        </l-marker>
      </l-marker-cluster-group>
    </l-map>
  </div>
</template>

<style>
.leaflet-cluster-anim .leaflet-marker-icon,
.leaflet-cluster-anim .leaflet-marker-shadow {
  -webkit-transition: -webkit-transform 0.3s ease-out, opacity 0.3s ease-in;
  -moz-transition: -moz-transform 0.3s ease-out, opacity 0.3s ease-in;
  -o-transition: -o-transform 0.3s ease-out, opacity 0.3s ease-in;
  transition: transform 0.3s ease-out, opacity 0.3s ease-in;
}

.leaflet-cluster-spider-leg {
  -webkit-transition: -webkit-stroke-dashoffset 0.3s ease-out,
    -webkit-stroke-opacity 0.3s ease-in;
  -moz-transition: -moz-stroke-dashoffset 0.3s ease-out,
    -moz-stroke-opacity 0.3s ease-in;
  -o-transition: -o-stroke-dashoffset 0.3s ease-out,
    -o-stroke-opacity 0.3s ease-in;
  transition: stroke-dashoffset 0.3s ease-out, stroke-opacity 0.3s ease-in;
}

.marker-cluster-small {
  background-color: #b5e28c99;
}

.marker-cluster-small div {
  background-color: #6ecc3999;
}

.marker-cluster-medium {
  background-color: #dbb5369d;
}

.marker-cluster-medium div {
  background-color: #ecf00c99;
}

.marker-cluster-large {
  background-color: #fd8873ce;
}

.marker-cluster-large div {
  background-color: #f1381799;
}

.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
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
  line-height: 30px;
}
</style>
