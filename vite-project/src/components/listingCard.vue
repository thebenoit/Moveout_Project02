<script setup>
import { BookmarkIcon, MapPinIcon, MapIcon, StarIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { ref, watch, onMounted, defineProps } from "vue";


const props = defineProps({
    // path: {
    // 	type: String,
    // 	required: true,
    // },
    // label: {
    // 	type: String,
    // 	required: true,
    // },
    // src: {
    // 	type: String,
    // 	required: true,
    // },
    // text: {
    // 	type: String,
    // 	required: true,
    // },
    img: {
        type: String,
        default: "@/assets/images/house-1477041_1920.jpg",
        required: true,
    },
    city: {
        type: String,
        default: "Montréal-nord aaaaaaaaa",
        required: true,
    },
    address: {
        type: String,
        default: "3330 Chem. de la Côte Vertu, Saint-Laurent, QC H4R 1R3",
        required: true,
    },
    bedrooms: {
        type: Number,
        default: 2,
        required: true,
    },
    bathrooms: {
        type: Number,
        default: 1,
        required: true,
    },
    rating: {
        type: Number,
        default: 3,
        required: true,
    },
    price: {
        type: Number,
        default: 1500,
        required: true,
    },
});

const isValidImage = ref(true);

// Methods
function handleImageError() {
    isValidImage.value = false;
}

</script>

<template>
    <div class="w-full rounded overflow-hidden shadow-lg p-2 bg-white min-[1262px]:hidden transition-all">
        <img class="object-cover rounded-2xl rounded-b-none" src="@/assets/images/house-1477041_1920.jpg">
        <div class="p-2">
            <div class="flex w-full">
                <div class="w-2/3">
                    <div class="flex">
                        <MapPinIcon class="size-6" />
                        <div class="font-bold text-base truncate my-auto mb-0">{{ city }}</div>
                    </div>
                    <p class="text-gray-700 text-base truncate">
                        {{ address }}
                    </p>
                </div>
                <div class="justify-around w-1/2 flex">
                    <MapIcon class="size-8 my-auto stroke-blue-main" />
                    <BookmarkIcon class="size-8 my-auto stroke-blue-main" />
                </div>
            </div>
            <div class="flex w-full justify-between mt-3">
                <div class="flex h-full">
                    <div class="my-auto text-xl font-bold mr-2">{{ rating }}</div>
                    <div class="flex my-auto">
                        <StarIcon v-for="(star, index) in 5" :key="index" :class="{
                            'h-5 stroke-none': true,
                            'fill-blue-main': index < rating,
                            'fill-gray-300': index >= rating
                        }" />
                    </div>
                </div>

                <div class="flex font-bold text-xl">
                    <div>{{ bedrooms }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#686868" viewBox="0 0 15 12" class="my-auto h-3.5 ml-1">
                        <g clip-path="url(#a)">
                            <path fill="#686868" d="M14.27 4.696h-.013c-.402 0-.73.32-.73.71 0 .04-.034.072-.074.072H1.547a.073.073 0 0 1-.074-.071.722.722 0 0 0-.73-.711H.73c-.402 0-.73.32-.73.71v5.883c0 .392.328.711.73.711h.013c.402 0 .73-.32.73-.71v-.203c0-.072.06-.13.134-.13h11.786c.073 0 .134.058.134.13v.202c0 .392.328.711.73.711h.013c.402 0 .73-.32.73-.71V5.406a.722.722 0 0 0-.73-.711Z" />
                            <path fill="#686868" d="M1.741 4.891h.753a.133.133 0 0 0 .134-.13v-.424a.53.53 0 0 1 .536-.522H6.43a.53.53 0 0 1 .535.522v.424c0 .072.06.13.134.13h.804a.133.133 0 0 0 .134-.13v-.424a.53.53 0 0 1 .535-.522h3.265a.53.53 0 0 1 .536.522v.424c0 .072.06.13.134.13h.753a.265.265 0 0 0 .268-.26V1.564c0-.574-.482-1.043-1.072-1.043h-9.91c-.59 0-1.072.47-1.072 1.043V4.63c0 .144.12.261.268.261Z" />
                        </g>
                        <defs>
                            <clipPath id="a">
                                <path fill="#fff" d="M0 0h15v12H0z" />
                            </clipPath>
                        </defs>
                    </svg>
                    <div class="ml-4">{{ bathrooms }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#686868" viewBox="0 0 13 13" class="my-auto h-4 ml-1">
                        <g clip-path="url(#a)">
                            <path fill="#686868" d="M.813 9.75a2.423 2.423 0 0 0 .812 1.805v1.039a.406.406 0 0 0 .406.406h.813a.406.406 0 0 0 .406-.406v-.407h6.5v.407a.406.406 0 0 0 .406.406h.813a.406.406 0 0 0 .406-.406v-1.04a2.421 2.421 0 0 0 .813-1.804V8.53H.812v1.22Zm11.78-3.25H2.032V1.758a.54.54 0 0 1 .921-.38l.49.488c-.334.759-.194 1.501.219 2.025l-.005.004a.406.406 0 0 0 0 .574l.287.287a.406.406 0 0 0 .575 0L7.193 2.08a.406.406 0 0 0 0-.574l-.287-.287a.406.406 0 0 0-.574 0l-.004.004C5.804.811 5.062.671 4.303 1.004l-.489-.49A1.758 1.758 0 0 0 .812 1.759V6.5H.406A.406.406 0 0 0 0 6.906v.406a.406.406 0 0 0 .406.407h12.188A.406.406 0 0 0 13 7.312v-.406a.406.406 0 0 0-.406-.406Z" />
                        </g>
                        <defs>
                            <clipPath id="a">
                                <path fill="#fff" d="M0 0h13v13H0z" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div class="flex">
                    <div class="font-bold text-xl">{{ price }}$</div>
                </div>

            </div>

        </div>
    </div>

    <div class="h-64 w-full rounded-2xl p-2 shadow-sm border-gray-100 min-[1262px]:flex hidden transition-all">
    <img class="object-cover h-56 w-56 rounded-2xl my-auto" src="@/assets/images/house-1477041_1920.jpg">
    <div class="flex flex-col ml-4 p-2 min-w-72 w-full justify-between">
        <div class="w-full">
            <!-- titre + bookmark -->
            <div class="flex justify-between mb-1">
                <h1 class="text-2xl truncate max-w-80">{{ city }}</h1>

                <button>
                    <BookmarkIcon class="size-6 my-auto stroke-blue-main" />
                </button>
            </div>
            <!-- adresse + map -->
            <div class="flex space-x-1 w-1/2">
                <MapPinIcon class="size-6 my-auto" />
                <p class="text-base truncate my-auto">{{ address }}</p>
                <button>
                    <MapIcon class="size-6 my-auto stroke-blue-main" />
                </button>
            </div>
        </div>
        <!-- percs -->
        <div class="h-1/4 space-x-3 flex text-gray-400 max-w-72 flex-wrap">
            <div>percs</div>
            <div>•</div>
            <div>percs</div>
            <div>•</div>
            <div>percs</div>
            <div>•</div>
            <div>percs</div>
        </div>
        <!-- nb chambre et salles de bains -->
        <div class="flex font-bold text-xl">
            <div>{{ bedrooms }}</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#686868" viewBox="0 0 15 12" class="my-auto h-3.5 ml-1">
                <g clip-path="url(#a)">
                    <path fill="#686868" d="M14.27 4.696h-.013c-.402 0-.73.32-.73.71 0 .04-.034.072-.074.072H1.547a.073.073 0 0 1-.074-.071.722.722 0 0 0-.73-.711H.73c-.402 0-.73.32-.73.71v5.883c0 .392.328.711.73.711h.013c.402 0 .73-.32.73-.71v-.203c0-.072.06-.13.134-.13h11.786c.073 0 .134.058.134.13v.202c0 .392.328.711.73.711h.013c.402 0 .73-.32.73-.71V5.406a.722.722 0 0 0-.73-.711Z" />
                    <path fill="#686868" d="M1.741 4.891h.753a.133.133 0 0 0 .134-.13v-.424a.53.53 0 0 1 .536-.522H6.43a.53.53 0 0 1 .535.522v.424c0 .072.06.13.134.13h.804a.133.133 0 0 0 .134-.13v-.424a.53.53 0 0 1 .535-.522h3.265a.53.53 0 0 1 .536.522v.424c0 .072.06.13.134.13h.753a.265.265 0 0 0 .268-.26V1.564c0-.574-.482-1.043-1.072-1.043h-9.91c-.59 0-1.072.47-1.072 1.043V4.63c0 .144.12.261.268.261Z" />
                </g>
                <defs>
                    <clipPath id="a">
                        <path fill="#fff" d="M0 0h15v12H0z" />
                    </clipPath>
                </defs>
            </svg>
            <div class="ml-4">{{ bathrooms }}</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#686868" viewBox="0 0 13 13" class="my-auto h-4 ml-1">
                <g clip-path="url(#a)">
                    <path fill="#686868" d="M.813 9.75a2.423 2.423 0 0 0 .812 1.805v1.039a.406.406 0 0 0 .406.406h.813a.406.406 0 0 0 .406-.406v-.407h6.5v.407a.406.406 0 0 0 .406.406h.813a.406.406 0 0 0 .406-.406v-1.04a2.421 2.421 0 0 0 .813-1.804V8.53H.812v1.22Zm11.78-3.25H2.032V1.758a.54.54 0 0 1 .921-.38l.49.488c-.334.759-.194 1.501.219 2.025l-.005.004a.406.406 0 0 0 0 .574l.287.287a.406.406 0 0 0 .575 0L7.193 2.08a.406.406 0 0 0 0-.574l-.287-.287a.406.406 0 0 0-.574 0l-.004.004C5.804.811 5.062.671 4.303 1.004l-.489-.49A1.758 1.758 0 0 0 .812 1.759V6.5H.406A.406.406 0 0 0 0 6.906v.406a.406.406 0 0 0 .406.407h12.188A.406.406 0 0 0 13 7.312v-.406a.406.406 0 0 0-.406-.406Z" />
                </g>
                <defs>
                    <clipPath id="a">
                        <path fill="#fff" d="M0 0h13v13H0z" />
                    </clipPath>
                </defs>
            </svg>
        </div>

        <div class="flex justify-between">
            <!-- rating -->
            <div class="flex h-full">
                <div class="my-auto text-xl font-bold mr-2">{{ rating }}</div>
                <div class="flex my-auto">
                    <StarIcon v-for="(star, index) in 5" :key="index" :class="{
                        'h-5 stroke-none': true,
                        'fill-blue-main': index < rating,
                        'fill-gray-300': index >= rating
                    }" />
                </div>
                <!-- <div class="flex my-auto">
                    <StarIcon class="h-5 fill-blue-main stroke-none"/>
                    <StarIcon class="h-5 fill-blue-main stroke-none"/>
                    <StarIcon class="h-5 fill-blue-main stroke-none"/>
                    <StarIcon class="h-5 fill-blue-main stroke-none"/>
                    <StarIcon class="h-5 fill-gray-300 stroke-none"/>
                </div> -->
            </div>
            <!-- prix -->
            <div class="flex">
                <div class="font-bold text-xl">4000$</div>
                <div class="my-auto mb-0 ml-1">/month</div>
            </div>
        </div>
    </div>
    
</div>


</template>