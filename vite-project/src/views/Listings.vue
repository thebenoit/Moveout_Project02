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
import mapPage from "../components/mapPage.vue";
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
import mixpanel from "mixpanel-browser";

const mapStore = useMapStore();
const router = useRouter();

// Initialize the `apparts` ref as an empty array
const apparts = ref([
  // Your list of apartments
]);

const appartsMap = ref([
  // Your list of apartments for map
]);

// variable qui contient la map leaflet
const map = ref();

const displayModeIsMap = ref(true);

const bedrooms = ref(0);
const prixMin = ref(0);
const prixMax = ref(0);
const inputPrixMin = ref(0);
const inputPrixMax = ref(0);
const noData = ref(false);

const zoom = ref(13);
const currentPage = ref(1);
const totalPages = ref();
const queryString = ref("");
//load 10 card par page
const pageSize = ref(30);
//permetra de load toute la liste sur la map
const pageSizeMap = ref(300);
const prixButtonEvent = "click sur prix button";
const timerOn = ref(false);

const isRendered = ref(false);

const selectedBedrooms = ref([]);
const selectedBathrooms = ref([]);
const selectedBudget = ref({
  minValue: 0,
  maxValue: 100,
});

const updateQueryString = () => {
  let query = "";
  if (selectedBedrooms.value) {
    query += `numberBedrooms=${selectedBedrooms.value}&`;
  }

  if (selectedBudget.value.minValue) {
    query += `minPrice=${selectedBudget.value.minValue}&`;
  }
  if (selectedBudget.value.maxValue) {
    query += `maxPrice=${selectedBudget.value.maxValue}&`;
  }
  // Remove the last "&" if it exists
  queryString.value = query.slice(0, -1);
};

const fetchData = async () => {
  try {
    let response = "";
    let responseMap = "";

    mapStore.map = map.value;

    if (!queryString.value) {
      //api call pour la liste de card
      response = await utils.post(`api/appartements/page`, {
        pageNumber: currentPage.value,
        pageSize: pageSize.value,
      });
      //reponse for map
      // responseMap = await utils.post(`api/appartements/page`, {
      // pageNumber: currentPage.value,
      // pageSize: pageSizeMap.value,
      // });
    } else {
      console.log("queryStringValue: ", queryString.value);
      //api call pour la liste de card
      response = await utils.post(
        `api/appartements/page?${queryString.value}`,
        {
          pageNumber: currentPage.value,
          pageSize: pageSize.value,
        }
      );

      responseMap = await utils.post(
        `api/appartements/page?${queryString.value}`,
        {
          pageNumber: currentPage.value,
          pageSize: pageSizeMap.value,
        }
      );

      console.log("response: ", response);
      console.log("pageSize.value: ", pageSize.value);
    }
    //si il n'y a pas d'appartement disponible afficher page(refaire logique)
    if (response.length === 0) {
      noData.value = true;
    } else {
      noData.value = false;
    }

    apparts.value = response;
    appartsMap.value = responseMap;

    //extremely guetto way to pass total page into a variable
    //totalPages.value = apparts.value[0].total;

    totalPages.value = await pageAndPageTotal(apparts);

    isRendered.value = true;
  } catch (error) {
    console.error("Error fetching apartments:", error);
    console.log(`appart length: `, response.length);
  }
};

onMounted(async () => {
  updateQueryString();
  await fetchData();
});

function updateChange() {
  console.log("dans updateChange: ");
  updateQueryString();
  fetchData();
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
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
/**
 * méthode qui permet d'avoir le nombre de page total
 * et de reset la position de la page à 1
 * @param apparts
 */
const pageAndPageTotal = async (apparts) => {
  //si la page actuellee st plus grande que
  //le nombre total de page reset la valeur
  if (currentPage.value > apparts.value[0].total) {
    currentPage.value = 1;
  }

  return apparts.value[0].total;
};

onUnmounted(() => {
  // Nettoyage ou annulation des opérations en cours
});

// Use ref to access the item container and individual listingCards
const itemRefs = ref({});

const handleDisplayModeMap = () => {
  console.log(`Display mode map clicked!`);
  displayModeIsMap.value = !displayModeIsMap.value;
};
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
    selectedBedrooms.value.push(bedrooms);
  }
};

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
  return description.split("·")[0].trim()[0];
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

const filteredApparts = computed(() => {
  try {
    console.log("computed: ");
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

// const clickPrixButton = (modal) => {
//   modal.showModal();
//   //track et commence un timer quand user click sur le price button
//   mixpanel.time_event("#prixButton", prixButtonEvent);

//   timerOn.value = true;
// };

const clickPourToiButton = () => {
  router.push("/foryou");

  //méthode qui track les cliques sur le button
  mixpanel.track("click sur pour toi", {
    button_id: "pourToiButton",
    button_name: "pour toi",
    page: "foryou",
  });
};
</script>

<template>
  <div>
    <div
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden"
    >
      <button
        class="bg-blue-main text-white rounded-full flex space-x-4 p-2 px-4"
        @click="handleDisplayModeMap"
      >
        <Squares2X2Icon class="size-10" />
        <ArrowsRightLeftIcon class="size-10" />
        <MapIcon class="size-10" />
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
            <p class="">{{ currentPage }} sur {{ totalPages }} pages</p>
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
              id="pourToiButton"
              class="btn bg-red-400 btn-sm text-white border-gray-400"
              @click="clickPourToiButton"
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
            <button
              id="prixButton"
              class="btn btn-sm"
              onclick="my_modal_1.showModal()"
            >
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
          </div>
          <!-- <div class="my-auto min-w-fit ml-10">display modesa</div> -->
        </div>

        <div
          v-if="noData == true"
          class="w-full pt-5 space-y-4 h-[70vh] overflow-y-auto whitespace-nowrap p-2 flex flex-wrap gap-3 justify-around"
        >
          <h1>0 appartements trouvée</h1>
          <div>
            <img class="object-contain" src="../assets/images/no_data.svg" />
          </div>
        </div>

        <div
          v-else
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
        </div>
        <div class="join mx-auto">
          <button class="join-item btn" @click="lastPage">«</button>
          <button class="join-item btn">Page {{ currentPage }}</button>
          <button class="join-item btn" @click="nextPage">»</button>
        </div>
      </div>

      <mapPage
        :apparts="appartsMap"
        :isLargeScreen="isLargeScreen"
        :displayModeIsMap="displayModeIsMap"
        :mapStore="mapStore"
      />
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
