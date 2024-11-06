<script setup>
import utils from "../utils/utils.js";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
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
import { decodeJwt } from "jose";

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

// stores
import { useMapStore } from "@/stores/mapStore.js";
import BetaLogo from "@/components/BetaLogo.vue";

const mapStore = useMapStore();
const router = useRouter();

// Initialize the `apparts` ref as an empty array
const apparts = ref([
  // Your list of apartments
]);

// variable qui contient la map leaflet
const map = ref();

const displayModeIsMap = ref(true);

const nomUser = ref("");
const bedrooms = ref(0);
const prixMin = ref(0);
const prixMax = ref(0);
const inputPrixMin = ref(0);
const inputPrixMax = ref(0);
const alwaysTrue = ref(true);

const zoom = ref(12);

const isRendered = ref(false);

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
    //get le token et le decode
    const token = await decodeJwt(utils.getToken());

    //get la préférence spécifique
    const pref = await utils.get(`api/client/preference/${token.prefId}`);
    const user = await utils.get(`api/client/login/${token.prefId}`);

    if (user.length > 0) {
      const firstUser = user[0];
      console.log("Prénom de l'utilisateur :", firstUser.firstName);
      nomUser.value = firstUser.firstName;
      // Accédez à d'autres propriétés si nécessaire
    } else {
      console.log(`user n'existe pas`);
    }

    if (!pref) {
      console.log("preference nexiste pas: ");
    }

    // console.log('pref: ',pref)

    mapStore.map = map.value;

    // Await the result of `utils.post` and assign it to `apparts.value`
    const response = await utils.post("api/appartements/pageForYou", {
      pageNumber: 1,
      priceMin: pref.budget.minValue,
      priceMax: pref.budget.maxValue,
      numberBedrooms: pref.numberOfBedrooms,
      location: pref.locationPreferences,
    });
    apparts.value = response;

    // Set the rendered flag
    isRendered.value = true;
  } catch (error) {
    console.error("Error fetching apartments:", error);
    
  }
});

onUnmounted(() => {
  // Nettoyage ou annulation des opérations en cours
});

// Use ref to access the item container and individual listingCards
const itemRefs = ref({});

function setItemRef(el, idx) {
  if (el) {
    itemRefs.value[idx] = el;
  }
}

function scrollToItem(id) {
  setTimeout(() => {
    //Existing code
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
  }, 0); // Adjust the delay as necessary
}

const resultsCount = computed(() => apparts.value.length);

const isLargeScreen = computed(() => window.innerWidth >= 1024);

//!utils.getToken()
</script>

<template>
  <div>
    <div
    
      v-if="alwaysTrue"
      class="text-center p-6 rounded-lg shadow-md h-screen flex items-center justify-center"
    >
      <div
        class="w-full max-w-md bg-gray-200 backdrop-blur-3xl p-6 rounded-lg shadow-lg text-center"
      >
        <p class="text-sm text-gray-100">
          <a
            href="https://www.freepik.com/free-vector/mobile-login-concept-illustration_4957412.htm#from_view=detail_alsolike"
            >Image by storyset on Freepik</a
          >
        </p>
        <img
          src="@/assets/images/needLogin.png"
          alt="Success Image"
          class="w-full h-auto mb-4"
        />
        <h1 class="text-2xl font-bold mb-2">Oups!</h1>
        
        <!-- <p class="text-lg mb-4">
          Vous devez être connecté pour avoir accès aux listings personnalisés
        </p> -->

        <p class="text-lg mb-4">
          Cette section du site est en cours de développement et sera disponible prochainement. Merci de votre patience.
        </p>

        <!-- <a class="btn btn-primary" href="/login"
          >Je veux des listings personnalisés!</a
        > -->
        <!-- <br />
        <br /> -->
        <a class="btn btn-neutral" href="/listings">Retour</a>
      </div>
    </div>
    <div
      v-else
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden"
    >
      <button
        class="bg-blue-main text-white rounded-full flex space-x-4 p-2 px-4"
        @click="displayModeIsMap = !displayModeIsMap"
      >
        <Squares2X2Icon class="size-7" />
        <ArrowsRightLeftIcon class="size-7" />
        <MapIcon class="size-7" />
      </button>

      <div
        class="grid grid-col-12 relative z-10 h-[85vh] m-6 transition-all duration-300"
      >
        <div
          :class="{
            hidden: displayModeIsMap,
            'w-full h-full col-span-12 lg:col-span-6 sm:p-0 lg:p-6 my-auto lg:block':
              !displayModeIsMap || isLargeScreen,
          }"
        >
          <div class="w-full flex justify-between">
            <div>
              <h1 class=" font-medium">Montreal</h1>
              <p class="">{{ resultsCount }} results</p>
            </div>
            <div class="flex h-full my-auto space-x-2">
              <!-- <div>saved</div>
                    <input type="checkbox" class="toggle my-auto toggle-primary" checked="checked" /> -->
            </div>
          </div>
          <div class="h-14 mt-2 flex w-full justify-between">
            <div class="overflow-x-auto whitespace-nowrap space-x-3">
              <div
                class="btn bg-blue-main btn-sm text-white border-gray-400"
                @click="router.push('/listings')"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                  />
                </svg>

                <div>Main</div>
              </div>

              <div class="btn bg-red-400 btn-sm text-white border-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>

                <div class="text-sm">Bienvenue {{ nomUser }}!</div>
              </div>

              <!--- <div class="btn bg-blue-main btn-sm text-white border-gray-400" @click="router.push('/listings')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
              </svg>
              
              

              <div>Main</div>
            </div>

            <div class="btn btn-sm border-gray-400">
              <div>
                <CurrencyDollarIcon class="size-6" />
              </div>
              <div>Price</div>
            </div>
            <div class="btn btn-sm border-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#686868"
                viewBox="0 0 15 12"
                class="size-6"
              >
                <g clip-path="url(#a)">
                  <path
                    fill="#686868"
                    d="M14.27 4.696h-.013c-.402 0-.73.32-.73.71 0 .04-.034.072-.074.072H1.547a.073.073 0 0 1-.074-.071.722.722 0 0 0-.73-.711H.73c-.402 0-.73.32-.73.71v5.883c0 .392.328.711.73.711h.013c.402 0 .73-.32.73-.71v-.203c0-.072.06-.13.134-.13h11.786c.073 0 .134.058.134.13v.202c0 .392.328.711.73.711h.013c.402 0 .73-.32.73-.71V5.406a.722.722 0 0 0-.73-.711Z"
                  />
                  <path
                    fill="#686868"
                    d="M1.741 4.891h.753a.133.133 0 0 0 .134-.13v-.424a.53.53 0 0 1 .536-.522H6.43a.53.53 0 0 1 .535.522v.424c0 .072.06.13.134.13h.804a.133.133 0 0 0 .134-.13v-.424a.53.53 0 0 1 .535-.522h3.265a.53.53 0 0 1 .536.522v.424c0 .072.06.13.134.13h.753a.265.265 0 0 0 .268-.26V1.564c0-.574-.482-1.043-1.072-1.043h-9.91c-.59 0-1.072.47-1.072 1.043V4.63c0 .144.12.261.268.261Z"
                  />
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M0 0h15v12H0z" />
                  </clipPath>
                </defs>
              </svg>
              <div>Bedrooms</div>
            </div>
            <div class="btn btn-sm border-gray-400">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#686868"
                  viewBox="0 0 13 13"
                  class="size-6"
                >
                  <g clip-path="url(#a)">
                    <path
                      fill="#686868"
                      d="M.813 9.75a2.423 2.423 0 0 0 .812 1.805v1.039a.406.406 0 0 0 .406.406h.813a.406.406 0 0 0 .406-.406v-.407h6.5v.407a.406.406 0 0 0 .406.406h.813a.406.406 0 0 0 .406-.406v-1.04a2.421 2.421 0 0 0 .813-1.804V8.53H.812v1.22Zm11.78-3.25H2.032V1.758a.54.54 0 0 1 .921-.38l.49.488c-.334.759-.194 1.501.219 2.025l-.005.004a.406.406 0 0 0 0 .574l.287.287a.406.406 0 0 0 .575 0L7.193 2.08a.406.406 0 0 0 0-.574l-.287-.287a.406.406 0 0 0-.574 0l-.004.004C5.804.811 5.062.671 4.303 1.004l-.489-.49A1.758 1.758 0 0 0 .812 1.759V6.5H.406A.406.406 0 0 0 0 6.906v.406a.406.406 0 0 0 .406.407h12.188A.406.406 0 0 0 13 7.312v-.406a.406.406 0 0 0-.406-.406Z"
                    />
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="#fff" d="M0 0h13v13H0z" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div>Bathrooms</div>
            </div>
            <div class="btn btn-sm border-gray-400">
              <div>
                <MapPinIcon class="size-6" />
              </div>
              <div>location</div>
            </div> -->
            </div>
            <!-- <div class="my-auto min-w-fit ml-10">display modesa</div> -->
          </div>
          <div
            class="w-full pt-5 space-y-4 h-[75vh] overflow-y-auto whitespace-nowrap p-2 flex flex-wrap gap-3 justify-around"
          >
            <listingCard
              v-for="appart in apparts"
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
              :ref="
                (el) => {
                  //si le composant n'est pas null
                  if (el && el.$el) {
                    setItemRef(el.$el, appart.id);
                  }
                }
              "
            />
          </div>
        </div>
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
            <l-marker-cluster-group>
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
                    :ref="
                      (el) => {
                        //si le composant n'est pas null
                        if (el && el.$el) {
                          setItemRef(el.$el, appart.id);
                        }
                      }
                    "
                  />
                </LPopup>
              </l-marker>
            </l-marker-cluster-group>
          </l-map>
        </div>
      </div>
    </div>
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
