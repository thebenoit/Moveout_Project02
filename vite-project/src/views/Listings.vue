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
import MultiSlider from "@/components/ui/input/multirange-input/multiRangeInput.vue";

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

const bedrooms = ref(0);
const prixMin = ref(0);
const prixMax = ref(0);
const inputPrixMin = ref(0);
const inputPrixMax = ref(0);

const zoom = ref(12);
const currentPage = ref(1);
const totalPages = ref(100);
const queryString = ref("");
// const pageNumber = ref(1)

const isRendered = ref(false);

const selectedBedrooms = ref([]);
const selectedBathrooms = ref([]);
const selectedBudget = ref({
  minValue: 0,
  maxValue: 100,
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
const updateQueryString = () => {
  let query = "";
  if (selectedBedrooms.value) {
    console.log(`numberBedrooms=${selectedBedrooms.value}&`);

    query += `numberBedrooms=${selectedBedrooms.value}&`;
  }

  if (selectedBudget.value.minValue) {
    console.log(`minPrice=${selectedBudget.value.minValue}&`);
    query += `minPrice=${selectedBudget.value.minValue}&`;
  }
  if (selectedBudget.value.maxValue) {
    console.log(`maxPrice=${selectedBudget.value.maxValue}&`);
    query += `maxPrice=${selectedBudget.value.maxValue}&`;
  }
  // Remove the last "&" if it exists
  queryString.value = query.slice(0, -1);
  console.log(`query ${query}`);
};

const fetchData = async () => {
  try {
    let response = "";

    mapStore.map = map.value;

    if (!queryString.value) {
      response = await utils.post(`api/appartements/page`, {
        pageNumber: currentPage.value,
      });
    } else {
      response = await utils.post(
        `api/appartements/page?${queryString.value}`,
        {
          pageNumber: currentPage.value,
        }
      );
    }

    apparts.value = response;
    console.log("apparts.value[0].total: ", apparts.value[0].total);
    totalPages.value = apparts.value[0].total;
    console.log("totalPages: ", totalPages.value);

    // totalPages.value = allPage

    isRendered.value = true;
  } catch (error) {
    console.error("Error fetching apartments:", error);
  }
};

onMounted(async () => {
  updateQueryString();
  await fetchData();
  // const totalPages = await utils.get('api/appartements/page/numberOfPage');
});

function updateChange() {
  console.log("dans updateChange: ");
  updateQueryString();
  fetchData();
}
// async function fetchPage(pageNumber) {
//   try {
//     isRendered.value = false;

//     const response = await utils.post("api/appartements/page", {
//       pageNumber: pageNumber,
//     });

//     if (response) {
//       apparts.value = response;
//       console.log(response);
//     } else {
//       console.error("Failed to fetch data");
//     }
//   } catch (error) {
//     console.error("Error fetching page:", error);
//   } finally {
//     isRendered.value = true;
//   }
// }

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    console.log("currentPage: ", currentPage.value);
    console.log("totalPages: ", totalPages.value);
    currentPage.value++;
    await fetchData();
  } else {
    console.log("You are on the last page.");
  }
};

const lastPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchData();
  } else {
    console.log("You are on the first page.");
  }
};

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
//
const toggleBathroomsSelection = (bathrooms) => {
  if (selectedBathrooms.value.includes(bathrooms)) {
    //remove if already selected
    selectedBathrooms.value = selectedBathrooms.value.filter(
      (n) => n !== bathrooms
    );
  } else {
    console.log("push bathrooms: ", bathrooms);
    selectedBathrooms.value.push(bathrooms);
  }
};
// Fonction pour gérer la sélection du nombre de chambres
const toggleBedroomsSelection = (bedrooms) => {
  if (selectedBedrooms.value.includes(bedrooms)) {
    //remove if already selected
    selectedBedrooms.value = selectedBedrooms.value.filter(
      (n) => n !== bedrooms
    );
  } else {
    console.log("push bedrooms: ", bedrooms);
    selectedBedrooms.value.push(bedrooms);
  }
};

const filteredApparts = computed(() => {
  try {
    const filtered = apparts.value.filter((appart) => {
      // Si price est déjà un nombre, vous pouvez l'utiliser directement sans conversion.
      const price = parseFloat(
        appart.price.replace(/[^0-9.,]/g, "").replace(",", ".")
      );

      //extraire le premier caractère qui est  bedroom et converti le en float
      let bedrooms = extractBedrooms(appart.customTitle);
      // si ce n'est pas un nombre comme s dans studio ou c dans chambre privé met 1
      if (isNaN(bedrooms)) {
        bedrooms = 1;
      }

      console.log(`bedrooms: ${bedrooms}`);

      console.log("price: ", price);

      // Retournez la condition de filtrage directement
      return selectedBedrooms.value.includes(bedrooms); //price <= selectedBudget.value.maxValue && price >= selectedBudget.value.minValue
    });
    return filtered;
  } catch (error) {
    console.log(`erreur lors de la filtration d'appartement ${error}`);
  }
});

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
const handleMinValueChange = (value) => {
  console.log("Min value changed:", value); // Vérifiez la valeur reçue
  selectedBudget.value.minValue = value;
};

const handleMaxValueChange = (value) => {
  console.log("Max value changed:", value); // Vérifiez la valeur reçue
  selectedBudget.value.maxValue = value;
};

const resultsCount = computed(() => apparts.value.length);

const isLargeScreen = computed(() => window.innerWidth >= 1024);
</script>

<template>
  <div>
    <div
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
    </div>
    <div
      class="grid grid-cols-12 relative z-10 h-[85vh] m-6 transition-all duration-300"
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
            <h1 class="text-2xl font-medium">Montreal</h1>
            <p class="">{{ currentPage }} sur {{ totalPages }}</p>
          </div>
          <div class="flex h-full my-auto space-x-2">
            <!-- <div>saved</div>
                    <input type="checkbox" class="toggle my-auto toggle-primary" checked="checked" /> -->
          </div>
        </div>

        <div class="h-14 mt-2 flex w-full justify-between">
          <div class="overflow-x-auto whitespace-nowrap space-x-3">
            <!-- cache tout ce qui est plus grand qu'un petit écran -->

            <div
              class="btn bg-red-400 btn-sm text-white border-gray-400"
              @click="router.push('/foryou')"
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>

              <div>Pour toi</div>
            </div>

            <!-- Open the modal using ID.showModal() method -->
            <button class="btn btn-sm" onclick="my_modal_1.showModal()">
              <div>
                <CurrencyDollarIcon class="size-6" />
              </div>
              <div>Prix</div>
            </button>
            <dialog id="my_modal_1" class="modal">
              <div class="modal-box">
                <h3 class="text-lg font-bold text-blue-main text-center">
                  Prix
                </h3>

                <p class="py-4 text-center">
                  Inscrivez les prix qui vous conviennent
                </p>
                <MultiSlider
                  :min="0"
                  :max="100"
                  @update:minValue="handleMinValueChange"
                  @update:maxValue="handleMaxValueChange"
                ></MultiSlider>
                <div class="modal-action">
                  <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->

                    <button
                      class="btn bg-blue-main text-white"
                      @click="updateChange"
                    >
                      Continuer
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
            <button
              class="btn btn-sm border-gray-400"
              onclick="my_modal_2.showModal()"
            >
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
              <div>Chambres</div>
            </button>
            <dialog id="my_modal_2" class="modal">
              <div class="modal-box">
                <h3 class="text-lg font-bold text-blue-main text-center">
                  Chambres
                </h3>
                <p class="py-4 text-center">
                  Chosisez le nombre de chambre qui vous intéresse
                </p>

                <div class="flex justify-center">
                  <button
                    v-for="bedrooms in ['1', '2', '3', '4', '5+']"
                    :key="bedrooms"
                    @click="toggleBedroomsSelection(bedrooms)"
                    :class="{
                      '  bg-blue-main text-white ':
                        selectedBedrooms.includes(bedrooms),
                      ' bg-gray-200 text-gray-700 ':
                        !selectedBedrooms.includes(bedrooms),
                    }"
                    class="px-4 py-2 rounded-md border m-2"
                  >
                    {{ bedrooms }}
                  </button>
                </div>

                <div class="modal-action">
                  <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button
                      @click="updateChange"
                      class="btn btn-active btn-accent bg-blue-main text-white"
                    >
                      Continuer
                    </button>
                  </form>
                </div>
              </div>
            </dialog>

            <!-- <button class="btn btn-sm border-gray-400 " onclick="my_modal_3.showModal()">
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
              <div>Bathrooms</div>
            </button>
            <dialog id="my_modal_3" class="modal">
              <div class="modal-box ">
                <h3 class="text-lg font-bold text-blue-main text-center">Toilettex</h3>
                <p class="py-4 text-center">Chosisez le nombre de Toilettes qui vous intéresse</p>
                
                <div class="flex justify-center ">
                  <button
                
                  v-for="bathrooms in ['1', '2', '3', '4', '5+']"
                  :key="bathrooms"
                  @click="toggleBathroomsSelection(bathrooms)"
                  :class="{
                    '  bg-blue-main text-white ':
                      selectedBathrooms.includes(bathrooms),
                    ' bg-gray-200 text-gray-700 ':
                      !selectedBathroomss.includes(bathrooms),
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ bathrooms }}
                </button>

                </div>
                
                <div class="modal-action">
                  <form method="dialog"> -->
            <!-- if there is a button in form, it will close the modal -->
            <!-- <button class="btn btn-active btn-accent  bg-blue-main text-white">Continuer</button>
                  </form>
                </div>
              </div>
            </dialog>  -->

            <!-- <div class="btn btn-sm border-gray-400"
           >
              <div>
                <MapPinIcon class="size-6" />
              </div>
              <div>location</div>
            </div> -->
          </div>
          <!-- <div class="my-auto min-w-fit ml-10">display modesa</div> -->
        </div>
        <div
          class="w-full pt-5 space-y-4 h-[70vh] overflow-y-auto whitespace-nowrap p-2 flex flex-wrap gap-3 justify-around"
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
            :ref="(el) => setItemRef(el, appart.id)"
          />
          <!-- <div class="join py-5">
            <button class="join-item btn btn-md btn-active">1</button>
            <button class="join-item btn btn-md">2</button>
            <button class="join-item btn btn-md">{{ currentPage }}</button>
            <button class="join-item btn btn-md">3</button>
            <button class="join-item btn btn-md">4</button>
          </div> -->
        </div>
        <div class="join mx-auto">
          <button class="join-item btn" @click="lastPage">«</button>
          <button class="join-item btn">Page {{ currentPage }}</button>
          <button class="join-item btn" @click="nextPage">»</button>
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
