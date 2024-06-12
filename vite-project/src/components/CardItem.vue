<script setup>
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
</script>

<template>
	<a :href=props.url>
		<div class="card card-compact w-96 bg-base-100 shadow-xl">
			<figure>
				<img class="object-cover h-48 w-96"
					:src=props.img
					:alt=props.label
				/>
			</figure>
	
			<div class="card-body">
				<h2 class="card-title">{{props.label}}</h2>
				<p> {{props.title}} </p>
				<p> {{props.price}} </p>
				<p> {{props.city}} </p>
			</div>
		</div>
	</a>
</template>
