<script setup>
import utils from "../utils/utils.js";
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
  defineProps,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";

// leaflet
import {
  LMap,
  LTileLayer,
  LControlZoom,
  LMarker,
  LPopup,
} from "@vue-leaflet/vue-leaflet";
import Supercluster from "supercluster";
import { LMarkerClusterGroup } from "vue-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "vue-leaflet-markercluster/dist/style.css";

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

let supercluster = ref(null);
const clusters = ref([]);
const bounds = ref();
const geoPoints = ref([]);
const zoom = ref();

const map = ref(null); // référence à la carte leaflet

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

//https://chatgpt.com/share/673eb5cb-f830-8012-91c6-158d3d65e1a4
const initializeSupercluster = () => {
  try {
    //convertir les données en format GeoJson
    const geojsonPoints = props.apparts.map((appart, index) => {
  if (!appart.location || appart.location.length !== 2) {
    console.warn(`Location invalide à l'index ${index}:`, appart);
  }

  return {
    type: "Feature",
    properties: {
      id: appart.id,
      price: appart.price,
      fullAddress: appart.fullAddress,
      customTitle: appart.customTitle,
      img: appart.img,
    },
    geometry: {
      type: "Point",
      coordinates: [appart.location[1], appart.location[0]], // Vérifie si inversion nécessaire
    },
  };
});
console.log("GeoJSON Points après mapping:", geojsonPoints);

    //Créer une instance de Supercluster
    supercluster = new Supercluster({
      radius: 5, // Rayon pour regrouper les points (en pixels)
      maxZoom: 16, // zoom max pour regrouper
    });
    geoPoints.value = geojsonPoints;
    console.log(`GeoPoints dans initialize: `, geoPoints.value);
    // charger les points dans Supercluster
    supercluster.load(geoPoints.value);

    //calculer les clusters initiaux
    updateClusters();
  } catch (error) {
    console.log(`erreur dans initializeSupercluster: `, error);
  }
};

const updateClusters = () => {
  try {
    if (!map.value || !supercluster) {
      console.log(`rien à rétourner`);
      return;
    }
    console.log(`apparts length: `, props.apparts.length);
    // obtenir les clusters visibles en fontion du zoom et des limites actuelles
    const bounds = map.value.leafletObject.getBounds(); // Récupère les limites de la carte Leaflet
    zoom.value = map.value.zoom;
    console.log(`GeoPoints dans update: `, geoPoints.value);
    console.log(
      "West:",
      bounds.getWest(),
      "South:",
      bounds.getSouth(),
      "East:",
      bounds.getEast(),
      "North:",
      bounds.getNorth()
    );
    console.log(`zoom: `, zoom.value);

    //créer les clusters à l'aide de supercluster
    clusters.value = supercluster.getClusters(
      [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      zoom.value
    );
   
    console.log(`clusters: `, clusters);
    console.log(`avant array cluster: `, clusters.value.length);

    if (clusters.value.length === 0) {
      console.warn("No clusters to display.");
  }} catch (error) {
    console.log(`erreur dans updateClusters: `, error);
  }
};

const handleClusterClick = (cluster) => {
  console.log(`Click on cluster!`);
  if (cluster.properties.cluster) {
    //zoom pour voir les détails d'un cluster
    const [lng, lat] = cluster.geometry.coordinates;
    map.value.center = [lat, lng];
    map.value.zoom += 2; // Approfondir le zoom
  }
};

//https://stackoverflow.com/questions/77920777/cannot-access-leaflet-mapobject-in-vue3
//check if the map is fully initialized
function isReady() {
  if (map.value && map.value.leafletObject) { // Vérifie les deux conditions
    console.log(`Map is ready`);
    const leafletObject = map.value.leafletObject;
    initializeSupercluster();
    leafletObject.on("moveend", updateClusters); // Ajoute le listener seulement si l'objet existe
  } else {
    console.warn('La carte n\'est pas encore initialisée.');
  }
}

watch(
  () => props.apparts, // Observe le changement des données
  (newApparts) => {
    if (newApparts && newApparts.length) {
      initializeSupercluster(); // Appelle la fonction lorsque les données sont disponibles
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (map.value && map.value.leafletObject) {
    isReady(); // Appelle dès que le composant est monté
  } else {
    // Attendre un peu si la carte prend du temps à se charger
    setTimeout(isReady, 1000); // Ajuste le délai si nécessaire
  }
});

function extractBathrooms(description) {
  if (!description) {
    console.log("valeurs description undefined");
    return " ";
  }

  // Use a regular expression to find the number of bathrooms
  const bathroomMatch = splitDescription(description)[1];

  // Extract and return the number of bathrooms if a match is found
  return bathroomMatch;
}

function splitDescription(description) {
  //$refs.map.Object.geojsonPoints();
  if (!description) {
    console.log("valeurs description undefined");
    return " ";
  }

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
  if (!fullAddress) {
    console.log("valeurs fulladress undefined");
    return " ";
  }

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
  if (!description) {
    console.log("valeurs description undefined");
    return " ";
  }

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
      @ready="isReady"
      class="h-full"
      :options="{ zoomControl: false }"
    >
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-control-zoom position="bottomright"></l-control-zoom>

      <!-- <l-marker-cluster-group> -->
      <l-marker
        v-for="cluster in clusters"
        :key="cluster.properties.cluster_id || cluster.properties.id"
        :lat-lng="[
          cluster.geometry.coordinates[1],
          cluster.geometry.coordinates[0],
        ]"
        @click="handleClusterClick(cluster)"
      >
        <LPopup class="p-0">
          <div v-if="cluster.properties.cluster">
            <p>{{ cluster.properties.point_count }} points regroupés ici</p>
          </div>
          <div v-else>
            <listingCard
              :id="cluster.properties.id"
              :price="cluster.properties.price"
              :city="extractCity(cluster.properties.fullAddress)"
              :bedrooms="extractBedrooms(cluster.properties.customTitle)"
              :bathrooms="extractBathrooms(cluster.properties.customTitle)"
              :rating="0"
              :img="cluster.properties.img"
              :address="cluster.properties.fullAddress"
              :location="cluster.geometry.coordinates"
            />
          </div>
        </LPopup>
      </l-marker>
      <!-- </l-marker-cluster-group> -->
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
