<script setup>
import { ref, watch, onMounted, defineProps } from "vue";
import { PhotoIcon } from '@heroicons/vue/24/outline'

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

	title: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	bedrooms: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	img: {
		type: String,
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
	<a :href=props.url>
		<div class="w-96 bg-base-100 shadow-2xl duration-500 hover:shadow-blue-400 transition-all rounded-lg">
			<figure>
				<img v-if="isValidImage" class="object-cover media" :src="props.img" :alt="props.label" @error="handleImageError" />
				<div v-else class="flex items-center justify-center media bg-gray-200">
					<PhotoIcon class="w-8 h-8" />
				</div>
			</figure>
			<div class="card-body">
				<div class="grid grid-cols-4 grid-rows-2 gap-3 font-medium content-center">
					<div class="row-span-2 content-center text-2xl text-blue-500 group-hover:shadow-blue-500">{{props.price}}$</div>
					<div class="col-span-3">{{ props.title }}</div>
					<p class="text-xl col-span-3"> {{ props.city }} </p>
				</div>
			
			</div>
		</div>
	</a>
</template>

<style scoped>
.media {
	@apply h-48 w-96 rounded-2xl rounded-b-none;
}
</style>