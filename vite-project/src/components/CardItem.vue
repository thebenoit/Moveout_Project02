<script setup>
import { ref, watch, onMounted, defineProps } from "vue";

const props = defineProps({
	path: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	src: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<a :href=props.path>
		<div class="card card-compact w-96 bg-base-100 shadow-xl">
			<figure>
				<img
					:src=props.src
					alt="Shoes"
				/>
			</figure>
	
			<div class="card-body">
				<h2 class="card-title">{{props.label}}</h2>
				<p>{{props.text}}</p>
			</div>
		</div>
	</a>
</template>
