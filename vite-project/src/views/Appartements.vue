<script setup>
import { ref, onMounted, computed } from 'vue';
import CardItem from '../components/CardItem.vue';
import utils from '../utils/utils.js';
import Footer from '../components/Footer.vue'
import Map from '../components/map2.vue'

// Initialize the `apparts` ref as an empty array
const apparts = ref([]);

const bedrooms = ref(0);
const price = ref(0)

function setBedrooms(value) {
  bedrooms.value = value
}

const isRendered = ref(false)



onMounted(async () => {
  // Await the result of `utils.get('appartments')` and assign it to `apparts.value`
  const response = await utils.get('api/appartments');
  apparts.value = response;

  console.log("valeur: ", apparts.value)
  isRendered.value = true
});

// Extract addresses from apparts data
/*const appartAddresses = computed(() => {
  return apparts.value.map(appart => {
    const addressParts = appart.custom_sub_titles_with_rendering_flags.map(subtitleObj => subtitleObj.subtitle);
    return addressParts.join(', ');
  });
});*/
</script>


<template>

  <div class="bodyPage h-screen">
    <div class="white-space pt-12">
    </div>
    <header>
      <section class="box-choice h-4">
        <div class=" interior-box p-1">
          <div class="">
            <ul class="flex gap-x-2">
              <li class="  nav-link bedrooms h-full p-y-2 px-4 ">
                <button>{{ bedrooms }} Bedrooms
                  <span class="dropdown-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                      <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </button>
                <ul class=" chambres drop-down w-36">
                  <header class="font-bold text-center  w-full -mt-1 overflow-hidden h-1 rounded">
                    Chambres
                  </header>
                  <li class="flex items-center justify-center h-full py-2 px-4"><button class="flex items-center justify-center py-2 px-4" @click="setBedrooms(1)">1</button></li>
                  <li class="flex items-center justify-center h-full py-2 px-4"><button class="flex items-center justify-center py-2 px-4" @click="setBedrooms(2)">2</button></li>
                  <li class="flex items-center justify-center h-full py-2 px-4"><button class="flex items-center justify-center py-2 px-4" @click="setBedrooms(3)">3</button></li>

                </ul>

              </li>
              <li class="  nav-link price h-full p-y-2 px-4">
                <button>Price
                  <span class="dropdown-icon">

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                      <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>


                  </span>
                </button>
                <ul class="drop-down w-64 h-42 ">
                  <header class="font-bold text-center  w-full -mt-1 overflow-hidden h-1 rounded">
                    Price range
                  </header>
                  <li class="flex flex-col items-center justify-center h-full py-2 px-4">


                    <div class="flex flex-1 mmt04">
                      <p class="m-2">Prix Minimal</p> <input class="border-2 m-2">
                    </div>

                    <div class="flex flex-1 mmt04">
                      <p class="m-2">Prix Maximal</p> <input class="border-2 m-2">
                    </div>

                    <button class="bg-cyan-500 mt-4 mb-4 px-4 py-2 rounded text-white">Apply</button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </header>
    <div class="main">
      <aside class="left">
        <Map :apparts="apparts" />
      </aside>
      <aside class="right">
        <div class="flex flex-wrap gap-3 justify-around">
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
          <div v-for="appart in apparts" :key="appart.url">
            <CardItem :title="appart.custom_title" :price="new Intl.NumberFormat().format(appart.listing_price.amount)" :city="appart.location.reverse_geocode.city" :bedrooms="appart.bedrooms" :url="appart.url" :img="appart.primary_listing_photo.image.uri" />
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!---<div class="flex flex-col  ">

    <section class="box-choice mt-20 mx-auto h-5  ">
      <div class=" interior-box p-1   shadow-xl">
        <div class=" ">
          <ul class="flex gap-x-8  ">
            <li class=" flex-1 nav-link bedrooms h-full p-y-2 px-4 ">
              <button>Bedrooms
                <span class="dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd"
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd" />
                  </svg>
                </span>
              </button>
              <ul class="drop-down ">
                <li class="h-full p-y-2 px-4"><button>1</button></li>
                <li class="h-full p-y-2 px-4"><button>2</button></li>
                <li class="h-full p-y-2 px-4"><button>3</button></li>
              </ul>
            </li>
            <li class=" flex-1 nav-link price h-full p-y-2 px-4">
              <button>Price
                <span class="dropdown-icon">

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd"
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd" />
                  </svg>


                </span>
              </button>
              <ul class="drop-down ">
                <li class="h-full p-y-2 px-4">
                  <input type="range" min="0" max="100" value="40" class="range" />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div class="flex flex-1">
      <div class="flex-1 flex-col ">
        <Map :apparts="apparts" />
      </div>

      <div class=" flex-1 flex-col inset-0 overflow-auto">

        <div>
          <h1 class="text-xl font-bold mt-10">Résultats :{{ apparts.length }}</h1>
          <div class="flex flex-wrap gap-3 justify-around my-24 ">

            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>
            <div v-if="!isRendered" class="w-96 h-80 skeleton"></div>

            <div v-for="appart in apparts" :key="appart.url">

              <CardItem :title="appart.custom_title"
                :price="new Intl.NumberFormat().format(appart.listing_price.amount)"
                :city="appart.location.reverse_geocode.city" :bedrooms="appart.bedrooms" :url="appart.url"
                :img="appart.primary_listing_photo.image.uri" />
            </div>
          </div>
        </div>

      </div>
    </div>


  </div>---->
</template>

<style>
.bodyPage {

  font-family: sans-serif;
  text-align: center;
  font-size: 24px;
  display: flex;
  flex-direction: column;

}

/* header {

  padding: 1em 0 2em 0;
  z-index: 10;

} */

.left {
  background: blanchedalmond;
  padding: 0em 0 0em 0;
  flex: 1 1 100px;
  overflow: hidden;


}



.right {
  overflow: auto;
  padding: 0em 0 3em 0;
  flex: 1 1 100px;
}

.main {
  display: flex;
  flex: 1;
  height: 80%;
}

.nav-link {

  border-color: rgb(170, 170, 170);
  border-width: 1px;
  border-radius: 12px;



}

.nav-link,
.drop-down li {
  height: 100%;
  padding: 0.5rem 1rem;
  font-weight: 60;


}

.drop-down {
  position: absolute;
  padding: 0.5rem 0;
  margin: 0.5rem -0.5rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 12px;
  display: none;

}

.nav-link:hover {
  background-color: rgb(222, 222, 222);
  border-radius: 0.5rem;
}

.bedrooms:hover .drop-down,
.price:hover .drop-down {
  display: block;
  border-width: 1px;
  border-color: rgb(0, 152, 240);
}

.bedrooms button,
.price button {
  display: flex;

  border-radius: 15px;
}

.dropdown-icon {
  font-size: 20px;
  position: relative;
  right: -5px;
  transition: 0.3s ease-in-out all
}

.bedrooms:hover .dropdown-icon,
.price:hover .dropdown-icon {

  transform: rotate(180deg)
}

.chambres button:hover {
  background-color: rgb(57, 136, 255);

  transition: 0.1s ease-in-out all;
  color: white;
}

.box-choice {
  margin-bottom: 20;

  z-index: 2;
}

.interior-box {
  border-width: 10;
  border-color: blue;
}

@media all and (max-width: 700px) {
  .main {
    flex-direction: column;
  }

  .left {
    display: none
  }


}
</style>

<!---<style>

.nav-link {

  border-color: black;
  border-width: 1px;

}
.nav-link,
.drop-down li {
  height: 100%;
  padding: 0.5rem 1rem;
  font-weight: 6000;
  
}

.drop-down {
  position: absolute;
  padding: 0.5rem 0;
  margin: 0.5rem -0.5rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 12px;
  display: none;

}

.nav-link:hover {
  background-color: rgb(222, 222, 222);

  border-radius: 0.5rem;


}

.bedrooms:hover .drop-down,
.price:hover .drop-down {
  display: block
}

.bedrooms button,
.price button {
  display: flex
}

.dropdown-icon {
  font-size: 20px;
  position: relative;
  right: -5px;
  transition: 0.3s ease-in-out all
}

.bedrooms:hover .dropdown-icon,
.price:hover .dropdown-icon {

  transform: rotate(180deg)
}

.drop-down li:hover {
  background-color: rgb(222, 222, 222);
}

.box-choice {
  margin-bottom: 20;

  z-index: 2;
}

.interior-box {
  border-width: 10;
  border-color: blue;
}
</style>---->
