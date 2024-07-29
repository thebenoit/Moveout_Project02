<script setup>
import { ref, onMounted, computed } from 'vue';
import listingCard from '@/components/listingCard.vue';
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline'


const isRendered = ref(false)

onMounted(async () => {
    isRendered.value = true
});
</script>

<template>
    <div class="flex lg:grid lg:grid-cols-12 relative z-10 h-[90vh] lg:m-6 m-0 transition-all duration-300">
        <div class="w-full h-full col-span-12 lg:col-span-6 p-6 my-auto lg:block">
            <div class="w-full flex justify-between">
                <div>
                    <h1 class="text-2xl font-medium">Listings in Montreal</h1>
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
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>
                    <div class="btn btn-sm border-gray-400">
                        <div>
                            <CurrencyDollarIcon class="size-6"/>
                        </div>
                        <div>Price</div>
                    </div>

                </div>
                <div class="my-auto min-w-fit ml-10">display modesa</div>
            </div>
            <div class="w-full pt-5 space-y-4 h-[75vh] overflow-y-auto whitespace-nowrap p-2 flex flex-wrap gap-3 justify-around">
                <div v-if="!isRendered" class="skeleton h-64 w-full"></div>
                <div v-if="!isRendered" class="skeleton h-64 w-full"></div>
                <div v-if="!isRendered" class="skeleton h-64 w-full"></div>
                <div v-if="!isRendered" class="skeleton h-64 w-full"></div>
                <listingCard />
                <listingCard />
                <listingCard />
                <listingCard />
                

            </div>
        </div>
        <div class="w-full  lg:p-4 col-span-6 lg:col-start-7 h-full my-auto border-white shadow-2xl">
            <l-map ref="map" v-model:zoom="zoom" :center="[45.5017, -73.5673]" class="h-full" :options="{ zoomControl: false }">
                <l-tile-layer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
                <l-control-zoom position="bottomright"></l-control-zoom>
            </l-map>
        </div>
    </div>

</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControlZoom } from "@vue-leaflet/vue-leaflet";

export default {
    components: {
        LMap,
        LTileLayer,
        LControlZoom,
    },
    data() {
        return {
            zoom: 12,
        };
    },
};
</script>

<style></style>